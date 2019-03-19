/*
 *
 *   ISB Project
 *
 */

/* * 각자의 노트북에서 개발환경 변경하는 법.
 *
 *  - Mac OS, Linux 개발환경 설정
 *
 *  export NODE_ENV=production
 *  export NODE_ENV=development
 *
 *
 *  - Windows 개발환경설정
 *
 *  set NODE_ENV=production
 *  set NODE_ENV=development
 */

// ↘ 자동 development 환경설정
process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';

var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
// var RedisStore = require('connect-redis')(session);
// var redis = require('redis');
var flash = require('connect-flash');
var app = express();

app.use(bodyParser.urlencoded({ extended: true })); // body-parser 사용 설정.
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs'); // 템플릿 엔진 ejs 사용 선언. res.render 메소드에서 .ejs 생략 가능
app.set('views', './views'); // views 파일들이 있는 경로 설정

app.use(cookieParser());
app.use(flash());

// ↘ 현재 개발 환경에 따른 config global 변수 설정.
if(process.env.NODE_ENV === "production") {
    global.config = JSON.parse(fs.readFileSync('./config/production.json'));
} else {
    global.config = JSON.parse(fs.readFileSync('./config/development.json'));
}

global.dbpool = mysql.createPool(config.mysql.dbconn);  // mysql global 변수 설정.
// global.cache = redis.createClient({host:config.redis.host}); // redis 글로벌로 사용.

app.use(session({
    // store: new RedisStore({
    //     host: config.redis.host,
    //     port: config.redis.port,
    //     ttl: config.session.ttl,
    //     prefix: config.session.prefix
    // }),
    resave: config.session.resave,  // 세션 아이디를 접속할 때마다 새롭게 발급하지 않음
    saveUninitialized: config.session.saveUninitialized,    // 세션 아이디를 실제 사용 전에는 발급하지 않음
    secret: config.session.secret,  // 쿠키에 저장할 connect.sid값을 암호화할 키값 입력
    cookie: config.session.cookie,
    name: config.session.name
}));

app.use(cookieSession({
    keys: ['node_yun'],
    cookie: {
        maxAge: 1000 * 60 * 60  // 유효기간 1시간
    }
}));

app.use('/', express.static(__dirname + '/public')); // public 디렉토리 사용 설정.

app.use('/', require('./routers/index.js')());  // 라우팅 설정.

// ↘ 서버 실행!
app.listen(config.server.listen, function(){
    console.log("Start app.listen :: Port:" + config.server.listen.port + " =================================");
    console.log("Process running in " + process.env.NODE_ENV + " environment.");
});
