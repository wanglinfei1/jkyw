/**
 * Created by 卫宁宁 on 2017/1/13.
 */
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

    var id = GetQueryString("id");
    $.ajax({
        type: 'post',
        url: '/my/counselingrecord/queryCounseling',
        data: {
            id: id
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('token', loginData.accessToken);
        }

    }).done(function (a) {
        /*console.log(a)*/;
        if (a.state == 0) {
            var data = a.data;
            data.counselingRecord.applyStatus = data.counselingRecord.applyStatus == 0 ? '等待中' : data.counselingRecord.applyStatus == 1 ? '已拨打电话' : '已过期';
            $('#status').html(data.counselingRecord.applyStatus);
            $('.state').each(function () {
                if ($(this).html() == data.counselingRecord.applyStatus) {
                    $(this).parent().css('display', 'block')
                }
            });
            var text1 = '', text2 = '', text3 = '';
            text1 += '<img src="" alt="" class="fixImage"> <ul class="clearfix">'+
                '<li class="floatL JPaddingR"><b>接听电话：</b><i>' + data.counselingRecord.telephone + '</i></li>'+
                '<li class="floatL"><b>方便接听时间：</b><i>' +data.counselingRecord.applyCallTime + '</i></li>'+
                '<li class="floatL"><b>疾病名称：</b><i>' + data.counselingRecord.diseaseName + '</i></li>'+
                '<li class="floatL li2"><b>疾病详情：</b><i>' + data.counselingRecord.diseaseDetail + '</i></li>'+
                '<li class="floatL li2">'+
                '<b>上传图片：</b>'+
                '<div class="floatL imgB">'+
                '<i>'+
                '</i>'+
                '</div>'+
                '</li>'+
                '<li class="floatL li2"><b>申请时间：</b><i>' + data.counselingRecord.applyTime + '</i></li>'+
                '<li class="floatL li2 linone"><b>服务时间：</b><i>'+data.counselingRecord.callTime+'</i></li>'+
                '<li class="floatL li2"><b>申请订单号：</b><i>' + data.counselingRecord.orderNo + '</i></li>'+
                '</ul>';
            $('#orderInfo').html(text1);
            var imgage='';
            for(var i=0; i<data.listImage.length; i++){
                imgage+='<div class="img floatL"><img class="cur" src="'+data.listImage[i].thumbnail+'" alt="" data-imgul="'+data.listImage[i].imgaeUrl+'"></div>';
            }
            $('.Details-infor .imgB i').html(imgage);
            /*点击显示大图*/
            bigPic();
            if(data.counselingRecord.applyStatus == '已拨打电话'||data.counselingRecord.applyStatus==1){
                $('.linone').css('display','block')
            }
            if(data.counselingRecord.healthCard==undefined||data.counselingRecord.healthCard==null){
                data.counselingRecord.healthCard='';
            }
            text2 += ' <h4>就诊人信息</h4>'+
                '<div class="infor">'+
                '<ul class="clearfix">'+
                '<li class="floatL"><b>就诊人：</b><i>' + data.counselingRecord.patientName + '</i></li>'+
                '<li class="floatL"><b>手机号：</b><i>' + data.counselingRecord.mobile + '</i></li>'+
                '<li class="floatL"><b>身份证号：</b><i>' + data.counselingRecord.idCard + '</i></li>'+
                '<li class="floatL"><b>居民健康卡号：</b><i>' + data.patient.healthCard + '</i></li>'+
                '</ul>'+
                '</div>';
            $('#patientInfo').html(text2);

            data.counselingRecord.doctorTitle = data.counselingRecord.doctorTitle == 1 ? "主任医师" :data.counselingRecord.doctorTitle == 2 ? "副主任医师" : data.counselingRecord.doctorTitle == 3 ? "主治医师" : "普通医师";
            text3 += '<h4>就诊医生信息</h4>'+
                '<div class="infor">'+
                '<ul class="clearfix">'+
                '<li class="floatL"><b>姓名：</b><i>' + data.counselingRecord.doctorName + '</i></li>'+
                '<li class="floatL"><b>医院：</b><i>' + data.counselingRecord.hospitalName + '</i></li>'+
                '<li class="floatL"><b>科室：</b><i>' + data.counselingRecord.deptName + '</i></li>'+
                '<li class="floatL"><b>职称：</b><i>' + data.counselingRecord.doctorTitle + '</i></li>'+
                '</ul>'+
                '</div>';
            $('#doctorInfo').html(text3);
            var Height=$('.applicationDetails-r').outerHeight();
            $('.applicationDetails .personalCenter-l').css('height',Height);
        }
    })


});