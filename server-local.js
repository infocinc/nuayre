var express = require('express'),
    app = express();

app.use(express.logger());

var title = "NuAyre Eliminateurs d'odeurs Produits EcoLogo UL 2796";

var oneDay = 86400000;

app.use(express.compress());
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.get('/', function(req, res){
    res.sendfile('index.html');
});

var server = app.listen(process.env.PORT, '192.168.1.5', function() { 
 console.log(__dirname);
 console.log('Express server started on port %s', process.env.PORT);
});



