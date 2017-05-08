var Pth='';
$(function(){
    $('input').not('.btn,#imgcodekey').val('');
    $('label.error').hide();
    $('.Y_login-warp').css('height',$(window).height())
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
                window.location.href='../html/Y_Login.html?userType=doc';
            })
            $('.ts').html('');
            $('.go_bot').hide()
        }else{
            $('.login_2').click(function(){
                window.location.href='../html/Y_Login.html';
            })
            $('.go_bot').show();
        }
    });

    $('.autoLogin .check').on('click',function(){
        $(this).toggleClass('cho');
    });
    /*失去焦点时验证*/
    $("input").blur(function(){
        if (!$(this).valid()){
            $('.ts').html('');
            return;
        }
    })
    var userType=getRequestParam('userType');
    if(userType=='doc'){
        $('.login-nav a').removeClass('active');
        $('.doc').addClass('active');
        $('.go_bot').hide();
        $('.login_2').click(function(){
            window.location.href='../html/Y_Login.html?userType=doc';
        })
    }else{
        $('.login_2').click(function(){
            window.location.href='../html/Y_Login.html';
        })
    }
    $('#Y_btn-save').click(function () {
        var val=$('.login-nav a.active').html();
        if (!$("#Y_loginupForm").valid()){
            $('.ts').html('');
            return;
        }
        if(val==="医生"){
            Pth='/pcLogin/doctorLogin';
            docsubit(Pth,1)
        }else{
            Pth='/pcLogin/memberLogin';
            docsubit(Pth)
        }
    });
    $('#phone').on('blur',function(){
        if (!$(this).valid()){
            $('.ts').html('');
            return;
        }
        $('.code span').addClass('pCode');
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
                //    console.log(res);
                    if(res.state==0){
                        if(!res.data.exist){
                            /*parent.layer.msg('您还未注册，请注册', {icon: 1});*/
                            $('.ts').html("您还未注册，请注册");
                        }
                    }else{
                        /*parent.layer.msg(res.msg, {icon: 1});*/
                    }
                }
            });
        }
    });
});
function docsubit(docpth,docType){
    $.ajax({
        url:Y_servUrl,
        data:{
            'pathL':docpth,
            'mobile':$("#phone").val(),
            'smsCode':$('#smsCode').val(),
            'loginType':1
        },
        type : 'post',
        dataType : "json",
        success:function(res){
        //    console.log(res);
            if(res.state==0){
                if($('.login-nav a.active').html()=='医生'){
                    setCookie('Doc_id',res.data.id);
                    setCookie('DocToken',res.data.accessToken);
                    setCookie('DocfreshToken',res.data.refreshToken);
                }else{
                    setCookie('cookaccessToken',res.data.accessToken);
                    setCookie('cookrefreshToken',res.data.refreshToken);
                }
                if(res.data.needSetPassword){
                    window.location.href='../html/Y_PasSetting.html?loginPer='+encodeURI($('.login-nav a.active').html());
                }else{
                    if($('.login-nav a.active').html()=='医生'){
                        window.location.href='../html/Doc_WpatientManage.html';
                    }else{
                        window.location.href='../html/index.html';
                    }
                }
            }else{
                $('.ts').html(res.msg);
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
        }
  });
}
//发送验证码
$('#sendCode').on('click',Jsend);
function changeSed(a){
    $('#sendCode').off('click');
    $('#sendCode').html(a + 's后重新发送');
    $('#sendCode').attr('disabled',true);
    $('#sendCode').removeClass('pCode');
}
function Jsend(){
    if (!$('#phone').valid()){
        $('.ts').html('');
        return;
    }
    var mobile=$('#phone').val();
    var a = 60;
    changeSed(a);
    var timer = setInterval(function () {
        if (a > 0) {
            a--;
            changeSed(a);
        } else {
            clearInterval(timer);
            $('#sendCode').on('click',Jsend);
            $('#sendCode').html('发送验证码');
            $('#sendCode').attr('disabled',false);
            $('#sendCode').addClass('pCode');
        }
    }, 1000);
    $.ajax({
        url:servUrl,
        data:{
            'pathL':'/getSmsVerifyCode',
            "mobile":mobile
        },
        type : 'post',
        dataType : "json",
        success:function(res){
            /*console.log(res)*/
        }
    });
}