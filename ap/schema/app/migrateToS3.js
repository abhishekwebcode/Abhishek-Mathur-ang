var parquet = require('@jeffbski/parquetjs');
var fs = require("fs");

function storeparr(S3, request,response) {
    let promises=[];
    fs.readdirSync(`data/parquet/${request.session.Organisation.org_id}`).forEach(file => {
        console.log(file);
        console.dir(response);
        var fileStream = fs.createReadStream(`data/parquet/${request.session.Organisation.org_id}/${file}`);
        var putParams = {
            Bucket: request.session.Organisation.s3BucketName,
            Key: file,
            Body: fileStream
        };
        promises.push(S3.putObject(putParams).promise());
    });
    Promise.all(promises).then(e=>{
        response.json({
            success:true
        })
    }).catch(e=>{
        console.error(e)
    })
    return;

}

var getSchema = function (item) {
    var schema = {};
    for (var key in item) {
        var i = item[key];
        switch (typeof i) {
            case "object":
                break;
            case "boolean":
                schema[key] = {type: 'BOOLEAN'}
                break
            case "string":
                try {
                    var yy = schema[key];
                    if (("date" in key.toLowerCase()) && ("T" in yy)) {
                        var j = new Date(yy);
                        schema[key] = {type: 'TIMESTAMP_MILLIS'};
                    }
                } catch (e) {
                    schema[key] = {type: 'UTF8'};
                }
                break
            case "number":
                schema[key] = {type: 'DOUBLE'}
                break
        }
    }
    return schema;
}


var filter = function (item, schema_new) {
    for (var key in item) {
        switch (typeof i) {
            case "object":
                delete item[key];
                break
            case "boolean":
                //schema[key] = {type: 'BOOLEAN'}
                if (item[key] == "null") {
                    item[key] = null;
                }
                break
            case "string":
                if (item[key] == "null") {
                    item[key] = "none";
                }
                try {
                    var yy = schema[key];
                    if (("date" in key.toLowerCase()) && ("T" in yy)) {
                        var j = new Date(yy);
                        item[key] = j;
                        //      schema[key] = {type: 'TIMESTAMP_MILLIS'};
                    }
                } catch (e) {
                    //schema[key] = {type: 'UTF8'};
                }
                break
            case "number":
                //schema[key] = {type: 'INT64'}
                if (item[key] == null) {
                    item[key] = 0;
                }
                //item[key] = parseFloat(item[key])
                break
            default:
                if (item[key] == "null") {
                    item[key] = "null";
                }
                break;
        }
        try {
            if (schema_new[key]['TYPE'] == "DOUBLE") {
                item[key] = 0;
            }
        } catch (e) {
            delete schema_new[key];
            console.error(e);
            console.log(schema_new, key, "sdf");
        }

    }
    return item;
}

var extreme = function (item) {
    for (var t in item) {
        if (typeof item[t] == "object") {
            delete item[t];
        }
    }
    return item;
}


var storeInParquet = async function (sobj_name, items, S3, request) {
    try {
        fs.mkdirSync(`data/parquet/${request.session.Organisation.org_id}`, {recursive: true})
    } catch (e) {
        console.error(e)
    }
    var schem_new = getSchema(items[0]);
    console.log("SCHEMA:" + sobj_name, schem_new, "ITEMS", items);
    var schema = new parquet.ParquetSchema(schem_new);
    var writer = await parquet.ParquetWriter.openFile(schema, `data/parquet/${request.session.Organisation.org_id}/${sobj_name}.parquet`);

    writer.setRowGroupSize(1);
    items.forEach(e => {
        e = filter(e, schem_new);
        e = extreme(e);
        console.log(`APPENDING ROW TO WRITER ${sobj_name}`, e);
        writer.appendRow(e).catch(e => {
            console.error(e);
        });
    })
    console.log(`CLOSING ${sobj_name}`)
    await writer.close();
    return ;
};

var then = function (client, request, response, items, s3, bucketname) {
    let filesList = [];
    let promisesS3 = [];
    items.forEach(ll => {
        filesList.push(ll.sobject_name);
        promisesS3.push(storeInParquet(ll.sobject_name, ll.datas, s3, request).catch(e=>{console.error('asds',e)}))
        console.log(promisesS3);
    });
    Promise.all(promisesS3).then(o => {
        console.log('dsfdghsufih')
        console.dir(o);
        storeparr(s3,request,response);
    }).catch(e => {
        console.error("ERROR",e)
    })

    return
    for (var tty in items) {
        var hhh = items[tty];
        console.log("FIRST LEVEL", hhh);
        for (var innerItem in hhh) {
            var inII = hhh[innerItem];
            console.log("SECOND LEVEL", inII);
            var ttt = filter(inII);
            console.log("FILTEREd", ttt);
            items["schema"] = ttt[0];
            items[tty][innerItem] = ttt[1];
        }
    }

};

module.exports = function (DynamoDbCLient, request, response, s3) {
    let s3BucketName = request.session.Organisation.s3BucketName;

    var itemsListMain = [];
    var params = {
        TableName: `nodeapp_${request.session.Organisation.org_id}_data`
    };
    DynamoDbCLient.scan(params, onScan);

    function onScan(err, data) {
        console.log(arguments);
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 4));
        } else {
            console.log("Scan succeeded.");
            data.Items.forEach(function (itemdata) {
                itemsListMain.push(itemdata);
            });
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else {
                console.log("askduh", itemsListMain);
                then(DynamoDbCLient, request, response, itemsListMain, s3, s3BucketName)
            }
        }
    }

};

