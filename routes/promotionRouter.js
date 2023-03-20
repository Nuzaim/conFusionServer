const express = require("express");
const bodyParser = require("body-parser");
const Promotions = require("../models/promotions");
const authenticate = require("../authenticate");
const cors = require("./cors");

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route("/")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Promotions.find({})
    .then((promotions)=>{
        req.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promotions);
    })
    .catch((err)=> next(err) );
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promotions.create(req.body)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promotion);
    })
    .catch((err)=> next(err) );
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.deleteMany()
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    })
    .catch((err)=> next(err) );
});

promotionRouter.route("/:promotionId")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promotion);
    })
    .catch((err)=> next(err) );
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end("POST operaion not supported on /promotions/" + req.params.promotionId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promotionId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    })
    .catch((err)=> next(err) );
});

module.exports = promotionRouter;