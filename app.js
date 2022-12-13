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
    const bdtest = await db.getUser("thomas");
    console.log("req.user : ", req.user)
    console.log("getusertest: ", bdtest)


    var pop_rat = 0;
    var rap_rat = 0;
    var electro_rat = 0;
    var jazz_rat = 0;
    var rnb_rat = 0;
    var rock_rat = 0;
    var classique_rat = 0;
    data = [];
    //average rating for pop
    averageRatingForPop = await db.getAverageRatingForPop(1)
    var pop_song = averageRatingForPop[0];
    if (pop_song==undefined){
        pop_rat += 0;
    }else{
        pop_rat += pop_song.dataValues.averageRating;
    }
    //average rating for rap
    var averageRatingForRap = await db.getAverageRatingForRap(1);
    var rap_song = averageRatingForRap[0];
    if (rap_song==undefined){
        rap_rat += 0;
    }else{
        rap_rat += rap_song.dataValues.averageRating;
    }
    //average rating for electro
    var averageRatingForElectro = await db.getAverageRatingForElectro(1);
    var electro_song = averageRatingForElectro[0];
    if (electro_song==undefined){
        electro_rat += 0;
    }else{
        electro_rat += electro_song.dataValues.averageRating;
    }
    
    //average rating for rock
    var averageRatingForRock = await db.getAverageRatingForRock(1);
    var rock_song = averageRatingForRock[0];
    if (rock_song==undefined){
        rock_rat += 0;
    }else{
        rock_rat += rock_song.dataValues.averageRating;
    }
    //average rating for classique
    var averageRatingForClassique = await db.getAverageRatingForClassique(1);
    var classique_song = averageRatingForClassique[0];
    if (classique_song==undefined){
        classique_rat += 0;
    }else{
        classique_rat += classique_song.dataValues.averageRating;
    }
    
    //average rating for rnb
    var averageRatingForRnB = await db.getAverageRatingForRnB(1);
    var rnb_song = averageRatingForRnB[0];
    if (rnb_song==undefined){
        rnb_rat += 0;
    }else{
        rnb_rat += rnb_song.dataValues.averageRating;
    }
    
    //average rating for jazz
    var averageRatingForJazz = await db.getAverageRatingForJazz(1);
    var jazz_song = averageRatingForJazz[0];
    if (jazz_song==undefined){
        jazz_rat += 0;
    }else{
        jazz_rat += jazz_song.dataValues.averageRating;
    }


    songs = await db.getSongs()
    repusers=[];
    for (const element of songs) {
        repuser = await db.User.findByPk(element.UserId)
        repusers.push(repuser.username);
    };

    var data = [];
    data.push(pop_rat,rock_rat,jazz_rat,classique_rat,rap_rat, rnb_rat,electro_rat);
    console.log("should be int", typeof(data[0]))
    console.log("data is:", data)
    //console.log(repusers)
    //module.exports = [pop_rat, rock_rat, jazz_rat, classique_rat, rap_rat, rnb_rat, electro_rat];

    res.render(path.join(__dirname, 'static/index.ejs'), {errormessage: "", songs: songs, repusers:repusers, data:data});
});

app.get('/auth', (req, res) => {
    res.render(path.join(__dirname, 'static/auth.ejs'));
});

app.get('/report', (req, res) => {
    res.locals.user = req.user;
    res.render(path.join(__dirname, 'static/report.ejs'));
});

app.get('/list', (req, res) => {
    res.locals.user = req.user;
    res.render(path.join(__dirname, 'static/list.ejs'));
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
const { Song, getUser, averageRatingsPerGenrePerUser, User } = require('./db.js');
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