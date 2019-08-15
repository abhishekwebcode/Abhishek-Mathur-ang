var jsforce = require('jsforce');
var conn = new jsforce.Connection({loginUrl: 'https://ap8.salesforce.com'});
var conn2 = new jsforce.Connection({loginUrl: 'https://ap8.salesforce.com'});
var AWS = require('aws-sdk')
const axios = require('axios')
const _ = require('underscore')
var lodash = require("lodash");
var fs= require('fs');
const writeJsonFile = require('write-json-file');

var insertSobjRecords = function (request, ObjName, dynamodbclient, record) {
    var params = {
        TableName: `nodeapp_${request.session.Organisation.org_id}_data`,
        Key: {
            sobject_name: ObjName,
        },
        UpdateExpression: "SET #ri = list_append(#ri, :vals)",
        ExpressionAttributeValues: {
            ":vals": [record]
        },
        ExpressionAttributeNames: {
            "#ri": "datas"
        },
        ReturnValues: "NONE"
    };
    console.log("asdsad", ObjName);
    return dynamodbclient.update(params).promise()
}

var insertSobjRow = function (request, ObjName, dynamodbclient) {
    var params = {
        TableName: `nodeapp_${request.session.Organisation.org_id}_data`,
        Item: {
            sobject_name: ObjName,
            datas: []
        }
    };
    console.log("asdsad", ObjName);
    return dynamodbclient.put(params).promise()
}

function pruneEmpty(obj) {
    return function prune(current) {
        lodash.forOwn(current, function (value, key) {
            if (_.isUndefined(value) || _.isNull(value)
            ) {
                //current[key] = "null";
            }
        });
        // remove any leftover undefined values from the delete
        // operation on an array
        if (_.isArray(current)) _.pull(current, undefined);

        return current;

    }(obj);  // Do not modify the original object, create a clone instead
}


var getData = async function (conn, fieldsLister, sobjName) {
    return conn.query(`SELECT ${fieldsLister.join()} FROM ${sobjName}`);
};


var filterRecords = function (records) {
    records.records.map(tt => {
        delete tt["attributes"];
        pruneEmpty(tt);
    });
};

var insertIntoDynamoDB = async function (client, sobj_name, recordsList, request,response) {
    var array = recordsList.records;
    console.log(array.length);
    var slices = [];
    var i, j, temparray, chunk = 1;
    for (i = 0, j = array.length; i < j; i += chunk) {
        temparray = array.slice(i, i + chunk);
        slices.push(temparray);
    }
    console.log(`inseting...`)
    var in1 = await insertSobjRow(request, sobj_name, client);
    for (m1 = 0; m1 < slices.length; m1++) {
        uu = slices[m1];
        for (let m2 = 0; m2 < uu.length; m2++) {
            var yyyu = uu[m2];
            console.log("DATA ROW", yyyu);
            await insertSobjRecords(request, sobj_name, client, yyyu);
        }
    }


};

module.exports = function (request, response, client, metafieldsraw, jsonFIleReader,metaSelected) {
    var errors = [];
    var metaUrl = metafieldsraw.filter(n => n).map(e => e[1]);
    var metaStore = metafieldsraw.filter(n => n).map(e => e[0]);
    var metaObject = jsonFIleReader.sync(`data/${request.session.Organisation.org_id}_meta_1.json`);


    conn.login(request.session.Organisation.salesforceDetails.email, request.session.Organisation.salesforceDetails.password + request.session.Organisation.salesforceDetails.token, function (err, res) {
        if (err) {
            response.json({
                success: false,
                message: err.message
            })
            return ;
        }
        else {
            var params = {
                TableName:'nodeapp_org',
                Key:{
                    'org_id':request.session.Organisation.org_id
                },
                UpdateExpression: "set selectionDone = :r, selection=:p",
                ExpressionAttributeValues:{
                    ":r":true,
                    ":p":metaSelected
                },
                ReturnValues:"NONE"
            };
            request.session.Organisation.selectionDone=true;
            client.update(params, function(err, data) {
                if (err) {
                    console.error("error");
                    response.json({success:false})
                } else {

                }
            });

            const accessToken = conn.accessToken;
            const instanceUrl = conn.instanceUrl;
            const version = 'v42.0';
            let axiosInstance;
            return axios.get(`${conn.instanceUrl}/services/data/`)
                .then(async res => {
                    console.log("FIRA", res);
                    let urlObject = res.data[res.data.length - 4];
                    axiosInstance = axios.create({
                        baseURL: `${conn.instanceUrl}${urlObject.url}`,
                        headers: {Authorization: `Bearer ${accessToken}`},
                        timeout: 99999
                    });
                    for (var meta in metaUrl) {
                        try {
                            var metakeyword = (metaUrl[meta]);
                            console.log("META", metaStore[meta]);
                            var fields = await axiosInstance.get(`/sobjects/${metakeyword}/describe`);
                            console.log('fields  lksdjdf')
                            console.dir(fields.data);
                            try{
                                fs.mkdirSync(`data/fieldMeta/${request.session.Organisation.org_id}`, {recursive: true})
                                console.log('field file path',`data/fieldMeta/${request.session.Organisation.org_id}/${metakeyword}.json`);
                            }catch (e) {
                                console.error('SUPPRESSED',e);
                            }
                            writeJsonFile.sync(`data/fieldMeta/${request.session.Organisation.org_id}/${metakeyword}.json`,fields.data);
                            let fieldsArray = [];
                            _.each(fields.data.fields, obj => fieldsArray.push(obj.name));
                            var records = await getData(conn, fieldsArray, metakeyword);
                            filterRecords(records);
                            var inssertion = await insertIntoDynamoDB(client, metaStore[meta], records, request, response);
                            response.json({
                                success: true
                            })
                        } catch (e) {
                            console.error('SUPPRESSED',e);
                            errors.push(e);
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                    if (err) {
                        response.json({
                            success: false,
                            message: "Error Connecting to SalesForce"
                        })
                    }
                    return err
                })
        }
    });
}
