const express = require("express");
const bodyParser = require("body-parser");
const Favorites = require("../models/favorite");
const authenticate = require("../authenticate");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route("/")
.get(authenticate.verifyUser, (req,res,next) => {
    Favorites.find({user : req.user})
    .populate("user")
    .populate("dishes")
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user})
    .then(favorites => {
        if(favorites){
            console.log(req.body.every(dish => !favorites.dishes.includes(dish._id)));
            if(req.body.every(dish => !favorites.dishes.includes(dish._id))){
                req.body.forEach(dish => {
                    favorites.dishes.push(dish);
                });
                favorites.save()
                .then(favorites => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type","application/json");
                    res.json(favorites);
                });
            }else{
                err = new Error("Aleast One of the dishes is already in favorites");
                err.status = 400;
                return next(err);
            }
        }else{
            favorites = new Favorites({user : req.user._id});
            req.body.forEach(dish => {
                favorites.dishes.push(dish);
            });
            favorites.save()
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(favorites);
            });
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .then(favorites => {
        Favorites.findByIdAndRemove(favorites._id)
        .then(resp => {
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.json(resp);
        })
    })
    .catch(err => next(err));
});

favoriteRouter.route("/:dishId")
.post(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .then(favorites => {
        if(favorites){
            if(favorites.dishes.indexOf(req.params.dishId) === -1){
                favorites.dishes.push(req.params.dishId);
                favorites.save()
                .then(favorites => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type","application/json");
                    res.json(favorites);
                });
            }else{
                err = new Error("Dish is already in the favorites");
                err.status = 400;
                return next(err);
            }
        }else{
            favorites = new Favorites({user : req.user._id});
            favorites.dishes.push(req.params.dishId);
            favorites.save()
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(favorites);
            });
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .then(favorites => {
        if(favorites != null && favorites.dishes.includes(req.params.dishId)){
            favorites.dishes.splice(favorites.dishes.indexOf(req.params.dishId),1);
            favorites.save()
            .then(fav => {
                res.statusCode = 200;
                res.setHeader("Content-Type","applicaion/json");
                res.json(fav);
            })
        }else if(!favorites.dishes.includes(req.params.dishId)){
            var err = new Error("Dish " + req.params.dishId + " is not found");
            err.status = 404;
            return err;
        }else{
            var err = new Error("Favorites is not found for the user");
            err.status = 404;
            return err;
        }
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;