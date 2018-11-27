/*
 *
 *   Main Index Router
 *
 */

var express = require('express');
var router = require('router');

module.exports = function(){

    require('express-group-routing');   // 그룹 라우팅

    router.get('/', function(req, res){
        res.render('./main', function(){
            console.log("Page Main Rendered.");
        });
    });

    return router;
};