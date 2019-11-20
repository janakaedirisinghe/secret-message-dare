const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser  =require('body-parser');
const morgan = require('morgan');
const cookie = require('cookie');
const url = require('url');



// mongoose connect
mongoose.connect('mongodb+srv://janaka531:Jayantha@531@cluster0-01qr2.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser:true,useUnifiedTopology: true
});

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();

});
// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extends: false}));
app.use((bodyParser.json()));

const user = require('./api/routes/user');

// handlebar middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// app.get('/css/main.css', function(req, res){ res.send("./views"); res.end(); })

app.use(express.static('public'));



app.get('/',(req,res,next) => {

    // Parse the cookies on the request
    var cookies = cookie.parse(req.headers.cookie || '');

    if (cookies.id){
        const urlTest =  url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.originalUrl
        }) + 'user/home/' + cookies.id ;
        res.redirect(urlTest);
    } else {
        res.render("index");
    }

});

// user routs
app.use('/user',user);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        }
    });
});

module.exports = app;
