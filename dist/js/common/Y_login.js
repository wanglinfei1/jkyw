var pth='';
$(function(){
    setTimeout(function(){
        $('input').not('.btn,#imgcodekey').val('');
    },0);
    $('label.error').hide();
    $('.Y_login-warp').css('height',$(window).height());
    $('.login-nav a').on('click',function(){
        $('.ts').html('');
        $('label.error').hide();
        $('.loginUpBox input').not('.btn,#imgcodekey').val('');
        $('.loginUpBox .check').removeClass('cho');
        $('.login-nav a').removeClass('active');
        $(this).addClass('active');
        $('.past').html('');
        var val=$('.login-nav a.active').html();
        if(val==="医生"){
            $('.login_2').click(function(){
                window.location.href='../html/Y_yzmLogin.html?userType=doc';
            })
            $('.go_bot').hide()
        }else{
            $('.login_2').click(function(){
                window.location.href='../html/Y_yzmLogin.html';
            })
            $('.go_bot').show();
        }
    });
    var userType=getRequestParam('userType');
    if(userType=='doc'){
        $('.login-nav a').removeClass('active');
        $('.doc').addClass('active');
        $('.go_bot').hide();
    }
    $('.autoLogin .check').on('click',function(){
        $(this).toggleClass('cho');
    });
    var val=$('.login-nav a.active').html();
    if(val==="医生"){
        $('.login_2').click(function(){
            window.location.href='../html/Y_yzmLogin.html?userType=doc';
        })
        $('.go_bot').hide()
    }else{
        $('.login_2').click(function(){
            window.location.href='../html/Y_yzmLogin.html';
        })
        $('.go_bot').show();
    }
        /*失去焦点时验证*/
        $("input").blur(function(){
            if (!$(this).valid()){
                $('.ts').html('');
                return;
            }
        })
    $('#phone').blur(function(){
        if (!$(this).valid()){
            $('.ts').html('');
            return;
        }
        if($('.login-nav a.active').html()=='患者'){
            $.ajax({
                url:servUrl,
                data:{
                    'pathL':'/member/checkExistsMobile',
                    'mobile':$("#phone").val()
                },
                type : 'GET',
                dataType : "json",
                success:function(res){
                    if(res.state==0){
                        if(!res.data.exist){
                            $('.ts').html("您还未注册，请注册");
                            /*parent.layer.msg('您还未注册，请注册', {icon: 1});*/
                        }
                    }else{
                        /*parent.layer.msg(res.msg, {icon: 1});*/
                    }
                }
            });
        }
    })

    /*点击提交按钮*/
    $('#Y_btn-save').click(function () {
        if (!$("#Y_loginForm").valid()){
            $('.ts').html('');
            return;
        }
        var val=$('.login-nav a.active').html();
        if(val==="医生"){
            pth='/pcLogin/doctorLogin';
            Y_dlsublit(pth,1)
        }else{
            pth='/pcLogin/memberLogin';
            Y_dlsublit(pth)
        }
    });

});

/*登陆的提交*/
function Y_dlsublit(dlpth,docType){
    $.ajax({
        url:Y_servUrl,
        data:{
            'pathL':dlpth,
            'mobile':$("#phone").val(),
            'password':$('#password').val(),
            'imgCode':$('#imgCode').val(),
            'imgCodeKey':$('#imgcodekey').val(),
            'loginType':2
        },
        type : 'post',
        dataType : "json",
        success:function(res){
            if(res.state==0){
                if($('.login-nav a.active').html()=='医生'){
                    setCookie('Doc_id',res.data.id);
                    setCookie('DocToken',res.data.accessToken);
                    setCookie('DocfreshToken',res.data.refreshToken);
                    window.location.href='../html/Doc_WpatientManage.html';
                }else{
                    setCookie('cookaccessToken',res.data.accessToken);
                    setCookie('cookrefreshToken',res.data.refreshToken);
                    window.location.href='../html/index.html';
                }
            }else{
                sendCode();
                /*parent.layer.msg(res.msg,{icon: 1});*/
                if(docType==1&&res.state==2008){
                    $('.ts').html('您还未注册，请联系010-62975580进行注册。');
                }else if(docType==1&&res.state==2024) {
                    $('.ts').html('您的账号已禁用，请联系010-62975580。');
                }else{
                    $('.ts').html(res.msg);
                }

            }
        },
        error:function(res){
            /*console.log(res)*/
        }
    });
}
//请求图片验证码
var time='';
function sendCode(){
    time=new Date().getTime();
    $('#imgcodekey').val(time);
    $('.code .span').html('');
    $('<img src="'+servpath+"/imgVerifyCode/"+time+'"/>').appendTo('.code .span')
}
sendCode();
$('.code .span').on('click',function(){
    $(this).html('');
    sendCode();
});