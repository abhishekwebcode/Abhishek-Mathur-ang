
module.exports=async function (request,response,client) {
    try {
        if (request.session.user_obj) {
            let organisation = await client.get({
                TableName: "nodeapp_org",
                Key: {
                    org_id: request.Session.User.org_name
                }
            });
        }
else
    {
        request.session = null;
        response.redirect('/?not_logged_in')
    }
} catch(e) {

}
