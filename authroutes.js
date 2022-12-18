const express = require('express')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport-local');
const User = require('./db').User;
const bcrypt = require('bcrypt');
module.exports = function(app,passport)
{

app.use((bodyParser.urlencoded({ extended: false })))
app.use(bodyParser.json());
 app.get('/signup', function(req,res) {
     res.render('../intro/index');
 }) 
 app.get('/login',function(req,res){
     res.send({
         username: req.body.username
     })
 });

app.post('/signup', function(req,res){
    let hashed = bcrypt.hashSync(req.body.password, 10);
    var a = [req.body.email,req.body.username, hashed, req.body.name];
    User.findOne({
       where: { email: a[0],
        username: a[1],
        password: a[2],
        name: a[3]
       }

    }).then(users => {
        if (users) {
            res.redirect("/");
        }
        else{
            User.create({
                email: a[0],
                username: a[1],
                password: a[2],
                name: a[3]

          }).then(users => {
            res.redirect("/");
          }).catch(function () {
            console.log("Account creation Rejected");
       });    
        }
    }).catch(function (reason) {
        console.log(reason);
   });
})

app.post('/login', passport.authenticate('local', { successRedirect:'/', failureRedirect: '/auth' }));
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next("test",err); }
      res.redirect('/');
    });
  });

}