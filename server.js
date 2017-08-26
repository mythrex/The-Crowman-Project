const express = require('express');
const db = require('./db.js');
const exphbs = require('express-hbs');
const app = express();
const bodyParser = require('body-parser');
//routes
const login = require('./routes/login-route.js');
const admin = require('./routes/admin.js');
const customer = require('./routes/customer.js');

var port = process.env.PORT || 3000;
//models
const Banks = db.Banks;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/',express.static(__dirname + '/public'));

//setting up hbs engine
app.engine('hbs',exphbs.express4({
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials',
}))



app.set('view engine','hbs');
app.set('views', 'views');


app.use(login);
app.use(admin);

app.listen(port, function () {
  console.log(`Server Starts on ${port}`);
});
