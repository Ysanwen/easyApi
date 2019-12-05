const express  = require('express');

let app = express()

// 设置跨越
app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
})

// 设置 api
app.use('/api', function(req, res) {
  let randomNum = Math.floor(Math.random() * 1000);
  res.json({ status: 'success', message: 'welcome to use easy api with: ' + randomNum + ' request!' });
})

app.listen(8081, '127.0.0.1', function (err) {
  if (err) {
    console.log(err)
    return false
  }
  console.log('server start at port:' + 8081)
})