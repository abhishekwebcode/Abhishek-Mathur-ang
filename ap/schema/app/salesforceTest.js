var jsforce = require('jsforce');
var conn = new jsforce.Connection({loginUrl: 'https://ap8.salesforce.com'});
const AWS = require('aws-sdk')
const axios = require('axios')
const _ = require('underscore')
t = () => {
    
    conn.login('sunamjohn@sale.com', 'Itahari2' + 'zbwSMvm4BMymgLM6gcTGNVc97', function (err, res) {
        console.log("error", err);
        console.log(`\n\n\nRESPONSE`);
        console.log(res);
        const accessToken = conn.accessToken;
        const instanceUrl = conn.instanceUrl;
        const version = 'v42.0';
        let axiosInstance;
        return axios.get(`${conn.instanceUrl}/services/data/`)
            .then(res => {
                console.log('urll object');
                console.dir(res.data);
                let urlObject = res.data[res.data.length - 4];
                axiosInstance = axios.create({
                    baseURL: `${conn.instanceUrl}${urlObject.url}`,
                    headers: {Authorization: `Bearer ${accessToken}`},
                    timeout: 99999
                })
                console.log(`TEST1`, res)
                return axiosInstance.get('/')
            })
            .then(res => {
                console.log(`TEST2`, res)
                return axiosInstance.get('/sobjects')
            })
            .then(res => {
                console.log(`TEST3`, res)
                return axiosInstance.get('/sobjects/Account/describe')
            })
            .then(res => {
                console.log(`TEST4`, res)
                f = axiosInstance.get(res.data.urls.sobject).then(e => {
                    console.log("NEW")
                    console.dir(e)
                }).catch(e => {
                    console.error(e)
                })
                console.log("f", f, res.data.urls.sobject)
                let fieldsArray = []
                _.each(res.data.fields, obj => fieldsArray.push(obj.name))
                return fieldsArray
            })
            .then(res => {
                return res
            })
            .then(res => {
                console.log(`TEST5`, res)
                console.log('fieldsArray', res)
                return conn.query(`SELECT ${res.join()} FROM Account`);
            })
            .then(res => {
                console.log(`TEST6`, res)
                _.each(res.records, row => {
                    console.log('each row=> ', row)
                    let input = row
                    let params = {
                        TableName: "Account",
                        Item: input
                    }
                    docClient.put(params, function (err, data) {
                        if (err) {
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
            .catch(err => {
                console.log('errorrr', err);
                return err
            })
    });
};
setTimeout(function () {
    console.dir(this);
}, 100000000);
