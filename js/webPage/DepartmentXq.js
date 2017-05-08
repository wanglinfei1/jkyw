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
    var hospitalID = GetQueryString("hospitalId");
    var doctorID=GetQueryString("doctorId");
    $('.HospitalCon li').find('a').eq(0).attr('href','HospitalIntroduced.html?navActive=1&hospitalId='+hospitalID+'&doctorId='+doctorID+'');
    $('.HospitalCon li').find('a').eq(1).attr('href','DepartmentIntroduced.html?navActive=1&hospitalId='+hospitalID+'&doctorId='+doctorID+'');
    /*获取医院介绍*/
    $.ajax({
        type: "post",
        url: "/my/hospital/findIntroduction/" + hospitalID,
    }).done(function (a) {
        /*console.log(a)*/;
        var text1 = '';
        if (a.state == 0) {
            if (a.data.hospital.imageUrl == null || a.data.hospital.imageUrl == '') {
                a.data.hospital.imageUrl = '../../img/yypic.png'
            }
            $('.docImage').html('<img src="' + a.data.hospital.imageUrl + '" />')
            switch (a.data.hospital.level) {
                case 1:
                    a.data.hospital.level="三级特等";
                    break;
                case 2:
                    a.data.hospital.level="三级甲等";
                    break;
                case 3:
                    a.data.hospital.level="三级乙等";
                    break;
                case 4:
                    a.data.hospital.level="三疾丙等";
                    break;
                case 5:
                    a.data.hospital.level="二级甲等";
                    break;
                case 6:
                    a.data.hospital.level="二级乙等";
                    break;
                case 7:
                    a.data.hospital.level="二级丙等";
                    break;
                case 8:
                    a.data.hospital.level="一级甲等";
                    break;
                case 9:
                    a.data.hospital.level="一级乙等";
                    break;
                case 10:
                    a.data.hospital.level="一级丙等";
                    break;
                case 11:
                    a.data.hospital.level="社区医院";
                    break;
            }

            text1 += ' <h2>' + a.data.hospital.name + '<i class="yydj"> ' + a.data.hospital.level + '</i></h2>\
            <p class="p1"><b>电话 : </b>' + a.data.hospital.tel +'</p>\
            <p class="p2"><b>网址 : </b>' + a.data.hospital.url + '</p>\
            <p class="p3"><b>地址 : </b>' + a.data.hospital.address + '</p>'
            $('.info-r').html(text1);
        }
    })
    /*获取科室详情*/
    $.ajax({
        type: "post",
        url: "/my/department/find/"+ GetQueryString("departmentId"),
    }).done(function (a) {
        if(a.state==0){
            $('.departementTilte').html(a.data.parentDepart.deptName+'>'+a.data.department.deptName);
            $('.departementCon').html(a.data.department.deptDesc);
            getSameDoc(GetQueryString("departmentId"));
        }
    })
//同科室医生信息获取
    function getSameDoc(deptId){
        $('.same .more').on('click',function(){
            window.location="sameDocVisits.html?deptId="+encodeURI(deptId);
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
                console.log(DataList);
                var listNum;
                /*DataList=DataList.filter(function(item){
                 return item.doctor.id!=doctorID
                 });*/
                if(DataList.length<5){
                    $('.sameTop .more').css('display','none');
                    listNum=DataList.length;
                }else{
                    listNum=4;
                }
                for(var i=0; i<listNum;i++){
                    var docTitle = DataList[i].doctor.title == 1 ? "主任医师" : DataList[i].doctor.title == 2 ? "副主任医师" : DataList[i].doctor.title == 3 ? "主治医师" : "普通医师";
                    if (DataList[i].doctor.headimg == null || DataList[i].doctor.headimg == '') {
                        DataList[i].doctor.headimg = './img/docImg.jpg'
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
                        '<span class="" data_docID="'+DataList[i].doctor.id+'"></span>'+
                        '<span class="" data_docID="'+DataList[i].doctor.id+'"></span>'+
                        '<span class="" data_docID="'+DataList[i].doctor.id+'"></span>'+
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
});