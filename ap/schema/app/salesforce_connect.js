var jsforce = require('jsforce');
var conn = new jsforce.Connection({loginUrl : 'https://ap8.salesforce.com'});
const AWS = require('aws-sdk');
const axios = require('axios');
const _ = require('underscore');



module.exports=function (req,res,dynamo,client) {
    var promiseslist=[];
    var susername=req.body.salesForceusername;
    var spassword=req.body.salesForcepassword;
    var stoken=req.body.salesForcetoken;
    var axiosInstance_new;
    console.log('dfsdf','sunamjohn@sale.com', 'Itahari2'+'zbwSMvm4BMymgLM6gcTGNVc97');
    console.log('dfsdf',susername, spassword+stoken);
    conn.login(susername, spassword+stoken , function(err, res) {
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
                return axiosInstance.get('/sobjects',{timeout:99999})
            })
            .then(e=>{
                console.log("SOBJECTS",e);
                i=0;
                e.data.sobjects.forEach(r=>{
                    i++;
                    if (i>70) {return}
                    promiseslist.push(
                        axiosInstance_new.get(r.urls.describe)
                    )
                })
                return Promise.all(promiseslist);
            })
            .then(e=>{
                console.dir(promiseslist)
            })
            .catch(err => {
                console.dir(promiseslist)
                console.log('errorrr', err)
                return err
            })

    })
}

/*
    conn.login('sunamjohn@sale.com', 'Itahari2'+'zbwSMvm4BMymgLM6gcTGNVc97' , function(err, res) {
        console.log("error",err);
        console.log(`\n\n\nRESPONSE`);
        console.log(res);
    });

LEVEL3
.then(res => {
                console.log(`TEST3`,res)
                res.data.sobjects.forEach(e=>{
                    promiseslist.push(
                        axiosInstance.get(`/sobjects/${e.label}/describe`,{timeout:999999})
                    );
                })
                console.log(promiseslist);
                return Promise.all(promiseslist)
            })
            .then(ee=>{
                console.log("allpromises",ee);
            })
---

    .then(res => {
                console.log(`TEST4`,res)
                let fieldsArray = []
                _.each(res.data.fields, obj => fieldsArray.push(obj.name))
                return fieldsArray
            })
            .then(res => {
                console.log(`TEST5`,res)
                console.log('fieldsArray', res)
                return conn.query(`SELECT ${res.join()} FROM Account`);
            })
            .then(res => {
                console.log(`TEST5`,res)
                _.each(res.records, row => {
                    console.log('each row=> ', row)
                    let input = row
                    let params = {
                        TableName: "Account",
                        Item: input
                    }

                    docClient.put(params, function(err, data){
                        if(err) {
                            console.log('errr result', err)
                        } else {
                            console.log('fetch result', data)
                        }
                    })

                    // docClient.get(params, function(err, data){
                    //   if(err) {
                    //     console.log('errr result', err)
                    //   } else {
                    //     console.log('fetch result', data)
                    //   }
                    // })
                })
                return 'upload successfull!!!'
            })
*/
