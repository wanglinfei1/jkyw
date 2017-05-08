/**
 * Created by wanglinfei on 2017/4/10.
 */
const reqUrl=require('./reqUrl.js');
const request = require('request');
var upLoad=function (afile,req,res,ret){
    let proxy_url=reqUrl.urlFile;
    /*设置请求后台请求头*/
    var Accept=req.headers["accept"];
    var ContentType=req.headers["content-type"];
    var connection=req.headers["connection"];
    var headers={"connection":connection,"Accept":Accept,"content-type":ContentType,"nonce":ret.nonceStr,"timestamp":ret.timestamp,"verificateCode":ret.signature};
   var options = {
        headers: headers,
        url: proxy_url+req.url,
        body: afile
    };
    /*请求后台*/
    request.post(options,callback);
       console.log(options);
    function callback(error, response, data) {
        try {
            handler(error, response, data);
        } catch(e) {
            console.log('\r\n', e, '\r\n', e.stack);
            try {
                res.end(e.stack);
            } catch(e) { }
        }
    }
    function handler(error, response, data){
        var type = response.headers["content-type"];
        var originUrl=reqUrl.originUrl;
        res.set({'Access-Control-Allow-Origin': originUrl, "Content-Type": type});
        if(response){
            if(data){
                console.log(data);
                res.send(data);
            }else{
                res.send(response);
            }
        }else{
            console.log('请求成功');
        }
        if(error){
            res.send(error);
        }
    }
};
module.exports = upLoad;