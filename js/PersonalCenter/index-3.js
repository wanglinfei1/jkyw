/**
 * Created by wanglinfei on 2017/2/7.
 */
if(!JSON.parse(localStorage.getItem("loginData"))){
    window.location="../webPage/login.html";
}
$('.personal-nav div').on('click',function(){
    window.location='index-1.html?cont='+(Number($(this).index())+1);
});
$(function () {
    var loginData = JSON.parse(localStorage.getItem("loginData"));
    /*获取地址栏的参数*/
    function GetQueryString(name) {
        /*定义正则，用于获取相应参数*/
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        /*字符串截取，获取匹配参数值*/
        var r = window.location.search.substr(1).match(reg);
        /*但会参数值*/
        if (r != null)return unescape(r[2]);
        return null;
    }

    var ID = GetQueryString("id");
    var iToken=loginData.accessToken;
    $.ajax({
        type:"get",
        url:"/my/exactBespoke/queryPc/"+ID,
        beforeSend :function(xhr){
            xhr.setRequestHeader('token',iToken);
        },
        success:function(data){
            if (data.state == 0) {
                /*console.log(data)*/;
                if(data.data.exactBespoke.applyStatus==0){
                    $('.InEview').css('display','block');
                    $('.applicationDetails-r h3 i').html('申请中');
                }else if(data.data.exactBespoke.applyStatus==1){
                    $('.successEview').css('display','block');
                    $('.applicationDetails-r h3 i').html('申请成功');
                }else if(data.data.exactBespoke.applyStatus==2||data.data.exactBespoke.applyStatus==null){
                    $('.failureEview').css('display','block');
                    $('.applicationDetails-r h3 i').html('申请失败');
                    $('.failure').css('display','block');
                    $('.failure li i').html(data.data.exactBespoke.reason);
                }
                //就诊人信息
                var healthCard;
                if(data.data.patient==null){
                    healthCard='';
                }else{
                    healthCard=data.data.patient.healthCard;
                }
                $('.patient .infor ul').html('<li class="floatL"><b>就诊人：</b><i>'+data.data.exactBespoke.patientName+'</i></li>'+
                    '<li class="floatL"><b>手机号：</b><i>'+data.data.patient.mobile+'</i></li>'+
                    '<li class="floatL"><b>身份证号：</b><i>'+data.data.patient.idCard+'</i></li>'+
                    '<li class="floatL"><b>居民健康卡号：</b><i>'+healthCard+'</i></li>');
                //订单信息
                if(data.data.exactBespoke.diseaseName==null){
                    data.data.exactBespoke.diseaseName='';
                }
                if(data.data.exactBespoke.diseaseDetail==null){
                    data.data.exactBespoke.diseaseDetail='';
                }
                $('.Details-infor .infor ul').html('<li class="floatL"><b>期望就诊城市：</b><i>'+data.data.exactBespoke.consultCity+'</i></li>'+
                    '<li class="floatL"><b>期望就诊时间：</b><i>'+data.data.exactBespoke.consultStartTime.split(' ')[0]+' — '+data.data.exactBespoke.consultEndtTime.split(' ')[0]+'</i></li>'+
                    '<li class="floatL"><b>期望就诊医院：</b><i>'+data.data.exactBespoke.consultHospital+'</i></li>'+
                    '<li class="floatL"><b>疾病名称：</b><i>'+data.data.exactBespoke.diseaseName+'</i></li>'+
                    '<li class="floatL li2"><b>疾病详情：</b><i>'+data.data.exactBespoke.diseaseDetail+'</i></li>'+
                    '<li class="floatL li2">'+
                    '<b>上传图片：</b>'+
                    '<div class="floatL imgB">'+
                    '<i>'+

                    '</i>'+
                    '</div>'+
                    '</li>'+
                    '<li class="floatL li2"><b>申请时间：</b><i>'+data.data.exactBespoke.applyTime+'</i></li>'+
                    '<li class="floatL li2"><b>申请订单号：</b><i>'+data.data.exactBespoke.orderNo+'</i></li>');
                var imgage='';
                for(var i=0; i<data.data.imageList.length; i++){
                    imgage+='<div class="img floatL"><img class="cur" src="'+data.data.imageList[i].thumbnail+'" alt="" data-imgul="'+data.data.imageList[i].imgaeUrl+'"></div>';
                }
                $('.Details-infor .imgB i').html(imgage);
                /*点击显示大图*/
                bigPic();
                if(data.data.exactBespoke.applyStatus==1&&data.data.exactBespoke.adviseDoctorIds!=''){
                    $('.recom').css('display','block');
                    findDoctor(data.data.exactBespoke.adviseDoctorIds);
                }
                var Height=$('.applicationDetails-r').outerHeight();
                $('.applicationDetails .personalCenter-l').css('height',Height);
            }
        }

    });
    function findDoctor(str) {
        console.log(str);
        if(!str){
            $('.recom').css('display','none');
            return;
        }
        var DocArr=[];
        if(str.charAt(',')!=-1){
            DocArr=str.split(',');
        }else{
            DocArr=str.split(' ');
        }
        var str='';
        for(var i=0; i<DocArr.length; i++){
            $('<li class="detail cursor" data_docID=""></li>').appendTo('.recom ul');
            (function(i){
                $.ajax({
                    type: "post",
                    url: "/my/doctor/findDoctor/" + DocArr[i],
                    success: function (data) {
                        /*console.log(data)*/;
                        if (data.state == 0)  {
                            var docTitle = data.data.doctor.title == 1 ? "主任医师" : data.data.doctor.title == 2 ? "副主任医师" : data.data.doctor.title == 3 ? "主治医师" : "普通医师";
                            if (data.data.doctor.headimg == null || data.data.doctor.headimg == '') {
                                data.data.doctor.headimg = '/img/docImg.jpg'
                            }
                            var skill=data.data.doctor.skilled;
                            if(skill.length>38){
                                skill=skill.substr(0,38)+'...';
                            }
                            $('<div class="info clearfix">'+
                                '<div class="imgWa floatL info-l">'+
                                '<div class="docImage">'+
                                '<img src="'+data.data.doctor.headimg+'" />'+
                                '</div>'+
                                '<b></b>'+
                                '</div>'+
                                '<div class="info-r floatL">'+
                                '<h2>'+data.data.doctor.name+'  <i>'+docTitle+'</i></h2>'+
                                '<p class="p1">'+data.data.hospital.name+'--'+data.data.depart.deptName+'</p>'+
                                '<p class="p2">擅长：'+skill+' </p>'+
                                '</div>'+
                                '<div class="serve floatL clearfix" data_docID="'+data.data.doctor.id+'">'+
                                '<div class="floatL registered cursor">'+
                                '<h3><span></span></h3>'+
                                '<p>预约</p>'+
                                '</div>'+
                                '<div class="floatL detailgraphic cursor div2">'+
                                '<h3 ><span></span></h3>'+
                                '<p>图文</p>'+
                                '</div>'+
                                '<div class="floatL detailphone cursor div3">'+
                                '<h3><span></span></h3>'+
                                '<p>电话</p>'+
                                '</div>'+
                                '</div>'+
                                '</div>').appendTo('.recom ul li:eq('+i+')');
                            $('.recom ul li:eq('+i+')').attr('data_docID',data.data.doctor.id);
                            if(data.data.doctor.isExpert){
                                $('.recom ul li:eq('+i+') .imgWa b').addClass('block');
                            }
                            if(!data.data.doctor.isBespoke){
                                $('.recom ul li:eq('+i+') .serve div:eq(0)').addClass('noServer');
                            }
                            if(!data.data.doctor.isSupporVideotexConsult){
                                $('.recom ul li:eq('+i+') .serve div:eq(1)').addClass('noServer');
                            }
                            if(!data.data.doctor.isSupporTelConsult){
                                $('.recom ul li:eq('+i+') .serve div:eq(2)').addClass('noServer');
                            }

                            function docDetails(){
                                var docId=$(this).attr('data_docID');
                                window.location="../../dist/webPage/docDetails.html?doctorId="+encodeURI(docId);
                            }
                            $('.recom ul').on('click','li',docDetails);
                            $('.recom ul .serve div').on('click',function(event){
                                var event = event || window.event;
                                if (event.stopPropagation) {
                                    event.stopPropagation();
                                } else {
                                    event.cancelBubble = true;
                                }
                                $('.recom ul').off('click','li',docDetails);
                                if ($(this).hasClass('noServer')) {
                                    return;
                                }else{
                                    var n=$(this).index();
                                    var docId=$(this).parent().attr('data_docID');
                                    if(n==0){
                                        window.location="../../dist/webPage/docDetails.html?doctorId="+encodeURI(docId);
                                    }else if(n==1){
                                        window.location="../../dist/webPage/Detail-graphic.html?doctorId="+encodeURI(docId);
                                    }else if(n==2){
                                        window.location="../../dist/webPage/Detail-phone.html?doctorId="+encodeURI(docId);
                                    }
                                }
                            });
                        }
                    }
                });
            })(i);
        }
    }

});