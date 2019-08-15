var getSchema = require("../util/getSchema");
var rowConverter = require("../util/convertRow");
const loadJsonFile = require('load-json-file');
var parquet = require('@jeffbski/parquetjs');
var fs = require("fs");
var s3Prefix = `nodesalesforcedata/`;

function storeparr(S3, request, response, folder) {
    let promises = [];
    fs.readdirSync(`data/parquet/${request.session.Organisation.org_id}`).forEach(file => {
        var fileStream = fs.createReadStream(`data/parquet/${request.session.Organisation.org_id}/${file}`);
        var fileTypeFOlder=file.split(".")[0];
        var putParams = {
            Bucket: s3Prefix + folder + '/' + fileTypeFOlder ,
            Key: file,
            Body: fileStream
        };
        promises.push(S3.putObject(putParams).promise());
    });
    Promise.all(promises).then(e => {
        response.json({
            success: true
        })
    }).catch(e => {
        console.error(e)
    })
}


var storeR = async function (objName, datas, S3, request, realName) {
    var metaDesc = loadJsonFile.sync(`data/fieldMeta/${request.session.Organisation.org_id}/${realName}.json`);
    try {
        fs.mkdirSync(`data/parquet/${request.session.Organisation.org_id}`, {recursive: true})
    } catch (e) {
        //console.error(e)
    }
    var schema1 = getSchema(metaDesc);
    console.log("SCHEMA:" + objName, schema1);
    var schema = new parquet.ParquetSchema(schema1);
    var writer = await parquet.ParquetWriter.openFile(schema, `data/parquet/${request.session.Organisation.org_id}/${objName}.parquet`);
    writer.setRowGroupSize(1);
    datas.forEach(e => {
        try {
            e = rowConverter(schema1, e);
            console.log(`APPENDING ROW TO WRITER ${objName}`, e);
            writer.appendRow(e).catch(e => {
                console.error(e);
            });
        } catch (e) {
            console.error(e);
        }
    })
    console.log(`CLOSING ${objName}`)
    await writer.close();
}

var startParquet = function (client, request, response, itemsListMain, S3, S3BucketNameFolder) {
    let filesList = [];
    let promisesS3 = [];
    var mapping = {};
    var jsonFieldMain = loadJsonFile.sync(`data/${request.session.Organisation.org_id}_meta_1.json`);
    jsonFieldMain.forEach(e => {
        mapping[e.label] = e.name;
    });
    itemsListMain.forEach(ll => {
        filesList.push(ll.sobject_name);
        promisesS3.push(storeR(ll.sobject_name, ll.datas, S3, request, mapping[ll.sobject_name]).catch(e => {
            console.error('asds', e)
        }))
    });
    console.log(promisesS3);
    Promise.all(promisesS3).then(o => {
        console.log('dsfdghsufih')
        console.dir(o);
        storeparr(S3, request, response, S3BucketNameFolder);
    }).catch(e => {
        console.error("ERROR", e)
    })

};

module.exports = function (DynamoDbCLient, request, response, s3) {
    console.clear()
    let s3BucketName = request.session.Organisation.s3BucketName;
    var itemsListMain = [];
    var params = {
        TableName: `nodeapp_${request.session.Organisation.org_id}_data`
    };
    DynamoDbCLient.scan(params, onScan);

    function onScan(err, data) {
        console.log(arguments);
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 4));
        } else {
            console.log("Scan succeeded.");
            data.Items.forEach(function (itemdata) {
                itemsListMain.push(itemdata);
            });
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else {
                console.log("askduh", itemsListMain);
                startParquet(DynamoDbCLient, request, response, itemsListMain, s3, s3BucketName)
            }
        }
    }

};

