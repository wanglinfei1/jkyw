/**
 * Created by wanglinfei on 2017/2/7.
 */
$(function () {
    /*获取医院列表*/
    var loginData = JSON.parse(localStorage.getItem("loginData"));
    getCity();
    function getCity() {
        $.ajax({
            type: "post",
            url: "/my/region/queryExpectCity",
            data: {
                str: 2
            },
            dataType: "json"
        }).done(function (a) {
            if (a.state == 0) {
                var text1 = '';
                var city = a.data;
                for (var i = 0; i < city.length; i++) {
                    text1 += "<li city_id=" + city[i].id + ">" + city[i].regionName + "</li>";
                }
                $("#city").html(text1);

                //模拟城市下拉菜单
                $('.city input').on('click', function () {
                    if ($('.city .scrollBar').css('display') == 'none') {
                        $('.city .scrollBar').show();
                    } else {
                        $('.city .scrollBar').hide();
                    }
                });
                $('#city li').on('click', function () {
                    $('#cityId').val($(this).html());
                    $('.city span:eq(1)').css('display','none');
                    $('#cityId').attr('city_id',$(this).attr('city_id'));
                    $('.city .scrollBar').hide();
                    getHospitalList();
                });
            }
        })
    }

    function getHospitalList() {
        $.ajax({
            type: "post",
            url: "/my/hospital/allHospital",
            data: {
                "pageNum":1,
                "pageSize":100,
                "cityId":$('#cityId').attr('city_id'),
                "isRecommend":0
            },
            dataType: "json"
        }).done(function (a) {
            if (a.state == 0) {
                $('.hospital input').val('');
                var text1 = '';
                var Hospital = a.data.result;
                for (var i = 0; i < Hospital.length; i++) {
                    text1 += "<li hospital_id=" + Hospital[i].hospital.id + ">" + Hospital[i].hospital.name + "</li>";
                }
                $("#hospital").html(text1);

                //模拟医院下拉菜单
                $('.hospital input').on('click', function () {
                    $('.hospital .scrollBar').show();
                });
                $('.hospital div li').on('click', function () {
                    $('.hospital input').val($(this).html());
                    $('.hospital span:eq(1)').css('display','none');
                    $('.hospital input').attr('hospital_id',$(this).attr('hospital_id'));
                    $('.hospital .scrollBar').hide();
                });
            }
        })
    }


    function Validate() {
        var flag=true;
        $('input').each(function () {
            if ($(this).attr('Wrequire') == 'required') {
                $(this).removeClass('redBox')
                if ($(this).val() == '') {
                    $(this).addClass('redBox');
                    flag=false
                }
            }
        });

        if ($('textarea').val().length< 15) {
            $('textarea').addClass('redBox');
            $('.disease .red').css('display', 'block');
            $('.disease .red').html='请输入不低于15个字的疾病描述';
            flag = false;
        }else if($('textarea').val().length> 300){
            $('textarea').addClass('redBox');
            $('.disease .red').css('display', 'block');
            $('.disease .red').html='请输入不大于300个字的疾病描述';
            flag = false;
        }else{
            $('textarea').removeClass('redBox');
            $('.disease .red').css('display', 'none');
            flag = true;

        }
        if(!flag){
            return false

        }
        return true
    }

    //点击body下拉框隐藏
    $('body').bind('click', function (event) {
        var evt = event.srcElement ? event.srcElement : event.target;
        if (evt.getAttribute("data_id") == 'btn') {
            return;
        } else {
            $('.scrollBar').hide();
        }
    });
    //文本域输入框
    $('textarea').on('input', function () {
        var n = $(this).val().length;
        $('.pas i').html(n);
    });
    //上传图片
    imgUpload();
    function getData() {
        var startTime = $('#time1').val();
        var endTime = $('#time2').val();
        var cityId = $('#cityId').attr('city_id');
        var hospitalId = $('.hospital input').attr('hospital_id');
        var diseaseName = $('#diseaseName').val();
        var diseaseDetail = $('#diseaseDetail').val();
        console.log(arrImage);
        $.ajax({
            type: 'post',
            url: '/my/exactBespoke/addExactBespoke',
            data: {
                "token": loginData.accessToken,
                startTime: startTime+' 00:00:00',
                endTime: endTime+' 00:00:00',
                cityId: cityId,
                hospitalId: hospitalId,
                diseaseName: diseaseName,
                diseaseDetail: diseaseDetail,
                picUrl: arrImage
            },
            beforeSend:function(){
                $('<img src="../../img/loading.gif" class="loading"/>').appendTo('#butt');
            }
        }).done(function (a) {
            $('.loading').remove();
            if(a.state==0){
                $('.infor input,.infor textarea').not('.submit').val('');
                $('.infor .pic .img').remove();
                $('#add').show();
                $('.popup').css('display','block');
            }else if(a.state==1004){
                $('#butt span').css({'display':'block',"top":"15px", "left":"60px","width":"250px"});
                $('#butt span').html("不可预约，请以患者身份登录");
                setTimeout(function(){
                    $('#butt span').css({'display':'none'});
                },4000);
                setTimeout(function(){
                    $('.popup').css({'display':'none'});
                },2000);
            }else{
                $('#butt span').css({'display':'block',"top":"15px", "left":"60px","width":"250px"});
                $('#butt span').html(a.msg);
                setTimeout(function(){
                    $('#butt span').css({'display':'none'});
                },4000);
                setTimeout(function(){
                    $('.popup').css({'display':'none'});
                },2000);
            }
        })
    }

    /*点击提交的事件*/
    $('.submit').click(function () {
        var validation1=validityTime();
        var validation2=Validate();
        if(validation1&&validation2){
            getData();
        }
    });
});

