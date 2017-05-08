/**
 * Created by wanglinfei on 2017/4/13.
 */
/*请求后台函数并往浏览器发送数据*/
const reqUrl=require('./reqUrl.js');
const request = require('request');
var requ=function (URLQuery,type,req,res,ret,reqUrlL){
    var classify = encodeURI(URLQuery.classify||'custom');
    if(classify=='custom'&&URLQuery.pathL){
        let selfSearch='';
        let proxy_url=URLQuery.serverName||reqUrlL;
        let reqUrlPath = proxy_url+URLQuery.pathL;
        URLQuery.appid=reqUrl.appid;
        for(var key in URLQuery){
            if(key!='classify'&&key!='serverName'&&key!='pathL'&&key!='typeL'&&key!='token'){
                selfSearch+='&'+key+'='+ encodeURI(URLQuery[key]);
            }
        }
        /*设置请求后台请求头*/
        var Accept=req.headers["accept"];
        var ContentType=req.headers["content-type"];
        var headers={"Accept":Accept,"content-type":ContentType,"nonce":ret.nonceStr,"timestamp":ret.timestamp,"verificateCode":ret.signature};
        if(URLQuery.token){
            headers.token=URLQuery.token;
        }
        var options = {
            headers: headers,
            url: reqUrlPath+'?'+selfSearch.substr(1),
            method: type,
            json: true
        };
        /*请求后台*/
        request(options, callback);
        /*console.log(options);*/
        function callback(error, response, data) {
            try {
                handler(error, response, data);
            } catch(e) {
            //    console.log('\r\n', e, '\r\n', e.stack);
                try {
                    res.end(e.stack);
                } catch(e) { }
            }
        }
        function handler(error, response, data){
            if(response){
                var type = response.headers["content-type"];
                res.set({"Content-Type": type});
                if(data){
                //    console.log(data.msg);
                    res.send(data);
                }else{
                    res.send(response);
                }
            }else{
            //    console.log('请求成功');
            }
            if(error){
                res.send(error);
            }
        }
    }else{
        let response={
            state: 404,
            msg: 'error',
            data:'你请求的接口不存在'
        };
        res.write(JSON.stringify(response));
        res.end()
    }
};
module.exports = requ;