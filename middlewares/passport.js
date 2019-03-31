var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = () => {

    // ↘ 로그인 성공시 serializeUser 메소드를 통해서 사용자 정보를 세션에 저장.
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(user, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    // ↘ sn이 'aaa'일 경우 sn을 done callback을 통해 serializeUser 메소드로 넘김.
    // 인증에 실패하면 done(false, null)를 처리함.
    passport.use(new LocalStrategy({
        usernameField: 'sn',    // main.ejs의 <input>태그의 name값과 같아야함.
        passwordField: 'pw',
        passReqToCallback: true // 인증을 수행하는 인증 함수로, HTTP Request를 그대로 전달할지 여부를 결정.
    }, function(req, sn, pw, done){



        dbpool.getConnection(function(err, conn) {
            if(err) { // DB 연결 실패시
                console.log("DB Connection Error:",err);
                return done("DBError",profile)
            }

            conn.query('SELECT * FROM homepageusers WHERE name = "' + sn + '"', function (err, rows) {
                if (err) {
                    conn.release();
                    console.log("SQL Search 에러 : " + err);
                    conn.release();
                    return done(false, null);
                }

                console.log("dbcall:main:" + rows.length);

                // 후보목록을 가져오는 데 실패하면 즉, 검색결과가 없으면
                if (rows && rows instanceof Array && !rows.length) {
                    console.log("찾는 후보가 존재하지 않습니다.");
                    return done(false, null);
                }

                var realdata = JSON.stringify(rows);
                res.status(200).json({status: true, data: realdata});
                return done(null, {
                    'sn' : sn
                });
            });

        });


    }));

}; // end of module.exports




/*

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = () => {

    passport.serializeUser(function (user, done) { // Strategy 성공 시 호출됨
        done(null, user);   // 여기의 user가 deserializeUser의 첫 매개변수로 이동.
    });
    passport.deserializeUser(function (user, done) { // 매개변수 user는 req.session.passport.user에 저장된 값
        done(null, user);   // 여기의 user가 req.user가 됨.
    });


    // Sign Up
    passport.use('signup', new LocalStrategy({
        // idField: 'id',
        // pwField: 'pw',
        // serialnumberField: 'sn',
        // emailField: 'em',
        // birthField: 'bi',
        // phoneField: 'pn',
        usernameField: 'id',
        passwordField: 'pw',
        session: true,  // 세션에 저장 여부
        passReqToCallback: true
    }, function(req, id, pw, done){
        // if(!id || !pw || !sn) {
        //     return done(null, false);
        // }    // id, pw, sn을 입력하지 않은 경우

        console.log("#### Local Passport signup 실행됨");

        dbpool.getConnection(function(err, conn){
            if(err){     // DB 연결 실패시 에러핸들링
                console.log("signup:DB Connection Error!!");
                res.status(200).json({ status: false, message: "signup:DB 연결에 장애가 발생했습니다." });
                return;
            }

            console.log("#### dbpool.getConnection 성공.");

            conn.query('SELECT * FROM homepageusers WHERE id=?', [id], function (err, result) {
                if (err) {
                    conn.release();
                    console.log("signup:sql:err:" + err)
                } else {

                    console.log("#### homepageusers DB SELECT 성공");

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
    })); // end of passport.use('signup', new LocalStrategy({}))


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

*/