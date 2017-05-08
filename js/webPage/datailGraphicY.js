var doctorID;
$(function () {
    var loginData = JSON.parse(localStorage.getItem("loginData"));
    function GetQueryString(name) {
        /*定义正则，用于获取相应参数*/
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        /*字符串截取，获取匹配参数值*/
        var r = window.location.search.substr(1).match(reg);
        /*但会参数值*/
        if (r != null)return decodeURI(r[2]);
        return null;
    }
    doctorID = GetQueryString("doctorId");
    $.ajax({
        type: "post",
        url: "/my/doctor/findDoctor/" + doctorID,
    }).done(function (a) {
        var text1 = '';
        if (a.state == 0) {
            var skilled = a.data.doctor.skilled;
            var skilled2;
            if (skilled.length > 60) {
                skilled2 = skilled.substr(0, 60) + '……';
            } else {
                skilled2 = skilled;
            }
            var introd = a.data.doctor.introduction;
            var introd2;
            if (introd.length > 60) {
                introd2 = introd.substr(0, 60) + '……';
            } else {
                introd2 = introd;
            }
            a.data.doctor.title = a.data.doctor.title == 1 ? "主任医师" : a.data.doctor.title == 2 ? "副主任医师" : a.data.doctor.title == 3 ? "主治医师" : "普通医师";
            if (a.data.doctor.headimg == null || a.data.doctor.headimg == '') {
                a.data.doctor.headimg = '/img/docImg.jpg'
            }
            $('.docImage').html('<img src="' + a.data.doctor.headimg + '" />')
            text1 += ' <h2>' + a.data.doctor.name + '<i> ' + a.data.doctor.title + '</i></h2>\
            <p class="p1"><a href="HospitalIntroduced.html?navActive=1&hospitalId='+a.data.depart.hospitalId+'&doctorId='+a.data.doctor.id+'" target="_blank">' + a.data.hospital.name + '--' + a.data.depart.deptName + '</a></p>\
        <p class="p2"><a href="javaScript:;">擅长：' + skilled2 + '</a><i class="block zhankai cursor">详情</i><i class="none shouqi cursor">收起</i></p>\
        <p class="p3"><a href="javaScript:;">简介：' + introd2 + '</a><i class="block zhankai">详情</i><i class="none shouqi">收起</i></p>'
            $('.info-r').html(text1);
            if(a.data.doctor.isExpert){
                $('.imgWa b').css('display','block');
            }
            /*点击详情展示全部内容*/
            if(skilled.length>38){
                $('.info-r .p2 i.zhankai').css('display','block');
            }else{
                $('.info-r .p2 i.zhankai').css('display','none');
            }
            $('.p2 i.zhankai').on('click',function(){
                $('.info-r .p2 a').html('擅长：'+skilled);
                $(this).css('display','none');
                $('.p2 i.shouqi').css('display','block');
            });
            $('.p2 i.shouqi').on('click',function(){
                $('.info-r .p2 a').html('擅长：'+skilled2);
                $(this).css('display','none');
                $('.p2 i.zhankai').css('display','block');
            });
            if(introd.length>38){
                $('.p3 i.zhankai').css('display','block');
            }else{
                $('.p3 i.zhankai').css('display','none');
            }
            $('.p3 i.zhankai').on('click',function(){
                $('.info-r .p3 a').html('简介：'+introd);
                $(this).css('display','none');
                $('.p3 i.shouqi').css('display','block');
            });
            $('.p3 i.shouqi').on('click',function(){
                $('.info-r .p3 a').html('简介：'+introd2);
                $(this).css('display','none');
                $('.p3 i.zhankai').css('display','block');
            });

        }
    })
    imgUpload();
    /*表单验证*/
    $('.submit').on('click', function () {
        var flag = true;

        if ($('textarea').val().length< 15) {
            $('.disease .red').css('display', 'block');
            $('textarea').addClass('erro');
            flag = false;
        }else{
            $('.disease .red').css('display', 'none');
            $('textarea').removeClass('erro');
            flag = true;
        }
        if (flag) {
            $.ajax({
                type: 'post',
                url: '/my/counselingrecord/addCounseling',
                data: {
                    token: loginData.accessToken,
                    doctorID: doctorID,
                    diseaseName: $('#diseaseName').val(),
                    diseaseDetail:$('#diseaseDetail').val(),
                    picUrl:arrImage,
                    type:1
                },
                beforeSend:function(){
                    $('<img src="img/loading.gif" class="loading"/>').appendTo('#butt');
                },
            }).done(function(a){
                console.log;
                $('.loading').remove();
                if(a.state==0){
                    $('.infor input,.infor textarea').not('.submit').val('');
                    $('.infor .pic .img').remove();
                    $('#add').show();
                    $('.popup').css('display','block')
                }else if(a.state==1004){
                    $('#butt span').css({'display':'block'});
                    $('#butt span').html("不可预约，请以患者身份登录");
                    setTimeout(function(){
                        $('#butt span').css({'display':'none'});
                    },4000);
                }else{
                    $('#butt span').css({'display':'block'});
                    $('#butt span').html(a.msg);
                    setTimeout(function(){
                        $('#butt span').css({'display':'none'});
                    },4000);
                }

            })
        }
    })
});

$(function(){
    //模拟下拉菜单
    $('.timer input').on('click',function(){
        if($('.timer ul').css('display')=='none'){
            $('.timer ul').show();
        }else{
            $('.timer ul').hide();
        }
    });
    $('.timer ul li').on('click',function(){
        $('.timer input').val($(this).html());
        $('.timer ul').hide();
    });
    //文本域输入框
    $('textarea').on('click',function(){

    }).on('input',function(){
        var n=$(this).val().length;
        $('.pas i').html(n);
    });
});