function GetQueryString(name) {
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*但会参数值*/
    if (r != null)return unescape(r[2]);
    return null;
}

var cont = GetQueryString("cont");

$(function () {
    var loginData = JSON.parse(localStorage.getItem("loginData"));
    var time1;
    var time2;
    /*ajax请求方法*/
    getList = function (url, type, colums, pageNum, startTime, endTime, init, onlineType) {
        var typeW = type;
        $.ajax({
            type: 'post',
            url: url,
            data: {
                "token": loginData.accessToken,
                pageNum: pageNum,
                pageSize:8,
                startTime: startTime,
                endTime: endTime,
                type: onlineType
            },
            dataType: "json"
        }).done(function (a) {
            if (a.state == 0) {
                var text = '';
                var list = a.data.result;
                $('.page4').attr('data_page', a.data.pages);

                clickPage(init);


                if (list.length == 0) {
                    $('.page4').css('display', 'none');
                    $(".ulList").html('<p style="width:65px;margin:20px auto;">暂无数据!</p>');
                    return;
                } else {
                    $('.page4').css('display', 'block');
                }
                var tableList = makeList(colums, list);
                $(".ulList").html(tableList);

                var Height = $('.personalCenter-r').outerHeight();
                $('.personalCenter .personalCenter-l').css('height', Height);
                /*时期查询*/
                $(module + ' .queryTime').off('click').on('click', function () {
                    $(module + ' .time1').removeClass('redBox');
                    $(module + ' .time2').removeClass('redBox');
                    time1 = $(module + ' .time1').val();
                    time2 = $(module + ' .time2').val();
                    if ($(module + ' .time1').val() == '' || $(module + ' .time2').val() == '') {
                        if (time1 == '') {
                            $(module + ' .time1').addClass('redBox');
                        }
                        if (time2 == '') {
                            $(module + ' .time2').addClass('redBox');
                        }
                        return
                    }
                    ;
                    var time11 = time1;
                    time11.replace(/-/g, '');
                    var time22 = time2;
                    time22.replace(/-/g, '');
                    $('.tip').css('display', 'none');
                    if (time22 < time11) {
                        $('.tip').css('display', 'block');
                        return
                    }
                    var startTime = $(module + ' .time1').val();
                    var endTime = $(module + ' .time2').val();
                    getList(urlW, typeW, colums, 1, startTime, endTime, 1, onlineType);
                    $('.page1 div a').removeClass('active');
                    $('.page1 div a').eq(0).addClass('active');
                });

                /*点击详情*/
                function detail() {
                    var id = $(this).attr('idata');
                    window.location = "personalCenter.html?id=" + id + "&type=" + typeW;
                }

                $('.orde .ulList span').each(function (i) {
                    if ($(this).html() == '详情') {
                        $(this).off('click').on('click', detail);
                    }
                })
                /*点击申请详情*/
                function detail2() {
                    var id = $(this).attr('idata');
                    window.location = "index-3.html?id=" + id;
                }

                $('.apploiction .ulList span').each(function (i) {
                    if ($(this).html() == '详情') {
                        $(this).off('click').on('click', detail2);
                    }
                });
                /*点击电话咨询详情*/
                function detail3() {
                    var id = $(this).attr('idata');
                    window.location = "index-2.html?id=" + id;
                }

                $('.call-visits-list .ulList span').each(function (i) {
                    if ($(this).html() == '详情') {
                        $(this).off('click').on('click', detail3);
                    }
                })
                /*点击图文咨询详情*/
                function detail4() {
                    var id = $(this).attr('idata');
                    window.open("chatRoom.html?id=" + id+ '&type='+0);
                }

                $('.visits-list .ulList span').each(function (i) {
                    if ($(this).html() == '聊天') {
                        $(this).off('click').on('click', detail4);
                    }
                })


            }
        })
    }

    /*制作表格*/
    var makeList = function (colums, data) {
        /*表头*/
        var table = "";
        table += '<li class="clearfix">'
        for (var c in colums) {
            table += '<span class="span1" style="width:' + colums[c].width + 'px; background:#ecf0f1">';
            table += colums[c].title;
            table += '</span>';
        }
        table += '<li>'

        /*console.log(data)*/;
        /*表身*/
        for (var d in data) {
            var lineVal = data[d]
            table += '<li class="clearfix">';
            for (var c in colums) {
                var value = colums[c]
                table += '<span class="span' + (Number(c) + 1) + '" style="width:' + value.width + 'px;" idata="' + data[d].id + '">';
                var ss = '';
                if (typeof value.format == "function") {
                    if (typeof value.name == 'object') {
                        ss = value.format(lineVal[(value.name)[0]], lineVal[(value.name)[1]], lineVal[(value.name)[2]])
                    } else {
                        ss = lineVal[value.name];
                        ss = value.format(ss);
                    }
                } else {
                    ss = lineVal[value.name];
                }
                table += ss;
                table += '</span>';
            }
            table += '</li>';
        }
        return table;
    };
    /*初始化列表*/
    //getList("/my/patient/queryMyRegisteredList", 'order', colums, 1);
    /*预约时间查询*/
    if (cont) {
        $('.personal-nav div').removeClass('active');
        $('.personal-nav div').eq(Number(cont) - 1).addClass('active');
        Won = $('.personal-nav div').eq(Number(cont) - 1).children('b').html();
        init(Number(cont) - 1, $('.personal-nav div').eq(Number(cont) - 1).get(0));
        shift();
    }

    /*点击分页*/
    var iNum = 0;

    function clickPage(init) {
        if (init == 1) {
            current = 1;
        }
        var pages = $(module + ' .page4').attr('data_page');
        creatHtml(current, +pages);

        $(module + ' .page4 a').off('click').on('click', function () {
            var num = $(this).html();
            if (num == "&lt;") {
                if (current == 1)return;
                current = +current - 1;
            } else if (num == "&gt;") {
                if (current == pages)return;
                current = +current + 1;
            } else {
                current = +num;
            }

            /*时期查询*/
            time1 = $(module + ' .time1').val();
            time2 = $(module + ' .time2').val();
            if (time1 && time2) {
                getList(urlW, typeW, colums, current, time1, time2,undefined,onlineType);
                return
            }
            getList(urlW, typeW, colums, current,undefined,undefined,undefined,onlineType);
        });
        /*传输门的实现*/
        $(module + ' .page4 span').off('click').on('click', function () {
            var ipt = +$(module + ' .page4 input').val();
            if (ipt && ipt <= pages && ipt != current) {
                current = ipt;
            }
            if (time1 && time2) {
                getList(urlW, typeW, colums, current, time1, time2,undefined,onlineType);
                return
            }
            getList(urlW, typeW, colums, current,undefined,undefined,undefined,onlineType);
        });
    };
})