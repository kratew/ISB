var passport = require('passport');
var NaverStrategy = require('passport-naver').Strategy;

module.exports = () => {

    passport.serializeUser(function (user, done) { // Strategy 성공 시 호출됨
        console.log("Strategy Serialized");
        done(null, user);
    });
    passport.deserializeUser(function (user, done) { // 매개변수 user는 req.session.passport.user에 저장된 값
        console.log("Strategy Deserialized");
        done(null, user);
    });

    passport.use(new NaverStrategy(config.passport.naver, function(){
        console.log("Naver Strategy used");
    }));
};