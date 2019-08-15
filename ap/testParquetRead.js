var parquet = require(`@jeffbski/parquetjs`);
// create new ParquetReader that reads from 'fruits.parquet`
console.clear();
async function d() {
    console.log(process.argv[2]);
    r = (process.argv[2]);
    let reader = await parquet.ParquetReader.openFile(r);
    console.dir(reader.envelopeReader)
    console.dir(reader.getMetadata())
    console.dir(reader.getSchema())
    console.dir(reader.metadata)
    console.dir(reader.schema)
    // create a new cursor
    let cursor = reader.getCursor();
    d2 = 0
    // read all records from the file and print them
    let record = null;
    while (record = await cursor.next()) {
        console.log(record);
        d2++
    }
    console.log(d2);
}
d();

setInterval(e=>{

},100000);
