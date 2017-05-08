/**
 * Created by wanglinfei on 2017/3/15.
 */
define(["jquery","common","weui","fastclick","jweixin","extend","jqWeui","touchSwiper"],function($,Common,weui,FastClick,wx){
    function MyselfInfor(){
        this.ejs = "views/person_info";
        this.cssPath = ["styles/reset.css","styles/person_info.css","styles/weui.min.css","styles/jquery-weui.css","styles/style.css"];
        this.imgUrlId='11';
    }

    MyselfInfor.prototype={
        init:function(business){
            var _t = this;
            Common.panel.add(_t.ejs,{},"myselfInfor").open(true);
            $(function() {
                FastClick.attach(document.body);
            });
            /*this.getUserinfo();*/
            var inforArr=["name","sex","birthDate","mobile"];
            for(var i=0;i<inforArr.length;i++){
                _t.selfInfor(inforArr[i])
            }
            /*填写姓名页*/
            $('#myselfInfor #name').off('click').on('click',function(){
                Common.router.trigger("myName", {
                    module : "myName",
                    method : "init",
                    params : [ "myselfInfor" ]
                });
            });
            function changeColor(){
                if(_t.isFill()){
                    $('#myselfInfor #submit').addClass('complete');
                }else{
                    $('#myselfInfor #submit').removeClass('complete');
                }
            }
            /*监控input*/
            $('#myselfInfor input').off('input').on("input",changeColor);
            /*表单验证*/
            $("#myselfInfor #submit").unbind("click").bind("click",function(){
                if(!$(this).hasClass('complete')){
                    return;
                }
               _t.formDataInfor(business,inforArr);
            });
            /*滑动返回上一页*/
            $("#myselfInfor").swipe({
                swipeRight: function() {
                    _t.gotoBefore(business);
                },
            });
            /*日历插件*/
            $('#myselfInfor #birthDate').off('click').on('click',_t.datePicker);
            /*性别层弹窗*/
            this.sexSheet();
            this.wxSdk();
        },
        selfInfor:function(dataInfor){
            var _t=this;
            if(dataInfor=='name'){
                inputVal=$('#app-main').attr("data-"+dataInfor)||localStorage.getItem("data-"+dataInfor);
            }else{
                var inputVal=localStorage.getItem("data-"+dataInfor);
            }
            if(inputVal){
                if(dataInfor=='sex'){
                    inputVal=inputVal==1?'男':'女'
                }
                if(dataInfor=='mobile'){
                    $('#myselfInfor #'+dataInfor+'').attr("readonly","readonly")
                }
                $('#myselfInfor #'+dataInfor+'').val(inputVal);
                if(_t.isFill()){
                    $('#myselfInfor #submit').addClass('complete');
                }
            }
        },
        /*获取个人信息接口*/
        getUserinfo:function(){
            Common.req("weixin.userinfo","get",{}, function(data) {
                 /*console.log(data);*/
                if(data.data.headimgurl){
                    /*console.log(data.data.headimgurl)*/
                    $('#myselfInfor .avatar img').attr('src',data.data.headimgurl);
                }
            },function(data){
                 console.log(data);
            });
        },
        /*微信SDK*/
        wxSdk:function(){
            var _t=this;
            wx.ready(function() {
                wx.hideAllNonBaseMenuItem();
                /* wx.showMenuItems({
                 menuList: [
                 "refresh"
                 ] // 要显示的菜单项，所有menu项见附录3
                 });*/
                /*上传图片*/
                /*$('#myselfInfor .avatar').off('click').on('click',function(){
                    wx.chooseImage({
                        count: 1, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            $('#myselfInfor .avatar img').attr('src',localIds[0]);
                            /!*previewImage(localIds[0])*!/
                            upload(localIds);
                        }
                    });
                });*/
                function previewImage(current){
                    wx.previewImage({
                        current: current, // 当前显示图片的http链接
                        urls: [] // 需要预览的图片http链接列表
                    });
                }
                function upload(localIds){
                    wx.uploadImage({
                        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                            var serverId = res.serverId; // 返回图片的服务器端ID
                            _t.imgUrlId=serverId;
                            $('#myselfInfor .avatar img').attr('data_imgUrlId',serverId);
                        }
                    });
                }
            });
        },
        /*表单验证提交*/
        formDataInfor:function(business,inforArr){
            var _t=this;
            //var imgUrlId=$('#myselfInfor .avatar img').attr('data_imgUrlId');
            /* console.log(imgUrlId);*/
            var params= $("#perfectForm").serializeObject();
            var reg=/[^\x00-\x80]/;
            if($.trim(params.name)=="" ){
                $.toast("姓名不能为空","forbidden");
                return;
            }
            if($.trim(params.sex)==""){
                $.toast("性别不能为空，请选择", "forbidden");
                return;
            }
            if($.trim(params.birthDate)==""){
                $.toast("出生日期不能为空，请选择", "forbidden");
                return;
            }else if(_t.isBirthDate($.trim(params.birthDate))){
                $.toast("请选择正确的出生日期", "forbidden");
                return;
            }
            if($.trim(params.mobile)==""){
                $.toast("手机号不能为空", "forbidden");
                return;
            }else if(!checkMobile($.trim(params.mobile))){
                $.toast("请填入正确的手机号","forbidden");
                return;
            }
            if(params.sex=="男"){
                params.sex=1;
            }else if(params.sex=="女"){
                params.sex=2;
            }
            params.openid=Common.param.openid;
            Common.req("wxportal.completeInfo","post", params, function(data) {
                /* console.log(data);*/
                setTimeout(function(){
                    $.toast("保存成功",1000,function(){
                        _t.gotoBefore(business);
                        for(var i=0; i<inforArr.length;i++){
                            localStorage.setItem("data-"+inforArr[i],params[inforArr[i]]);
                        }
                        $('.mui-dtpicker').remove();
                    });
                },300);
            },function(data){
                setTimeout(function(){
                    $.toast(data.msg,1000);
                },300);
                /* console.log(data);*/
            });
            return;
        },
        /*出生年月校验*/
        isBirthDate:function(myDate){
            var timerDa=new Date().getTime();
            var myDate=(new Date(myDate)).getTime();
            if(myDate<=timerDa){
                return false;
            }
            return true;
        },
        /*日历插件*/
        datePicker:function(){
            var _t=this;
            var oYear=new Date().getFullYear();
            weui.datePicker({
                start: 1900,
                end: oYear,
                onChange: function (result) {

                },
                onConfirm: function (result) {
                    var min=result[1]<10?'0'+result[1]:result[1];
                    var Day=result[2]<10?'0'+result[2]:result[2];
                    $('#myselfInfor #birthDate').val(result[0]+'-'+min+'-'+Day);
                    var params= $("#perfectForm").serializeObject();
                    if($.trim(params.name)&&$.trim(params.sex)&&$.trim(params.birthDate)&&$.trim(params.mobile)){
                        $('#myselfInfor #submit').addClass('complete');
                    }
                }
            })
        },
        /*性别弹窗*/
        sexSheet:function(){
            var $iosActionsheet = $('#iosActionsheet');
            var $iosMask = $('#iosMask');
            var _t=this;
            function hideActionSheet() {
                $iosActionsheet.removeClass('weui-actionsheet_toggle');
                $iosMask.fadeOut(200);
            }

            $iosMask.off('click').on('click', hideActionSheet);
            $('#iosActionsheetCancel').on('click', hideActionSheet);
            $("#myselfInfor #sex").on("click", function(){
                $iosActionsheet.addClass('weui-actionsheet_toggle');
                $iosMask.fadeIn(200);
            });
            $('#myselfInfor .cell').on('click',function(){
                hideActionSheet();
                $("#myselfInfor #sex").val($(this).html());
                if(_t.isFill()){
                    $('#myselfInfor #submit').addClass('complete');
                }
            })
        },
        /*是否全填*/
        isFill:function(){
            var params= $("#perfectForm").serializeObject();
            if($.trim(params.name)&&$.trim(params.sex)&&$.trim(params.birthDate)&&$.trim(params.mobile)){
                return true;
            }
        },
        /*返回前一页*/
        gotoBefore:function(business){
            /*history.pushState({},"",'app_1_record.html');
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

    return MyselfInfor;
});