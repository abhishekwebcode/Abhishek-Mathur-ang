module.exports=function (docclient,username,password,role) {
    return docclient.get({
        TableName:"nodeapp_users",
        Key:{
            username:username,
            role:role
        }
    }).promise().then(e=>{
        if (e.Item.passwordHash==password) {
            return e.Item
        }
        else{
            return false
        }
    }).catch(e=>{
        console.log(e);
        return false;
    });


}
