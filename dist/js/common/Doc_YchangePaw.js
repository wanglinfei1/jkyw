var Y_Doc_setpassw=getCookieValue("Doc_setpassw");
$(function(){
    if(Y_Doc_setpassw=="true"){
        /*需要设置密码*/
        $('.Y_Oldpaw').hide();
        $('.Y_Newpaw label.control-label').html('设置密码');
    }else{
        /*修改密码*/
        $('.Y_Oldpaw').show();
        $('.Y_Newpaw label.control-label').html('新密码');
    }
        /*点击提交按钮*/
        $('#Y_btn-save').click(function () {
            if (!$(".Ydoc_changpasswForm").valid()){
                $('.ts').html('');
                return;
            }
            if($('#oldpwd').val()==$('#password').val()){
                $('.ts').html('新密码不能和原密码相同');
                return;
            }
            if(Y_Doc_setpassw=="true"){
                /*需要设置密码*/
                var Y_data1={
                    'pathL': '/doctor/password',
                    'token': dcIiToken,
                    'newPassword':$('#password').val(),
                    'confirmPassword': $('#newpass').val()
                };
                Y_changpawsublit(Y_data1)
            }else{
                /*修改密码*/
                var Y_data2={
                    'pathL': '/doctor/password',
                    'token': dcIiToken,
                    'newPassword':$('#password').val(),
                    'confirmPassword': $('#newpass').val(),
                    'oldPassword':$('#oldpwd').val()
                };
                Y_changpawsublit(Y_data2)
            }
        });
})
function Y_changpawsublit(data){
    $.ajax({
        url: servUrl,
        data:data,
        type: 'post',
        dataType: "json",
        success: function (res){
            if (res.state == 0) {
                setCookie('Doc_setpassw',false);
                parent.layer.msg('成功', {icon: 0});
                window.location.href = "../html/Doc_YpersonalCenter.html";
            }else{
                if(res.state==2005){
                    $('.ts').html(res.msg);
                }else{
                    parent.layer.msg(res.msg, {icon: 1});
                }
            }
        },
        error: function (res) {
            parent.layer.msg(res.msg, {icon: 1});
        }
    });
}
