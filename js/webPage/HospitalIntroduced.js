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
            $('.Hospital-Con p').html(a.data.hospital.introduction)
        }
    })
    /*获取科室*/
    $.ajax({
        type: "post",
        url: "/my/department/findDepartIntroduction/" + hospitalID,
    }).done(function (a) {
        var text2='';
        if (a.state == 0) {
            for(var i in a.data){
                var text3='';
                if(a.data[i].child!=null && a.data[i].child!=undefined && a.data[i].child!=''){
                    for(var j in a.data[i].child){
                        text3+='<li class="float:left"><a href="DepartmentXq.html?navActive=1&departmentId='+a.data[i].child[j].id+'&doctorId='+doctorID+'&hospitalId='+hospitalID+'">'+a.data[i].child[j].deptName+'</a></li>'
                    }
                }
                text2+='<div class="Departmentcon1">'
                    +'<h3>'+a.data[i].parent.deptName+'</h3>'
                    +'<ul class="clearfix">'+text3+'</ul>'
                    +'</div>'
            }
            $('.Department-con').html(text2);
        }
    })
});