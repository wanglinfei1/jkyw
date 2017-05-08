/**
 * Created by wanglinfei on 2017/4/6.
 */
/**
 * data {path:接口路径,type:post||get默认post,serverName:接口服务器名,option……}
 * success 成功回调
 * error  失败回调
 */
jQuery.support.cors = true;
var servpath = '/data';
var servpath = 'http://192.168.201.244:10001';
/*带base的接口路径*/
var servUrl = servpath + '/my';
/*不带base的接口路径*/
var Y_servUrl = servpath + '/myLogin';
var Ajax = function (data, success, error) {
    $.ajax({
        url: servUrl,
        data: data,
        type: 'post',
        cache: false,
        dataType: "json",
        timeout: 30000,
        beforeSend: function () {
        },
        success: function (res) {
            success && success(res);
        },
        error: function (res) {
            error && error(res);
        }
    });
};
/* 获取URL参数列表 */
var getRequestParams = function () {
    var url = String(window.location);
    if (url.indexOf('?') > 0) {
        return url.substring(url.indexOf("?") - 0 + 1);
    }
    return "";
};
/* 获取地址栏Url参数值， */
var getRequestParam = function (key) {
    var params = getParams();
    if (params && params != null) {
        var args = params.split("&");
        for (var i = 0; i < args.length; i++) {
            var param = args[i].split("=");
            if (param[0] == key) {
                return param[1];
            }
        }
        return "";
    }
};

/* 获取标签Url参数值， */
var getTitleParam = function (key,url) {
    if (url.indexOf('?') > 0) {
        url = url.substring(url.indexOf("?") - 0 + 1);
    }
    var params = url;
    if (params && params != null) {
        var args = params.split("&");
        for (var i = 0; i < args.length; i++) {
            var param = args[i].split("=");
            if (param[0] == key) {
                return param[1];
            }
        }
        return "";
    }
};
function getParams() {
    var url = String(window.location);
    if (url.indexOf('?') > 0) {
        return url.substring(url.indexOf("?") - 0 + 1);
    }
    return "";
}
/*获取地址栏的参数*/
function GetQueryString(name) {
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*但会参数值*/
    if (r != null)return unescape(r[2]);
    return null;
}
/*手机号格式化*/
function phoneFormat(num) {
    if(num){
        num = num.split('');
        num.splice(3, 4, '****');
        num = num.join('');
        return num;
    }
}
/*身份证号格式化*/
function IdCardFormat(num) {
    if(num){
        num = num.split('');
        num.splice(4, 10, '****');
        num = num.join('');
        return num;
    }
}
/*
 * 格式化时间格式，，以分钟为单位的时间 param format yyyy-MM-dd hh:mm:ss
 * YYYY年MM月dd日hh小时mm分ss秒 yyyy年MM月dd日 MM/dd/yyyy yyyyMMdd yyyy-MM-dd hh:mm:ss
 * yyyy.MM.dd hh:mm
 *
 */
Array.prototype.myForEach = function myForEach(callBack, context) {
    typeof context === "undefined" ? context = window : null;

    if ("forEach" in Array.prototype) {
        this.forEach(callBack, context);
        return;
    }

    //->不兼容处理
    for (var i = 0; i < this.length; i++) {
        typeof callBack === "function" ? callBack.call(context, this[i], i, this) : null;
    }
};
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
/*判断移动端兼容样式*/
function isMobile(){
    var u = navigator.userAgent.toLowerCase();
    return !!u.match(/applewebkit.*mobile.*/);
}
if(isMobile()){
    $('.Y_login-warp').css('background','url(../images/login-bg-s.png) repeat-x #fff')
}
/*首页资讯和百科标题*/
function hotNews(data, url, box, index) {
    $.ajax({
        url: servUrl,
        data: data,
        async: false,
        beforeSend: function () {
            if (index != undefined) {
                $(box).eq(index).html('<img class="loading" src="../images/loading.gif" />')
            } else {
                $(box).html('<img class="loading" src="../images/loading.gif" />')
            }
        },
        type: 'get',
        dataType: "json",
        success: function (res) {
            if (res.state == 0) {
                var data = res.data.result;
                if (box == '.JboxDoc') {
                    if (res.data.total < 4) {
                        $('.JcontBoxDoc h2 a').css('display', 'none');
                    //    console.log(data.length)
                    } else {
                        $('.JcontBoxDoc h2 a').css('display', 'block');
                    }
                }
                for (i in data) {
                    if (data[i].updateTime) {
                        data[i].updateTime = new Date(data[i].updateTime).format('yyyy.MM.dd');
                    }
                }
            //    console.log(res);
                var topHtml = new EJS({url: url}).render({data: res.data.result});
                if (index != undefined) {
                    $(box).eq(index).html(topHtml);
                } else {
                    $(box).html(topHtml);
                }
                $(box).attr('total', res.data.total)
            }
        },
        error: function (res) {
        //    console.log(res)
        }
    });
}
/*$(function(){
 /!*设置选中的Nav导航*!/
 var iTitle=window.location.href.split('/')[window.location.href.split('/').length-1].split('.')[0];
 if(iTitle=='index' || iTitle==''){
 $('.JNav li[iTitle="'+iTitle+'"]').addClass('active').siblings().removeClass('active');
 }else{
 $('.JNav li[iTitle="Encyclopedia_GXY"]').addClass('active').siblings().removeClass('active');
 }
 //$('.JNav li[iTitle="'+iTitle+'"]').addClass('active').siblings().removeClass('active');
 })*/
/*刷新token*/
function resToken(refr,doc) {
    $.ajax({
        url: servUrl,
        data: {
            'pathL': '/refreshToken',
            'refreshToken': refr
        },
        type: 'post',
        dataType: "json",
        success: function (res) {
            if (res.state == 0) {
                if(doc==1){
                    setCookie('cookaccessToken', res.data.token);
                    setCookie('cookrefreshToken', res.data.refreshToken);
                }else{
                    setCookie('Doc_id',res.data.id);
                    setCookie('DocToken',res.data.accessToken);
                    setCookie('DocfreshToken',res.data.refreshToken);
                }
                window.location = window.location.href;
            }
        }
    });
}
/*判断是否登陆wlf*/
$(function () {
    userlogin(iToken);
});
function userlogin(){
    if (iToken&&iToken!='undefined'&&iToken!='null') {
        $.ajax({
            url: servUrl,
            data: {
                'pathL': '/member/getUserInfo',
                'token': iToken
            },
            type: 'post',
            dataType: "json",
            success: function (res) {
            //    console.log(res);
                if (res.state == 0) {
                    var topHtml = new EJS({url: '../compileEjs/headTop.ejs'}).render({data: res.data});
                    $('.JtopWap').html(topHtml);
                } else if (res.state == 1003) {
                    var refreshToken = getCookieValue("cookrefreshToken");
                    resToken(refreshToken,1)
                }else{
                    var topHtml = new EJS({url: '../compileEjs/headTop.ejs'}).render({data: null});
                    $('.JtopWap').html(topHtml);
                }
            },
            error: function (res) {
            //    console.log(res)
            }
        });
    } else {
        var topHtml = new EJS({url: '../compileEjs/headTop.ejs'}).render({data: null});
        $('.JtopWap').html(topHtml);
    }
    /*退出删除cookie*/
    $('.JtopWap').on('click', '.JsignOut', function () {
        delCookie('cookaccessToken');
        delCookie('cookrefreshToken');
        goIndex();
    });
    $('.JtopWap').on('click', '.Lperson', function () {
        var isLogin = $('.Lperson').attr('isLogin');
    //    console.log(isLogin)
        if (isLogin == 'true') {
            goPersonal();
        } else {
            goLogin();
        }
    });
    /*跳转个人中心*/
    function goPersonal() {
        window.location = "../html/Fpersonal-center.html";
    }
    /*跳转登陆界面*/
    function goLogin() {
        window.location = "../html/Y_Login.html";
    }
    /*跳转首页*/
    function goIndex(){
        window.location = "../html/index.html";
    }
    /*搜索*/
    $('.Jsearch .button').on('click', function () {
        var searchVal = $.trim($('.Jsearch .seaechVal').val());
        if (searchVal) {
            window.location = "../html/SearchEncy.html?searchval=" + encodeURI(searchVal);
        } else {
            var place = $('.Jsearch .seaechVal').attr('placeholder');
            $('.Jsearch .seaechVal').attr('placeholder', '您输入的搜索内容不能为空');
            setTimeout(function () {
                $('.Jsearch .seaechVal').attr('placeholder', place);
            }, 2000)
        }
    });
    $('.Jsearch .seaechVal').on('keyup', function (event) {
        if (event.keyCode == 13) {
            var searchVal = $.trim($('.Jsearch .seaechVal').val());
            if (searchVal) {
                window.location = "../html/SearchEncy.html?searchval=" + encodeURI(searchVal);
            } else {
                var place = $('.Jsearch .seaechVal').attr('placeholder');
                $('.Jsearch .seaechVal').attr('placeholder', '您输入的搜索内容不能为空');
                setTimeout(function () {
                    $('.Jsearch .seaechVal').attr('placeholder', place);
                }, 2000)
            }
        }
    });
}
/*患者端判断未登录返回首页*/
function isLoginGoIndex(token){
    if(!token){
        window.location = "../html/index.html";
    }
}
