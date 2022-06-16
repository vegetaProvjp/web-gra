const express = require('express');
const morgan = require('morgan')
const path = require('path');
const {engine} = require('express-handlebars');
const methodOverride = require('method-override')
const db = require("./config/db")
const route = require('./routes/index.route');
const session = require('express-session');
const port = 9000
const app = express();
const cookieParser = require('cookie-parser');
const passport = require('passport')
var bodyParser = require('body-parser')
const MongoStore = require('connect-mongo');
const serveStatic = require('serve-static')
// Connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'resource/views'));
app.engine('hbs', engine({
    extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(cookieParser());
app.use(bodyParser.json())
// app.use(morgan('combined'));

//Chuyen POST thanh PUT
app.use(methodOverride('_method'))
// app.use(passport.initialize());
// app.use(passport.session());
app.use(session({ 
  cookie: { maxAge: 60000 }, 
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/project_graduation',
    autoRemove: 'native' // Default
  }),
  secret: 'woot',
  resave: false, 
  saveUninitialized: false,
}));

// app.use(function (req, res, next) {
//   res.locals.session = req.session;
//   next()
// })
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next()
})

//biến local kiểm tra trạng thái đăng nhập
app.locals.login = false;
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})