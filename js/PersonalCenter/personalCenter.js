/**
 * Created by wanglinfei on 2017/2/7.
 */
if(!JSON.parse(localStorage.getItem("loginData"))){
    window.location="../webPage/login.html";
}
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

    var ID = GetQueryString("Id");
    var Ajaxdata='';
    $.ajax({
        type: 'post',
        url: "/my/patient/queryMyRegisteredStatus",
        data: {
            "token": loginData.accessToken,
            id: GetQueryString('id'),
        },
        dataType: "json",
    }).done(function (a) {
        Ajaxdata=a.data;
        console.log(a);
        if (a.state == 0) {
            var text1 = '';
            var text2 = '';
            var text3 = '';
            var register = a.data.registerRecord;
            var patient = a.data.patient;
            var consult = register.consultationType == 0 ? "初诊" : "复诊";
            var source = register.sourceType == 0 ? "普通" : register.sourceType == 1 ? "专家" : "特需";
            var doctorT=register.doctorTitle == 1 ? "主任医师" :register.doctorTitle == 2 ? "副主任医师":register.doctorTitle == 3 ?"主治医师":"普通医师";
            $('.roof').text('display', 'block');
            if (register.status == 0) {
                $('.success').css('display', 'block');
                $('.failure').css('display', 'none');
                $('.roof').text('预约成功');
                $('.personalCenter-r .order i').addClass('callOff');
                $('.blockShow').show();
            }else if (register.status == 2) {
                $('.success').css('display', 'none');
                $('.failure').css('display', 'block');
                $('.roof').text('已取消');
                $('.failure i').text('已取消');
                $('.blockShow').hide();
            }else {  //判断是否取消
                $('.success').css('display', 'none');
                $('.failure').css('display', 'block');
                $('.roof').text('预约失败');
                $('.failure i').text('预约失败');
                $('.blockShow').hide();
            }
            var oDate=new Date();
            var newTimeYear=oDate.getFullYear();
            var newTimeMonth=oDate.getMonth()+1;
            newTimeMonth=newTimeMonth<10?('0'+newTimeMonth):newTimeMonth;
            var newTimeDay=oDate.getDate();
            /*console.log(newTimeYear+'-'+newTimeMonth+'-'+newTimeDay);*/
            var timerlist=register.consultationTime.split(' ');
            var timeAp=timerlist[1].split(':')[0];
            var timeres=timerlist[0].split('-');
            /*console.log(timeres);*/
            if(timeres[0]<=newTimeYear&&timeres[1]<=newTimeMonth&&timeres[2]<newTimeDay){
                $('.blockShow').hide();
                $('.personalCenter-r .order').css('width','185px');
                $('.personalCenter-r .order i').removeClass('callOff');
            }
            var timeDate;
            if(timeAp>8&&timeAp<12){
                timeDate='上午';
            }else if(timeAp>=12&&timeAp<18){
                timeDate='下午';
            }else if(timeAp>=18&&timeAp<24){
                timeDate='晚上';
            }
            register.diseaseName==null?register.diseaseName='':register.diseaseName=register.diseaseName;
            register.diseaseDetail==null?register.diseaseDetail='':register.diseaseDetail=register.diseaseDetail;
            text1 += '<li class="floatL"><b>就诊时间：</b><i>' + timerlist[0]+'  '+timeDate+ '</i></li>\
                       <li class="floatL"><b>预约时间：</b><i>' + register.bespokeTime + '</i></li>\
                       <li class="floatL"><b>号源类型：</b><i>' + source + '</i></li>\
                       <li class="floatL"><b>预约费：</b><i>' + register.fee+' 元'+'</i></li>\
                       <li class="floatL"><b>取号凭证：</b><i>' + patient.idCard + '</i></li>\
                       <li class="floatL"><b>就诊类型：</b><i>' + consult + '</i></li>\
                       <li class="floatL"><b>预约订单号：</b><i>' + register.orderno + '</i></li>'+
                      '<li class="floatL"><b>疾病名称：</b><i>'+register.diseaseName+'</i></li>'+
                      '<li class="floatL li2"><b>疾病详情：</b><i>'+register.diseaseDetail+'</i></li>'+
                      '<li class="floatL li2">'+
                      '<b>上传图片：</b>'+
                      '<div class="floatL imgB">'+
                      '<i>'+
                      '</i>'+
                      '</div>'+
                      '</li>';
            $('.indent ul').html(text1);
            var imgage='';
            if(a.data.images!=undefined){
                for(var i=0; i<a.data.images.length; i++){
                    imgage+='<div class="img floatL"><img src="'+a.data.images[i].thumbnail+'" alt="" data-imgul="'+a.data.images[i].imgaeUrl+'"></div>';
                }
            }
            $('.orderInfor .imgB i').html(imgage);
            /*点击显示大图*/
            bigPic();
            text2 += '<li class="floatL"><b>就诊人：</b><i>' + patient.name + '</i></li>\
                       <li class="floatL"><b>手机号：</b><i>' + patient.mobile + '</i></li>\
                       <li class="floatL"><b>身份证号：</b><i>' + patient.idCard + '</i></li>\
                       <li class="floatL"><b>居民健康卡号：</b><i>' + patient.healthCard + '</i></li>';
            $('.sick ul').html(text2);

            text3 += '<li class="floatL"><b>姓名：</b><i>' + register.doctorName + '</i></li>\
                               <li class="floatL"><b>医院：</b><i>' + register.hospitalName + '</i></li>\
                       <li class="floatL"><b>科室：</b><i>' + register.deptName + '</i></li>\
                       <li class="floatL"><b>职称：</b><i>' + doctorT + '</i></li>';
            $('.doctor ul').html(text3);
            var Height=$('.personalCenter-r').outerHeight();
            $('.personalCenter .personalCenter-l').css('height',Height);
        }
    });
    $('.JcancleY').click(function(){
        $('.popup .success').html('您确定要取消预约吗？');
        $('.sibBtn').show();
        $('.popup').css('display','block');
        $('.popup .close,.popup .cancel').on('click',function(){
            $('.popup').css('display','none');
        });
    })
      $('#JorderTure').click(function(){
          $.ajax({    /*//调取取消预约接口*/
              type: 'post',
              url: "/my/registerRecord/cancelRecord/"+GetQueryString('id')+"",
              data: {
                  "token": loginData.accessToken,
              },
              dataType: "json",
          }).done(function (data) {
              if(data.state==0){
                  $('.popup .success').html('取消成功!');
                  $('.personalCenter-r .order i').removeClass('callOff');
                  $('.sibBtn').hide();
                  $('.popup .close').on('click',function(){
                      $('.popup').css('display','none');
                  });
                  setTimeout(function(){
                      $('.popup').css('display','none');
                      $('.success').css('display', 'none');
                      $('.failure').css('display', 'block');
                      $('.roof').text('已取消');
                      $('.failure i').text('已取消');
                      $('.blockShow').hide();
                  },800);
              }else{
                  $('.popup .success').html('取消失败!');
                  $('.sibBtn').hide();
                  $('.popup .close').on('click',function(){
                      $('.popup').css('display','none');
                  });
                  setTimeout(function(){
                      $('.popup').css('display','none');
                  },800);
              }
          })



      })

})