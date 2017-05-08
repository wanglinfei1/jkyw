/**
 * Created by wanglinfei on 2017/1/5.
 */
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
function newToke() {
    $.ajax({
        type: "post",
        url: "/my/refreshToken",
        data: {
            "refreshToken": loginData.refreshToken
        },
        success: function (data) {
            var newData = data.data;
            if (newData) {
                /*console.log(newData)*/
                newData.accessToken = data.data.token;
                localStorage.setItem("loginData", JSON.stringify(newData));
                window.location = "../../index.html";
            } else {
                localStorage.removeItem("loginData");
                localStorage.removeItem("loginPhone");
                localStorage.removeItem("selfInfor");
                localStorage.removeItem("url");
                localStorage.removeItem("userType");
            }

        },
        error: function (data) {
            /*console.log(data)*/;
        }
    });
}
//头部显示登陆者信息
var loginData = JSON.parse(localStorage.getItem("loginData"));
var userType = JSON.parse(localStorage.getItem("userType"));
var perfect = '';//没有完善信息，true；
var myselfInfor;
if (loginData && userType == 0) {
    //获取用户是否登陆
    $.ajax({
        type: "post",
        url: "/my/account/info",
        data: {
            "token": loginData.accessToken
        },
        success: function (data) {
            /*console.log(data)*/;
            if (data.state == 1003) {
                newToke();
            }
            if (data.state == 0) {
                $('.top .topR h5').html('退出');
                $('.Jlogin').html('我是医生');
                $('.top .topR h5').on('click', function () {
                    localStorage.removeItem("loginData");
                    localStorage.removeItem("loginPhone");
                    localStorage.removeItem("url");
                    localStorage.removeItem("userType");
                    localStorage.removeItem("selfInfor");
                    window.location = "../../index.html";
                })
            }
        },
        error: function (data) {

        }
    });
    //根据token获取个人信息
    $.ajax({
        type: "post",
        url: "/my/patient/queryByPc/",
        data: {
            "token": loginData.accessToken
        },
        success: function (data) {
            if (data.data) {
                myselfInfor = data.data;
                var name = myselfInfor.name || myselfInfor.mobile;
                $('.topWapper .top p i').html(name);
                $('#patient').html(name);
                // $('.ulList .span1').html(name);
                $('.personalCenter-in .name').html(myselfInfor.name);
                $('.personalCenter-in .phone').html(myselfInfor.mobile);
                $('.visit i').html(name);
                $('#mobile').html(myselfInfor.mobile);
                localStorage.setItem("selfInfor", JSON.stringify(myselfInfor));
            } else {

            }
        },
        error: function (data) {

        }
    });
    //获取用户信息是否完善
    $.ajax({
        type: "post",
        url: "/my/patient/isPatientInfo",
        data: {
            "token": loginData.accessToken
        },
        success: function (data) {
            if (data.msg == 'token已过期') {
                return;
            }
            if (data.msg == '患者信息不完善') {
                perfect = true;
            }
        },
        error: function (data) {
            /*console.log(data)*/;
        }
    });
}
//弹窗弹出
function perfectShow() {
    $('.perfect').css('display', 'block');
    $('.Jerror').hide();
    $('input').removeClass('red');
    $('input,textarea').not('input[type="button"]').val('');
    var ocWidth = $(window).width() + 'px';
    var ocHeight = $(window).height() + 'px';
    $('.perfect').css({width: ocWidth, height: ocHeight});
    //返现信息
    var myselfInfor = JSON.parse(localStorage.getItem("selfInfor"));
    $('.perfect form input').eq(2).val(localStorage.getItem("loginPhone"));
    if(myselfInfor){
        $('.perfect form input').eq(0).val(myselfInfor.name);
        var sex = myselfInfor.sex;
        if (sex == 2) {
            $('.perfect form input').eq(1).val('男');
        } else if (sex == 1) {
            $('.perfect form input').eq(1).val('女');
        }
        $('.perfect form input').eq(3).val(myselfInfor.idCard);
        var birthdate=myselfInfor.birthdate.split('/');
        var age=birthdate[2];
        var date=new Date;
        var year=date.getFullYear();
        age=year-age;
        $('.perfect form input').eq(4).val(age);
        $('.perfect form input').eq(5).val(myselfInfor.healthCard);
        $('.perfect form textarea').val(myselfInfor.address);
    }
}
$('.perfect .close').on('click', function () {
    $('.perfect').hide();
});
$('.popup-in .p').on('click', '.sex', function () {
    $('.gender').show();
});
$('.gender li').on('click', function () {
    $('.sex').val($(this).html());
    $('.gender').hide();
});
//弹出关闭
$('.perfect .close').on('click', function () {
    $('.perfect').css('display', 'none');
});


//进入精准预约

$('.wapper .navW .nav li:eq(3)').on('click',function(){
    setTimeout(function(){
        if(loginData){
            if(perfect){
                perfectShow();
            } else {
                window.location = "../../dist/webPage/accurateReservation.html?navActive=3";
            }
        } else {
            window.location = "../../dist/webPage/login.html";
        }
    },100);
});
//进入个人中心
$('.topWapper .topr2').on('click', function (event) {
    var loginData = JSON.parse(localStorage.getItem("loginData"));
    if (loginData) { //**********************************************************************//
        if (userType == 1) {
            window.location = "../../dist/personalCenter/docCenter.html";
        } else {
            if (perfect) {
                perfectShow();
            } else {
                window.location = "../../dist/personalCenter/index-1.html";
            }
        }

    } else {
        window.location = "../../dist/webPage/login.html";
    }
});

//完善信息
$(function () {
    $('.sex').click(function () {
        if ($('.gender').css('display') == 'none') {
            $('.gender').css('display', 'block');
        } else {
            $('.gender').css('display', 'none');
        }
    });
    $('.gender li').on('click', function () {
        $('.sex').val($(this).html());
        $('.gender').hide();
    });
    $('.perfect .save').on('click', function () {
        $('.perfect form input').removeClass('red');
        $('.tip').css('display', 'none');
        $('.chushen').css('display', 'none');
        var empty = false;
        var name = $('.perfect form input').eq(0).val();
        var sex = 0;
        if ($('.sex').val() != '') {
            sex = $('.perfect form input').eq(1).val() == '女' ? 1 : 2;
        }
        var phone = localStorage.getItem("loginPhone");
        var idCard = $('.perfect form input').eq(3).val();
        var birthdate = $('.perfect form input').eq(4).attr('timerstr');
        var healthCard = $('.perfect form input').eq(5).val();
        var address = $('.perfect form textarea').val();
        var Data = {
            "token": loginData.accessToken,
            "name": name,
            "sex": sex,
            "birthdate": birthdate,
            "mobile": phone,
            "idCard": idCard,
            "healthCard": healthCard,
            "address": address
        };
        if (!name) {
            $('.perfect form input').eq(0).addClass('red');
            empty = true;
        }
        if (!sex) {
            $('.perfect form input').eq(1).addClass('red');
            empty = true;
        }
        var bir = new RegExp(/^[\d]{4}[-][\d]{1,2}[-][\d]{1,2}$/).test(birthdate);
        if (!birthdate) {
            $('.perfect form input').eq(4).addClass('red');
            empty = true;
            $('.chushen').css('display', 'block')
        } else if (bir === false) {
            $('.perfect form input').eq(4).addClass('red');
            empty = true;
            $('.chushen').css('display', 'block')
        } else {
            var birArr = birthdate.split('-');
            if (birArr[0] > 1910 && birArr[0] < 2018 && birArr[1] > 0 && birArr[1] < 13 && birArr[2] > 0 && birArr[2] < 32) {
            } else {
                $('.perfect form input').eq(4).addClass('red');
                empty = true;
                $('.chushen').css('display', 'block')
            }
        }
        if (!idCard) {
            $('.perfect form input').eq(3).addClass('red');
            empty = true;

        } else {
//function checkidno(obj) {
                var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
                    21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
                    33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
                    42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
                    51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
                    63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
                };
                var checkCard = function(obj)
                {
                    //校验长度，类型
                    if(isCardNo(obj) === false)
                    {
                        return false;
                    }
                    //检查省份
                    if(checkProvince(obj) === false)
                    {
                        return false;
                    }
                    //校验生日
                    if(checkBirthday(obj) === false)
                    {
                        return false;
                    }
                    //检验位的检测
                    if(checkParity(obj) === false)
                    {
                        return false;
                    }
                    return true;
                };
//检查号码是否符合规范，包括长度，类型
                var isCardNo = function(obj)
                {
                    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
                    if(reg.test(obj) === false)
                    {
                        return false;
                    }
                    return true;
                };
//取身份证前两位,校验省份
                var checkProvince = function(obj)
                {
                    var province = obj.substr(0,2);
                    if(vcity[province] == undefined)
                    {
                        return false;
                    }
                    return true;
                };
//检查生日是否正确
                var checkBirthday = function(obj)
                {
                    var len = obj.length;
                    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
                    if(len == '15')
                    {
                        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                        var arr_data = obj.match(re_fifteen);
                        var year = arr_data[2];
                        var month = arr_data[3];
                        var day = arr_data[4];
                        var birthday = new Date('19'+year+'/'+month+'/'+day);
                        return verifyBirthday('19'+year,month,day,birthday);
                    }
                    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
                    if(len == '18')
                    {
                        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                        var arr_data = obj.match(re_eighteen);
                        var year = arr_data[2];
                        var month = arr_data[3];
                        var day = arr_data[4];
                        var birthday = new Date(year+'/'+month+'/'+day);
                        return verifyBirthday(year,month,day,birthday);
                    }
                    return false;
                };
//校验日期
                var verifyBirthday = function(year,month,day,birthday)
                {
                    var now = new Date();
                    var now_year = now.getFullYear();
                    //年月日是否合理
                    if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)
                    {
                        //判断年份的范围（3岁到100岁之间)
                        var time = now_year - year;
                        if(time >= 0 && time <= 130)
                        {
                            return true;
                        }
                        return false;
                    }
                    return false;
                };
//校验位的检测
                var checkParity = function(obj)
                {
                    //15位转18位
                    obj = changeFivteenToEighteen(obj);
                    var len = obj.length;
                    if(len == '18')
                    {
                        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                        var cardTemp = 0, i, valnum;
                        for(i = 0; i < 17; i ++)
                        {
                            cardTemp += obj.substr(i, 1) * arrInt[i];
                        }
                        valnum = arrCh[cardTemp % 11];
                        if (valnum == obj.substr(17, 1))
                        {
                            return true;
                        }
                        return false;
                    }
                    return false;
                };
//15位转18位身份证号
                var changeFivteenToEighteen = function(obj)
                {
                    if(obj.length == '15')
                    {
                        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                        var cardTemp = 0, i;
                        obj = obj.substr(0, 6) + '19' + obj.substr(6, obj.length - 6);
                        for(i = 0; i < 17; i ++)
                        {
                            cardTemp += obj.substr(i, 1) * arrInt[i];
                        }
                        obj += arrCh[cardTemp % 11];
                        return obj;
                    }
                    return obj;
                };
                /*身份证验证*/
                if(!checkCard(idCard)){
                    $('.perfect form input').eq(3).addClass('red');
                    $('.tip').css('display', 'block');
                    empty = true;
                }
            }
        if (empty) {
            return;
        } else {
            $.ajax({
                type: "post",
                url: "/my/patient/insertPatientInfo",
                data: Data,
                success: function (data) {
                    /*console.log(data)*/;
                    $('.perfect').css('display', 'none');
                    perfect = false;
                }
            });
        }
    });
});
$('.wapper .topR h5 a').on('click', function () {
    if ($(this).parent().hasClass('doc')) {
        localStorage.setItem("docUrl", window.location.href);
    } else {
        localStorage.setItem("url", window.location.href);
    }
});
var arrImage = [];
var arrImageurl = [];
function submitW() {
    var num;
    function showResponse(data) {
        data = JSON.parse(data);
        /*console.log(data)*/;
        num = $('.upPic .pic').children().length;
        if (num >= 9) {
            $('<div class="img floatL"><img src="' + data.smallUrl + '" data-imgul="'+data.url+'"/><i class="cur"></i></div>').insertBefore('#add');
            $('#add').hide();
            /*return false;*/
        } else {
            $('<div class="img floatL"><img src="' + data.smallUrl + '" data-imgul="'+data.url+'"/><i class="cur"></i></div>').insertBefore('#add');
        }
        arrImage.push(encodeURIComponent(data.smallUrl));
        arrImageurl.push(data.url);
        $('.img i').on('click', function () {
            var n = $(this).parent().index();
            $(this).parent().remove();
            arrImage.splice(n, 1);
            arrImageurl.splice(n, 1);
            $('#add').show();
        });
        /*点击出现大图*/
        bigPic();
    }
    var options = {
        type: 'post',
        beforeSubmit:function (formData) {
            /*console.log(formData);*/
            var aFile = formData[0].value;
            /*console.log(aFile);*/
            if (!aFile) {
                return;
            }
            var ImgType = ["gif", "jpeg", "jpg", "bmp", "png"];
            var imgSrc=aFile.name||aFile;
            if (!RegExp("\.(" + ImgType.join("|") + ")$", "i").test(imgSrc.toLowerCase())) {
                alert("选择文件错误,图片类型必须是" + ImgType.join("，") + "中的一种");
                return false;
            }
        },
        url: "/my/uploadImg?small=true",
        success: showResponse,
        dataType: 'text'
    };
    $('#uploadForm').ajaxSubmit(options);
    return false;
}
function imgUpload() {
    //上传图片
        /*if(!this.files){
            this.select();
            this.blur();
            aFile = document.selection.createRange();
            var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
            var src = document.selection.createRange().text;

            $("<div class='img floatL' style='"+sFilter+src+"\"'><img src='" + document.selection.createRange().text+"'/><i class='cur'></i></div>").insertBefore('#add');
            $('.img i').on('click',function(){
                $(this).parent().remove();
            });
        }else{
            aFile = this.files[0];
            if (!aFile) {
                return;
            }
            if (!RegExp("\.(" + ImgType.join("|") + ")$", "i").test(aFile.name.toLowerCase())) {
                alert("选择文件错误,图片类型必须是" + ImgType.join("，") + "中的一种");
                return false
            }
            var data = new FormData();
            data.append("file", aFile);
            var xhr = getXMLHttpRequest();
            xhr.open("post", '/my/uploadImg?small=true');
            xhr.send(data);
            var data = data;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var data = eval('(' + xhr.responseText + ')');
                    /!*console.log(data)*!/;
                    num = $('.upPic .pic').children().length;
                    if (num >= 9) {
                        $('<div class="img floatL"><img src="' + data.smallUrl + '" data-imgul="'+data.url+'"/><i class="cur"></i></div>').insertBefore('#add');
                        $('#add').hide();
                        /!*return false;*!/
                    } else {
                        $('<div class="img floatL"><img src="' + data.smallUrl + '" data-imgul="'+data.url+'"/><i class="cur"></i></div>').insertBefore('#add');
                    }
                    arrImage.push(encodeURIComponent(data.smallUrl));
                    arrImageurl.push(data.url);
                    $('.img i').on('click', function () {
                        var n = $(this).parent().index();
                        $(this).parent().remove();
                        arrImage.splice(n, 1);
                        arrImageurl.splice(n, 1);
                        $('#add').show();
                    });
                    /!*点击出现大图*!/
                    bigPic();
                }
            };
        }*/
        /*function getXMLHttpRequest() {
            var xmlHttpRequest;
            if (window.XMLHttpRequest) {
                xmlHttpRequest = new XMLHttpRequest();
                if (xmlHttpRequest.overrideMimeType) {
                    xmlHttpRequest.overrideMimeType("text/xml");
                }
            } else if (window.ActiveXObject) {
                var activexName = [ "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];
                for ( var i = 0; i < activexName.length; i++) {
                    try {
                        xmlHttpRequest = new ActiveXObject(activexName[i]);
                        if(xmlHttpRequest){
                            break;
                        }
                    } catch (e) {
                    }
                }
            }
            return xmlHttpRequest;
        }*/
}
$('.Jlogin').on('click', function () {
    if ($(this).html() == '我是患者') {
        window.location = "../../dist/webPage/login.html?count=0";
        localStorage.removeItem("docUrl");
        localStorage.removeItem("docUserType");
        localStorage.removeItem("docLoginData");
        localStorage.removeItem("docLoginPhone");
        localStorage.removeItem("docInfor");
    } else if ($(this).html() == '我是医生') {
        window.location = "../../dist/webPage/login.html?count=1";
        localStorage.removeItem("url");
        localStorage.removeItem("userType");
        localStorage.removeItem("loginData");
        localStorage.removeItem("loginPhone");
    }
    localStorage.removeItem("selfInfor");
});


/*wnn点击出现大图*/
function bigPic(){
    $('.img').off('click').on('click', 'img', function () {
        var n = $(this).parent().index();
        $('.fixImage').css('display','block').attr('src', $(this).attr('data-imgul'));
        var oDiv = document.createElement('div');
        $('body').append(oDiv);
        var width = $(window).width();
        var height = $(window).height();
        $(oDiv).css({
            'height': height,
            'width': width,
            'background': 'black',
            'opacity': 0.5,
            'position': 'fixed',
            'zIndex': 50,
            'top': 0
        });
        var oImg = document.createElement('img');
        $('body').append(oImg);
        $(oImg).attr('src', '../../img/delete.png');
        $(oImg).css({
            'position': 'fixed',
            'zIndex': 50,
            'top': 0,
            'right': 0,
            'width': 80,
            'cursor': 'pointer'
        });
        $('.fixImage').show();
        $(oImg).click(function () {
            $(oDiv).hide();
            $(oImg).hide();
            $('.fixImage').hide();
        });
    });

}



//*搜索跳转*/
$('.logo .input2').on('click',function(){
    var searchVal=$.trim($('.logo .input1').val());
    if(searchVal){
        window.location="/dist/webPage/searchPage.html?searchVal="+encodeURI(searchVal);
    }
});
$('.logo .input1').on('keyup',function(event){
    if(event.keyCode ==13){
        var searchVal=$.trim($('.logo .input1').val());
        if(searchVal){
            window.location="/dist/webPage/searchPage.html?searchVal="+encodeURI(searchVal);
        }
    }
});
/*nav active*/
var navActive = GetQueryString("navActive");
$('.navW .nav li').removeClass('active');
$('.navW .nav li').eq(navActive).addClass('active');

/*兼容ie样式*/
/*console.log(navigator.userAgent);*/
if(navigator.userAgent.indexOf('Chrome')!=-1){
    $('.logo .search .input1').css('height','48px');
}
