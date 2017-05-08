var pth='';
var loginPer='';
var Y_Doc_setpassw=getCookieValue("Doc_setpassw");
$(function(){
    $('input').not('.btn,#imgcodekey').val('');
    $('label.error').hide();
    $('.Y_login-warp').css('height',$(window).height())
    $('.login-nav a').on('click',function(){
        $('label.error').hide();
        $('.loginUpBox input').not('.btn').val('');
        $('.loginUpBox .check').removeClass('cho');
        $('.login-nav a').removeClass('active');
        $(this).addClass('active');
        $('.past').html('');
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
    /*点击提交按钮*/
    $('#submit').click(function () {
        if (!$("#Y_passettingForm").valid()){
            $('.ts').html('');
            return;
        }
       loginPer=decodeURI(getRequestParam('loginPer'));
        if(loginPer==='医生'){
            pth='/doctor/addPassword';
            addpawsubit(pth,dcIiToken)
        }else{
            pth='/member/addPassword';
            addpawsubit(pth,iToken)
        }

    });
    $('.Y_pasSettingTg').click(function(){
        loginPer=decodeURI(getRequestParam('loginPer'));
        if(loginPer==='医生'){
            setCookie('Doc_setpassw',true);
            window.location.href='../html/Doc_WpatientManage.html'
        }else{
            setCookie('user_setpassw',true);
            window.location.href='../html/index.html'
        }
    })
});

function addpawsubit(addpawPth,token){
    $.ajax({
        url:servUrl,
        data:{
            'pathL':addpawPth,
            'token':token,
            'password':$('#password').val(),
            'confirmPassword':$('#passwords').val()
        },
        type : 'post',
        dataType : "json",
        success:function(res){
            if(res.state==0){
                if(loginPer==='医生'){
                    setCookie('Doc_setpassw',false);
                    window.location.href='../html/Doc_WpatientManage.html'
                }else{
                    setCookie('user_setpassw',false);
                    window.location.href='../html/index.html'
                }
            }else{
                /*parent.layer.msg(res.msg, {icon: 1});*/
                $('.ts').html(res.msg);
            }
        },
        error:function(res){
        }
    });
}