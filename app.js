var express = require('express');

var routes = require('./routes/index.js');
var auth = require('./routes/auth.js');
var friend = require('./routes/friend.js');
var love = require('./routes/love.js');

var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

//view engine setup
app.set('views','./views');
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(session({
  secret: '1$!%!%13513',
  resave: false,
  saveUninitialized: true
}))

app.use('/',routes);
app.use('/auth',auth);
app.use('/friend',friend);
app.use('/love',love);

app.locals.pretty = true;

// 3000 번 리스닝
app.listen(3000,function() {
  console.log("서버가 정상적으로 작동되었습니다..(3000번포트)")
});
