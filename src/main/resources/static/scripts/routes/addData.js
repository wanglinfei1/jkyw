/**
 * Created by wanglinfei on 2017/3/16.
 */
define(["jquery","common","errorConfig","fastclick","jweixin","extend","weui","jqWeui","touchSwiper"],function($,Common,Error,FastClick,wx){
    function AddData(){
        this.ejs = "views/add_data";
        this.cssPath = ["styles/reset.css","styles/add_data.css","styles/weui.min.css","styles/jquery-weui.css","styles/style.css"];
        this.tab=false;
    }

    AddData.prototype={
        init:function(business){
            var _t = this;
            var isPerfectInfor= $('#app-main').attr('data_isPerfectInfor');
            if(isPerfectInfor!='isTrue'){
                _t.isPerfectInfor(business);
            }
            Common.panel.add(_t.ejs,{msg:'111'},"addData").open(true);
            $(function() {
                FastClick.attach(document.body);
            });
            _t.inputInit();
            /*监控input*/
            $('#addData input').not($('#time-format')).off("input change").on("input change",function(){
                if($(this).val().length>3){$(this).val($(this).val().substr(0,3));}
                if(_t.isFill()){
                    $('#addData #submit').addClass('complete');
                }else{
                    $('#addData #submit').removeClass('complete');
                }
            });
            $('#addData .noteCon textarea').off('input').on('input',function(){
                _t.remarkL();
            });
            /*表单验证*/
            $("#addData #submit").unbind("click").bind("click",function(){
                if(!$(this).hasClass('complete')){
                    return;
                }
                _t.formDataAdd(business);
                return;
            });
            /*滑动返回上一页*/
            $("#addData").swipe({
                swipeRight: function() {
                    if($('.weui-picker-container').css('display')){
                        return;
                    }
                    _t.goBeforPage(business);
                },
            });
            /*日历插件*/
            /*$("#time-format");*/
            /*收起键盘*/
            $('#time-format').on('click',function(){
                $('#addDataForm input').blur();
                $('#addDataForm textarea').blur();
            });
            $("#time-format").datetimePicker({
                title: '',
                yearSplit:'年',
                monthSplit:'月',
                dateSplit:"日",
                max:new Date(),
                times: function () {
                    return [  // 自定义的时间
                        {
                            values: (function () {
                                var hours = [];
                                for (var i=0; i<24; i++) hours.push(i > 9 ? i : '0'+i);
                                return hours;
                            })()
                        },
                        {
                            divider: true,  // 这是一个分隔符
                            content: ':'
                        },
                        {
                            values: (function () {
                                var minutes = [];
                                for (var i=0; i<59; i++) minutes.push(i > 9 ? i : '0'+i);
                                return minutes;
                            })()
                        },
                        {
                            divider: true,  // 这是一个分隔符
                            content: ''
                        }
                    ];
                },
            }).on('click',function(){
                $('#addData .mask').css('display','block');
                $('.picker-button').off('click').on('click',function(){
                    $('#addData .mask').css('display','none');
                });
                $('#addData .mask').off('click').on('click',function(){
                    $('#addData .mask').css('display','none');
                });
                /*wnn开始*/
                $('#offW').off("click").on("click",function(){
                    $("#addData .mask").css('display','none');
                });
                /*wnn结束*/
            });
            this.share();
        },
        inputInit:function(){
            $('#addData input').not($('#time-format')).val('');
            $('#addData .conMum').html('0');
            $('#addData textarea').val('');
            $('#addData #submit').removeClass('complete');
        },
        /*微信分享SDK*/
        share:function(){
            /*分享到朋友圈*/
            wx.ready(function() {
                wx.hideAllNonBaseMenuItem();
                wx.showMenuItems({
                    menuList: [
                        "menuItem:addContact",//查看公众号（未添加）:
                        "menuItem:profile",//查看公众号（已添加）
                        "menuItem:share:appMessage",//发送给朋友:
                        "menuItem:share:timeline" //分享到朋友圈
                    ] // 要显示的菜单项，所有menu项见附录3
                });
                wx.onMenuShareTimeline({
                    title: '血压记录，方便您的血压管理！智医为您倾情奉献我们的服务！', // 分享标题
                    link: Common.param.domainName+'app_1_record.html', // 分享链接
                    imgUrl: Common.param.domainName+'img/share.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        $.toast("分享成功",1000);
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        $.toast("取消分享",1000);
                    }
                });
                /*分享给朋友*/
                wx.onMenuShareAppMessage({
                    title: '血压记录，方便您的血压管理！智医为您倾情奉献我们的服务！', // 分享标题
                    desc: '关注智医，健康管理有惊喜！', // 分享描述
                    link: Common.param.domainName+'app_1_record.html', // 分享链接
                    imgUrl: Common.param.domainName+'img/share.png', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        $.toast("分享成功",1000);
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        $.toast("取消分享",1000);
                    }
                });
            });
        },
        formDataAdd:function(business){
            var _t=this;
            var params= $("#addDataForm").serializeObject();
            if($.trim(params.timer)=="" ){
                $.toast("日期不能为空","forbidden");
                return;
            }
            if($.trim(params.highValue)<60){
                $.toast("您的高压值太低啦，抓紧就医调整呐！","forbidden");
                return;
            }else if($.trim(params.highValue)>250){
                $.toast("您的高压值太高啦，抓紧就医调整呐！","forbidden");
                return;
            }
            if($.trim(params.lowValue)<30){
                $.toast("您的低压值太低啦，抓紧就医调整呐！","forbidden");
                return;
            }else if($.trim(params.lowValue)>200){
                $.toast("您的低压值太高啦，抓紧就医调整呐！","forbidden");
                return;
            }
            if($.trim(params.heartRate)<30){
                $.toast("您的心率太低啦，抓紧就医调整呐！","forbidden");
                return;
            }else if($.trim(params.heartRate)>150){
                $.toast("您的心率太高啦，抓紧就医调整呐！","forbidden");
                return;
            }
            if(params.Remarks&&params.Remarks.length>50){
                $.toast("备注不能超过五十个字","forbidden");
                return;
            }
            _t.addBloodPressure(params,business);
        },
        /*是否完善信息*/
        isPerfectInfor : function(business) {
            var _t=this;
            Common.req("wxportal.isCompleteInfo","get", {
                openid : Common.param.openid
                /*openid : 'ocPs50jpuKP63eFx1GFl7pjB8dlo'*/
            }, function(data) {
                /*console.log(data)*/
                if(data.state==0){

                }
            },function(data){
                /*console.log(data)*/
                _t.goBeforPage(business);
            });
        },
        /*判断是否全填*/
        isFill:function(){
            var params= $("#addDataForm").serializeObject();
            if($.trim(params.timer)&&$.trim(params.highValue)&&$.trim(params.lowValue)&&$.trim(params.heartRate)){
                return true;
            }
        },
        remarkL:function() {
            $('#addData .total i:eq(0)').html($('#addData .noteCon textarea').val().length);
        },
        addBloodPressure:function(params,business){
            var _t=this;
            var reqData={};
            /*reqData.openid='ocPs50jpuKP63eFx1GFl7pjB8dlo';*/
            reqData.openid=Common.param.openid;
            reqData.sbp=params.highValue;
            reqData.dbp=params.lowValue;
            reqData.heartRate=params.heartRate;
            reqData.comment=params.Remarks;
            reqData.measureTime=params.timer.replace(/['年'|'月']/g,'-').replace(/['日']/g,'')+':00';
            /*console.log(reqData);*/
            Common.req("wxportal.addBloodPressure","post",reqData, function(data) {
                /*console.log(data)*/
                if(data.state==0){
                    setTimeout(function(){
                        $.toast("提交成功",1000,function(){
                            _t.goBeforPage(business)
                        });
                    },300)
                }
            },function(data){
                /*console.log(data)*/
                setTimeout(function(){
                    $.toast("提交失败",1000);
                },300)
            });
        },
        goBeforPage:function(business){
           /* history.pushState({},"",'app_1_record.html');
            history.replaceState({},"",'app_1_record.html');*/
            if(business=="record"){
                Common.router.go(business);
            }else{
                Common.router.trigger("record", {
                    module : "record",
                    method : "init",
                    params : [ "index" ]
                });
            }
        }
    }

    return AddData;
});