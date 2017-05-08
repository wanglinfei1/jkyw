/**
 * Created by wanglinfei on 2017/4/10.
 */
const reqUrl=require('./reqUrl.js');
const request = require('request');
var upLoad=function (afile,req,res,ret){
    let proxy_url=reqUrl.urlFile;
    /*设置请求后台请求头*/
    console.log(req.headers);
    var Accept=req.headers["accept"];
    var ContentType=req.headers["content-type"];
    var connection=req.headers["connection"];
    var AcceptEncoding=req.headers["accept-encoding"];
    var ContentLength=req.headers["content-length"];
    var headers={"Content-Length":ContentLength,"Accept-Encoding":AcceptEncoding,"connection":connection,"Accept":Accept,"content-type":ContentType,"nonce":ret.nonceStr,"timestamp":ret.timestamp,"verificateCode":ret.signature};
    var Lboundary='--'+ContentType.replace('multipart/form-data; boundary=','');
    var Lpayload=Lboundary+ '\r\n'+'Content-Disposition: form-data; name="'+afile.file.fieldName+'"; filename="'+afile.file.name+'"'+'\r\n'+'Content-Type: '+afile.file.type+''+'\r\n\r\n\r\n'+Lboundary+'--';
    var options = {
        headers: headers,
        url: proxy_url+req.url,
        body: Lpayload
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