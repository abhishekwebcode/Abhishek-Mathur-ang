var params = {
    TableName: "nodeapp_org",
    KeySchema: [
        {AttributeName: "org_name", KeyType: "HASH"},
        {AttributeName: "formalName", KeyType: "RANGE"}
    ],
    AttributeDefinitions: [
        {AttributeName: "org_name", AttributeType: "S"},
        {AttributeName: "formalName", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};



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



dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
