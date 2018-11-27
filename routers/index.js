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
        res.render('./main', {title: "홈"}, function(){
            console.log("Main Page Rendered.");
        });
    });

    return router;
};