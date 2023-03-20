var express = require('express');
const bodyParser = require('body-parser');
var Users = require("../models/users");
var router = express.Router();
var passport = require("passport");
var authenticate = require('../authenticate');
var cors = require("./cors");

router.use(bodyParser.json());

/* GET users listing. */
router.get('/',cors.corsWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  Users.find({})
  .then((users)=>{
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    res.json(users);
  })
});
router.post('/signup', cors.corsWithOptions, (req,res,next)=>{
  Users.register(new Users({username:req.body.username}), req.body.password, (err,user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader("Content-Type","application/json");
      console.log("before err");
      res.json({err: err});
    }else{
      if (req.body.firstname)
        Users.firstname = req.body.firstname;
      if (req.body.lastname)
        Users.lastname = req.body.lastname;
      Users.save()
      .then((dish)=>{
        /*
        Dishes.findById(dish._id)
        .populate("comments.author")
        .then(dish => {
            res.statusCode(200);
            res.setHeader("Content-Type","application/json");
            res.json(dish);
        })
        */
        res.statusCode(200);
        res.setHeader("Content-Type","application/json");
        res.json(dish);
      }, 
      (err)=> { 
        console.log("err");
        return next(err)} )
    }
  });
});

router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get("/logout", cors.corsWithOptions, (req,res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  }else{
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;