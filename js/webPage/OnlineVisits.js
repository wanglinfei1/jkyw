/**
 * Created by 11922 on 2016/12/30.
 */
//医生信息列表展示
var pageSize=4;
//获取图文咨询列表
$.ajax({
    type:"post",
    url:"/my/doctor/allDoctor",
    data:{
        "pageNum":1,
        "pageSize":pageSize,
        isSupportVideoTex:1
    },
    beforeSend:function(){
        $('<img src="../../img/loading.gif" class="loading"/>').appendTo('#grapList');
    },
    success:function(data){
        $('.loading').remove();
        var DataList=data.data.result;
        if(DataList.length==0){
            $('#grap .doctor').css('display','none');
        }
        if(DataList.length<4){
            $('#grap .more-1').css('display','none');
        }
        for(var i=0; i<DataList.length;i++){
            if (DataList[i].doctor.headimg == null || DataList[i].doctor.headimg == '') {
                DataList[i].doctor.headimg = '/img/docImg.jpg'
            }
            var docTitle = DataList[i].doctor.title == 1 ? "主任医师" : DataList[i].doctor.title == 2 ? "副主任医师" : DataList[i].doctor.title == 3 ? "主治医师" : "普通医师";


            $('<li data_docID="'+DataList[i].doctor.id+'">'+
                '<a href="javaScript:;">'+
                '<div class="imgWa">'+
                '<div class="docImage">'+
                '<img src="'+DataList[i].doctor.headimg+'" />'+
                '</div>'+
                '<b></b>'+
                '</div>'+
                '<h2>'+DataList[i].doctor.name+'<b> '+docTitle+'</b></h2>'+
                '<h3>' + DataList[i].hospital.name + '一' + DataList[i].depart.deptName + '</h3>' +
                '<h4 style="display:none">已有<b>0人</b>咨询</h4>'+
                '<div class="line"></div>'+
                '<p>擅长：'+DataList[i].doctor.skilled+'</p>'+
                '<div class="line1"></div>'+
                '<div class="serveList clearfix" data_docID="'+DataList[i].doctor.id+'">'+
                '<span class="span1" ></span>'+
                '<span class="span2"></span>'+
                '<span class="span3"></span>'+
                '</div>'+
                '</a>'+
                '</li>').appendTo('#grap .docList');
            if(DataList[i].doctor.isExpert){
                $('#grap .docList li:eq('+i+') .imgWa b').addClass('block');
            }
            if(!DataList[i].doctor.isBespoke){
                $('#grap .docList li:eq('+i+') .serveList span:eq(0)').addClass('noServer');
            }
            if(!DataList[i].doctor.isSupporVideotexConsult){
                $('#grap .docList li:eq('+i+') .serveList span:eq(1)').addClass('noServer');
            }
            if(!DataList[i].doctor.isSupporTelConsult){
                $('#grap .docList li:eq('+i+') .serveList span:eq(2)').addClass('noServer');
            }
        }
        function docDetails() {
            var docId = $(this).attr('data_docID');
            window.location = "docDetails.html?navActive=1&doctorId=" + encodeURI(docId);
        }
        $('.docList').on('click','li', docDetails);
        $('.docList li span').on('click', function (event) {
            var event = event || window.event;
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }

            if ($(this).hasClass('noServer')) {
                return;

            }else{
                var n = $(this).index();
                var docId = $(this).parent().attr('data_docID');
                if (n == 0) {
                    window.location = "docDetails.html?navActive=1&doctorId=" + encodeURI(docId);
                } else if (n == 1) {
                    $('.docList li').off('click', docDetails);
                    if (loginData) {
                        if (perfect) {
                            perfectShow();
                        } else {
                            window.location = "Detail-graphic.html?navActive=1&doctorId=" + encodeURI(docId);
                        }
                    } else {
                        localStorage.setItem("url",window.location.href);
                        window.location = "login.html";
                    }
                } else if (n == 2) {
                    $('.docList li').off('click', docDetails);
                    if (loginData) {
                        if (perfect) {
                            perfectShow();
                        } else {
                            window.location = "Detail-phone.html?navActive=1&doctorId=" + encodeURI(docId);
                        }
                    } else {
                        localStorage.setItem("url",window.location.href);
                        window.location = "login.html";
                    }
                }
            }
        });
    }
});
//获取电话咨询列表
$.ajax({
    type:"post",
    url:"/my/doctor/allDoctor",
    data:{
        "pageNum":1,
        "pageSize":pageSize,
        isSupportTel:1
    },
    beforeSend:function(){
        $('<img src="../../img/loading.gif" class="loading"/>').appendTo('#callLait');
    },
    success:function(data){
        $('.loading').remove();
        var DataList=data.data.result;
        if(DataList.length==0){
            $('#call .doctor').css('display','none');
        }
        if(DataList.length<4){
            $('#call .more-1').css('display','none');
        }
        for(var i=0; i<DataList.length;i++){
            if (DataList[i].doctor.headimg == null || DataList[i].doctor.headimg == '') {
                DataList[i].doctor.headimg = '/img/docImg.jpg'
            }
            var docTitle = DataList[i].doctor.title == 1 ? "主任医师" : DataList[i].doctor.title == 2 ? "副主任医师" : DataList[i].doctor.title == 3 ? "主治医师" : "普通医师";


            $('<li data_docID="'+DataList[i].doctor.id+'">'+
                '<a href="javaScript:;">'+
                '<div class="imgWa">'+
                '<div class="docImage">'+
                '<img src="'+DataList[i].doctor.headimg+'" />'+
                '</div>'+
                '<b></b>'+
                '</div>'+
                '<h2>'+DataList[i].doctor.name+'<b> '+docTitle+'</b></h2>'+
                '<h3>' + DataList[i].hospital.name + '一' + DataList[i].depart.deptName + '</h3>' +
                '<h4 style="display:none">已有<b>0人</b>咨询</h4>'+
                '<div class="line"></div>'+
                '<p>擅长：'+DataList[i].doctor.skilled+'</p>'+
                '<div class="line1"></div>'+
                '<div class="serveList clearfix" data_docID="'+DataList[i].doctor.id+'">'+
                '<span class="span1" data_docID="' + DataList[i].doctor.id + '"></span>' +
                '<span class="span2"></span>'+
                '<span class="span3"></span>'+
                '</div>'+
                '</a>'+
                '</li>').appendTo('#call .docList');
            if(DataList[i].doctor.isExpert){
                $('#call .docList li:eq('+i+') .imgWa b').addClass('block');
            }
            if(!DataList[i].doctor.isBespoke){
                $('#call .docList li:eq('+i+') .serveList span:eq(0)').addClass('noServer');
            }
            if(!DataList[i].doctor.isSupporVideotexConsult){
                $('#call .docList li:eq('+i+') .serveList span:eq(1)').addClass('noServer');
            }
            if(!DataList[i].doctor.isSupporTelConsult){
                $('#grap .docList li:eq('+i+') .serveList span:eq(2)').addClass('noServer');
            }
        }
        function docDetails() {
            var docId = $(this).attr('data_docID');
            window.location = "docDetails.html?navActive=1&doctorId=" + encodeURI(docId);
        }
        $('.docList').on('click', 'li',docDetails);
        $('.docList li span').on('click', function (event) {
            var event = event || window.event;
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }

            if ($(this).hasClass('noServer')) {
                return;
            }else{
                var n = $(this).index();
                var docId = $(this).parent().attr('data_docID');
                if (n == 0) {
                    window.location = "docDetails.html?doctorId=" + encodeURI(docId);
                } else if (n == 1) {
                    $('.docList').off('click','li',docDetails);
                    if (loginData) {
                        if (perfect) {
                            perfectShow();
                        } else {
                            window.location = "Detail-graphic.html?navActive=1&doctorId=" + encodeURI(docId);
                        }
                    } else {
                        localStorage.setItem("url",window.location.href);
                        window.location = "login.html";
                    }
                } else if (n == 2) {
                    $('.docList').off('click','li',docDetails);
                    if (loginData) {
                        if (perfect) {
                            perfectShow();
                        } else {
                            window.location = "Detail-phone.html?navActive=1&doctorId=" + encodeURI(docId);
                        }
                    } else {
                        localStorage.setItem("url",window.location.href);
                        window.location = "login.html";
                    }
                }
            }
        });
    }
});