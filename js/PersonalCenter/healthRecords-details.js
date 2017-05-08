/**
 * Created by wanglinfei on 2017/2/7.
 */
if(!JSON.parse(localStorage.getItem("loginData"))){
    window.location="../webPage/login.html";
}
var phone = localStorage.getItem("loginPhone");
var myselfInfor=JSON.parse(localStorage.getItem("selfInfor"));
$('.name').html(myselfInfor.name);
$('.phone').html(myselfInfor.mobile);
var isBtn=false;
/*初始化日历*/
$("#gaugeTime").datepicker({
    inline: true,
    showOtherMonths: true,
    maxDate:'now',
}).datepicker('widget').wrap('<div class="ll-skin-lugo"/>');
$("#gaugeTime").on('change', function () {
    var timerVal = $(this).val();
    if(timerVal=='')return ;
    var timerArr = $(this).val().split('/');
    var timerStr = timerArr[2] + '-' + timerArr[0] + '-' + timerArr[1];
    $(this).val(timerStr);
});
/*初始化下拉*/
$('.Jselect').click(function(event){
    event.stopPropagation();
    var This=$(this);
    var isId=$(this).attr('id');
    jselect(This,isId);
})

var iFormdata;//保存过的数据
var ifEdit=true;
//查询健康档案
$.ajax({
    type: "POST",
    url: "/my/healthRecord/findById",
    dataType: "json",
    beforeSend: function (xhr) {
        xhr.setRequestHeader('token', loginData.accessToken);
    }
}).done(function (a) {
    if(0 === a.state){
        if(a.data==null){ //如果新建
            //元素赋值为空
            ifEdit=false;
        }else{           //如果编辑
            //返显
            iFormdata=a.data; //赋值
            ifEdit=true;
            JhelthInfo(iFormdata,$('#JgetJson'));//返显input，textarea
        }
    }else{
        console.log(a.msg);
    }
}).fail(function (a) {
    console.log(a.msg);
})
function JhelthInfo(obj,box){
    for(var index in obj){
        var elm = box.find('#'+ index);
        if(index=="hospital"){  //hospital 如果医院
            var iHtml=obj[index].split(',');
            var iHmtli='';
            for(var i=0;i<iHtml.length;i++){
                iHmtli+='<input type="text" value="'+iHtml[i]+'" class="input1">';
            }
            $('.hospital div').html(iHmtli);
        }else if(index=="cityId"){
            loadCity(obj[index]);
        }else if(index=="gaugeTime"){
            elm.val(getLocalTime(obj[index]/1000,"yyyy-MM-dd"));
        }else{
            obj[index]==null?elm.val(''):elm.val(obj[index]);
        }
    }
};
$('.hospital i').on('click',function(){
    if($('.hospital .floatL input').length>=3){
        return;
    }else{
        $('<input type="text"  class="input1">').appendTo('.hospital div');
    }
});
$('#JgetJson .codeList').on('click','.notAva',function(){ //点击暂无取消其他
    if($(this).prop("checked")){  //如果选中
        $(this).parent().siblings().find('input[type="checkbox"]').prop('checked',false);
        $(this).parent().parent().siblings('.other').val('');
    }
})
$('#JgetJson .codeList').on('click','input',function(){ ////点击其他取消暂无
    if($(this).parent().text()!='暂无'){ //如果不是点击暂无
        if($(this).prop("checked")){
            $(this).parent().siblings().find('.notAva').prop('checked',false);
        }
    }
})
$('#JgetJson .other').change(function(){
    if($(this).val()!=''){ //如果不为空
        $(this).siblings('.codeList').find('.notAva').prop('checked',false);
    }
})
$('.codeList').each(function(i){ //加载数据字典
    var isCode= $('.codeList').eq(i).attr('id');
    var This=$(this);
    loadCode(isCode,This);
})
//档案保存接口
$('#JhelthSave').click(function(){
    //判空：
    $('.checkEqui').each(function(){
        if($(this).find('input[ititle="Upform"]').val()=='' || $(this).find('input[ititle="Upform"]').val()=='请选择'){
            $(this).find('.Jerror').show();
            return;
        }else{
            $(this).find('.Jerror').hide();
        }
    })
    var hospVal=new Array();
    $('.hospital .floatL input').each(function(i){
        if($('.hospital .floatL input').eq(i).val()!=''){
            hospVal.push($(this).val());
        }
    })
    $('#hospital').val(hospVal.join(','));
    $('.checkboxList').each(function(){ //checkbox给隐藏域赋值
        var isTh=$(this).attr('id');
        var chk_value =[];
        if($(this).find('input[type="checkbox"]:checked').length==0){
            if($(this).siblings('input[class="other"]').val()==''){
                $(this).siblings('input[ititle="Upform"]').val('');
            }else{
                var isVal='*'+$(this).siblings('input[class="other"]').val();
                $(this).siblings('input[ititle="Upform"]').val(isVal);
            }
        }else{
            $(this).find('input[type="checkbox"]:checked').each(function(){
                chk_value.push($(this).val());
            })
            if($(this).siblings('input[class="other"]').val()==''){
                $(this).siblings('input[ititle="Upform"]').val(chk_value.join(','));
                console.log($(this).siblings('input[ititle="Upform"]').val());
            }else{
                var isVal='*'+$(this).siblings('input[class="other"]').val();
                chk_value.push(isVal);
                $(this).siblings('input[ititle="Upform"]').val(chk_value.join(','));
                console.log($(this).siblings('input[ititle="Upform"]').val());
            }
        }
    })
    //血压赋值
    $('#Jpeess #bloodPressure').val($.trim($('.bloodPH').val())+','+$.trim($('.bloodPL').val())+','+$('.bloodPLPX').val());
    var isData=getFormJson($('#JgetJson'));
    if($('#gaugeTime').val()!=''){
        isData.gaugeTime=isData.gaugeTime+' 00:00:00';
    }else{
        delete isData.gaugeTime;
    }
    if(ifEdit){ //如果编辑
        $.ajax({
            type: "POST",
            url: "/my/healthRecord/update?",
            dataType: "json",
            data: isData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('token', loginData.accessToken);
                $('<img src="../../img/loading.gif" class="loading"/>').appendTo('.last');
            }
        }).done(function (a) {
            $('.loading').remove();
            if(0 === a.state){
                $('.popup').css('display','block');
                $('.popup .close').on('click',function(){
                    $('.popup').css('display','none');
                });
                setTimeout(function(){
                    window.location='Myfile.html';
                },1500);
            }else{
                console.log(a.msg);
            }
        }).fail(function (a) {
            console.log(a.msg);
        })
    }else{     //如果新建
        $.ajax({
            type: "POST",
            url: "/my/healthRecord/save?",
            dataType: "json",
            data: isData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('token', loginData.accessToken);
                $('<img src="../../img/loading.gif" class="loading"/>').appendTo('.last');
            }
        }).done(function (a) {
            $('.loading').remove();
            if(0 === a.state){
                $('.popup').css('display','block');
                $('.popup .close').on('click',function(){
                    $('.popup').css('display','none');
                });
                setTimeout(function(){
                    window.location='Myfile.html';
                },1500);
            }else{
                console.log(a.msg);
            }
        }).fail(function (a) {
            console.log(a.msg);
        })
    }

})
function getFormJson(formObj) {
    var a = formObj.serializeArray();
    var o = {};
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
function jselect(This,isId){
    This.parent().parent().find('ul').hide();
    This.siblings('ul').show();
    This.siblings('ul').find('li').on('click',function(){
        var text = $(this).text();
        var ival = $(this).attr('id');
        This.val(text);
        This.siblings("#"+isId+"_").val(ival);
        This.siblings('ul').hide();
    })
}
//加载数据字典
function loadCode(isCode,This){
    $.ajax({
        type: "POST",
        url: "/my/dictItem/queryListByDictcode?dictCode="+isCode,
        dataType: "json",
    }).done(function (a) {
        if(0 === a.state){
            if(This.hasClass('listSel')){ //如果是下拉
                var text = ''
                if(isCode=="blood_pressure_unit"){  //如果是血压单位
                    for (var i = 0; i < a.data.result.length; i++) {
                        text += "<li id='"+a.data.result[i].id+"'>"+a.data.result[i].itemCode+"</li>";
                    }
                    $("#"+isCode).html(text);
                    $('.bloodPLPX').val('mmHg');
                    //血压返显赋值
                    if( iFormdata!=null && iFormdata.bloodPressure!=undefined && iFormdata.bloodPressure!='' && iFormdata.bloodPressure!=null ){
                        $('.bloodPH').val(iFormdata.bloodPressure.split(',')[0]);
                        $('.bloodPL').val(iFormdata.bloodPressure.split(',')[1]);
                        $('.bloodPLPX').val(iFormdata.bloodPressure.split(',')[2]);
                    }
                }else{
                    for (var i = 0; i < a.data.result.length; i++) {
                        text += "<li id='"+a.data.result[i].id+"'>"+a.data.result[i].itemName+"</li>";
                    }
                    $("#"+isCode).html("<li id=''>请选择</li>"+text);
                    //找到isCode要赋值的input
                    var iele=$("#"+isCode).siblings('input[ititle="Upform"]').attr('id');
                    $('#'+iele).val('请选择');
                    if(iFormdata!=null && iFormdata[iele]!=undefined && iFormdata[iele]!='' && iFormdata[iele]!=null ){
                        var iText= $("#"+isCode).find('li[id="'+iFormdata[iele]+'"]').text();
                        $('#'+iele).val(iText);
                        $('#'+iele+'_').val(iFormdata[iele]);
                    }
                }
            }else{  //如果是label
                var text = ''
                for (var i = 0; i < a.data.result.length; i++) {
                    var _icon='';
                    if(a.data.result[i].itemName=='暂无'){
                        _icon = "notAva";
                    }else{
                        _icon = "";
                    }
                    text += "<label><input class='"+_icon+"' id='"+a.data.result[i].id+"' type='checkbox' value='"+a.data.result[i].id+"' />"+a.data.result[i].itemName+"</label>";
                }
                $("#"+isCode).html(text);
                var iele=$("#"+isCode).siblings('input[ititle="Upform"]').attr('id');
                if( iFormdata!=null && iFormdata[iele]!=undefined && iFormdata[iele]!='' && iFormdata[iele]!=null ){
                    if(iFormdata[iele].indexOf('*')==-1){ //如果不存在，只是checkoutbox赋值
                        var iVal= iFormdata[iele].split(',');
                        for(var j=0;j<iVal.length;j++){ //循环所有的值
                            for(var i=0; i<$("#"+isCode).find('input[type="checkbox"]').length; i++)
                            {
                                if(iVal[j] ==$("#"+isCode).find('input[type="checkbox"]').eq(i).attr('id'))
                                {
                                    $("#"+isCode).find('input[type="checkbox"]').eq(i).prop('checked',true);
                                    break;
                                }
                            }
                        }
                    }else{ //存在
                        var iFdata= iFormdata[iele].split('*');
                        var iArry=iFdata[0];
                        $("#"+isCode).siblings('.other').val(iFdata[1]);
                        var iVal= iArry.split(',');
                        for(var j=0;j<iVal.length;j++){ //循环所有的值
                            for(var i=0; i<$("#"+isCode).find('input[type="checkbox"]').length; i++)
                            {
                                if(iVal[j] ==$("#"+isCode).find('input[type="checkbox"]').eq(i).attr('id'))
                                {
                                    $("#"+isCode).find('input[type="checkbox"]').eq(i).prop('checked',true);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }else{
            console.log(a.msg);
        }
    }).fail(function (a) {
        console.log(a.msg);
    })
}
var Height=$('.applicationDetails-r').outerHeight();
$('.applicationDetails-l').css('height',Height);
//listCity 加载省和城市
$.ajax({
    type: "POST",
    url: "/my/region/queryProvince",
    dataType: "json",
}).done(function (a) {
    if(0 === a.state){
        var text = ''
        for (var i = 0; i < a.data.length; i++) {
            text += "<li id='"+a.data[i].id+"'>"+a.data[i].regionName+"</li>";
        }
        $("#listCity").html(text);
        if( iFormdata!=null && iFormdata.cityId!=undefined && iFormdata.cityId!='' && iFormdata.cityId!=null ){
            var iText= $("#listCity").find('li[id="'+iFormdata.cityId+'"]').text();
            $('#cityId').val(iText);
            $('#cityId_').val(iFormdata.cityId);
        }
        $("#listCity").find('li').on('click',function(){
            var ival = $(this).attr('id');
            isBtn=true;
            loadCity(ival);
        })
    }else{
        console.log(a.msg);
    }
})
//listCity 加载省和城市
function loadCity(ival){
    $.ajax({
        type: "POST",
        url: "/my/region/queryCity?provinceId="+ival,
        dataType: "json",
    }).done(function (a) {
        if(0 === a.state){
            var text = ''
            for (var i = 0; i < a.data.length; i++) {
                text += "<li id='"+a.data[i].id+"'>"+a.data[i].regionName+"</li>";
            }
            $("#listProvince").html(text);
            //城市单独赋值
            $('#areaId').val('请选择');
            if(!isBtn){
                if(iFormdata!=null && iFormdata.areaId!=undefined && iFormdata.areaId!='' && iFormdata.areaId!=null  ){
                    var iText= $("#listProvince").find('li[id="'+iFormdata.areaId+'"]').text();
                    $('#areaId').val(iText);
                    $('#areaId_').val(iFormdata.areaId);
                }else{
                    $('#areaId').val('请选择');
                }
            }

        }else{
            console.log(a.msg);
        }
    })
}
$(document).on('click',function(){
    $('.Jselect').siblings('ul').hide();
})
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
/*$('.personal-nav div').on('click',function(){
    window.location='index-1.html?cont='+(Number($(this).index())+1);
})*/
$('#JhelthEdit .cancel').on('click',function(){
    window.location='Myfile.html';
})