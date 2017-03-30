var app = require('./config/express')();
var consign = require('consign');

app.listen(3000, function(){
  console.log('Servidor rodando!')
})

app.get('/', function(req, res){
  console.log('Recebida requisição de teste.');
  res.send('OK.');
})
