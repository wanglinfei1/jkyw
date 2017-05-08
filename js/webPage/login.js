/**
 * Created by wanglinfei on 2016/12/30.
 */
function GetQueryString(name){
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*但会参数值*/
    if(r!=null)return  decodeURI(r[2]); return null;
}
$(function(){
    var typeIndex=GetQueryString("count");
    setTimeout(function(){
        $('.loginUpBox input').not('.btn').val('');
    },0);
    if(typeIndex==0){
        $('.login-nav a').removeClass('active');
        $('.login-nav a').eq(0).addClass('active');
    }else if(typeIndex==1){
        $('.login-nav a').removeClass('active');
        $('.login-nav a').eq(1).addClass('active');
    }
    $('.login-nav a').on('click',function(){
        $('.loginUpBox input').not('.btn').val('');
        $('.loginUpBox .check').removeClass('cho');
        $('.login-nav a').removeClass('active');
        $(this).addClass('active');
        $('.doc-form').css('display','none');
        $('.past').html('');
        sendCode();
    });
    $('.login-nav .user').on('click',function(){
        $('.doc-form').css('display','none');
        $('.user-form').css('display','block');
        $('.go').css('display','block');
    });
    $('.login-nav .doc').on('click',function(){
        $('.doc-form').css('display','block');
        $('.user-form').css('display','none');
        $('.go').css('display','none');
    });
    $('.agree .check').on('click',function(){
        $(this).toggleClass('cho');
    });
    $('.autoLogin .check').on('click',function(){
        $(this).toggleClass('cho');
    });
    $('#phone1').on('input',function(){
        if($(this).val().length==11){
            $('.code span').addClass('pCode');
        }else{
            $('.code span').removeClass('pCode');
        }
    });

});

//请求图片验证码
var time='';
function sendCode(){
    time=new Date().getTime();
    $('.code .span').html('');
    $('<img src="'+"/my/imgVerifyCode/"+time+'"/>').appendTo('.code .span')
}
sendCode();
$('.code .span').on('click',function(){
    $(this).html('');
    sendCode();
});
//点击取消自动登陆按钮删除 localStorage
var use=$('.login-nav .user').hasClass('active');
$('.autoLogin .check').on('click',function(){
    var cho=$('.autoLogin .check').hasClass('cho');
    var $phone = $("#phone").val();
    var $password = $("#password").val();
    var loginInfor={
        "moblie":$phone,
    };
    if(cho){
        localStorage.removeItem('autoLogin');
    }else{
        localStorage.setItem("autoLogin",JSON.stringify(loginInfor));
    }
});
var loginIN=JSON.parse(localStorage.getItem("autoLogin"));
if(loginIN){
    $("#phone").val(loginIN.moblie);
    $("#password").val(loginIN.password);
}
//登陆ajax数据提交
$("#submit").on('click',function(){
    var use=$('.login-nav .user').hasClass('active');
    var $phone = $("#phone").val();
    var $password = $("#password").val();
    var $code=$('#code').val();
    var loginInfor={
        "moblie":$phone,
        "password":$password,
        "imgcode":$code,
        "imgcodekey":time
    };
    var tab=false;
    var cho=$('.autoLogin .check').hasClass('cho');
    $('form h4 input').on('keydown',function(){
        $(this).removeClass('red');
        tab=false;
    });
    if(!$password){
        $('#password').addClass('red');
        $('.past').html('');
        tab=true;
    }
//            if(!$code){
//                $('#code').addClass('red');
//                tab=true;
//            }
    if (/^(1[3|5|8|7]{1}\d{9})$/.test($phone)){
        if(tab){return;}
        if(use){
            //用户登陆
            $.ajax({
                type:"post",
                url:"/my/account/patientLogin",
                data:loginInfor,
                success:function(data){
                    /*console.log(data)*/;
                    if(data.data==null||''){
                        $('.past').html('登陆失败');
                    }
                    if(data.msg=='success'){
                        localStorage.setItem("loginData",JSON.stringify(data.data));
                        localStorage.setItem("loginPhone",$phone);
                        localStorage.setItem('userType',0);
                        var perfect=isInfor(data.data.accessToken);
                        var url=localStorage.getItem("url");
                        if(url){
                            window.location.href=url;
                        }else{
                            window.location="/index.html";
                        }
                    }else{
                        $('.past').html(data.msg);
                        sendCode();
                    }
                },
                error:function(){

                }
            });
        }else{
            //医生登陆
            $.ajax({
                type:"post",
                url:"/my/account/doctorLogin",
                data:loginInfor,
                success:function(data){
                    /*console.log(data)*/;
                    if(data.data==null){
                        $('.past').html(data.msg);
                        sendCode();
                    }else if(data.msg=='success'){
                        localStorage.setItem("docLoginData",JSON.stringify(data.data));
                        localStorage.setItem("docLoginPhone",$phone);
                        localStorage.setItem('docUserType',1);
                        var docUrl=localStorage.getItem("docUrl");
                        if(docUrl){
                            window.location.href=docUrl;
                        }else{
                            window.location="../personalCenter/docCenter.html";
                        }
                    }else if(data.msg=='数据绑定错误'){
                        $('.past').html(data.data.imgcode);
                        sendCode();
                    }
                },
                error:function(){

                }
            });
        }
    }else{
        $("#phone").addClass('red');
        $('.past').html('');
    }
});
function isInfor(token){
    $.ajax({
        type: "post",
        url: "/my/patient/isPatientInfo",
        data: {
            "token": token
        },
        success: function (data) {
            if(data.msg=='token已过期'){
                return;
            }
            if (data.msg == '患者信息不完善') {
                return true;
            }
        },
        error: function (data) {
            /*console.log(data)*/;
        }
    });
}