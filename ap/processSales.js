var jsforce = require('jsforce');
var conn = new jsforce.Connection({loginUrl : 'https://ap8.salesforce.com'});
var AWS = require('aws-sdk')
const axios = require('axios')
const _ = require('underscore')
exports.process = (username, password, token) => {
    console.log('uuuuuu', username, password, token)
    let docClient = new AWS.DynamoDB.DocumentClient()

    return conn.login(username, password+token).then(res => {
    console.log('login response',res)
    console.log('access token', conn.accessToken)
    console.log('instance url', conn.instanceUrl)
    const accessToken = conn.accessToken;
    const instanceUrl = conn.instanceUrl;
    const version = 'v42.0'
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
          timeout: 1000
        })
        console.log(`TEST1`)
        //return axiosInstance.get('/')
        return 4
      })
      .then(res => {
        console.log(`TEST2`)
        //return axiosInstance.get('/sobjects')
      })
      .then(res => {
        console.log(`TEST3`)
        //return axiosInstance.get('/sobjects/Account/describe')
      })
      .then(res => {
        console.log(`TEST4`)
        let fieldsArray = []
        _.each(res.data.fields, obj => fieldsArray.push(obj.name))
        return fieldsArray
      })
      .then(res => {
        console.log(`TEST5`)
        console.log('fieldsArray', res)
        return conn.query(`SELECT ${res.join()} FROM Account`);
      })
      .then(res => {
console.log(`TEST5`)
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
    })
    .catch(err => {
        console.log('errorrr', err)
        return err
    })
}

