'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const allowDomain = ['https://null.jsbin.com'];
const emailConfig = {
  to: 'kotvalera@gmail.com',
  from: 'kot@valerii.ml',
  subject: 'This is the subject',
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (allowDomain.indexOf(req.headers.origin) !== -1) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }
    next();
});

sgMail.setApiKey('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');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => {
  if(req.body.emailBody){
    emailConfig.html = req.body.emailBody;
    sgMail.send(emailConfig);
    res.json({ message: 'send'});
  }else{
    res.json({ message: 'failed'});
  }
});

app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
