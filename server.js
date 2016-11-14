var express = require('express')
  , app = express()
  , port = process.env.PORT || 3001;


/*accept cors*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static('public'));
app.listen(port);
console.log('Servidor escutando na porta: ' + port);

module.exports = app;