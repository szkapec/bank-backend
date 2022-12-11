const serverless = require('serverless-http');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({
    'path': 'home'
  })
})

module.exports.handler = serverless(app)