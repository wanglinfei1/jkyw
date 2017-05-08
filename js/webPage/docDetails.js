/**
 * Created by wanglinfei on 2017/2/7.
 */
function GetQueryString(name){
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*但会参数值*/
    if(r!=null)return  decodeURI(r[2]); return null;
}
var doctorID=GetQueryString("doctorId");
$(function(){
    $.ajax({
        type:"post",
        url:"/my/doctor/findDoctor/"+doctorID,
        success:function(data){
            /*console.log(data)*/
            var skilled=data.data.doctor.skilled;
            var skilled2;
            if(skilled.length>60){
                skilled2=skilled.substr(0,60)+'……';
            }else{
                skilled2=skilled;
            }
            var introd=data.data.doctor.introduction;
            var introd2;
            if(introd.length>60){
                introd2=introd.substr(0,60)+'……';
            }else{
                introd2=introd;
            }
            var docTitle = data.data.doctor.title == 1 ? "主任医师" : data.data.doctor.title == 2 ? "副主任医师" : data.data.doctor.title == 3 ? "主治医师" : "普通医师";
            if (data.data.doctor.headimg == null || data.data.doctor.headimg == '') {
                data.data.doctor.headimg = '/img/docImg.jpg'
            }

            $('.detail .info .docImage').html('<img src="'+data.data.doctor.headimg+'" />');
            $('.detail .info .info-r').html('<h2>'+data.data.doctor.name+'  <i>'+docTitle+'</i></h2>'+
                '<p class="p1"><a href="HospitalIntroduced.html?navActive=1&hospitalId='+data.data.depart.hospitalId+'&doctorId='+data.data.doctor.id+'" target="_blank">'+data.data.hospital.name+'--'+data.data.depart.deptName+'</a></p>'+
                '<p class="p2 p"><a href="javaScript:;"><b>擅长：</b>'+skilled2+' </a><i class="block zhankai">详情</i><i class="none shouqi">收起</i></p>'+
                '<p class="p3 p"><a href="javaScript:;"><b>简介：</b>'+introd2+'</a><i class="block zhankai">详情</i><i class="none shouqi">收起</i></p>');
            if(skilled.length>38){
                $('.p2 i.zhankai').css('display','block');
            }
            $('.p2 i.zhankai').on('click',function(){
                $('.p2 a').html('<b>擅长：</b>'+skilled);
                $(this).css('display','none');
                $('.p2 i.shouqi').css('display','block');
            });
            $('.p2 i.shouqi').on('click',function(){
                $('.p2 a').html('<b>擅长：</b>'+skilled2);
                $(this).css('display','none');
                $('.p2 i.zhankai').css('display','block');
            });
            if(introd.length>38){
                $('.p3 i.zhankai').css('display','block');
            }
            $('.p3 i.zhankai').on('click',function(){
                $('.p3 a').html('<b>简介：</b>'+introd);
                $(this).css('display','none');
                $('.p3 i.shouqi').css('display','block');
            });
            $('.p3 i.shouqi').on('click',function(){
                $('.p3 a').html('<b>简介：</b>'+introd2);
                $(this).css('display','none');
                $('.p3 i.zhankai').css('display','block');
            });
            if(data.data.doctor.isExpert){
                $('.detail .imgWa b').addClass('block');
                $('.scheduling-show').attr('data_zj','1');
            }else{
                $('.scheduling-show').attr('data_zj','0');
            }
            if(!data.data.doctor.isBespoke){
                $('.detail .serve div:eq(0)').addClass('noServer');
            }
            if(!data.data.doctor.isSupporVideotexConsult){
                $('.detail .serve div:eq(1)').addClass('noServer');
            }
            if(!data.data.doctor.isSupporTelConsult){
                $('.detail .serve div:eq(2)').addClass('noServer');
            }
            $('.count div:eq(0) i').html(data.data.hospital.name);
            $('.count div:eq(1) i').html(data.data.depart.deptName);
            $('.sameTop h2').attr('data_sameId',data.data.depart.id);
            getScheduldetail();
            getSameDoc(data.data.depart.id);
        }
    })
});
function getScheduldetail(){
    //页面跳转
    $('.detail .serve div').on('click',function(){
        if(!$(this).hasClass('noServer')){
            var n=$(this).index();
            if(n==0){

            }else if(n==1){
                if(loginData){
                    if(perfect){
                        perfectShow();
                    }else{
                        window.location="Detail-graphic.html?navActive=1&doctorId="+encodeURI(doctorID);
                    }
                }else{
                    localStorage.setItem("url",window.location.href);
                    window.location="login.html";
                }
            }else if(n==2){
                if(loginData){
                    if(perfect){
                        perfectShow();
                    }else{
                        window.location="Detail-phone.html?navActive=1&doctorId="+encodeURI(doctorID);
                    }
                }else{
                    localStorage.setItem("url",window.location.href);
                    window.location="login.html";
                }
            }
        }
    });
    //获取未来七天日期
    function toDub(n){
        return n<10?'0'+n:''+n;
    }
    var weekArr=['日','一','二','三','四','五','六'];
    var date1 = new Date();
    var timesArr=[];
    for(var i=1; i<8;i++){
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+i);
        var times = toDub((date2.getMonth()+1))+"-"+toDub(date2.getDate());
        timesArr.push(times);
        var wek=date2.getDay();
        $('<li class="floatL"><i>'+times+'</i><i>周'+weekArr[wek]+'</i></li>').appendTo('.scheduling-r .top');
    }
    //获取排期
    var doctorID=GetQueryString("doctorId");
    var day=7;
    $.ajax({
        type: "get",
        url: "/my/doctorScheduldetail/queryRecent/" + doctorID+'/'+day,
        success: function (data) {
            /*console.log(data);*/
            var schedule={};
            var baioqian=['<span class="ordinary cursor">普通门诊</span>','<span class="expert cursor">专家门诊</span>','<span class="special cursor">特需门诊</span>','<span class="full cursor">已约满 </span>','<span class="full cursor">已停诊 </span>'];
            var j=0;
            for(var i=0; i<data.data.length; i++){
                var newTime=toDub(new Date(data.data[i].scheduleDate).getMonth()+1)+'-'+toDub(new Date(data.data[i].scheduleDate).getDate());
                schedule[newTime]=data.data[i];
            }
            /*console.log(schedule);*/

            for(var i=0; i<timesArr.length; i++){
                if(schedule[timesArr[i]]){
                    var span=baioqian[schedule[timesArr[i]].sourceType];
                    var oStop=schedule[timesArr[i]].stop||'';
                    /*上午排期是否停诊*/
                    if(oStop.indexOf(0)==-1){
                        if(schedule[timesArr[i]].am){
                            $('.scheduling-show ul:eq('+i+') li:eq(0)').html(span).attr('data_id',schedule[timesArr[i]].id);
                        }else if(schedule[timesArr[i]].am==0){
                            $('.scheduling-show ul:eq('+i+') li:eq(0)').html(baioqian[3]);
                        }
                    }else if((oStop.indexOf(0)!=-1)&&(schedule[timesArr[i]].am!=null)){
                        $('.scheduling-show ul:eq('+i+') li:eq(0)').html(baioqian[4]);
                    }
                    /*下午排期是否停诊*/
                    if(oStop.indexOf(1)==-1){
                        if(schedule[timesArr[i]].pm){
                            $('.scheduling-show ul:eq('+i+') li:eq(1)').html(span).attr('data_id',schedule[timesArr[i]].id);
                        }else if(schedule[timesArr[i]].pm==0){
                            $('.scheduling-show ul:eq('+i+') li:eq(1)').html(baioqian[3]);
                        }
                    }else if((oStop.indexOf(1)!=-1)&&(schedule[timesArr[i]].pm!=null)){
                        $('.scheduling-show ul:eq('+i+') li:eq(1)').html(baioqian[4]);
                    }
                    /*晚上排期是否停诊*/
                    if(oStop.indexOf(2)==-1){
                        if(schedule[timesArr[i]].night){
                            $('.scheduling-show ul:eq('+i+') li:eq(2)').html(span).attr('data_id',schedule[timesArr[i]].id);
                        }else if(schedule[timesArr[i]].night==0){
                            $('.scheduling-show ul:eq('+i+') li:eq(2)').html(baioqian[3]);
                        }
                    }else if((oStop.indexOf(2)!=-1)&&(schedule[timesArr[i]].night!=null)){
                        $('.scheduling-show ul:eq('+i+') li:eq(2)').html(baioqian[4]);
                    }
                }else{

                }
            }
            //鼠标滑过
            $('.scheduling-show ul span').on('mouseover',function(){
                $('.scheduling-show ul span').removeClass('active');
                $(this).addClass('active');
            }).on('mouseout',function(){
                $('.scheduling-show ul span').removeClass('active');
            });
        }
    });
}
//点击排期页面跳转
setTimeout(function(){
    $('.scheduling-show ul').on('click','span',function(){
        var Id=$(this).parent().attr('data_id');
        var n=$(this).parent().index();
        if(loginData){
            if(perfect){
                perfectShow();
            }else{
                if($(this).hasClass('full')){
                    return;
                }
                window.location="confirmTheOrder.html?navActive=1&Id="+encodeURI(Id)+'&&doctorId='+encodeURI(doctorID)+'&&time='+n;
            }
        }else{
            localStorage.setItem("url",window.location.href);
            window.location="login.html";
        }
    });
},10);
//同科室医生信息获取
function getSameDoc(deptId){
    $('.same .more').on('click',function(){
        window.location="sameDocVisits.html?navActive=1&deptId="+encodeURI(deptId);
    });
    var pageSize=5;
    $.ajax({
        type:"post",
        url:"/my/doctor/findDoctorList/"+deptId,
        data:{
            "pageNum":1,
            "pageSize":pageSize
        },
        beforeSend:function(){
            $('<img src="../../img/loading.gif" class="loading"/>').appendTo('#sameList');
        },
        success:function(data){
            $('.loading').remove();
            var DataList=data.data.result;
            /*console.log(DataList);*/
            var listNum;
            if(DataList.filter){
                DataList=DataList.filter(function(item){
                    return item.doctor.id!=doctorID
                });
            }else{
                for(var i=0; i<DataList.length;i++){
                    if(DataList[i].doctor.id==doctorID){
                        DataList.splice(i,1);
                    }
                }
            }
            /*console.log(DataList);*/
            if(DataList.length<4){
                $('.sameTop .more').css('display','none');
                listNum=DataList.length;
            }else{
                listNum=3;
            }
            for(var i=0; i<listNum;i++){
                var docTitle = DataList[i].doctor.title == 1 ? "主任医师" : DataList[i].doctor.title == 2 ? "副主任医师" : DataList[i].doctor.title == 3 ? "主治医师" : "普通医师";
                if (DataList[i].doctor.headimg == null || DataList[i].doctor.headimg == '') {
                    DataList[i].doctor.headimg = '/img/docImg.jpg'
                }
                $('<li data_docID="'+DataList[i].doctor.id+'">'+
                    '<a href="javaScript:;">'+
                    '<div class="imgWa">'+
                    '<div class="docImage">'+
                    '<img src="'+DataList[i].doctor.headimg+'" />'+
                    '</div>'+
                    '<b></b>'+
                    '</div>'+
                    '<h2>'+DataList[i].doctor.name+'<b> '+docTitle+'</b></h2>'+
                    '<h3>'+DataList[i].hospital.name+'--'+DataList[i].depart.deptName+'</h3>'+
                    '<h4 style="display:none">已有<b>0人</b>咨询</h4>'+
                    '<div class="line"></div>'+
                    '<p>擅长：'+DataList[i].doctor.skilled+'</p>'+
                    '<div class="line2"></div>'+
                    '<div class="serveList clearfix">'+
                    '<span class="span1" data_docID="'+DataList[i].doctor.id+'"></span>'+
                    '<span class="span2" data_docID="'+DataList[i].doctor.id+'"></span>'+
                    '<span class="span3" data_docID="'+DataList[i].doctor.id+'"></span>'+
                    '</div>'+
                    '</a>'+
                    '</li>').appendTo('.same .sameList ul');
                if(DataList[i].doctor.isExpert){
                    $('.same ul li:eq('+i+') .imgWa b').css('display','block');
                }
                if(!DataList[i].doctor.isBespoke){
                    $('.same ul li:eq('+i+') .serveList span:eq(0)').addClass('noServer');
                }
                if(!DataList[i].doctor.isSupporVideotexConsult){
                    $('.same ul li:eq('+i+') .serveList span:eq(1)').addClass('noServer');
                }
                if(!DataList[i].doctor.isSupporTelConsult){
                    $('.same ul li:eq('+i+') .serveList span:eq(2)').addClass('noServer');
                }
            }
            function docDetails(){
                var docId=$(this).attr('data_docID');
                window.location="docDetails.html?navActive=1&doctorId="+encodeURI(docId);
            }
            $('.same .sameList ul').on('click','li',docDetails);
            $('.same .sameList ul li span').on('click',function(event){
                var event = event || window.event;
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else {
                    event.cancelBubble = true;
                }
                if(!$(this).hasClass('noServer')){
                    var n=$(this).index();
                    var docId=$(this).attr('data_docID');
                    if(n==0){
                        window.location="docDetails.html?navActive=1&doctorId="+encodeURI(docId);
                    }else if(n==1){
                        $('.same .sameList ul').off('click','li',docDetails);
                        if(loginData){
                            if(perfect){
                                perfectShow();
                            }else{
                                window.location="Detail-graphic.html?navActive=1&doctorId="+encodeURI(docId);
                            }
                        }else{
                            localStorage.setItem("url",window.location.href);
                            window.location="login.html";
                        }

                    }else if(n==2){
                        $('.same .sameList ul').off('click','li',docDetails);
                        if(loginData){
                            if(perfect){
                                perfectShow();
                            }else{
                                window.location="Detail-phone.html?navActive=1&doctorId="+encodeURI(docId);
                            }
                        }else{
                            localStorage.setItem("url",window.location.href);
                            window.location="login.html";
                        }
                    }
                }
            });
        }
    });
}