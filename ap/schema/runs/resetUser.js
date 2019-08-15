const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAIJ4WPUAECLLXVJQA',
    secretAccessKey: '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'
});

var client = new AWS.DynamoDB();
var documentClient = new AWS.DynamoDB.DocumentClient();

var user = "admin";

