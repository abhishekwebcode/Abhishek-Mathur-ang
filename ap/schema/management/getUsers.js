module.exports=function (orgID,request,response,dynamodbclient) {
    var tableName = "nodeapp_users";
    dynamodbclient.scan({
        TableName: tableName,
        Item: {
            org_name:request.session.Organisation.org_id
        }
    }).promise().then(e=>{
        response.json({sucess:true,users:e.Items})
    }).catch(e=>{
        response.json({sucess:false})
    })
}
