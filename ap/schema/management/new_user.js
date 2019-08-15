module.exports=function (username,password,role,request,response,dynamodbclient) {
    var tableName = "nodeapp_users";
    dynamodbclient.scan({
        TableName: tableName,
        Item: {
            username:username,
            role:role,
            org_name:req.session.Organisation.org_id,
            passwordHash:password
        }
    }).promise().then(e=>{
        response.json({sucess:true})
    }).catch(e=>{
        response.json({sucess:false})
    })
}
