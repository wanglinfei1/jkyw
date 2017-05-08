/**
 * Created by wanglinfei on 2017/2/7.
 */
//医生信息列表展示
var page=1;
var pageSize=12;
//获取图文咨询列表
function getList(pageNum,size){
    $.ajax({
        type:"post",
        url:"/my/doctor/allDoctor",
        data:{
            "pageNum ":pageNum,
            "pageSize":size,
            isSupportTel:1
        },
        beforeSend:function(){
            $('<img src="../../img/loading.gif" class="loading"/>').appendTo('#callDoc');
        },
        success:function(data){
            $('.loading').remove();
            $('#callDoc .docList').html('');
            var DataList=data.data.result;
            $('.page').attr('data_page',data.data.pages);
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
                    '<h3>' + DataList[i].hospital.name + '一' + DataList[i].depart.deptName + '</h3>' +
                    '<h4 style="display:none">已有<b>0人</b>咨询</h4>'+
                    '<div class="line"></div>'+
                    '<p>擅长：'+DataList[i].doctor.skilled+'</p>'+
                    '<div class="line1"></div>'+
                    '<div class="serveList clearfix">'+
                    '<span class="" data_docID="' + DataList[i].doctor.id + '"></span>' +
                    '<span class="" data_docID="' + DataList[i].doctor.id + '"></span>' +
                    '<span class="" data_docID="' + DataList[i].doctor.id + '"></span>' +
                    '</div>'+
                    '</a>'+
                    '</li>').appendTo('#callDoc .docList');
                if(DataList[i].doctor.isExpert){
                    $('#callDoc .docList li:eq('+i+') .imgWa b').addClass('block');
                }
                if(!DataList[i].doctor.isBespoke){
                    $('#callDoc .docList li:eq('+i+') .serveList span:eq(0)').addClass('noServer');
                }
                if(!DataList[i].doctor.isSupporVideotexConsult){
                    $('#callDoc .docList li:eq('+i+') .serveList span:eq(1)').addClass('noServer');
                }
                if(!DataList[i].doctor.isSupporTelConsult){
                    $('#callDoc .docList li:eq('+i+') .serveList span:eq(2)').addClass('noServer');
                }
            }
            /*style();*/
            pages(data.data.pages);
            function docDetails() {
                var docId = $(this).attr('data_docID');
                window.location = "docDetails.html?navActive=1&doctorId=" + encodeURI(docId);
            }

            $('.docList').on('click','li',docDetails);
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
                    var docId = $(this).attr('data_docID');
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
}
getList(page,pageSize);
//分页
var iNum=0;
function pages(iN){
    $('.page1 div').html('');
    var pages=$('.page').attr('data_page');
    var IN=iN||pages;
    $('.total i').html(IN);
    for(var i=0; i<IN;i++){
        $('<a href="javaScript:;" class="floatL">'+(i+1)+'</a>').appendTo('.page1 div')
    }
    $('.page1 div a').eq(iNum).addClass('active');
    $('.page1 div a').on('click',function(){
        $('.page1 div a').removeClass('active');
        iNum=$(this).index();
        $('.page1 div a').eq(iNum).addClass('active');
        getList(iNum+1,pageSize);
    });
    $('.page1 .per').on('click',function(){
        iNum--;
        if(iNum<0){
            iNum=0;
            return;
        }
        getList(iNum+1,pageSize);
        $('.page1 div a').removeClass('active');
        $('.page1 div a').eq(iNum).addClass('active');
    });
    $('.page1 .nex').on('click',function(){
        iNum++;
        if(iNum>IN-1){
            iNum=IN-1;
            return;
        }
        getList(iNum+1,pageSize);
        $('.page1 div a').removeClass('active');
        $('.page1 div a').eq(iNum).addClass('active');
    });
    $('.num').on('click',function(){
        $(this).html('');
    });
    $('.go').on('click',function(){
        var i=$('.num').html();
        if(0<i&&i<IN+1){
            iNum=i-1;
            getList(iNum+1,pageSize);
            $('.page1 div a').removeClass('active');
            $('.page1 div a').eq(iNum).addClass('active');
        }
    });
}
function style(){
    var Height=Math.ceil($('#callDoc li').length/4)*$('#callDoc li').outerHeight()+Math.ceil($('#callDoc li').length/4)*30+'px';
    var Width=4*$('#callDoc li').outerWidth()+2+'px';
    $('#callDoc').css('height',Height);
    $('#callDoc ul').css('height',Height);
    //$('#callDoc ul').css('width',Width);
}