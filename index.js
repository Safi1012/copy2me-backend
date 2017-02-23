var express = require('express')
var app = express()

app.listen(5000, function () {
  console.log('Example app listening on port 5000!')
})

app.get('/', function (req, res) {
  console.log('123456789')
  res.send('Hello Arne!')
})
