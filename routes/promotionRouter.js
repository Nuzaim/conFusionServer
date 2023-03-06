const express = require("express");
const bodyParser = require("body-parser");
const Promotions = require("../models/promotions");

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route("/")
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions)=>{
        req.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promotions);
    })
    .catch((err)=> next(err) );
})
.post((req,res,next) => {
    Promotions.create(req.body)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promotion);
    })
    .catch((err)=> next(err) );
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    Promotions.deleteMany()
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    })
    .catch((err)=> next(err) );
});

promotionRouter.route("/:promotionId")
.get((req,res,next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promotion);
    })
    .catch((err)=> next(err) );
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST operaion not supported on /promotions/" + req.params.promotionId);
})
.put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promotionId,{
        $set: req.body
    },{ new: true})
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promotion);
    })
    .catch((err)=> next(err) );
})
.delete((req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promotionId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    })
    .catch((err)=> next(err) );
});

module.exports = promotionRouter;