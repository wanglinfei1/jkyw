/**
 * Created by wanglinfei on 2017/2/7.
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

$('#phone1').on('keydown',function(){
    $('#phone1').removeClass('red');
});
//发送验证码
var tab=false;
$('#sendCode').on('click',function(){
    var $mobile=$('#phone1').val();
    if (/^(1[3|5|8|7]{1}\d{9})$/.test($mobile)) {
        if(tab){
            return;
        }
        tab=true;
        var a = 61;
        var timer = setInterval(function () {
            if (a > 0) {
                a--;
                $('#sendCode').html(a + 's后重新发送');
            } else {
                clearInterval(timer);
                $('#sendCode').html('发送验证码');
                tab=false;
            }
        }, 1000);
        $.ajax({
            type: "post",
            url: "/my/smsVerifyCode",
            data: {
                "mobile":$mobile
            },
            success: function (data) {
                /*console.log(data)*/
            }
        });
    } else{
        $('#phone1').addClass('red');
    }
});
//用户注册
$('#registered').on('click',function(){
    var $mobile=$('#phone1').val();
    var $code=$('#code1').val();
    var $pass=$('#password1').val();
    var checked=$('.agree .check').hasClass('cho');
    if (/^(1[3|5|8|7]{1}\d{9})$/.test($mobile)) {
        if(checked){
            $.ajax({
                type: "post",
                url: "/my/patient/registerPatient",
                data: {
                    phone:$mobile,
                    verifyCode:$code,
                    password:$pass
                },
                success: function (data) {
                    /*console.log(data)*/;
                    if(data.msg=='success'){
                        $('.past').html('注册成功,请去往登陆页');
                        $('.past').addClass('black');
                        setTimeout(function(){
                            window.location = "login.html";
                            $('.past').removeClass('black');
                        },2000);
                    }else{
                        $('.past').html(data.msg);
                    }
                },
                error:function(data){
                    $('.past').html(data.msg);
                }
            });
        }else{
            $('.past').html('请阅读用户协议');
        }
    }else{
        $('#phone1').addClass('red');
    }

});
//请求图片验证码
var time='';
$('.doc').on('click',function(){
    sendCode();
});
function sendCode(){
    time=new Date().getTime();
    $('.code .span1').html('');
    $('<img src="'+"/my/imgVerifyCode/"+time+'"/>').appendTo('.code .span1')
}
$('.code .span1').on('click',function(){
    sendCode();
});
//医生登陆ajax数据提交
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
                }
            });
        }
    }else{
        $("#phone").addClass('red');
    }
});

jQuery(function(){
    JPlaceHolder.init(0,8);
});