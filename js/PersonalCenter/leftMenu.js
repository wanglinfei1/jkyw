/**
 * Created by 卫宁宁 on 2017/1/12.
 */
var urlW = '/my/patient/queryMyRegisteredList', typeW = 'order',module='.orde';
var colums = [
    {
        title: "就诊日期", name: 'consultationTime', width: 150, format: function (val) {
        var timerlist = val.split(' ');
        var timeAp = timerlist[1].split(':')[0];
        var timeDate;
        if (timeAp > 8 && timeAp < 12) {
            timeDate = '上午';
        } else if (timeAp >= 12 && timeAp < 18) {
            timeDate = '下午';
        } else if (timeAp >= 18 && timeAp < 24) {
            timeDate = '晚上';
        }
        return (timerlist[0] + ' ' + timeDate)
    }
    },
    {title: "就诊人", name: 'patientName', width: 93, format: null},
    {
        title: "医生",
        name: ['doctorName', 'hospitalName', 'deptName'],
        width: 281,
        format: function (val1, val2, val3) {
            return (val1 + '－' + val2 + '－' + val3)
        }
    },
    {
        title: "状态", name: 'status', width: 99, format: function (val) {
        return (val == 0 ? '预约成功' : val == 1 ? '预约失败' : '已退号')
    }
    },
    {
        title: "操作", name: 'ope', width: 88, format: function () {
        return '详情'
    }
    }
];
$(function () {
    init();
    shift();
    /*$('.personal-nav div').on('click', function () {
        var n = $(this).index();
        init(n,this);
        shift()
    });*/
    
})
function init(){
    Won =$('.personal-nav .active b').html();
   /*var that=that;*/
   /* $('.personalCenter').removeClass('personalCenter1');
    $('.personal-nav div').removeClass('active');
    $(that).addClass('active');
    $('.personalCenter-r .div').css('display', 'none');
    $('.personalCenter-r .div').eq(n).css('display', 'block');
    if (n == 3) {
        $('.personalCenter').addClass('personalCenter1');
    }
    if(n==2){
        $('.visits h3 i').html('图文咨询');
        $('.visits .title span').removeClass('active');
        $('.visits .title span:eq(0)').addClass('active');
    }*/
/*    $('.personal-nav div').each(function () {
        if ($(that).hasClass('active')) {
            Won = $(that).children('b').html();
        }
    })*/
    /*清楚日历内容*/
    $('.time1').val('');
    $('.time2').val('');
}
function shift(){
    switch (Won) {
        case '我的预约':
            urlW = '/my/patient/queryMyRegisteredList';
            typeW = 'order';module='.orde';onlineType=undefined;
            colums = [
                {
                    title: "就诊日期", name: 'consultationTime', width: 150, format: function (val) {
                    var timerlist = val.split(' ');
                    var timeAp = timerlist[1].split(':')[0];
                    var timeDate;
                    if (timeAp > 8 && timeAp < 12) {
                        timeDate = '上午';
                    } else if (timeAp >= 12 && timeAp < 18) {
                        timeDate = '下午';
                    } else if (timeAp >= 18 && timeAp < 24) {
                        timeDate = '晚上';
                    }
                    return (timerlist[0] + ' ' + timeDate)
                }
                },
                {title: "就诊人", name: 'patientName', width: 93, format: null},
                {
                    title: "医生",
                    name: ['doctorName', 'hospitalName', 'deptName'],
                    width: 281,
                    format: function (val1, val2, val3) {
                        return (val1 + '－' + val2 + '－' + val3)
                    }
                },
                { //修改状态
                    title: "状态", name: 'status', width: 99, format: function (val) {
                    return (val == 0 ? '预约成功' : val == 2 ? '已取消' : '预约失败')
                }
                },
                {
                    title: "操作", name: 'ope', width: 88, format: function () {
                    return '详情'
                }
                }
            ];
            getList(urlW, 'order', colums, 1, undefined, undefined, 1,undefined);
            break;
        case '我的申请':
            urlW = '/my/exactBespoke/queryPcExactBespokeList';
            typeW = 'apply';module='.apploiction';onlineType=undefined;
            colums = [
                {
                    title: "申请日期", name: 'applyTime', width: 178, format: function (val) {
                    if(val==null){
                        return '';
                    }
                    // var timerlist = val.split(' ');
                    // var timeAp = timerlist[1].split(':')[0];
                    // var timeDate;
                    // if (timeAp > 8 && timeAp < 12) {
                    //     timeDate = '上午';
                    // } else if (timeAp >= 12 && timeAp < 18) {
                    //     timeDate = '下午';
                    // } else if (timeAp >= 18 && timeAp < 24) {
                    //     timeDate = '晚上';
                    // }
                    //return (timerlist[0] + ' ' + timeDate)
                    return val;
                }
                },
                {title: "就诊人", name: 'patientName', width: 74, format: null},
                {
                    title: "希望就诊时间",
                    name: ['consultStartTime', 'consultEndtTime'],
                    width: 222,
                    format: function (val1, val2) {
                        if(val1==null||val2==null){
                            val1=' ' ;
                            val2=' ' ;
                        }
                        val1 = val1.substr(0, 10);
                        val2 = val2.substr(0, 10);
                        return (val1 + '—' + val2 )
                    }
                },
                {
                    title: "确认疾病", name: 'diseaseName', width: 98, format: function(val){
                        if(val==null){
                            return '';
                        }else{
                            return val;
                        }
                    }
                },
                {
                    title: "状态", name: 'applyStatus', width: 83, format: function (val) {
                    return (val == 0 ? '审核中' : val == 1 ? '审核成功' : '审核失败')
                }
                },
                {
                    title: "操作", name: 'ope', width: 56, format: function () {
                    return '详情'
                }
                }
            ];
            getList(urlW, 'apply', colums, 1, undefined, undefined, 1,undefined);
            break;
        case '我的在线咨询':
            urlW = '/my/counselingrecord/queryPhoneRecordList';
            typeW = 'visits';module='.visits'; onlineType=1;
            colums = [
                {
                    title: "咨询人", name: 'patientName', width: 61, format: null
                },

                {
                    title: "医生",
                    name: ['doctorName', 'hospitalName', 'deptName'],
                    width: 142,
                    format: function (val1, val2, val3) {
                        return (val1 + '－' + val2 + '－' + val3)
                    }
                },

                {
                    title: "疾病名称", name: 'diseaseName',
                    width: 84,
                    format: null
                },

                {
                    title: "疾病详情", name: 'diseaseDetail', width: 190, format:function(val){
                    var iAll=val;
                    var Ihtml='';
                    if(val.length>=23){
                        val= val.substring(0,23);
                        Ihtml=val+'...<p class="Alltext" style="display:none">'+iAll+'</p><b class="openText cursor">展开</b>';
                    }else{
                        Ihtml=val;
                    }
                    return Ihtml;
                }
                },
                {
                    title: "提交时间", name: 'applyTime', width: 111, format:null
                },
                {
                    title: "状态", name: 'applyStatus', width: 70, format: function (val) {
                    return (val == 0 ? '未回复' : val == 1 ? '已回复' : '已过期')
                    }
                },
                {
                    title: "操作", name: 'ope', width: 47, format: function () {
                    return '聊天'
                    }
                }
            ];
            getList(urlW, 'visits', colums, 1, undefined, undefined, 1, onlineType);
            $('#phoneCounsel').on('click', function () {
                colums = [
                    {
                        title: "咨询人", name: 'patientName', width: 76, format: null
                    },

                    {
                        title: "医生",
                        name: ['doctorName', 'hospitalName', 'deptName'],
                        width: 173,
                        format: function (val1, val2, val3) {
                            return (val1 + '－' + val2 + '－' + val3)
                        }
                    },

                    {
                        title: "接听电话", name: 'telephone',
                        width: 129,
                        format: null
                    },

                    {
                        title: "方便接听时间", name: 'applyCallTime', width: 137, format: function (val) {
                        if(val==null){
                            return '';
                        }else{
                            return val;
                        }
                    }
                    },

                    {
                        title: "状态", name: 'applyStatus', width: 122, format: function (val) {
                        return (val == 0 ? '等待中' : val == 1 ? '已拨打电话' : '已过期')
                    }
                    },
                    {
                        title: "操作", name: 'ope', width: 69, format: function () {
                        return '详情'
                    }
                    }
                ];
                urlW = '/my/counselingrecord/queryPhoneRecordList';onlineType=0;
                getList(urlW, 'online', colums, 1, undefined, undefined, 1, onlineType);
            });
            $('#pictrueCounsel').on('click', function () {
                colums = [
                    {
                        title: "咨询人", name: 'patientName', width: 60, format: null
                    },

                    {
                        title: "医生",
                        name: ['doctorName', 'hospitalName', 'deptName'],
                        width: 141,
                        format: function (val1, val2, val3) {
                            return (val1 + '－' + val2 + '－' + val3)
                        }
                    },

                    {
                        title: "疾病名称", name: 'diseaseName',
                        width: 83,
                        format: null
                    },
                    {
                        title: "疾病详情", name: 'diseaseDetail', width: 189, format:function(val){
                        var iAll=val;
                        var Ihtml='';
                        if(val.length>=23){
                            val= val.substring(0,23);
                            Ihtml=val+'...<p class="Alltext" style="display:none">'+iAll+'</p><b class="openText">展开</b>';
                        }else{
                            Ihtml=val;
                        }
                        return Ihtml;
                    }
                    },
                    {
                        title: "提交时间", name: 'applyTime', width: 110, format:null
                    },
                    {
                        title: "状态", name: 'applyStatus', width: 69, format: function (val) {
                        return (val == 0 ? '未回复' : val == 1 ? '已回复' : '已过期')
                    }
                    },
                    {
                        title: "操作", name: 'ope', width: 47, format: function () {
                        return '聊天'
                    }
                    }
                ];
                urlW = '/my/counselingrecord/queryPhoneRecordList';onlineType=1;
                getList(urlW, 'online', colums, 1, undefined, undefined, 1, onlineType);
            });
            break;
        case '健康档案':
            JgetHelth();
            break;
    }
}


