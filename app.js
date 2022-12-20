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
    saveUninitialized: false,
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
    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);


    var pop_rat = 0;
    var rap_rat = 0;
    var electro_rat = 0;
    var jazz_rat = 0;
    var rnb_rat = 0;
    var rock_rat = 0;
    var classique_rat = 0;
    data = [];
    //average rating for pop
    if (!isNaN(userid) && userid!=0){
        averageRatingForPop = await db.getAverageRatingForPop(userid)
        var pop_song = averageRatingForPop[0];
        if (pop_song==undefined){
            pop_rat += 0;
        }else{
            pop_rat += pop_song.dataValues.averageRating;
        }
        //average rating for rap
        var averageRatingForRap = await db.getAverageRatingForRap(userid);
        var rap_song = averageRatingForRap[0];
        if (rap_song==undefined){
            rap_rat += 0;
        }else{
            rap_rat += rap_song.dataValues.averageRating;
        }
        //average rating for electro
        var averageRatingForElectro = await db.getAverageRatingForElectro(userid);
        var electro_song = averageRatingForElectro[0];
        if (electro_song==undefined){
            electro_rat += 0;
        }else{
            electro_rat += electro_song.dataValues.averageRating;
        }
        
        //average rating for rock
        var averageRatingForRock = await db.getAverageRatingForRock(userid);
        var rock_song = averageRatingForRock[0];
        if (rock_song==undefined){
            rock_rat += 0;
        }else{
            rock_rat += rock_song.dataValues.averageRating;
        }
        //average rating for classique
        var averageRatingForClassique = await db.getAverageRatingForClassique(userid);
        var classique_song = averageRatingForClassique[0];
        if (classique_song==undefined){
            classique_rat += 0;
        }else{
            classique_rat += classique_song.dataValues.averageRating;
        }
        
        //average rating for rnb
        var averageRatingForRnB = await db.getAverageRatingForRnB(userid);
        var rnb_song = averageRatingForRnB[0];
        if (rnb_song==undefined){
            rnb_rat += 0;
        }else{
            rnb_rat += rnb_song.dataValues.averageRating;
        }
        
        //average rating for jazz
        var averageRatingForJazz = await db.getAverageRatingForJazz(userid);
        var jazz_song = averageRatingForJazz[0];
        if (jazz_song==undefined){
            jazz_rat += 0;
        }else{
            jazz_rat += jazz_song.dataValues.averageRating;
        }
        var data = [];
        data.push(pop_rat,rock_rat,jazz_rat,classique_rat,rap_rat, rnb_rat,electro_rat);



        var nbrofclassique = 0
        var nbrofelectro = 0;
        var nbrofpop = 0;
        var nbrofrap = 0;
        var nbrofrnb = 0;
        var nbrofjazz = 0;
        var nbrofrock = 0;
        //nbr of songs for each genre for each user
        const testnbrofpop = await db.get_nbr_of_pop(userid);
        if (testnbrofpop[0]==undefined){
            nbrofpop += 0;
        }else{
            nbrofpop += testnbrofpop[0].count;
        }

        const testnbrofrock = await db.get_nbr_of_rock(userid);
        if (testnbrofrock[0]==undefined){
            nbrofrock += 0;
        }else{
            nbrofrock += testnbrofrock[0].count;
        }

        const testnbrofjazz = await db.get_nbr_of_jazz(userid);
        if (testnbrofjazz[0]==undefined){
            nbrofjazz += 0;
        }else{
            nbrofjazz += testnbrofjazz[0].count;
        }

        const testnbrofclassique = await db.get_nbr_of_classique(userid);
        if (testnbrofclassique[0]==undefined){
            nbrofclassique += 0;
        }else{
            nbrofclassique += testnbrofclassique[0].count;
        }

        const testnbrofrap = await db.get_nbr_of_rap(userid);
        if (testnbrofrap[0]==undefined){
            nbrofrap += 0;
        }else{
            nbrofrap += testnbrofrap[0].count;
        }

        const testnbrofrnb = await db.get_nbr_of_rnb(userid);
        if (testnbrofrnb[0]==undefined){
            nbrofrnb += 0;
        }else{
            nbrofrnb += testnbrofrnb[0].count;
        }

        const testnbrofelectro = await db.get_nbr_of_electro(userid);
        if (testnbrofelectro[0]==undefined){
            nbrofelectro += 0;
        }else{
            nbrofelectro += testnbrofelectro[0].count;
        }

        var nbr_of_songs_data = [];
        var total_nbr_of_songs = 0;
        nbr_of_songs_data.push(nbrofpop, nbrofrock, nbrofjazz, nbrofclassique, nbrofrap, nbrofrnb, nbrofelectro);
        for (let i = 0; i<nbr_of_songs_data.length; i++){
            total_nbr_of_songs += nbr_of_songs_data[i];
        }




    }else{
        console.log("there is no user connected yet")
    }


    res.render(path.join(__dirname, 'static/index.ejs'), {errormessage: "", data:data, nbr_of_songs_data:nbr_of_songs_data, total_nbr_of_songs: total_nbr_of_songs});
});

/*Liens vers les différentes pages*/

app.get('/auth', (req, res) => {
    res.render(path.join(__dirname, 'static/auth.ejs'));
});

app.get('/report', (req, res) => {
    res.locals.user = req.user;
    res.render(path.join(__dirname, 'static/report.ejs'));
});

app.get('/pop', async function (req, res) {
    res.locals.user = req.user;

    var PopSongs = 0;
    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);

    if (!isNaN(userid) && userid!=0){
        PopSongs = await db.getPopSongs(userid);
    }

    res.render(path.join(__dirname, 'static/pop.ejs'), {PopSongs: PopSongs});
});

app.get('/rap', async function (req, res) {
    res.locals.user = req.user;

    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);

    RapSongs = await db.getRapSongs(userid);

    res.render(path.join(__dirname, 'static/rap.ejs'), {RapSongs:RapSongs});
});

app.get('/electro', async function (req, res) {
    res.locals.user = req.user;

    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);

    ElectroSongs = await db.getElectroSongs(userid);

    res.render(path.join(__dirname, 'static/electro.ejs'), {ElectroSongs:ElectroSongs});
});

app.get('/rock', async function (req, res) {
    res.locals.user = req.user;
    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);

    RockSongs = await db.getRockSongs(userid);
    res.render(path.join(__dirname, 'static/rock.ejs'), {RockSongs:RockSongs});
});

app.get('/classique', async function (req, res) {
    res.locals.user = req.user;

    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);

    ClassiqueSongs = await db.getClassiqueSongs(userid);
    
    res.render(path.join(__dirname, 'static/classique.ejs'), {ClassiqueSongs:ClassiqueSongs});
});

app.get('/rnb', async function (req, res) {
    res.locals.user = req.user;
    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);

    RnbSongs = await db.getRnbSongs(userid);
    res.render(path.join(__dirname, 'static/rnb.ejs'), {RnbSongs});
});

app.get('/jazz', async function (req, res) {
    res.locals.user = req.user;
    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);

    JazzSongs = await db.getJazzSongs(userid);
    res.render(path.join(__dirname, 'static/jazz.ejs'), {JazzSongs:JazzSongs});
});

app.post('/auth', (req, res) => {
    //const user = // get the user object
    req.session.id = user.id;
  });
app.get('/list', async function (req, res)  {
    res.locals.user = req.user;
    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);

    var nbrofsongs = 0;
    var avgforallsongs = 0;
    data = [];

    var songs = 0;
    var bestgenre = 0;
    var pop_rat = 0;
    var rap_rat = 0;
    var electro_rat = 0;
    var jazz_rat = 0;
    var rnb_rat = 0;
    var rock_rat = 0;
    var classique_rat = 0;
    data = [];
    if (!isNaN(userid) && userid!=0){
        averageRatingForPop = await db.getAverageRatingForPop(userid)
        var pop_song = averageRatingForPop[0];
        if (pop_song==undefined){
            pop_rat += 0;
        }else{
            pop_rat += pop_song.dataValues.averageRating;
        }
        //average rating for rap
        var averageRatingForRap = await db.getAverageRatingForRap(userid);
        var rap_song = averageRatingForRap[0];
        if (rap_song==undefined){
            rap_rat += 0;
        }else{
            rap_rat += rap_song.dataValues.averageRating;
        }
        //average rating for electro
        var averageRatingForElectro = await db.getAverageRatingForElectro(userid);
        var electro_song = averageRatingForElectro[0];
        if (electro_song==undefined){
            electro_rat += 0;
        }else{
            electro_rat += electro_song.dataValues.averageRating;
        }
        
        //average rating for rock
        var averageRatingForRock = await db.getAverageRatingForRock(userid);
        var rock_song = averageRatingForRock[0];
        if (rock_song==undefined){
            rock_rat += 0;
        }else{
            rock_rat += rock_song.dataValues.averageRating;
        }
        //average rating for classique
        var averageRatingForClassique = await db.getAverageRatingForClassique(userid);
        var classique_song = averageRatingForClassique[0];
        if (classique_song==undefined){
            classique_rat += 0;
        }else{
            classique_rat += classique_song.dataValues.averageRating;
        }
        
        //average rating for rnb
        var averageRatingForRnB = await db.getAverageRatingForRnB(userid);
        var rnb_song = averageRatingForRnB[0];
        if (rnb_song==undefined){
            rnb_rat += 0;
        }else{
            rnb_rat += rnb_song.dataValues.averageRating;
        }
        
        //average rating for jazz
        var averageRatingForJazz = await db.getAverageRatingForJazz(userid);
        var jazz_song = averageRatingForJazz[0];
        if (jazz_song==undefined){
            jazz_rat += 0;
        }else{
            jazz_rat += jazz_song.dataValues.averageRating;
        }
        var data = [];
        data.push(pop_rat,rock_rat,jazz_rat,classique_rat,rap_rat, rnb_rat,electro_rat);
        const maxValue = Math.max.apply(null, data);
        const indexOfMaxValue = data.indexOf(maxValue);

        var temp = ["Pop", "Rock", "Jazz", "Classique", "Rap", "Rnb", "Electro"];
        var realbestgenre = temp[indexOfMaxValue];



        nbrofsongs += await db.get_nbr_of_songs(userid);
        avgforall = await db.getAverageRatingForAll(userid);
        avgforall = avgforall[0];
        if (avgforall==undefined){
            avgforallsongs += 0;
        }else{
            avgforallsongs += avgforall.dataValues.averageRating;
        }
        avgforallsongs = Number((avgforallsongs).toFixed(1));
        songs = await db.getSongs(userid)
    }


    res.render(path.join(__dirname, 'static/list.ejs'), {songs: songs, nbrofsongs: nbrofsongs, avgforallsongs:avgforallsongs, realbestgenre:realbestgenre});
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
const { Song, get_nbr_of_songs, getAverageRatingForAll, User } = require('./db.js');
 app.get('/search/:keyword', async function(req, res) {
    res.locals.user = req.user;
    var id = res.locals.user;
    if (id == undefined){
        id += 0;
    }else{
        id += res.locals.user.dataValues.id;
    }
    var userid = id[31];
    userid = parseInt(userid);

    var nbrofsongs = 0;
    var avgforallsongs = 0;
    var realbestgenre = 0;
    data = [];
    var pop_rat = 0;
    var rap_rat = 0;
    var electro_rat = 0;
    var jazz_rat = 0;
    var rnb_rat = 0;
    var rock_rat = 0;
    var classique_rat = 0;
    if (!isNaN(userid) && userid!=0){

        averageRatingForPop = await db.getAverageRatingForPop(userid)
        var pop_song = averageRatingForPop[0];
        if (pop_song==undefined){
            pop_rat += 0;
        }else{
            pop_rat += pop_song.dataValues.averageRating;
        }
        //average rating for rap
        var averageRatingForRap = await db.getAverageRatingForRap(userid);
        var rap_song = averageRatingForRap[0];
        if (rap_song==undefined){
            rap_rat += 0;
        }else{
            rap_rat += rap_song.dataValues.averageRating;
        }
        //average rating for electro
        var averageRatingForElectro = await db.getAverageRatingForElectro(userid);
        var electro_song = averageRatingForElectro[0];
        if (electro_song==undefined){
            electro_rat += 0;
        }else{
            electro_rat += electro_song.dataValues.averageRating;
        }
        
        //average rating for rock
        var averageRatingForRock = await db.getAverageRatingForRock(userid);
        var rock_song = averageRatingForRock[0];
        if (rock_song==undefined){
            rock_rat += 0;
        }else{
            rock_rat += rock_song.dataValues.averageRating;
        }
        //average rating for classique
        var averageRatingForClassique = await db.getAverageRatingForClassique(userid);
        var classique_song = averageRatingForClassique[0];
        if (classique_song==undefined){
            classique_rat += 0;
        }else{
            classique_rat += classique_song.dataValues.averageRating;
        }
        
        //average rating for rnb
        var averageRatingForRnB = await db.getAverageRatingForRnB(userid);
        var rnb_song = averageRatingForRnB[0];
        if (rnb_song==undefined){
            rnb_rat += 0;
        }else{
            rnb_rat += rnb_song.dataValues.averageRating;
        }
        
        //average rating for jazz
        var averageRatingForJazz = await db.getAverageRatingForJazz(userid);
        var jazz_song = averageRatingForJazz[0];
        if (jazz_song==undefined){
            jazz_rat += 0;
        }else{
            jazz_rat += jazz_song.dataValues.averageRating;
        }
        var data = [];
        data.push(pop_rat,rock_rat,jazz_rat,classique_rat,rap_rat, rnb_rat,electro_rat);
        const maxValue = Math.max.apply(null, data);
        const indexOfMaxValue = data.indexOf(maxValue);

        var temp = ["Pop", "Rock", "Jazz", "Classique", "Rap", "Rnb", "Electro"];
        var realbestgenre = temp[indexOfMaxValue];


        nbrofsongs += await db.get_nbr_of_songs(userid);
        avgforall = await db.getAverageRatingForAll(userid);
        avgforall = avgforall[0];
        if (avgforall==undefined){
            avgforallsongs += 0;
        }else{
            avgforallsongs += avgforall.dataValues.averageRating;
        }
        avgforallsongs = Number((avgforallsongs).toFixed(1));
        
    }

    //search bar
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
    res.render(path.join(__dirname, 'static/list.ejs'), {errormessage: "", songs: searched, nbrofsongs:nbrofsongs, avgforallsongs:avgforallsongs, realbestgenre:realbestgenre});
});

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: "ingi"
}, app).listen(8080);

console.log("Server Started!");