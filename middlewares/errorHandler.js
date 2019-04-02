/*
 * 전역 에러 헨들러
 */

exports.DefaultHandler = function(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    // TODO: 로깅 혹은 traceback 전달
    console.log({ip:req.ip,url:req.url,params:req.params,err:err});
    res.render('error', { text:"오류가 발생하였습니다." } );
    // TODO: ajax

}

exports.NotFoundHandler = function(req,res){
    res.status(404)
    /*
    if(req.headers.accept.indexOf('html'))
        res.render('error', { text:"페이지를 찾을 수 없습니다." })
    else
    */
        // TODO: Ajax에서는 별도 처리
    console.log({ip:req.ip,url:req.url,params:req.params});
    res.render('error', { text:"페이지를 찾을 수 없습니다." } );
    //res.send("NotFound")
}
