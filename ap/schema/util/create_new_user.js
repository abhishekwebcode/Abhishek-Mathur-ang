const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAIJ4WPUAECLLXVJQA',
    secretAccessKey: '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'
});

var documentClient = new AWS.DynamoDB.DocumentClient();

/**
 *
 * @param {String} username
 * @param {String} password
 * @param {String} role
 * @param {String} organisation_id
 * @param {DynamoDB.DocumentClient} client
 */
module.exports=function (username,password,role,organisation_id,client=documentClient) {
    var tableName = "nodeapp_users";
    var params = {
        TableName: tableName,
        Item: {
            username:username,
            role:role,
            org_name:organisation_id,
            passwordHash:password
        }
    };

    return client.put(params).promise()
}

