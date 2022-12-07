const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');
var fs = require('fs');
var https = require('https');
const bodyParser = require('body-parser');
const db = require('./db.js');
const auth = require('./auth');
const app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: "/",
        httpOnly: true,
        maxAge: 3600000
    }
  }));

app.use(cookieParser('abcdefg'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./authroutes.js')(app, passport);

db.testCon();

app.get('/', async function (req, res) {
    res.locals.user = req.user;
    songs = await db.getSongs()
    repusers=[];
    for (const element of songs) {
        repuser = await db.User.findByPk(element.UserId)
        repusers.push(repuser.username);
    };
    res.render(path.join(__dirname, 'static/index.ejs'), {errormessage: "", songs: songs, repusers:repusers});
});

app.get('/auth', (req, res) => {
    res.render(path.join(__dirname, 'static/auth.ejs'));
});

app.get('/report', (req, res) => {
    res.locals.user = req.user;
    res.render(path.join(__dirname, 'static/report.ejs'));
});

var urlencodeParser = bodyParser.urlencoded({ extended: false})

app.post('/report', urlencodeParser,function(req, res){
    db.pushSong(req.body.na_art, req.body.desc, req.body.rat, req.body.gnr, req.user.id);
    res.redirect("/");
 });


 app.post('/search/process', function(req, res) {
    var keyword = req.body.keyword;
    res.redirect('/search/' + keyword);
  });

const { Op } = require("sequelize");
const { Song } = require('./db.js');
 app.get('/search/:keyword', async function(req, res) {
    var keyword;
    keyword = req.params.keyword;
    var options = {
        where: {
          [Op.or]: [
            { 'description': { [Op.like]: '%' + keyword + '%' } },
            { '$name_artist$': { [Op.like]: '%' + keyword + '%' } }
          ]
        }
    };

    searched = await Song.findAll(options);
    repusers=[];
    for (const element of searched) {
        repuser = await db.User.findByPk(element.UserId)
        repusers.push(repuser.username);
    };
    res.locals.user = req.user;
    res.render(path.join(__dirname, 'static/index.ejs'), {errormessage: "", songs: searched, repusers:repusers});
});

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: "ingi"
}, app).listen(8080);

console.log("Server Started!");