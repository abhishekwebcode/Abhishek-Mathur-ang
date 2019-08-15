console.clear()
e=e=> {
    o=[];
    a=[];
    f=[];
    k={}
    require("fs").readdirSync('/Users/abhishekmathur/Downloads/ang/ap/data/fieldMeta/demo').forEach(file => {
        r = require('fs').readFileSync(`/Users/abhishekmathur/Downloads/ang/ap/data/fieldMeta/demo/${file}`)
        p=(JSON.parse(r.toString()))
        p.fields.forEach(e=> {
            k[e.name] = e;
        });
            p.fields.forEach(e=>{
            k[e.name]=e;
            //if (e.soapType="ChangeEventHeader")console.log(e)
            if (true) {
                if (o.indexOf(e.soapType)==-1) {
                    o.push(e.soapType)
                    a.push(e.type)
                }
            }

            if (e["compoundFieldName"]){
    //            console.log(k[e["compoundFieldName"]])
            }
            if (e.type=="complexvalue") {console.log(e)}
            if (e.type=="anyType") {console.log(e)}
        })
    })
    console.log(a)
}
setTimeout(()=>{},99999);
e();

