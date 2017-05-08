$(function () {
    var total = 0;
    /*搜索*/
    $('.button').click(function () {
        getPatient(1, 1, $('.search').val())
    });
    /*新增患者*/
    $('#newPatient').off('click').on('click', newPatient);
    init();
    function init() {
        getPatient(1, 1);
    };

    /*提交手机号*/
    function submitPhone() {
        $.ajax({
            url: servUrl,
            data: {
                'pathL': '/doctor/addMemberFromDoctor',
                'token': dcIiToken,
                'mobile': $('#phone').val()
            },
            type: 'post',
            dataType: "json",
            success: function (res) {
                if (res.state == 2020) {
                        $('#phone').val('');
                        layer.closeAll('page');
                        layer.msg('添加申请已发出，请耐心等待患者同意', {
                            icon: 3,
                            time: 3000, //2秒关闭（如果不配置，默认是3秒）
                            offset: '250px'
                        })

                } else if (res.state == 2017) {
                    $('#repeat').html('该患者已经是您的患者，不需要重复添加').css('display', 'block');
                    setTimeout(function () {
                        $('#repeat').css('display', 'none');
                    }, 3000)
                } else if(res.state==2021){
                    layer.closeAll('page');
                    layer.confirm('该患者还未注册患者端，是否邀请患者加入？', {
                        btn: ['确定', '取消'], //按钮
                        area: ['580px', '220px'],
                        title:'温馨提示'
                    }, function () {
                        layer.msg('已向患者发送邀请', {icon: 3});
                    });
                }else if(res.state==2022){
                    $('#phone').val('');
                    layer.closeAll('page');
                    layer.msg('您已向该患者发送请求，不需重复添加', {
                        icon: 3,
                        time: 3000, //2秒关闭（如果不配置，默认是3秒）
                        offset: '250px'
                    })

                }
            },
            error: function (res) {
            //    console.log(res)
            }
        });
    }



    /*获取患者列表*/
    function getPatient(pageNum, flag, name) {
        $('.pagination').css('display', 'block');
        $.ajax({
            url: servUrl,
            data: {
                'pathL': '/doctor/contacter/getMemberListByDocId',
                'token': dcIiToken,
                'pageNum': pageNum,
                'pageSize': 6,
                'name': name
            },
            type: 'post',
            dataType: "json",
            success: function (res) {
                if (res.state == 0) {
                    var data = res.data.result;
                    total = res.data.total;
                    if (flag == 1) {
                        initPage()
                    }
                    for (var i = 0; i < data.length; i++) {
                        data[i].headimg=data[i].headimg?data[i].headimg:'../images/patientImg.png' ;
                        data[i].memberBirthday = new Date(data[i].memberBirthday).format('yyyy-MM-dd');
                        data[i].mobile = phoneFormat(data[i].mobile);
                        data[i].memberSex = data[i].memberSex == 2 ? '女' : data[i].memberSex == 1 ? '男' : '';
                    }

                    if (total) {
                        $('#dataNull_wrapper').css('display', 'none');
                        var patient = new EJS({url: '../compileEjs/Doc_getPatient'}).render({data: data});
                        $('#tableBody').html(patient);
                    } else {
                        $('#tableBody').html('');
                        $('#dataNull_wrapper').css('display', 'block').html("<img id='data_null' src='../images/Doc_data_null.png'style='display: block;margin: 60px auto;'/>");
                    }

                }
            },
            error: function (res) {
            //    console.log(res)
            }
        });

    }

    /*新建患者*/
    function newPatient() {
        $('#phone').val('');
        layer.open({
            title: '新增人员',
            type: 1,
            //开启遮罩关闭
            content: $('.layW'),
            shade: 0.6,
            area: ['600px', '260px'],
            btn: ['确定', '取消'],
            yes: function () {
                if (!$("#W_form").valid())return;
                submitPhone();

            },
            success: function () {
                /*关闭弹框*/
                $('.layui-layer-setwin').off('click').on('click', function(){                        layer.closeAll('page');
                });
            }
        });
    }


    /*初始化页码*/
    function initPage() {
        if (!total) {
            $('.pagination').css('display', 'none');
            return;
        }
        $('.pagination').paging({
            pageNo: 1, //当前页
            totalPage: Math.ceil(total / 6), //总共多少页
            callback: function () {
                /*点击页数查询列表*/
                var infor = $('.search').val();
                if (infor == '') {
                    getPatient(this.pageNo);
                } else {
                    getPatient(this.pageNo, 2, infor);
                }

            }
        });
    }

});
