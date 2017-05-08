/**
 * Created by wanglinfei on 2017/2/7.
 */
function toDub(n){
    return n<10?'0'+n:''+n;
}
//显示个人信息
$.ajax({
    type: "post",
    url: "/my/patient/queryByPc/",
    data: {
        "token":loginData.accessToken
    },
    success: function (data) {
        /*console.log(data)*/;
        if(data.data) {
            myselfInfor=data.data;
            var n=myselfInfor.idCard.length;
            var idCard=myselfInfor.idCard.substr(0,4)+'**********'+myselfInfor.idCard.substr(n-4,n);
            var m=myselfInfor.mobile.length;
            var mobile=myselfInfor.mobile.substr(0,3)+'*****'+myselfInfor.mobile.substr(m-3,n);
            $('.patientInfor .infor').html('<h4>'+myselfInfor.name+'</h4>'+
                '<p>身份证<i>'+idCard+'</i></p>'+
                '<p>联系方式<i>'+mobile+'</i></p>');
            $('#butt p i').html(mobile);
        }
    },
    error: function (data) {

    }
});

imgUpload();
//获取预约信息
function GetQueryString(name){
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*但会参数值*/
    if(r!=null)return  decodeURI(r[2]); return null;
}
var ID=GetQueryString("Id");
var dayType=GetQueryString("time");
var fee;
var srcType;
$.ajax({
    type: "get",
    url: "/my/doctorScheduldetail/queryDetail/"+ID,
    success: function (data) {
        console.log(data);
        if(data.data.isExpert){
            $('.detail .imgWa b').addClass('block');
        }
        if(data.data.sourceType==1){
            $('.detail .type p').html('专家号');
            srcType=1;
        }else if(data.data.sourceType==0){
            $('.detail .type p').html('普通号');
            srcType=0;
        }else if(data.data.sourceType==2){
            $('.detail .type p').html('特需号');
            srcType=2;
        }
        //医院 科室
        var docTitle = data.data.title == 1 ? "主任医师" : data.data.title == 2 ? "副主任医师" : data.data.title == 3 ? "主治医师" : "普通医师";
        if (data.data.headimg == null || data.data.headimg == '') {
            data.data.headimg = '/img/docImg.jpg'
        }
        $('.detail .docInfo .docImage').html('<img src="'+data.data.headimg+'" />');
        $('.detail .docInfo .info-r').html('<h3>'+data.data.name+'   &nbsp<i>'+docTitle+'</i></h3>'+
            '<p>'+data.data.hospitalName+'</p>'+
            '<p>'+data.data.deptName+'</p>');
        //就诊时间
        var timer=new Date(data.data.scheduleDate);
        var newTime=timer.getFullYear()+'-'+toDub(timer.getMonth()+1)+'-'+toDub(timer.getDate());
        var timerArr=['上午','下午','晚上'];
        fee=data.data.fee;
        $('.detail .info .time').html('<h4>就诊时间</h4>'+
            '<p>'+newTime+'</p>'+
            '<p>'+timerArr[dayType]+'</p>');
        $('.detail .info .cost p').html('￥'+fee);
        $('#butt input').on('click',submit);
    },
    error:function(data){
        /*console.log(data)*/;
    }
});
//选择就诊状态
$('.options p span').on('click',function(){
    $('.options i').removeClass('check');
    $(this).children().addClass('check')
});
//文本域输入框
$('textarea').on('input', function () {
    var n = $(this).val().length;
    $('.pas i').html(n);
});
//确定预约提交
function submit(){
    var consultationType;
    var flag = true;
    if ($('textarea').val().length< 15) {
        $('.disease .red').css('display', 'block');
        $('textarea').addClass('redBox');
        flag = false;
    }else{
        $('.disease .red').css('display', 'none');
        $('textarea').removeClass('redBox');
        flag = true;
    }
    if($('.options p:eq(0) i').hasClass('check')){
        consultationType=0;
    }else{
        consultationType=1;
    }
    data={
        "token":loginData.accessToken,
        "doctoSchedulDetailID":ID,
        "daySeparateType":dayType,
        "srcType":srcType,
        "fee":fee,
        "consultationType":consultationType,
        "diseaseName": $('#diseaseName').val(),
        "diseaseDetail": $('#diseaseDetail').val(),
        "picUrl": arrImage,
    };
    /*console.log(data)*/;
    if (flag) {
        $.ajax({
            type: "post",
            url: "/my/registerRecord/addRegister",
            data:data,
            beforeSend:function(){
                $('<img src="../../img/loading.gif" class="loading"/>').appendTo('#butt');
            },
            success: function (data) {
                console.log(data);
                $('.loading').remove();
                if(data.state==0){
                    popupShow();
                    $('#add').show();
                    $('.resSMS i').html(data.data.mobile);
                    $('.confirmContent').html('<h4>请关注以下内容</h4>'+
                        '<p class="clearfix"><span class="floatL">就诊人</span><b class="floatL">'+data.data.patientName+'</b></p>'+
                        '<p class="clearfix"><span class="floatL">预约医生</span><b class="floatL">'+data.data.doctorName+'  '+data.data.hospitalName+'--'+data.data.deptName+'</b></p>'+
                        '<p class="clearfix"><span class="floatL">就诊时间</span><b class="floatL">'+data.data.consultationtime+'</b></p>'+
                        '<p class="clearfix"><span class="floatL">号源类型</span><b class="floatL">'+data.data.sourceTypeName+'号</b></p>'+
                        '<p class="clearfix"><span class="floatL">取号凭证</span><b class="floatL">'+data.data.certifiNo+'(身份证号)'+'</b></p>');
                     $('.Jconplect input,.Jconplect textarea').not('.submit').val('');
                     $('.pas i').html('0');
                     $('.Jconplect .pic .img').remove();
                     $('.options i').eq(0).addClass('check');
                     $('.options i').eq(1).removeClass('check');
                }else if(data.state==1004){
                    $('.past').html("不可预约，请以患者身份登录");
                    setTimeout(function(){
                        $('.past').html('');
                    },4000);
                }else{
                    $('.past').html(data.msg);
                    setTimeout(function(){
                        $('.past').html('');
                    },4000);
                }
            }
        });
    }

}
