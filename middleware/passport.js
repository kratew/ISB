var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function insertPassport(accessToken, refreshToken, profile, done) {
    // console.log("insertPassport:", profile);

    if(profile !== undefined ) {
        // ON DUPLICATE KEY UPDATE 사용하여 최종 로그인시간 없데이트
        dbpool.getConnection(function(err, conn) {
            if(err) { // DB 연결 실패시
                console.log("Connection Error:",err);
                return done("DBError",profile)
            }
            // naver는 displayName값 없음
            if(profile.provider == "naver") profile.displayName=profile.id;
            conn.query('INSERT INTO bfc_passport_user (user_name, user_sns, user_identify_id, bfc_season_number) VALUES(?, ?, ?, 3) ON DUPLICATE KEY UPDATE mdate=NOW()', [profile.displayName, profile.provider, profile.id], function(err, result, fields) {
                if(err) {
                    console.log("insertPassportErr", err);
                    conn.release();
                    return done(err,profile); // 에러
                }
                /*
                TODO: INSERT ON DUPLICATE KEY UPDATE를 하면 UPDATE시에 insertId가 무조건 1로 튀어나올때고 있는듯 한데;;;
                If a table contains an AUTO_INCREMENT column and INSERT ... UPDATE inserts a row, the LAST_INSERT_ID() function returns the AUTO_INCREMENT value. If the statement updates a row instead, LAST_INSERT_ID() is not meaningful.
                */

                /*
                var userid=result.insertId;
                if(result.affectedRows == 1){ // INSERT 일때
                    console.log("LOGIN:NEW:" + userid + ":" + profile.provider + "/" + profile.displayName);
                } else { // UPDATE 일때
                    conn.query('SELECT pk FROM bfc_passport_user WHERE user_sns=? AND user_identify_id=? LIMIT 1', [profile.provider, profile.id], function(err, rows, fields) {
                        console.log("TEST:",rows);
                        if(err || rows.length < 1) {
                            console.log("selectPassportErr", err);
                            conn.release();
                            return done(err,profile); // 에러
                        }
                        userid=rows[0].pk;
                    });
                    console.log("LOGIN:RE:" + userid + ":" + profile.provider + "/" + profile.displayName);
                }
                */
                conn.release();
                return done(null, {uid:result.insertId, name:profile.displayName, sns:profile.provider, sns_id:profile.id});
            });
            // console.log(test.sql);
        });
    } else { // passport callback 실패할때
        console.log("PassportFail:",profile)
        done("PassportFail");
    }
};


module.exports = () => {

    passport.serializeUser(function (user, done) { // Strategy 성공 시 호출됨
        done(null, user);   // 여기의 user가 deserializeUser의 첫 매개변수로 이동.
    });
    passport.deserializeUser(function (user, done) { // 매개변수 user는 req.session.passport.user에 저장된 값
        done(null, user);   // 여기의 user가 req.user가 됨.
    });


    // Sign Up
    passport.use('signup', new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
        serialnum: 'sn',
        email: 'em',
        birth: 'bi',
        phone: 'pn',
        session: true,  // 세션에 저장 여부
        passReqToCallback: true
    }, function(req, id, pw, sn, em, bi, pn, done){
        if(!id || !pw) { return done(null, false); }    // id, pw를 입력하지 않은 경우

        dbpool.getConnection(function(err, conn){
            if(err){     // DB 연결 실패시 에러핸들링
                console.log("signup:DB Connection Error!!");
                res.status(200).json({ status: false, message: "signup:DB 연결에 장애가 발생했습니다." });
                return;
            }

            conn.query('SELECT * FROM homepageusers WHERE id=?', [id], function (err, result) {
                if (err) {
                    conn.release();
                    console.log("signup:sql:err:" + err)
                } else {
                    if(rows.length){
                        console.log("signup:err:해당하는 id가 이미 존재함.");
                        return done(false, null);
                    } else {
                        conn.query('INSERT INTO homepageusers (id, pw, serialnumber, email, birth, phone), values(?, ?, ?, ?, ?, ?)',
                            [id, pw, sn, em, bi, pn], function(err, result, fields){
                                console.log("signup:DB Connection Error:insert:",err);
                                res.status(200).json({ status:false, messages: 'signup:등록에 장애가 발생하였습니다.' });
                                conn.release();
                                return;
                        });
                        conn.release();
                        console.log("signup:newID:"+id);
                        return done(null, {
                            id: id,
                            serialnumber: sn
                        });
                    }
                }
            }); // end of conn.query
        }); // end of dbpool.getConnection
    })); // end of passport.use('signin', new LocalStrategy({}))


    // Sign In
    passport.use('signin', new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
        session: true,  // 세션에 저장 여부
        passReqToCallback: true
    }, function(req, id, pw, done){
        if(!id || !pw) { return done(null, false); }    // id, pw를 입력하지 않은 경우

        dbpool.getConnection(function(err, conn){
            if(err){     // DB 연결 실패시 에러핸들링
                console.log("DB Connection Error!!");
                res.status(200).json({ status: false, message: "DB 연결에 장애가 발생했습니다." });
                return;
            }

            conn.query('SELECT * FROM homepageusers WHERE id=? AND season_number = 3', [id], function (err, result) {
                if (err) {
                    conn.release();
                    console.log("signin:sql:err:" + err)
                } else {
                    if(result.length === 0){
                        console.log("signin:해당하는 id가 존재하지 않음.");
                        return done(false, null);
                    } else {
                        if(!result[0].pw){
                            console.log("signin:패스워드가 일치하지 않음.");
                            return done(false, null);
                        } else {
                            console.log("signin:로그인 성공:" + result[0].id);
                            return done(null, {
                                id: result[0].id,
                                serialnumber: result[0].serialnumber
                            });
                        }
                    }
                }
            }); // end of conn.query
        }); // end of dbpool.getConnection
    })); // end of passport.use('signin', new LocalStrategy({}))

};  // end of module.exports