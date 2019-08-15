const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAIJ4WPUAECLLXVJQA',
    secretAccessKey: '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'
});

var client = new AWS.DynamoDB();
var documentClient = new AWS.DynamoDB.DocumentClient();

var tableName = "nodeapp_org";
var params = {
    TableName: tableName,
    Item: {
        org_id:"demo",
        formalName:"Sample Salesforce Account",
        salesforceConnected:false,
        salesforceDetails:{
            email:"false",
            password:"false",
            secret:"false"
        },
        meta : [],
        meta_detail : [],
        selection: [],
        selectionDone : false,
        importStartTime: "false"
    }
};

console.log("Adding a new item...");
documentClient.put(params, function(err, data) {
    if (err) {
        console.error("Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item successfully!");
    }
});
return
