module.exports=function (json) {
    p=json;
    a={}
    p.fields.forEach(b=>{
        switch (b.type) {
            case 'picklist':
                a[b.name] = { type: 'UTF8' }
                break;
            case 'textarea':
                a[b.name] = { type: 'UTF8' }
                break;
            case 'reference':
                a[b.name] = { type: 'UTF8' }
                break;
            case "id":
                a[b.name] = { type: 'UTF8' }
                break;
            case "datetime":
                a[b.name] = { type: 'TIMESTAMP_MILLIS' }
                break;
            case "string":
                a[b.name] = { type: 'UTF8' }
                break;
            case "boolean":
                a[b.name] = { type: 'BOOLEAN' }
                break;
            case "double":
                a[b.name] = { type: 'DOUBLE' }
                break;
            case "address":
                break;
            case "int":
                a[b.name] = { type: 'INT64' }
                break;
            case "date":
                a[b.name] = { type: 'TIMESTAMP_MILLIS' }
                break;
            case "complexvalue":
                //a[b.name] = { type: 'UTF8' }
                break;
            case "anyType":
                //a[b.name] = { type: 'UTF8' }
                break;
            default:
                //console.log(b.type,"NOTHING");
        }
    });
    //console.log(a);
    return a;
};
