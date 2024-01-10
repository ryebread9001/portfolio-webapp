var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cookieSession = require('cookie-session')
const helmet = require('helmet')
const noCache = require('nocache')

require('dotenv').config()

const jumperController = require('./controllers/jumperController')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
console.log(process.env.API_KEY);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
  name: 'session',
  secret: 'lT2y6ugnPFf7QRutrUoW', // random string, used to verify that cookies isn't ever altered client-side

  // Cookie Options
  maxAge: 12 * 60 * 60 * 1000 // 12 hours
}))
/** SECURITY */
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'connect-src': ["'self'", 'https://api.bloggify.net/gh-calendar/'],
      'style-src-elem': ["'self'", 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css', 'https://fonts.googleapis.com/css2'],
      'script-src-elem': ["'self'", 'https://cdn.jsdelivr.net/npm/chart.js', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.2/umd/popper.min.js'],
      'script-src-attr': ["'self'"]
    }
  }
})) // helmet allows for secure headers
app.use(helmet.xssFilter({
  setOnOldIE: true
}))
app.use(helmet.frameguard('deny'))
app.use(helmet.hsts({
  maxAge: 1000000000 // 11574 days; probably a little excessive...
}))
app.use(helmet.hidePoweredBy())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(noCache())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.post('/jumper-score', jumperController.postScore)
app.get('/jumper-score', jumperController.getScore)
app.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Me' });
});
app.get('/portfolio', function(req, res, next) {
  res.render('portfolio', { title: 'Portfolio' });
});
app.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
});
app.get('/breakroom', (req, res) => {
  console.log('get breakroom')
  res.render('jumper', { title: 'Unicorn Game' });
})
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error Page' });
});

app.listen(3000);

module.exports = app;
