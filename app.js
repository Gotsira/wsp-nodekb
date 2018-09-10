var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var flash = require('connect-flash')
var session = require('express-session')
var passport = require('passport')
var config = require('./config/database')

mongoose.connect(config.database)
let db = mongoose.connection

// Check connection
db.once('open', function() {
  console.log('Connected to MongoDB')
})

// Check for DB errors
db.on('error', function(err) {
  console.log(err)
})

// Init App
var app = express()

// Bring in Models
let Athlete = require('./models/athlete') 

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')))

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport)
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Home Route
app.get('/', function (req, res) {
  Athlete.find({}, function(err, athletes) {
    if(err) {
      console.log(err)
    } else {
      res.render('index', {
        title:'Athletes',
        athletes: athletes
      })
    } 
  })
})

// Route files
let athletes = require('./routes/athletes')
let users = require('./routes/users')
app.use('/athletes', athletes)
app.use('/users', users)

// Start server
app.listen(3000, () => console.log('Example app listening on port 3000!'))
