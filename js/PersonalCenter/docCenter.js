/**
 * Created by wanglinfei on 2017/2/7.
 */
if(!JSON.parse(localStorage.getItem("docLoginData"))){
    window.location="../webPage/login.html";
}
var colums = [
    {title: "咨询人", width: '50px', name: 'patientName', format: null},
    {
        title: "性别", width: '50px', name: 'sex', format: function (val) {
        return ( val == 1 ? '女' : '男')
    }
    },
    {
        title: "年龄", width: '50px', name: 'birthdate', format: function (val) {
        var iV = val.split('-')[0];
        var date = new Date;
        var year = date.getFullYear();
        return year - iV
    }
    },
    {title: "疾病名称", width: '88px', name: 'diseaseName', format: null},
    {
        title: "疾病详情", width: 'auto', name: 'diseaseDetail', format: function (val) {
        var iAll = val;
        var Ihtml = '';
        if (val.length >= 41) {
            val = val.substring(0, 41);
            Ihtml = val + '...<p class="Alltext" style="display:none">' + iAll + '</p><b class="openText">展开</b>';
        } else {
            Ihtml = val;
        }
        return Ihtml;
    }
    },
    {title: "提问时间", width: '88px', name: 'applyTime', format: null},
    {
        title: "操作", width: '50px', name: 'id', format: function () {
        return '聊天'
    }
    },
];

getTable("/my/counselingrecord/queryPhoneRecordList", 1, colums, $("#Jdoc_table"));
$('#Jdoc_table').on('click', '.openText', function () {
   var iHt = $(this).parent().html();
    $(this).parent().html('<p>'+$(this).siblings('.Alltext').text()+'</p><b class="openClose">收缩</b>');
    $('#Jdoc_table').off('click','.openClose').on('click', '.openClose', function () {
        var iAll=$(this).siblings().html();
        var val= $(this).siblings().html().substring(0,41);
        var  Ihtml=val+'...<p class="Alltext" style="display:none">'+iAll+'</p><b class="openText">展开</b>';
        $(this).parent().html(Ihtml);
    })
});
function getTable(url, pageNum, colums, Ibox) {
    $.ajax({
        type: 'post',
        url: url,
        data: {
            "token": docLoginData.accessToken,
            pageNum: pageNum,
            pageSize:8,
            type: 1,
        },
        dataType: "json",
    }).done(function (a) {
        if (a.state == 0) {
            var text = '';
            var data = a.data.result;
            $('.page').attr('data_page', a.data.pages);
            $('.total i').text(a.data.pages);
            //clickPage();
            $('.page4').paging({pageNo: pageNum, totalPage: Number(a.data.pages)});
            if (data.length == 0) {
                $('.page4').css('display', 'none');
                Ibox.html('<p style="width:65px;margin:20px auto;">暂无数据!</p>');
                return;
            }else {
                $('.page4').css('display', 'block');
            }
            var tableList = makeTable(colums, data);

            Ibox.html(tableList);
            $('.Jtd7').on('click', function () {
                var id = $(this).attr('idata');
                window.open('chatRoomDoc.html?id=' + id + '&type='+1);
            })

        }
    })
}
/*制作表格*/
function makeTable(colums, data) {
    /*表头*/
    var table = "";
    table += '<thead>'
    for (var c in colums) {
        table += '<th  style="width:' + colums[c].width + '" >';
        table += colums[c].title;
        table += '</th>';
    }
    table += '</thead><tbody>'
    /*console.log(data)*/;
    /*表身*/
    for (var d in data) {
        var lineVal = data[d];
        table += '<tr>';
        for (var c in colums) {
            var value = colums[c]
            table += '<td class="Jtd' + (Number(c) + 1) + '"  idata="' + data[d].id + '">';
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
            table += '</td>';
        }
        table += '</tr>';
    }
    table += '</tbody>';
    return table;
}

/*点击分页*/
var iNum = 0;
/*function clickPage() {
 var pages = $('.page').attr('data_page');
 /!* $('.total i').html(pages);
 var text1 = '';
 for (var i = 0; i < pages; i++) {
 text1 += '<a href="javaScript:;" class="floatL">' + (i + 1) + '</a>'
 }
 $('.page1 div').html(text1);*!/
 $('.page4').paging({pageNo: 1, totalPage: Number(pages)});
 /!*   /!*初始化第一个显示*!/
 $('.page1 div a').eq(iNum).addClass('active');

 /!*点击页码跳转*!/
 $('.page1 div a').on('click', function () {
 $('.page1 div a').removeClass('active');
 iNum = $(this).index();
 $('.page1 div a').eq(iNum).addClass('active');
 getTable("/my/counselingrecord/queryPhoneRecordList", iNum + 1, colums, $("#Jdoc_table"));
 });*!/
 /!*  /!*向后*!/
 $('.page1 .per').off('click').on('click', function () {
 iNum--;
 if (iNum < 0) {
 iNum = 0;
 return;
 }
 ;
 getTable("/my/counselingrecord/queryPhoneRecordList", iNum + 1, colums, $("#Jdoc_table"));
 $('.page1 div a').removeClass('active');
 $('.page1 div a').eq(iNum).addClass('active');
 });*!/
 /!* /!*向前*!/
 $('.page1 .nex').off('click').on('click', function () {
 iNum++;
 if (iNum > pages - 1) {
 iNum = pages - 1;
 return;
 }
 getTable("/my/counselingrecord/queryPhoneRecordList", iNum + 1, colums, $("#Jdoc_table"));
 $('.page1 div a').removeClass('active');
 $('.page1 div a').eq(iNum).addClass('active');
 });
 $('.num').on('click', function () {
 $(this).html('');
 });*!/
 /!* /!*传输门的实现*!/
 $('.go').on('click', function () {
 var i = $('.num').html();
 if (0 < i && i < pages + 1) {
 iNum = i - 1;
 getTable("/my/counselingrecord/queryPhoneRecordList", iNum + 1, colums, $("#Jdoc_table"));
 $('.page1 div a').removeClass('active');
 $('.page1 div a').eq(iNum).addClass('active');
 }
 });*!/
 }*/