/*患者端判断未登录返回首页*/
isLoginGoIndex(iToken);
var user_setpassw=getCookieValue("user_setpassw");
if(user_setpassw=='true'){
    /*需要设置密码*/
    $('#loginForm .first').hide();
    $('#loginForm .Second div').html('设置密码');
}else{
    /*修改密码*/
    $('#loginForm .first').show();
    $('#loginForm .Second div').html('新密码');
}
$('#submit').click(function () {
    var reg = /^[a-z0-9]{6,16}$/;
    if(user_setpassw=='true'){
        addPass(reg)
    }else{
        modifyPassword(reg)
    }
    return false;
});
function modifyPassword(reg){
    if($('#oldpwd').val()==""){
        $('#oldpwd').next('.Jerror').text('不能为空')
        return;
    }else{
        if(!(reg.test($('#oldpwd').val()))){
            $('#oldpwd').next('.Jerror').text('请输入6-15位数字或英文字符')
            return;
        }else{
            $('#oldpwd').next('.Jerror').text('')
        }
    }
    if($('#password').val()==""){
        $('#password').next('.Jerror').text('不能为空')
        return;
    }else{
        if(!(reg.test($('#password').val()))){
            $('#password').next('.Jerror').text('请输入6-15位数字或英文字符')
            return;
        }else{
            $('#password').next('.Jerror').text('')
        }
    }
    if($('#newpass').val()==""){
        $('#newpass').next('.Jerror').text('不能为空')
        return;
    }else{
        if(!(reg.test($('#newpass').val()))){
            $('#newpass').next('.Jerror').text('请输入6-15位数字或英文字符')
            return;
        }else{
            $('#newpass').next('.Jerror').text('')
        }
    }
    if($('#oldpwd').val()==$('#password').val()){
        $('#password').next('.Jerror').text('新密码和旧密码不能一致')
        return;
    }else{
        $('#password').next('.Jerror').text('')
    }
    if($('#password').val()!=$('#newpass').val()){
        $('#newpass').next('.Jerror').text('两次新密码输入不一致')
        return;
    }else{
        $('#newpass').next('.Jerror').text('')
    }

    $.ajax({
        url: servUrl,
        data: {
            'pathL': '/member/modifyPassword',
            'token':iToken,
            'password': $('#oldpwd').val(),
            'newPassword': $('#password').val()
        },
        type: 'post',
        dataType: "json",
        success: function (res) {
            //    console.log(res)
            if(res.state==0){
                window.location.href="../html/Fpersonal-center.html"
            }else if(res.state==2016){
                $('#newpass').next('.Jerror').text('原密码错误')
            }
        }
    })
}
function addPass(reg){
    if($('#password').val()==""){
        $('#password').next('.Jerror').text('不能为空')
        return;
    }else{
        if(!(reg.test($('#password').val()))){
            $('#password').next('.Jerror').text('请输入6-15位数字或英文字符')
            return;
        }else{
            $('#password').next('.Jerror').text('')
        }
    }
    if($('#newpass').val()==""){
        $('#newpass').next('.Jerror').text('不能为空')
        return;
    }else{
        if(!(reg.test($('#newpass').val()))){
            $('#newpass').next('.Jerror').text('请输入6-15位数字或英文字符')
            return;
        }else{
            $('#newpass').next('.Jerror').text('')
        }
    }
    if($('#password').val()!=$('#newpass').val()){
        $('#newpass').next('.Jerror').text('两次新密码输入不一致')
        return;
    }else{
        $('#newpass').next('.Jerror').text('');
    }
    $.ajax({
        url: servUrl,
        data: {
            'pathL': '/member/addPassword',
            'token':iToken,
            'password': $('#password').val(),
            'confirmPassword':$('#newpass').val()
        },
        type: 'post',
        dataType: "json",
        success: function (res) {
            if(res.state==0){
                setCookie('user_setpassw',false);
                window.location.href="../html/Fpersonal-center.html"
            }else if(res.state==2023){
                setCookie('user_setpassw',false);
                $('#newpass').next('.Jerror').text(res.msg);
                setTimeout(function(){
                    window.location.href="../html/Fmodify-password.html";
                },1000);
            }
        }
    })
}