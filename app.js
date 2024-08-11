var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cookieSession = require('cookie-session')
const helmet = require('helmet')
const noCache = require('nocache')
const { check } = require('express-validator');

require('dotenv').config()

const jumperController = require('./controllers/jumperController')
const movieController = require('./controllers/movieController')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
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
      'connect-src': ["'self'", 'https://tonejs.github.io/audio/casio/'],
      'style-src-elem': ["'self'", 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css', 'https://fonts.googleapis.com/css2'],
      'script-src-elem': ["'self'", 'https://cdn.jsdelivr.net/npm/chart.js', 'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js', 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js', 'https://code.jquery.com/jquery-3.4.1.slim.min.js'],
      'script-src-attr': ["'self'"],
      'img-src': ["'self'", 'https://image.tmdb.org/t/p/w185/', 'data:']
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
//
app.post('/jumper-score', [check('name').isLength({ min: 3 }).trim().escape()], jumperController.postScore)
app.get('/jumper-score', jumperController.getScore)
app.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Me', bubbles: true });
});
app.get('/portfolio', function(req, res, next) {
  res.render('portfolio', { title: 'Portfolio', bubbles: true });
});
app.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects', bubbles: true });
});
app.get('/breakroom', (req, res) => {
  console.log('get breakroom')
  let user = req.session.name ? req.session.name : "";
  res.render('jumper', { title: 'Unicorn Game', username: user, bubbles: false });
})
app.get('/music', (req, res) => {
  console.log('get music');
  res.render('music', { title: 'Piano Keys', bubbles: false });
})
app.get('/music-bundle', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/music-bundle.js'));
})
app.get('/movies', (req, res) => {
  console.log('get movies');
  res.render('movies', { title: 'Movies', bubbles: false });
})
app.get('/gradient', (req, res) => {
  console.log('get gradient');
  res.render('gradient', { title: 'Gradient Maker', bubbles: false });
})

app.get('/esp-page', (req, res) => {
  console.log('get esp page');
  res.render('esp', { title: 'ESP32 Control Page', bubbles: false });
})

let ESPvals = {"red": false,"yellow":false,"green":false,"blue":false,"white":false,"B1":false,"B2":false};
app.post('/esp-data', async (req, res) => {
  ESPvals = req.body;
  // for (const [key, value] of Object.entries(ESPval)) {
  //   console.log(`${key}: ${value}`);
  // }
  console.log("ESPvals: ", ESPvals);
  res.send(200);
})
app.get('/esp-data', async (req, res) => {
  res.send(ESPvals);
})
//app.post('/movies-data', movieController.postScore)
app.get('/movies-data', movieController.getMovieData);
app.get('/actor-data', movieController.getActorData);
app.use('/users', [check('name').isLength({ min: 3 }).trim().escape()], usersRouter);
app.get('/cassidy', function(req, res, next) {
  res.send(":>");
})

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
  res.render('error', { title: 'Error Page', bubbles: false });
});

app.listen(3000);
console.log('App listening on Port 3000');
module.exports = app;
