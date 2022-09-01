const express = require('express');
const morgan = require('morgan')
const path = require('path');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override')
const db = require("./config/db/index")
const paypal = require('paypal-rest-sdk');
const schedule = require('node-schedule')
var cron = require('cron');
const { v1: uuidv1 } = require('uuid');
const route = require('./routes/index.route');
const session = require('express-session');
const port = 9000
const app = express();
const cookieParser = require('cookie-parser');
const Handlebars = require('handlebars')
const passport = require('passport')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const MongoStore = require('connect-mongo');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const serveStatic = require('serve-static')
const cloudinary = require('./util/cloudinary')
const upload = require("./middleware/multer")
const Product = require('./app/models/products')
const fs = require("fs")
// Connect to db
db.connect();

app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, 'resource/views'));
app.engine('hbs', engine({
  extname: '.hbs',
  hbs: allowInsecurePrototypeAccess(Handlebars),
  helpers: require('./helpers/handlebars')
}));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(cookieParser());
app.use(bodyParser.json())

//Chuyen POST thanh PUT
app.use(methodOverride('_method'))
app.use(session({
  name: 'cart',
  cookie: { maxAge: 30 * 60 * 1000 },
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/project_graduation',
    autoRemove: 'native' // Default
  }),
  secret: 'my secret cart',
  resave: false,
  saveUninitialized: false,
  // function() {
  //   var job = new CronJob(
  //     '* * * * * *',
  //     function () {
  //       console.log('You will see this message every second');
  //     },
  //     null,
  //     true,
  //     'America/Los_Angeles'
  //   );
  //   job.start()
  // }
}));
app.use(session({
  name: 'dataOrder',
  cookie: { maxAge: 30 * 60 * 1000 },
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/project_graduation',
    autoRemove: 'native' // Default
  }),
  secret: 'my secret order',
  resave: false,
  saveUninitialized: false,
}));
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AZHE6u8u9NECszi-YJtk8cQ5hOd_pLrefradH91S-3_8ZPxxDYz-Cu1DwEyL_kT80zoL55GiMHLGUEBv',
  'client_secret': 'EIPLREx_IWwQdMTUzQbtckGBI5JP_Vl7z5f8YbdDQW8EM2DOwv7F64DBh30dId91AD11ezZlAJhSBI03'
});
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next()
})

app.use(async (req, res, next) => {
  try {
    res.locals.session = req.session;
    // const categories = await Category.find({}).sort({ title: 1 }).exec();
    // res.locals.categories = categories;
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
//biến local kiểm tra trạng thái đăng nhập
app.locals.login = false;
app.locals.logout = true;

route(app);
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})