/**
 * Created by wanglinfei on 2017/1/5.
 */
function JgetHelth(){
    //查询完善信息
    $.ajax({
        type: "POST",
        url: "/my/patient/queryByPc",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('token', loginData.accessToken);
        }
    }).done(function (a) {
        if(0 === a.state){
            JhelthInfo(a.data,$('.JselfInfo'));
        }else{
            console.log(a.msg);
        }
    }).fail(function (a) {
        console.log(a.msg);
    })
    //查询健康档案
    $.ajax({
        type: "POST",
        url: "/my/healthRecord/findDetailValueById",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('token', loginData.accessToken);
        }
    }).done(function (a) {
        if(0 === a.state){
            if(a.data==null || a.data.healthRecord==undefined){ //如果没有编辑过
                var Height=$('.personalCenter-r').outerHeight();
                $('.personalCenter .personalCenter-l').css('height',Height);
            }else{
                a.data.healthRecord.bloodType=a.data.bloodType;
                a.data.healthRecord.drugAllergiv=a.data.drugAllergiv;
                a.data.healthRecord.foodContactAllergiv=a.data.foodContactAllergiv;
                a.data.healthRecord.marry=a.data.marry;
                a.data.healthRecord.personalHabits=a.data.personalHabits;
                a.data.healthRecord.rhNegative=a.data.rhNegative;
                a.data.healthRecord.specialPersonTag=a.data.specialPersonTag;
                a.data.healthRecord.fertilityState=a.data.fertilityState;
                a.data.healthRecord.familyMedicalHistory=a.data.familyMedicalHistory;
                a.data.healthRecord.surgicalTrauma=a.data.surgicalTrauma;
                JhelthInfo(a.data.healthRecord,$('#JhealthBox'));
                var Height=$('.personalCenter-r').outerHeight();
                $('.personalCenter .personalCenter-l').css('height',Height);
            }
        }else{
            console.log(a.msg);
            //parent.layer.msg(a.msg, {icon: 1});
        }
    }).fail(function (a) {
        console.log(a.msg);
        ///parent.layer.msg("请求失败", {icon: 1});
    })
}
function JhelthInfo(obj,box){
    for(var index in obj){
        var elm = box.find('.'+ index);
        if(index=='sex'){
            obj[index]==1?elm.html('女'):elm.html('男');
        }else if(index=="gaugeTime"){
            if(obj[index]!='' && obj[index]!=null){
                elm.html(getLocalTime(obj[index]/1000,"yyyy-MM-dd"));
            }else{
                elm.html('');
            }
        }else if(index=="bloodPressure"){
            var iVal=obj[index].split(',');
            if(iVal[0]=='' && iVal[1]==''){
                elm.html('');
            }else{
                elm.html(obj[index]);
            }
        }else if(index=="birthdate"){
            var newDate=new Date().getFullYear();
            var Date2=obj.birthdate.split('-')[0];
            var age=newDate-Date2;
            box.find('.age').html(age);
        }else{
            obj[index]==null?elm.html(''):elm.html(obj[index]);
            obj[index]==null?elm.val(''):elm.val(obj[index]);
        }
    }
};

//时间戳转换成正常格式
function getLocalTime(nS,fm) {
    return  new Date(parseInt(nS) * 1000).Format(fm);
}
//时间戳转换成正常格式
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}












