const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAIJ4WPUAECLLXVJQA',
    secretAccessKey: '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'
});

var client = new AWS.DynamoDB();
var documentClient = new AWS.DynamoDB.DocumentClient();




var params = {
    TableName: "nodeapp_users",
    KeySchema: [
        {AttributeName: "username", KeyType: "HASH"},
        {AttributeName: "role", KeyType: "RANGE"}
    ],
    AttributeDefinitions: [
        {AttributeName: "username", AttributeType: "S"},
        {AttributeName: "role", AttributeType: "S"}
    ],

    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};


var params = {
    TableName: "nodeapp_org",
    KeySchema: [
        {AttributeName: "org_id", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
        {AttributeName: "org_id", AttributeType: "S"}
    ],

    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

client.createTable(params, function(tableErr, tableData) {
    if (tableErr) {
        console.error("Error JSON:", JSON.stringify(tableErr, null, 2));
    } else {
        console.log("Created table successfully!");
    }


});