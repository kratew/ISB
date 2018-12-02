/*
 *
 *   Main Index Router
 *
 */

var express = require('express');
var router = express.Router();

module.exports = function(){

    require('express-group-routes');   // 그룹 라우팅

    router.get('/', function(req, res){
        res.render('./main', {title: "홈"});
        console.log("Main Page Rendered.");
    });

    router.get('/signin', function(req, res){
        res.render('./signin', {title: "로그인"});
        console.log("Sign In Page Rendered.");
    });

    router.get('/signup', function(req, res){
        res.render('./signup', {title: "회원가입"});
        console.log("Sign Up Page Rendered.");
    });

    router.get('/map', function(req, res){
        res.render('./map', {title: "회원가입"});
        console.log("Sign Up Page Rendered.");
    });

    return router;
};