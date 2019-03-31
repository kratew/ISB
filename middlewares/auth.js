/*
 * 인증체크 미들웨어
 */

// var utils = require('../helpers/utils');

// 세션 로그인 되었을때
exports.authCheck =function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        console.log("RequireAuth:",req.ip, req.method, req.originalUrl);
        res.redirect("/login");
        return;
    }
};
