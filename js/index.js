/**
 * Created by wanglinfei on 2017/2/7.
 */
//医生信息列表展示
var pageSize=4;
$.ajax({
    type:"post",
    url:"/my/doctor/allDoctor",
    data:{
        "pageNum":1,
        "pageSize":pageSize
    },
    beforeSend:function(){
        $('<img src="../img/loading.gif" class="loading"/>').appendTo('#doctor');
    },
    success:function(data){
        console.log(data);
        $('.loading').remove();
        var DataList=data.data.result;
        if(DataList.length==0){
            $('.doctorInfo').css('display','none');
        }
        if(DataList.length<4){
            $('.more-1').css('display','none');
        }
        for(var i=0; i<DataList.length;i++){
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
                '<div class="line"></div>'+
                '<div class="serveList clearfix">'+
                '<span class="span1" data_docID="'+DataList[i].doctor.id+'"></span>'+
                '<span class="span2" data_docID="'+DataList[i].doctor.id+'"></span>'+
                '<span class="span3" data_docID="'+DataList[i].doctor.id+'"></span>'+
                '</div>'+
                '</a>'+
                '</li>').appendTo('#docList');
            if(DataList[i].doctor.isExpert){
                $('#docList li:eq('+i+') .imgWa b').addClass('block');
            }
            if(!DataList[i].doctor.isBespoke){
                $('#docList li:eq('+i+') .serveList span:eq(0)').addClass('noServer');
            }
            if(!DataList[i].doctor.isSupporVideotexConsult){
                $('#docList li:eq('+i+') .serveList span:eq(1)').addClass('noServer');
            }
            if(!DataList[i].doctor.isSupporTelConsult){
                $('#docList li:eq('+i+') .serveList span:eq(2)').addClass('noServer');
            }
        }
        function docDetails(){
            var docId=$(this).attr('data_docID');
            window.location="/dist/webPage/docDetails.html?navActive=1&doctorId="+encodeURI(docId);
        }
        $('.docList').on('click','li',docDetails);
        $('.docList li span').on('click',function(event){
            var event = event || window.event;
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            if ($(this).hasClass('noServer')) {
                return;
            }else{
                var n=$(this).index();
                if(n==0){
                    var docId=$(this).attr('data_docID');
                    window.location="/dist/webPage/docDetails.html?navActive=1&doctorId="+encodeURI(docId);
                }else if(n==1){
                    $('.docList').off('click','li',docDetails);
                    if(loginData){
                        if(perfect){
                            perfectShow();
                        }else{
                            var docId=$(this).attr('data_docID');
                            window.location="/dist/webPage/Detail-graphic.html?navActive=1&doctorId="+encodeURI(docId);
                        }
                    }else{
                        localStorage.setItem("url",window.location.href);
                        window.location="/dist/webPage/login.html";
                    }
                }else if(n==2){
                    $('.docList').off('click','li',docDetails);
                    if(loginData){
                        if(perfect){
                            perfectShow();
                        }else{
                            var docId=$(this).attr('data_docID');
                            window.location="/dist/webPage/Detail-phone.html?navActive=1&doctorId="+encodeURI(docId);
                        }
                    }else{
                        localStorage.setItem("url",window.location.href);
                        window.location="/dist/webPage/login.html";
                    }
                }
            }
        });
    }
});
//弹窗弹出
//弹出关闭
$('.perfect .close').on('click',function(){
    $('.perfect').css('display','none');
});
//页面跳转
$('.case1 li:eq(0)').on('click',function(){
    window.location="/dist/cjjb/mnab.html?navActive=4";
});
$('.case1 li:eq(1)').on('click',function(){
    window.location="/dist/cjjb/lxzfxwzxxy_1.html?navActive=4";
});
$('.case1 li:eq(2)').on('click',function(){
    window.location="/dist/cjjb/pttxy_1.html?navActive=4";
});
/*兼容ie8样式*/
var nav=navigator.userAgent;
if(nav.indexOf('MSIE 8.0')!=-1){
    $('.case1 li').css('marginRight','0px');
}
