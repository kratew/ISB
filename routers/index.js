/*
 *
 *   Main Index Router
 *
 */

var express = require('express');
var router = express.Router();

module.exports = function(){

    require('express-group-routes');   // 그룹 라우팅

    // 패키지
    var passport = require('passport');

    router.use(passport.initialize()); // passport(인증 모듈)를 초기화하는 미들웨어
    router.use(passport.session()); // 현재 세션 ID을 deserialized user 객체로 변경하는 미들웨어
    // router.use(passport.authenticate('session'));
    require('../middlewares/passport.js')(passport);


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


    // Sign Up
    router.post('/signup-auth', function(req, res, next) {
        // res.render('index', { title: 'Marketplace Untuk Anda' });
        passport.authenticate('signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true })
    });

    // Sign In
    router.post('/signin-auth', function(req,res,next){
        passport.authenticate('signin',{
            successRedirect: '/',
            failureRedirect: '/signin' });
    });

    return router;
};