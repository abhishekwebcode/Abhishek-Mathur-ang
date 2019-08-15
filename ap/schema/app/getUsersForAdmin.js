/**
 *
 * @param {String} org_name
 * @param {DynamoDB.DocumentClient} client
 */
module.exports=async function (org_name,client) {
    return client.query({
        Table:"nodeapp_users",
        Key:{
            org_name:org_name
        }
    }).promise();
}
