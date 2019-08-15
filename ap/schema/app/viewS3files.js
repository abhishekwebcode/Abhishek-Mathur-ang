var s3Prefix = `nodesalesforcedata/`;


module.exports = function (request, respones, S3) {
    var folders = [];
    var params = {
        Bucket: 'nodesalesforcedata',
        Delimiter: '/',
        Prefix: request.session.Organisation.s3BucketName + '/',
    }

    S3.listObjects(params, function (err, data) {
        if (err) {
            console.dir(err);
            respones.json({
                success: false
            })
        } else {
            var files = [];
            var promises = [];
            data.CommonPrefixes.forEach(e => {
                e = e.Prefix;
                folders.push(e.split("/")[1]);
                var params = {
                    Bucket: 'nodesalesforcedata',
                    Delimiter: '/',
                    Prefix: e,
                }
                promises.push(S3.listObjects(params).promise())
            });
            Promise.all(promises).then(jj => {
                jj.forEach(hh => {

                    hh.Contents.forEach(o => {
                        console.log(o,"size");
                        i = o.Key.split("/");
                        files.push({name:i[i.length - 1],size:o.Size});
                    })
                })
                return files;
            })
                .then(files => {
                    console.log(`FILES`, files);
                    respones.json({
                        success:true,
                        files:files
                    })
                })
                .catch(e=>{
                    console.log(e);
                    respones.json({
                        success: false,
                    })
                })
        }
    });
}

