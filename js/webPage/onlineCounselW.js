/**
 * Created by 卫宁宁 on 2017/1/12.
 */
$(function () {
    var loginData = JSON.parse(localStorage.getItem("loginData"));
    $('#phoneCounsel').on('click', function () {
        getPhoneList(1, 0);
    });
    function getPhoneList(pageNum, type) {
        $.ajax({
            type: 'post',
            url: '/my/counselingrecord/queryPhoneRecordList',
            data: {
                "token": loginData.accessToken,
                pageNum: pageNum,
                pageSize: 8,
                type: type
            }
        }).done(function (a) {
            if (a.state == 0) {
                datas = a.data.result;
                var text1 = '';
                for (var i = 0; i < datas.length; i++) {
                    datas[i].applyStatus = datas[i].applyStatus == 0 ? '等待中' : datas[i].applyStatus == 1 ? '已拨打电话' : '已过期';
                    var day = datas[i].applyTime.substr(0, 10);
                    var minute = datas[i].applyTime.substr(11, 8);
                    text1 += ' <li class="clearfix">\
                    <span class="span1 floatL lin54">' + datas[i].patientName + '</span>\
                        <span class="span2 floatL lin27">' + datas[i].doctorName + '－' + datas[i].hospitalName + '<br/>－' + datas[i].deptName + '</span>\
                    <span class="span3 floatL lin54">' + datas[i].diseaseName + '</span>\
                        <span class="span4 floatL lin27"><i>' + day + '</i><br/><i>' + minute + '</i></span>\
                    <span class="span5 floatL lin54">' + datas[i].applyStatus + '</span>\
                        <span class="span6 floatL lin54 cursor detail" idata="' + datas[i].id + '">详情</span>\
                        </li>'
                }
                $('.ulList').html(text1);

                /*绑定点击事件*/
                $('.detail').on('click', function () {
                    var id = $(this).attr('idata');
                    details(id);
                })

            }
        })
    };

    function details(id) {
        window.location = 'index-2.html?id=' + id;
    }
})


$(function () {
    var loginData = JSON.parse(localStorage.getItem("loginData"));
    $('#pictrueCounsel').on('click', function () {
        getPhoneList(1, 1);
    });
    function getPhoneList(pageNum, type) {
        $.ajax({
            type: 'post',
            url: '/my/counselingrecord/queryPhoneRecordList',
            data: {
                "token": loginData.accessToken,
                pageNum: pageNum,
                pageSize: 8,
                type: type
            }
        }).done(function (a) {
            if (a.state == 0) {
                datas = a.data.result;
                var text1 = '';
                for (var i = 0; i < datas.length; i++) {
                    datas[i].applyStatus = datas[i].applyStatus == 0 ? '等待中' : datas[i].applyStatus == 1 ? '已拨打电话' : '已过期';
                    var day = datas[i].applyTime.substr(0, 10);
                    var minute = datas[i].applyTime.substr(11, 8);
                    text1 += ' <li class="clearfix">\
                    <span class="span1 floatL lin54">' + datas[i].patientName + '</span>\
                        <span class="span2 floatL lin27">' + datas[i].doctorName + '－' + datas[i].hospitalName + '<br/>－' + datas[i].deptName + '</span>\
                    <span class="span3 floatL lin54">' + datas[i].diseaseName + '</span>\
                        <span class="span4 floatL lin27"><i>' + day + '</i><br/><i>' + minute + '</i></span>\
                    <span class="span5 floatL lin54">' + datas[i].applyStatus + '</span>\
                        <span class="span6 floatL lin54 cursor detail" idata="' + datas[i].id + '">详情</span>\
                        </li>'
                }
                $('.ulList').html(text1);

                /*绑定点击事件*/
                $('.detail').on('click', function () {
                    var id = $(this).attr('idata');
                    details(id);
                })

            }
        })
    };

    function details(id) {
        window.location = 'index-2.html?id=' + id;
    }
})