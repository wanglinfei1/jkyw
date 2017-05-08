var typeIndex;
$(function(){
    typeIndex=GetQueryString("title");
    $('.Y_sex label').click(function(){
        $('.Y_sex i').removeClass('checked');
        $(this).find('i').addClass('checked');
        var sexval=$(this).find('input').val();
        $('#sex').val(sexval)
    })
    /*地址*/
    $('.Y_tex1 textarea').keyup(function(){
        show(this,50);
    })
    /*擅长*/
    $('.Y_tex2 textarea').keyup(function(){
        show(this,100);
    })
    /*简介*/
    $('.Y_tex3 textarea').keyup(function(){
        show(this,300);
    })
    if(typeIndex==2){
        /*点击提交按钮*/
        $('#Y_btn-save').click(function () {
            if (!$(".Ydoc_perCenForm").valid())return;
            $.ajax({
                url: servUrl,
                data: {
                    'pathL': '/doctor/edit',
                    'token': dcIiToken,
                    'terminal':'pc',
                    'sex': $('#sex').val(),
                    'address': $('#address').val(),
                    'skilled': $('#skilled').val(),
                    'academicResearch':$("#academicResearch").val()
                },
                type: 'post',
                dataType: "json",
                success: function (res){
                    if (res.state == 0) {
                        window.location.href = "../html/Doc_YpersonalCenter.html";
                    }
                },
                error: function (res) {
                }
            });
        });
    }

/*医生个人信息的返显*/
    $.ajax({
        url:servUrl,
        data: {
            'pathL': '/doctor/info',
            'token': dcIiToken,
            'terminal':'pc'
        },
        type: 'GET',
        cache:false,
        dataType: "json",
        success: function (res) {
            if (res.state == 0) {
                var data = res.data;
                if (data.headimg == null) {
                    $('.Yimg_upload img').prop("src", "../../images/Doc_Yicon1.png");
                } else {
                    $('.Yimg_upload img').prop("src", data.headimg);
                }
                for(var index in data){
                    var elm = $('.Ydoc_perCenForm').find('.'+ index);
                    //有这个元素则进行赋值，值为空赋值为空
                    data[index]==null?elm.html(''):elm.html(data[index]);
                    if(data.sex==1){
                        $('.sex').html('男')
                    }else if(data.sex==2){
                        $('.sex').html('女')
                    }
                    if (typeIndex == 2) {
                        $('#address').val(data.address);
                        $('#skilled').val(data.skilled);
                        $('#academicResearch').val(data.academicResearch);
                        $('.Y_tex1 span b').html($('.Y_tex1 textarea').val().length);
                        $('.Y_tex2 span b').html($('.Y_tex2 textarea').val().length);
                        $('.Y_tex3 span b').html($('.Y_tex3 textarea').val().length);
                        if (data.sex == 1) {
                            $('.Y_sex i').removeClass('checked');
                            $('.sex1 i').addClass('checked');
                            $('#sex').val(data.sex)
                        } else if(data.sex == 2) {
                            $('.Y_sex i').removeClass('checked');
                            $('.sex2 i').addClass('checked');
                            $('#sex').val(data.sex)
                        }else{
                            $('.Y_sex i').removeClass('checked');
                            $('#sex').val('')
                        }
                    }
                }
           }
        }
    })
})
function show(text,num){
    var textVal=text.value.length;
    if(textVal<=num){
        $(text).parent().find('span b').html(textVal);
    }else{
        text.value=text.value.substring(0,num);
    }
}