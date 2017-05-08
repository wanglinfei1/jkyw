/*随机数字符*/
var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};
/*时间戳s*/
var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};
/*排序连接*/
var raw = function (nonceStr,timestamp,token) {
  var newArr=[nonceStr,timestamp,token];
  string = newArr.sort().join('');
  return string;
};
/*sha加密签名*/
var sign = function (token, appId) {
  var ret = {
    appid: appId,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    token: token
  };
  var string = raw(ret.nonceStr,ret.timestamp,ret.token);
      sha1 = require('sha-1');
  ret.signature  = sha1(string);
  return ret;
};

module.exports = sign;
