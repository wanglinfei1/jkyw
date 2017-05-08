/**
 * Created by wanglinfei on 2017/4/11.
 */
const reqUrl=require('./reqUrl.js');
const request = require('request');
var imgVerifyCode=function (URLQuery,req,res,ret){
    let proxy_url=reqUrl.urlFile;
    URLQuery.appid=reqUrl.appid;
    var selfSearch;
    for(var key in URLQuery){
        if(key!='classify'&&key!='serverName'&&key!='pathL'&&key!='typeL'&&key!='token'){
            selfSearch+='&'+key+'='+ encodeURI(URLQuery[key]);
        }
    }
    var headers={"nonce":ret.nonceStr,"timestamp":ret.timestamp,"verificateCode":ret.signature};
    if(URLQuery.token){
        headers.token=URLQuery.token;
    }
    var options = {
        headers: headers,
        url: proxy_url+req.url
    };
    /*请求后台*/
    try {
        request.get(options).pipe(res);
    } catch(e) {
    //    console.log('\r\n', e, '\r\n', e.stack);
        try {
            res.end(e.stack);
        } catch(e) { }
    }
};
module.exports = imgVerifyCode;