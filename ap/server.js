const _ = require('underscore')
const AWS = require('aws-sdk')
const express = require('express')
const bodyParser = require('body-parser')
const processSales = require('./processSales')

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var app = express()

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'AKIAIJ4WPUAECLLXVJQA',
  secretAccessKey: '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'
})


const http = require('http');
const fs = require('fs')

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static('public'));

app.get('/index.html', function (req, res) {
  res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/user_credential', urlencodedParser, function (req, res) {
  // Prepare output in JSON format
  response = {
     username:req.body.username,
     password:req.body.password,
     token:req.body.token
  };

  processSales.process(req.body.username, req.body.password, req.body.token)
    .then(response => res.end(JSON.stringify(response)))
    .catch(err => res.end(JSON.stringify(err)))
  // console.log(response);
  // res.end(JSON.stringify(response));
})

// const server = http.createServer((req, res) => {
  
// });


app.listen(port,() => { 
  console.log(`Server running at http://${hostname}:${port}/`);
});




