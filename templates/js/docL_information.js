/**
 * Created by wanglinfei on 2017/4/14.
 */

$(function () {
    $('#page-wrapper').css('height', $(window).height() - 100 + 'px');
    $(window).on('resize', function () {
        $('#page-wrapper').css('height', $(window).height() - 100 + 'px');
    });
    $('.L_information .L_topR p').off('click').on('click', function () {
        initPupob();
        layer.open({
            type: 1,
            title: '写总结',
            area: ['600px', '570px'],
            closeBtn: 1,
            fix: true,
            offset: 'auto',
            shadeClose: false,
            skin: 'yourclass',
            content: $('.L_Popup')
        });
    });
    /*初始化弹窗*/
    function initPupob() {
        var LmedHtml = new EJS({url: '../compileEjs/DocL_medinfor.ejs'}).render({data: {}});
        $('.Lmedinfor').html(LmedHtml);
        $('.Lmedinfor li').removeClass('addLi');
        $('.L_PopupIntop textarea').val('');
        $('.L_PopupIntop span i.num').html('0');
        $('.L_PopupIntop div .PholderSpan').css({'left':'38px','top':'15px','color':'#ccc','font-size':'12px'})
        $('.L_Popup .submit').attr('issubmit','true');
    }

//模拟下拉菜单
    /*$('.L_type input').on('click',function(){
     if($('.L_type div').css('display')=='none'){
     $('.L_type div').show();
     }else{
     $('.L_type div').hide();
     }
     });
     $('.L_type div p').on('click',function(){
     $('.L_type input').val($(this).html());
     $('.L_type div').hide();
     });*/
//模拟下拉菜单
    $('#page-wrapper').on('click', '.input2', function () {
        if ($(this).siblings('.L_xialaL1').css('display') == 'none') {
            $(this).siblings('.L_xialaL1').show();
        } else {
            $(this).siblings('.L_xialaL1').hide();
        }
    });
    $('#page-wrapper').on('click', '.xialaV', function () {
        $(this).parent().siblings('.input2').val($(this).html());
        $(this).parent().hide();
    });
//文本域输入框
    $('.L_PopupIntop textarea').off('input').on('input', function () {
        var n = $(this).val().length;
        $('.L_PopupIntop span i.num').html(n);
        if (n > 150) {
            $(this).val($(this).val().substr(0, 149));
            layer.alert('字数超出限制');
            return;
        }
    });
    var userId = getRequestParam('userId');
    var doctorId=getCookieValue("Doc_id");
    if(!doctorId){
        window.location = "../html/Y_Login.html";
    }
    if(!userId){
        window.location.href='../html/Doc_WpatientManage.html';
    }
    $.ajax({
        url: servUrl,
        data: {
            'pathL': '/doctor/getUserInfo',
            'token': dcIiToken,
            'id': userId
        },
        type: 'post',
        dataType: "json",
        success: function (res) {
        //    console.log(res);
            if (res.state == 0 && res.data) {
                if (res.data.headimg) {
                    $('.L_infor .headimg').attr('src', res.data.headimg);
                }
                $('.L_infor .name').html(res.data.name);
                if(res.data.birthday){
                    $('.L_infor .birthday').html(new Date(res.data.birthday).format('yyyy-MM-dd'));
                }
                if (res.data.sex == 2) {
                    $('.L_infor .sex').html('女');
                } else if (res.data.sex == 1) {
                    $('.L_infor .sex').html('男');
                }
                $('.L_infor .mobile').html(phoneFormat(res.data.mobile));
                $('.L_tab .p1').attr('memberAccid', res.data.imAccid);
            }
        }
    });
    $('.L_tab p:eq(0)').off('click').on('click', function () {
        getSummaryList();
    });
    $('.L_tab p:eq(1)').off('click').on('click', function () {
        getRecordList();
    });
    getRecordList();
    /*获取血压列表*/
    function getRecordList() {
        $('.L_tab p').removeClass('active');
        $('.L_tab p:eq(1)').addClass('active');
        $('.L_summary').css('display', 'none');
        $('.L_Record').css('display', 'block');
        $.ajax({
            url: servUrl,
            data: {
                'pathL': '/memberBloodPressure/queryBloodPressureList',
                'token': dcIiToken,
                'userId': userId
            },
            type: 'post',
            dataType: "json",
            success: function (res) {
            //    console.log(res);
                if (res.state == 0) {
                    var data = res.data.result;
                    if (data.length) {
                        for (i in data) {
                            if (data[i].measureTime) {
                                data[i].measureTime = new Date(data[i].measureTime).format('yyyy-MM-dd hh:mm');
                            }
                        }
                    } else {
                        $('.L_Record').css('border', 'none')
                    }
                    var recordHtml = new EJS({url: '../compileEjs/DocL_Record.ejs'}).render({data: data});
                    $('.L_Record').html(recordHtml);
                }
            }
        });
    }

    /*获取咨询总结列表*/
    function getSummaryList() {
        $('.L_tab p').removeClass('active');
        $('.L_tab p:eq(0)').addClass('active');
        $('.L_summary').css('display', 'block');
        $('.L_Record').css('display', 'none');
        $.ajax({
            url: servUrl,
            data: {
                'pathL': '/medicalCases/listByDoctorId',
                'token': dcIiToken,
                'memberId': userId
            },
            type: 'get',
            dataType: "json",
            success: function (res) {
            //    console.log(res);
                if (res.state == 0) {
                    var data = res.data;
                    if (data.length) {
                        for (i in data) {
                            if (data[i].creatTime) {
                                data[i].creatTime = new Date(data[i].creatTime).format('yyyy-MM-dd');
                            }
                        }
                    }
                    var summaryHtml = new EJS({url: '../compileEjs/DocL_summary.ejs'}).render({data: data});
                    $('.L_summary').html(summaryHtml);
                }

            }
        });
    }

    /*点击取消按钮关闭弹窗*/
    $('.L_Popup').on('click', '.clo', function () {
        layer.closeAll();
    });
    /*药品名称限制*/
    $('.L_Popup').on('input', '.drugName', function () {
        var n = $(this).val().length;
        if (n > 32) {
            $(this).val($(this).val().substr(0, 32));
            layer.alert('药品名称不能超过32个字');
            return;
        }
    });
    /*计量名称限制*/
    $('.L_Popup').on('blur', '.dose', function () {
        var n = $(this).val();
        if(n!=''){
            if (isNaN(n)||n > 999.999 || n < 0.001) {
                layer.alert('药品计量请输入0.001-999.999之间的数字');
                $(this).val('');
                return;
            }
        }
    });
    /*频次限制*/
    $('.L_Popup').on('input', '.frequency', function () {
        var n = $(this).val().length;
        if (n > 20) {
            $(this).val($(this).val().substr(0, 20));
            layer.alert('不能超过20个字');
            return;
        }
    });
    $('.L_Popup .submit').click(function () {
        var summayuData = {};
        summayuData.memberId = userId;
        summayuData.doctorId = doctorId;
        summayuData.healthAdvice = $('.L_PopupIntop textarea').val();
        summayuData.pharmacyInstruct = [];
        var aLiNum = $('.Lmedinfor li').length;
        if (summayuData.healthAdvice || $('.Lmedinfor li .drugName').val()) {
            var summayTab = true;
            if ($('.Lmedinfor li .drugName').val()) {
                for (var i = 0; i < aLiNum; i++) {
                    var pharmacyInstruct = {};
                    pharmacyInstruct.drugType = $('.Lmedinfor li:eq(' + i + ') .drugType').val().substr(0, 2);
                    if ($('.Lmedinfor li:eq(' + i + ') .drugName').val()) {
                        pharmacyInstruct.drugName = $('.Lmedinfor li:eq(' + i + ') .drugName').val();
                    } else {
                        summayTab = false;
                    }
                    if ($('.Lmedinfor li:eq(' + i + ') .dose').val()) {
                        pharmacyInstruct.dose = $('.Lmedinfor li:eq(' + i + ') .dose').val();
                    } else {
                        summayTab = false;
                    }
                    pharmacyInstruct.unit = $('.Lmedinfor li:eq(' + i + ') .unit').val();
                    if ($('.Lmedinfor li:eq(' + i + ') .frequency').val()) {
                        pharmacyInstruct.frequency = $('.Lmedinfor li:eq(' + i + ') .frequency').val();
                    } else {
                        summayTab = false;
                    }
                    summayuData.pharmacyInstruct.push(pharmacyInstruct);
                }
            }
            if (summayTab) {
                if( $('.L_Popup .submit').attr('issubmit')=='true'){
                    addsummary(JSON.stringify(summayuData));
                }
            } else {
                layer.alert('用药指导有未填项');
            }
        } else {
            layer.alert('健康建议或用药指导不能为空');
        }
    });
    $('.L_Popup .Lmedadd').off('click').on('click', function () {
        var LmedHtml = new EJS({url: '../compileEjs/DocL_medinfor.ejs'}).render({data: {}});
        $('.Lmedinfor').append(LmedHtml);
        $('.addLi .cloc').on('click', function () {
            $(this).parent().remove();
        });
    });

    /*写总结*/
    function addsummary(summayuData) {
        $('.L_Popup .submit').attr('issubmit','flase');
        $.ajax({
            url: servUrl,
            data: {
                'pathL': '/medicalCases/save',
                'token': dcIiToken,
                'doctorId': doctorId,
                'memberId': userId,
                'type': 1,
                'MedicalCasesInfoJson': summayuData
            },
            type: 'post',
            dataType: "json",
            success: function (res) {
                if (res.state == 0) {
                    layer.closeAll();
                    getSummaryList();
                }
            }
        });
    }
});


