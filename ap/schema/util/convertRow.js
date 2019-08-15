module.exports=function (schema,row) {
    for (var t in row) {
        if (schema[t]==undefined || schema[t]==null) {
            delete row[t];
            continue;
        }
        if ((row[t])==null || row[t]==undefined) {
            switch (schema[t].type) {
                case 'UTF8':
                    row[t]="NULL";
                    break;
                case 'TIMESTAMP_MILLIS':
                    row[t]=new Date(0);
                    break;
                case 'DOUBLE':
                    row[t]=0.0;
                    break;
                case 'INT64':
                    row[t]=0;
                    break;
            }
        }
        if (schema[t].type === "TIMESTAMP_MILLIS") {
            row[t] = new Date(row[t]);
        }
    }
    return row;
}
