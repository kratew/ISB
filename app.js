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
var csrf = require('csurf');
var bodyParser = require('body-parser');
var redis = require('redis');
var redisStore = require('connect-redis');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var app = express();
app.use(timeout('10s')) // timeout 5초 적용

var client = redis.createClient(6379, 'localhost');

app.use(bodyParser.urlencoded({ extended: true })); // body-parser 사용 설정.
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs'); // 템플릿 엔진 ejs 사용 선언. res.render 메소드에서 .ejs 생략 가능
app.set('views', './views'); // views 파일들이 있는 경로 설정

app.disable('x-powered-by'); // for Security
app.enable('trust proxy'); // behind elb

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(haltOnTimedout)
app.use(cookieParser());
app.use(haltOnTimedout)
app.use(expressValidator()); // express-validator 사용

// ↘ 현재 개발 환경에 따른 config global 변수 설정.
if(process.env.NODE_ENV === "production") {
    global.config = JSON.parse(fs.readFileSync('./config/production.json'));
} else {
    global.config = JSON.parse(fs.readFileSync('./config/development.json'));
}

global.dbpool = mysql.createPool(config.mysql.dbconn);  // mysql global 변수 설정.
global.cache = redis.createClient({host:config.redis.host}); // redis 글로벌로 사용.

// 레디스 세션
app.use(session({
    store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        ttl: config.session.ttl,
        prefix: config.session.prefix
    }),
    resave: config.session.resave, // 세션을 언제나 저장할 지 정하는 값
    saveUninitialized: config.session.saveUninitialized, // 세션이 저장되기 전 초기화가 안된 상태로 미리 만들어서 저장
    secret: config.session.secret, // 세션을 암호화 하여 저장
    cookie: config.session.cookie,
    name: config.session.name
}));

var csrfProtection = csrf({ cookie: true });

cache.on("error", function (err){
    // TODO: redis 에러 처리
    console.log("RedisError:" + err);
});

app.use('/', express.static(__dirname + '/public')); // public 디렉토리 사용 설정.

app.use('/', require('./routes/index.js')());  // 라우팅 설정.

// Status 404 (Error) middleware
app.use('*', require("./middlewares/errorHandler").NotFoundHandler);

// 기본 에러핸들러
app.use(require("./middlewares/errorHandler").DefaultHandler);

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
}


// ↘ 서버 실행!
app.listen(config.server.listen, function(){
    console.log("Start app.listen :: Port:" + config.server.listen.port + " =================================");
    console.log("Process running in " + process.env.NODE_ENV + " environment.");
});
