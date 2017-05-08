/*患者端判断未登录返回首页*/
isLoginGoIndex(iToken);

var Jidcard,isubData;
/*编辑返显*/
$.ajax({
    url:servUrl,
    data: {
        'pathL': '/member/getUserInfo',
        'token': iToken
    },
    type: 'post',
    cache: false,
    dataType: "json",
    success: function (res) {
        var data = res.data;
    //    console.log(data);
        if (!data.headimg) {
            $('.img').prop("src", "../images/head-photo.png");
        } else {
            $('.img').prop("src", data.headimg);
        }
        $('#username').val(data.name);
        $('#dsdphone').val(data.mobile);

        if (data.sex == 1) {
            $('.Y_sex i').removeClass('checked');
            $('.sex1 i').addClass('checked');
            //$('.Jsex[value="1"]').attr("checked", "checked");
            $('#JSelsex').val(data.sex);
        } else if(data.sex == 2){
            $('.Y_sex i').removeClass('checked');
            $('.sex2 i').addClass('checked');
           // $('.Jsex[value="2"]').attr("checked", "checked");
            $('#JSelsex').val(data.sex);
        }else{
            $('.Y_sex i').removeClass('checked');
            $('#JSelsex').val('');
        }
        data.idCard==null || data.idCard==''?data.idCard='':data.idCard=data.idCard;
        data.address==null?data.address='':data.address=data.address;
        $('#ID').val(IdCardFormat(data.idCard));
        Jidcard=IdCardFormat(data.idCard);
        if(data.birthday!=null && data.birthday!=''){
            var days=new Date(data.birthday).format("yyyy-MM-dd");
            $('#day').val(days);
        }
        $('#address').val(data.address);
    }
});
/*$('.Jsex').click(function(){
    $('.Jerror').text('');
    $('#JSelsex').val($(this).val());
    $('#JSelsex-error').hide();
})*/
var identityTab=true;
$('.identity').on('input',function(){
    $('.IDError').html('');
});
$('.identity').change(function(){
    $('.identity').attr('data-rule-Idcard',true);
    if($('.identity').val()){
        identityTab=checkidno($('.identity').val());
    }
});
$('.Y_sex label').click(function(){
    $('.Jerror').text('');
    $('.Y_sex i').removeClass('checked');
    $(this).find('i').addClass('checked');
    var sexval=$(this).find('input').val();
    $('#JSelsex').val(sexval);
    $('#JSelsex-error').hide();
});

/*点击提交按钮*/
    $('#cun').click(function () {
        if(!$(".F_form").valid())return;
        if($('#JSelsex').val()==''){
            $('.Jerror').text('不能为空');
            return
        }else{
            $('.Jerror').text('');
        }
        if($('.identity').val()){
            /*if($('.identity').val()==''){
             $('.identity').attr('data-rule-Idcard',true)
             }*/
            if(!identityTab){
                $('.IDError').html('请输入正确的身份证号');
                return;
            }
        }
        isubData={
            'pathL': '/member/edit',
            'token': iToken,
            'name': $('#username').val(),
            'sex': $('#JSelsex').val(),
            'birthDate':$('#day').val(),
            'address': $('#address').val()
        };
        if($('#ID').val()!=''){
            if($('#ID').val()!=Jidcard){
                isubData.idCard=$('#ID').val();
            }
        }else {
            isubData.idCard='';
        }
        getSubmit();
        return false;
    });

    function getSubmit() {
        $.ajax({
            url: servUrl,
            data:isubData,
            type: 'post',
            dataType: "json",
            success: function (res) {
                if (res.state == 0) {
                   window.location.href = "../html/Fpersonal-center.html"
                }
            },
            error: function (res) {
            }
        });
        return false;
    }














