var jsforce = require('jsforce');
var conn = new jsforce.Connection({loginUrl : 'https://ap8.salesforce.com'});
const AWS = require('aws-sdk')
const axios = require('axios')
const _ = require('underscore')
const writeJsonFile = require('write-json-file');

var showError = function(res) {
    res.redirect("/?error_salesForce_login");
    res.end()
};


module.exports=function (req,response,dynamo,client) {
    var promiseslist=[]
    var susername=req.body.salesForceusername;
    var spassword=req.body.salesForcepassword;
    var stoken=req.body.salesForcetoken;
    var request=req;
    var axiosInstance_new;
    console.log('dfsdf','sunamjohn@sale.com', 'Itahari2'+'zbwSMvm4BMymgLM6gcTGNVc97');
    console.log('dfsdf',susername, spassword+stoken);
    conn.login(susername, spassword+stoken , function(err, res) {
        if (err) {
            showError(response);
            return false;}
        const accessToken = conn.accessToken;
        const instanceUrl = conn.instanceUrl;
        console.log(instanceUrl)
        const version = 'v42.0';
        let axiosInstance;
        return axios.get(`${conn.instanceUrl}/services/data/`)
            .then(res => res)
            .then(res => {
                console.log('urll object')
                console.dir(res.data)
                let urlObject = res.data[res.data.length - 4]
                axiosInstance = axios.create({
                    baseURL: `${conn.instanceUrl}${urlObject.url}`,
                    headers: { Authorization: `Bearer ${accessToken}` },
                    timeout: 99999
                })
                axiosInstance_new = axios.create({
                    baseURL: `${conn.instanceUrl}`,
                    headers: { Authorization: `Bearer ${accessToken}` },
                    timeout: 99999
                })
                console.log(`TEST1`,res)
                return axiosInstance.get('/')
            })
            .then(res => {
                console.log(`TEST2`,res)
                return axiosInstance.get('/sobjects',{timeout:99999})
            })
            .then(e=>{
                console.log("S-OBJECTS",e);
                var params = {
                    TableName: 'nodeapp_org',
                    Key: {
                        'org_id' : req.session.Organisation.org_id
                    },
                    UpdateExpression: 'set salesforceConnected = :t, salesforceDetails.email = :s1, salesforceDetails.secret = :s2, salesforceDetails.password = :s3',
                    ExpressionAttributeValues: {
                        ':t' : true,
                        ':s1' : req.body.salesForceusername,
                        ':s2' : req.body.salesForcetoken,
                        ':s3' : req.body.salesForcepassword
                    }
                };
                client.update(params, function(err, data) {
                    if (err) {
                        console.log("Error", err);
                    } else {
                        console.log("Success", data);
                    }
                });
                req.session.Organisation.salesforceConnected=true;
                req.session.Organisation.salesforceDetails={
                    email:req.body.salesForceusername,
                    password:req.body.salesForcepassword,
                    token:req.body.salesForcetoken
                };

                req.session.save();
                writeJsonFile.sync(`data/${req.session.Organisation.org_id}_meta_1.json`, e.data.sobjects);
                response.redirect('/');
            })
            .catch(err => {
                console.dir(promiseslist)
                console.log('errorrr', err)
                showError(response)
                return false
            })

    })
}
