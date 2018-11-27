/*
 *
 *   ISB Project
 *
 */


var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();


app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // 템플릿 엔진 ejs 사용 선언. res.render 메소드에서 .ejs 생략 가능
app.set('views', './views'); // views 파일들이 있는 경로 설정



console.log("Hello World!");
