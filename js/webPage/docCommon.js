/**
 * Created by wanglinfei on 2017/1/23.
 */
function newToke() {
    $.ajax({
        type: "post",
        url: "/my/refreshToken",
        data: {
            "refreshToken": docLoginData.refreshToken
        },
        success: function (data) {
            var newData=data.data;
            if(newData){
                /*console.log(newData)*/
                newData.accessToken=data.data.token;
                localStorage.setItem("docLoginData",JSON.stringify(newData));
                window.location="/index.html";
            }else{
                localStorage.removeItem("docLoginData");
                localStorage.removeItem("docLoginPhone");
                localStorage.removeItem("docInfor");
                localStorage.removeItem("docUrl");
                localStorage.removeItem("docUserType");
            }

        },
        error:function(data){
            /*console.log(data)*/
        }
    });
}
//头部显示登陆者信息
var docLoginData=JSON.parse(localStorage.getItem("docLoginData"));
var userType=JSON.parse(localStorage.getItem("docUserType"));
var DOCInfor;
//医生用户登陆
if(docLoginData&&userType==1){
    $.ajax({
        type: "post",
        url: "/my/account/info",
        data: {
            "token": docLoginData.accessToken
        },
        success: function (data) {
            /*console.log(data)*/;
            if (data.msg == 'token已过期') {
                newToke();
                //
            }
            if(data.data) {
                DOCInfor=data.data.account;
                DOCInfor.headImg=data.data.headImg;
                var name=DOCInfor.contactName||DOCInfor.accountNo;
                $('.topWapper .top p i').html(name+' 医生');
                $('.Jlogin').html('我是患者')
                $('.top .topR h5').html('退出');
                $('.personalCenter-in .name').html(DOCInfor.name);
                $('.personalCenter-in .phone').html(DOCInfor.mobile);
                $('.top .topR h5').on('click',function(){
                    localStorage.removeItem("docLoginData");
                    localStorage.removeItem("docLoginPhone");
                    localStorage.removeItem("docUrl");
                    localStorage.removeItem("docUserType");
                    window.location="/index.html";
                    localStorage.removeItem("docInfor");
                });
                localStorage.setItem("docInfor",JSON.stringify(DOCInfor));
                $('.JdocCenter .name').text(DOCInfor.contactName);
                $('.JdocCenter .phone').text(DOCInfor.accountNo);
                if(DOCInfor.headImg){
                    $('.JdocCenter .imgBox img').attr('src',DOCInfor.headImg);
                }
            }
        },
        error:function(data){

        }
    });
}
$('.wapper .topR h5 a').on('click',function(){
    if($(this).parent().hasClass('doc')){
        localStorage.setItem("docUrl",window.location.href);
    }else{
        localStorage.setItem("url",window.location.href);
    }
});
$('.Jlogin').on('click',function(){
    if($(this).html()=='我是患者'){
        window.location="../../dist/webPage/login.html";
        localStorage.removeItem("docUrl");
        localStorage.removeItem("docUserType");
        localStorage.removeItem("docLoginData");
        localStorage.removeItem("docLoginPhone");
        localStorage.removeItem("docInfor");
    }else if($(this).html()=='我是医生'){
        window.location="../../dist/webPage/login.html";
        localStorage.removeItem("url");
        localStorage.removeItem("userType");
    }
});
//进入个人中心
$('.topWapper .topr2').on('click',function(event){
    var docLoginData=JSON.parse(localStorage.getItem("docLoginData"));
    if(docLoginData){
        window.location="../../dist/personalCenter/docCenter.html";
    }else{
        window.location="../../dist/webPage/login.html";
    }
});