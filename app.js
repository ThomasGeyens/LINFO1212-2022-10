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


    let pop_rat = 0;
    let rap_rat = 0;
    let electro_rat = 0;
    let jazz_rat = 0;
    let rnb_rat = 0;
    let rock_rat = 0;
    let classique_rat = 0;
    //average rating for pop
    const averageRatingForPop = await db.getAverageRatingForPop(1);
    const pop_song = averageRatingForPop[0];
    if (pop_song==undefined){
        pop_rat += 0;
    }else{
        pop_rat += pop_song.dataValues.averageRating;
    }
    console.log("should be 5.3", pop_rat)
    //average rating for rap
    const averageRatingForRap = await db.getAverageRatingForRap(1);
    const rap_song = averageRatingForRap[0];
    if (rap_song==undefined){
        rap_rat += 0;
    }else{
        rap_rat += rap_song.dataValues.averageRating;
    }
    console.log("should be 0", rap_rat)
    //average rating for electro
    const averageRatingForElectro = await db.getAverageRatingForElectro(1);
    const electro_song = averageRatingForElectro[0];
    if (electro_song==undefined){
        electro_rat += 0;
    }else{
        electro_rat += electro_song.dataValues.averageRating;
    }
    
    //average rating for rock
    const averageRatingForRock = await db.getAverageRatingForRock(1);
    const rock_song = averageRatingForRock[0];
    if (rock_song==undefined){
        rock_rat += 0;
    }else{
        rock_rat += rock_song.dataValues.averageRating;
    }
    
    //average rating for classique
    const averageRatingForClassique = await db.getAverageRatingForClassique(1);
    const classique_song = averageRatingForClassique[0];
    if (classique_song==undefined){
        classique_rat += 0;
    }else{
        classique_rat += classique_song.dataValues.averageRating;
    }
    
    //average rating for rnb
    const averageRatingForRnB = await db.getAverageRatingForRnB(1);
    const rnb_song = averageRatingForRnB[0];
    if (rnb_song==undefined){
        rnb_rat += 0;
    }else{
        rnb_rat += rnb_song.dataValues.averageRating;
    }
    
    //average rating for jazz
    const averageRatingForJazz = await db.getAverageRatingForJazz(1);
    const jazz_song = averageRatingForJazz[0];
    if (jazz_song==undefined){
        jazz_rat += 0;
    }else{
        jazz_rat += jazz_song.dataValues.averageRating;
    }
   console.log("should be 7", jazz_rat)


    songs = await db.getSongs()
    repusers=[];
    for (const element of songs) {
        repuser = await db.User.findByPk(element.UserId)
        repusers.push(repuser.username);
    };

    const data = [pop_rat,rock_rat,jazz_rat,classique_rat,rap_rat, rnb_rat,electro_rat];
    console.log("this should be the data", data)
    //module.exports = [pop_rat, rock_rat, jazz_rat, classique_rat, rap_rat, rnb_rat, electro_rat];

    res.render(path.join(__dirname, 'static/index.ejs'), {errormessage: "", songs: songs, repusers:repusers, pop_rat:pop_rat, rock_rat:rock_rat, jazz_rat:jazz_rat, classique_rat:classique_rat, electro_rat:electro_rat, rnb_rat:rnb_rat, rap_rat:rap_rat, data:data});
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
const { Song, getUser, averageRatingsPerGenrePerUser } = require('./db.js');
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