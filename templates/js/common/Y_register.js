
$(function(){
    setTimeout(function(){
        $('input').not('.btn,#imgcodekey').val('');
    },0);
    $('label.error').hide();
    $('.Y_login-warp').css('height',$(window).height());
    $('.login-nav a').on('click',function(){
        $('label.error').hide();
        $('.loginUpBox input').not('.btn').val('');
        $('.loginUpBox .check').removeClass('cho');
        $('.login-nav a').removeClass('active');
        $(this).addClass('active');
        $('.past').html('');
    });

    $('.agree .check').on('click',function(){
        $(this).toggleClass('cho');
    });
    /*失去焦点时验证*/
    $("input").blur(function(){
        if (!$(this).valid()){
            $('.ts').html('');
            return;
        }
    })
    $('#phone1').on('blur',function(){
        if (!$(this).valid()){
            $('.ts').html('');
            return;
        }
        $('.code span').addClass('pCode');
    })
    /*点击提交按钮*/
    $('#registered').click(function () {
        if (!$("#Y_registeredForm").valid()){
            $('.ts').html('');
            return;
        }
        if(!$('.agree .check').hasClass('cho')){
            $('.ts').html('请点击同意用户协议');
            return;
        }
        $.ajax({
            url:servUrl,
            data:{
                'pathL':'/member/register',
                'mobile':$("#phone1").val(),
                'smsCode':$('#code1').val(),
                'password':$('#password1').val()
            },
            type : 'post',
            dataType : "json",
            success:function(res){
                if(res.state==0){
                    /*登录首页*/
                //    console.log(res);
                    setCookie('cookaccessToken',res.data.accessToken);
                    setCookie('cookrefreshToken',res.data.refreshToken);
                    window.location.href='../html/index.html';
                }else if(res.state==2015){
                    $('.ts').html("该手机号已注册");
                    // parent.layer.msg(res.msg,{icon: 1});
                }else{
                    $('.ts').html(res.msg);
                }
            },
            error:function(res){
            }
        });

    });

});

//发送验证码
$('#sendCode').on('click',Jsend);
function changeSed(a){
    $('#sendCode').off('click');
    $('#sendCode').html(a + 's后重新发送');
    $('#sendCode').attr('disabled',true);
    $('#sendCode').removeClass('pCode');
}
function Jsend(){
    if (!$('#phone1').valid()){
        $('.ts').html('');
        return;
    }
    var mobile=$('#phone1').val();
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

