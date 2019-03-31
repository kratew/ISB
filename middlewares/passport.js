var passport = require('passport');
var NaverStrategy = require('passport-naver').Strategy;

function insertPassport(accessToken, refreshToken, profile, done) {
    //console.log("insertPassport:", profile);

    if(profile !== undefined ) {
        // ON DUPLICATE KEY UPDATE 사용하여 최종 로그인시간 없데이트
        dbpool.getConnection(function(err, conn) {
            if(err) { // DB 연결 실패시
                console.log("Connection Error:",err);
                return done("DBError",profile)
            }
            // naver는 displayName값 없음
            if(profile.provider == "naver") profile.displayName=profile.id;
            conn.query('INSERT INTO passport_user (user_name, user_sns, user_identify_id) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE mdate=NOW()', [profile.displayName, profile.provider, profile.id], function(err, result, fields) {
                if(err) {
                    console.log("insertPassportErr", err);
                    conn.release();
                    return done(err,profile); // 에러
                }
                conn.release();
                return done(null, {uid:result.insertId, name:profile.displayName, sns:profile.provider, sns_id:profile.id});
            });
            //console.log(query);
        });
    } else { // passport callback 실패할때
        console.log("PassportFail:",profile)
        done("PassportFail");
    }
};


module.exports = () => {

    passport.serializeUser(function (user, done) { // Strategy 성공 시 호출됨
        done(null, user);
    });
    passport.deserializeUser(function (user, done) { // 매개변수 user는 req.session.passport.user에 저장된 값
        done(null, user);
    });

    passport.use(new NaverStrategy(config.passport.naver, insertPassport));
};