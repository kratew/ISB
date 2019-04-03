/*
 *
 *   Main Index Router
 *
 */

var express = require('express');
var router = express.Router();

module.exports = function(){

    require('express-group-routes');   // 그룹 라우팅
    // const basicAuth = require('express-basic-auth')

    // 패키지
    var passport = require('passport');

    // 미들웨어
    var auth = require('../middlewares/auth');


    router.use(passport.initialize()); // passport(인증 모듈)를 초기화하는 미들웨어
    router.use(passport.session()); // 현재 세션 ID을 deserialized user 객체로 변경하는 미들웨어
    // router.use(passport.authenticate('session'));
    require('../middlewares/passport.js')(passport);

    // view에 사용될 전역변수
    router.use(function (req, res, next) {
        res.locals.remoteip = res.ip;
        res.locals.main_max = config.main_max; // 메인에서 뿌려줄 최대 후보자수
        res.locals.is_login = req.isAuthenticated(); // 로그인 되어있는지
        res.locals.username = req.isAuthenticated() ? req.user.name : undefined;
        /*
        cache.get("countdown",function(err, data){
            console.log("InitCountdown:"+data);
            res.locals.countdown = JSON.parse(data);
            next();
        });
        */
        next();

    });

    // 접속 테스트 로그
    router.use(function(req, res, next) {
        //console.log("Cookies :  ", req.cookies);
        console.log("ACCESS:" + req.ip, req.method, req.originalUrl, typeof req.user !== undefined ? JSON.stringify(req.user) : "");
        next();
    });


    ///////////////////////////////////
    // 메인 인덱스

    router.get('/', function (req, res) {
        cache.get("maintenance",function(err, data){

            if(err){
                console.log("cache:get:error:" + err);
                res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
                return;
            }

            if(data === null){ // 캐쉬 없을때
                console.log("Main Page Rendered.");
                res.render('./main',{title:"홈"});;
                return;
            }

            res.render('./comming',{title:"준비중",text:data});
        });
    });


    ///////////////////////////////////
    // 맵

    router.get('/map', function(req, res){
        console.log("Map Page Rendered.");
        res.render('./map', {title: "회원가입"});
    });


    /////////////////////////////
    // Member 관련

    router.group("/login/auth", function(router) {

        var login_success_uri = '/map';
        var login_failure_uri = '/';

        router.get('/naver', passport.authenticate('naver'));
        router.get('/naver/callback', passport.authenticate('naver', { successRedirect: login_success_uri, failureRedirect: login_failure_uri} ));
    });

    // 로그아웃
    router.get('/logout', function (req, res) {
        // 로그인 세션 있으면 지움
        if(req.user) req.session.destroy();
        res.redirect('/');
    });


    ///////////////////////////////////
    // Ajax

    router.group("/ajax", function(router) {

        //router.use(auth.authCheck); // 인증확인
        // router.get('/update_main',updateController.updateMain); // 메인페이지 업데이트
    });





    return router;
};