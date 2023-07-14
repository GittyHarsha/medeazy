import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import passport from './middlewares/passport.js';
import router_retailer from './routes_retailer/index.js';
import router_supplier from './routes_supplier/index.js';
import { PORT, SECRET } from './config.js';

const app = express();

/* not needed, it is default configuration */
// view engine setup
// app.set('views', './views');
app.set('view engine', 'ejs');

// app.use(logger('dev')); // morgan
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  // cookie: { maxAge: 30 * 60 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./public'));

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.usericon = req.user.name;
  }
  next();
});

app.all('/', (req, res) => {
  res.render('index');
});
app.all('/supplier', (req, res)=>{
  res.render('suppliers_index');
});
app.all('/retailer', (req, res)=>{
  res.render('retailers_index');
});

function put_type(req, res, next) {
var url=req.url;
console.log("inside put_type");
console.log("url: ", req.url);
if(url.includes("supplier")) {
  req.body.customer_type='supplier';
}
else {
  req.body.customer_type='retailer';
}
next();
}
app.use('/', put_type);
app.use('/retailer',  router_retailer);
app.use('/supplier', router_supplier);
// url not found

app.use((req, res) => {
  res.status(404);
  res.format({
    html () {
      res.render('404', { url: `${req.headers.host}${req.url}` });
    },
    json () {
      res.json({ error: 'Not found', errorCode: 404 });
    },
    default () {
      res.type('txt').send('Error (404): File not found');
    }
  });
});

// error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.render('err', {
    code: err.code || err.statusCode || 500,
    desc: err.desc || err.statusMessage || 'Internal server error',
    url: `${req.headers.host}${req.url}`,
    stack: err.stack
  });
  console.log(err.content || err);
  next();
});

/*
error object
{
  code: `error code`,
  desc: `error desc`,
  content: `error msg for logging to console`
}
*/

const server = app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

