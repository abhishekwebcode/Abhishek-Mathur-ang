var express = require('express');
var AWS = require('aws-sdk')
const _ = require('underscore');
var bodyParser = require('body-parser')
const processSales = require('./processSales');
var urlencodedParser = bodyParser.urlencoded({extended: false});
let ejs = require('ejs');
const loadJsonFile = require('load-json-file');
function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAIJ4WPUAECLLXVJQA',
    secretAccessKey: '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'
});
var s3=new AWS.S3();
var dynamodb = new AWS.DynamoDB();
var dynamodbclient = new AWS.DynamoDB.DocumentClient();

var port = 3002;
var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var path = require("path");
app.set('trust proxy', 1)

var cookieSession = require('cookie-session')
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

app.use('/bower_components', express.static('bower_components'))
app.use('/views', express.static('views'))
app.use('/styles', express.static('styles'))
app.use('/fonts', express.static('fonts'))
app.use('/images', express.static('images'))
app.use('/scripts', express.static('scripts'))
var mockup = function(res) {
    res.json({
        success:true
    })
}

app.get('/', function (req, res, next) {
    if (req.session.loggedIn == true) {
        if (req.session.Organisation.salesforceConnected == true) {
            let se=JSON.parse(JSON.stringify(req.session.user_obj));
            se.passwordHash=``;
            let send = {user: se, Organisation: req.session.Organisation}
            ejs.renderFile('dashboard/app.html', {data: send}, null, function (err, str) {
                res.send(str);
            });
        } else {
            res.sendFile('login.html', {root: __dirname});
        }
    } else {
        res.sendFile('main.html', {root: __dirname});
    }
})

app.post('/user_credential', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        username: req.body.username,
        password: req.body.password,
        token: req.body.token
    };

    processSales.process(req.body.username, req.body.password, req.body.token)
        .then(response => res.end(JSON.stringify(response)))
        .catch(err => res.end(JSON.stringify(err)))
    // console.log(response);
    // res.end(JSON.stringify(response));
})

app.post("/login", function (req, res) {
    if (req.body.login == "" || req.body.password == "") {
        res.redirect("/?noinput");
        res.end();
        return;
    }

    a = require("./schema/get_user");

    b = a(dynamodbclient, req.body.login, req.body.password, req.body.role);
    b.then((User) => {
        req.session={};
        req.session.user_obj = User;
        if (User) {
            dynamodbclient.get({
                TableName: "nodeapp_org",
                Key: {
                    org_id: User.org_name
                }
            }).promise().then(Organisation_res => {
                req.session.Organisation = Organisation_res.Item
                req.session.loggedIn = true;
                res.redirect("/");
            }).catch(e => {
                console.log(`Error`)
                console.dir(e)
            })
        } else {
            res.redirect("/?wrong=1");
        }
    }).catch(e => console.error(e));

})

app.post("/sales_force-connect", function (req, res) {
    a = require("./schema/app/salesforce_login")(req, res, dynamodb, dynamodbclient);
})

app.get("/app", function (req, res) {
    res.sendFile('dashboard/app.html', {root: __dirname});
})

app.get("/session", function (req, res) {
    res.json(req.session);
})
app.get("/getFileS3/:file",function (req,res) {
    console.log(req.params);
    folder=req.params.file.split(".")[0];
    var params={
        Bucket: 'nodesalesforcedata',
        Key: `${req.session.Organisation.s3BucketName}/${folder}/${req.params.file}`
    };
    s3.getObject(params)
        .on('httpHeaders', function (statusCode, headers) {
            res.set('Content-Length', headers['content-length']);
            res.set('Content-Type', headers['content-type']);
            this.response.httpResponse.createUnbufferedStream()
                .pipe(res);
        })
        .send();
})
app.post("/api/*",function (req,res,next) {
    if (req.session.loggedIn == true) {
        if (req.session.Organisation.salesforceConnected == true) {
            next();
        }
        else {
            res.json({
                success:false,
                "error":"Please Connect SalesForce",
                "error_code":"SALESFORCE_AUTH_PENDING"
            })
        }
    }
    else {
        res.json({
            success:false,
            "error":"Please Log-in",
            "error_code":"NOT_LOGGED_IN"
        })
    }
});
//TODO QUERYABLE AND NESTED ROWS dynamo , parquet null?
app.post("/api/getFields",function (req,res) {
    objs=loadJsonFile.sync(`data/${req.session.Organisation.org_id}_meta_1.json`);
    u=[];
    objs.forEach(e=>{
        if (e.queryable) {u.push(e.label);}
    })
    res.json({
        success:true,
        result:u
    })
})

app.post("/api/putfields",function (req,res) {
    //mockup(res);return;
    var indexes=(req.body.fieldsIndexes).map(n=>parseInt(n)).sort((x,y)=>x>y);
    objs=loadJsonFile.sync(`data/${req.session.Organisation.org_id}_meta_1.json`);
    var metaSelected=[];
    indexes.forEach(index=>{
        metaSelected.push([objs[index].label,objs[index].name]);
    })
    console.log(metaSelected);
    (require("./schema/app/fetchAndInsertRecords"))(req,res,dynamodbclient,metaSelected,loadJsonFile,metaSelected);
})
app.post("/api/s3Files",function (req,res) {
    require('./schema/app/viewS3files')(req,res,s3);
})
app.post("/api/users",function (req,res) {
    if (req.session.User.role=="admin") {
        require('./schema/app/viewS3files')(req, res, s3);
    }
    else {
        res.send("")
    }

})
app.get('/testS',function () {
    require("./schema/app/salesforceTest")
    t();
})

app.post('/migrate',function (request,response) {
    require("./schema/app/migrateToS3New")(dynamodbclient,request,response,s3);
})
app.post('/signout',function (request,response) {
    request.session=null;
    response.json({
        sucess:true
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

process.on('exit', function () {
    console.log('About to exit, waiting for remaining connections to complete');
    app.close();
});

function logError(error){
    console.error(error)
    //require("fs").writeFileSync(`./logs/eerror_${Date.now()}.json`, refreshUser.inspect(error) , 'utf-8');
}
process.on('unhandledRejection', (reason, promise) => {
    logError(reason,promise)
});
process.on('rejectionHandled', (promise) => {

});
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
    logError([reason,p]);
});

