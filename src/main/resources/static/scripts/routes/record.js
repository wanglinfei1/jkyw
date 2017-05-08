/**
 * Created by wanglinfei on 2017/3/15.
 */
define(["jquery","common","fastclick","jweixin","weui","jqWeui","percent","touchSwiper","wangCommon"],function($,Common,FastClick,wx){
    function Record(){
        this.ejs = "views/record";
        this.cssPath = ["styles/reset.css","styles/record.css","styles/weui.min.css","styles/jquery-weui.css","styles/style.css"];
        this.slideNum=0;
    }

    Record.prototype={
        init:function(){/*console.log('js',11)*/
            var _t = this;
            Common.panel.add(this.ejs,{title:_t.title},"record").open(true);
            /*click延迟处理*/
            $(function() {
                FastClick.attach(document.body);
            });
            $(document.body).off('infinite');
            /*是否完善信息跳转*/
            var isPerfectInfor= $('#app-main').attr('data_isPerfectInfor');

            if(Common.param.openid){
                if(isPerfectInfor!='isTrue'){
                    _t.isPerfectInfor();
                }
                /*列表请求*/
                this.queryBloodPressureList();
                $('#record .goAddData').unbind("click").bind("click",function(){
                    isPerfectInfor= $('#app-main').attr('data_isPerfectInfor');
                    if(isPerfectInfor=='isTrue'){
                        _t.goAddData();
                    }else if(isPerfectInfor=='isFalse'){
                        _t.myselfInfor();
                    }
                });
            }else{
                $('#record .goAddData').unbind("click").bind("click",function(){
                    $.toast("微信授权失败，请重新授权！","forbidden")
                });
            }

            $('#record .goAddSugar').unbind("click").bind("click",function(){
                $.toast("该功能暂未开放，请耐心等待","forbidden",function(){
                    /*显示二维码*/
                    //_t.showQRcode();
                })
            });
            /*分享模块*/
            this.share();
            /*$("#record").swipe({
                swipeRight: function() {
                    console.log('prev');
                    _t.slideNum++;
                    if(_t.slideNum==2){
                        _t.closeWind();
                    }else if(_t.slideNum==1){
                        $.toast("再右划一次退出",1000);
                    }
                },
                preventDefaultEvents:true
            });*/
            /*this.swiperTitle();*/
        },
        pushHistory:function pushHistory(title,url) {
            var state = {
                title: title,
                url: url
            };
            if(!window.history.state){
                window.history.pushState(state, "title", "#");
            }else {
                if (window.history.state.url != '#') {
                    console.log(1);
                    window.history.pushState(state, "title", "#");
                }
            }
        },
        /*滑动提示*/
        swiperTitle:function(){
            $.notification({
                title: "",
                text: "向右滑动页面返回上一页",
                time:1000,
                media: "",
                data: "123",
            });
        },
        /*关闭窗口*/
        closeWind:function(){
            wx.ready(function() {
                wx.closeWindow();
            });
        },
        /*微信分享SDK*/
        share:function(){
            /*分享到朋友圈*/
            var _t=this;
            wx.ready(function() {
                console.log(Common.param.domainName);
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
        /*跳转到完善信息页*/
        myselfInfor:function(){
           /* history.pushState({},"",'app_1_myselfInfor.html');
            history.replaceState({},"",'app_1_myselfInfor.html');*/
            this.pushHistory("title","#");
            Common.router.trigger("myselfInfor", {
                module : "myselfInfor",
                method : "init",
                params : [ "index" ]
            });
        },
        /*跳转到添加数据页*/
        goAddData:function(){
           /* history.pushState({},"",'app_1_addData.html');
            history.replaceState({},"",'app_1_addData.html');*/
            this.pushHistory("title","#");
            Common.router.trigger("addData", {
                module : "addData",
                method : "init",
                params : [ "index" ]
            });
        },
        /*跳转到更多记录页*/
        goMore:function(){
           /* history.pushState({},"",'app_1_moreRecords.html');
            history.replaceState({},"",'app_1_moreRecords.html');*/
            this.pushHistory("title","#");
            Common.router.trigger("moreRecords", {
                module : "moreRecords",
                method : "init",
                params : [ "index" ]
            });
        },
        /*是否完善信息*/
        isPerfectInfor : function() {
            var _t=this;
            Common.req("wxportal.isCompleteInfo","get", {
                openid : Common.param.openid
               /* openid : 'ocPs50jpuKP63eFx1GFl7pjB8dlo'*/
            }, function(data) {
                /*console.log(data)*/
               if(data.state==0){
                   $('#app-main').attr('data_isPerfectInfor','isTrue');
               }
            },function(data){
                console.log(data)
                $('#app-main').attr('data_isPerfectInfor','isFalse');
            },1);
        },
        /*获取血压记录信息*/
        queryBloodPressureList:function () {
            var _t=this;
            Common.req("wxportal.queryBloodPressureList","get", {
                openid : Common.param.openid,
                /*openid : 'ocPs50jpuKP63eFx1GFl7pjB8dlo',*/
                pageNum: 1,
                pageSize:2
            }, function(data) {
                /*console.log(data)*/
                if(data.data.result.length){
                    $('#record .recordCon').css('display','block');
                    var queryLis=data.data.result[0];
                    var sbqFix=(queryLis.sbp/2.5).toFixed(2);
                    var bbqFix=(queryLis.dbp/2).toFixed(2);
                    var heartRateFix=(queryLis.heartRate/1.5).toFixed(2);
                    function canvasColor(project){
                        if(queryLis[project]=="normal"){
                            return "#A3D4FD";
                        }else if(queryLis[project]=="up"){
                            return "#ff9696";
                        }else if(queryLis[project]=="down"){
                            return "#89f3e8";
                        }
                    }
                    function fontColor(project){
                        if(queryLis[project]=="normal"){
                            return "#C6E5FE";
                        }else if(queryLis[project]=="up"){
                            return "#F8B5B8";
                        }else if(queryLis[project]=="down"){
                            return "#92f8ee";
                        }
                    }
                    var sbpRangeColor=canvasColor('sbpRange');
                    var dbpRangeColor=canvasColor('dbpRange');
                    var heartRateRangeColor=canvasColor('heartRateRange');
                    var sbpFontColor=fontColor('sbpRange');
                    var dbpFontColor=fontColor('dbpRange');
                    var heartRateFontColor=fontColor('heartRateRange');
                    /*console.log(sbpRangeColor);*/
                    $('#record .recordCon .figure div:eq(0)').html('<canvas id="canvas1" width="171" height="171" style="width:86px; height:86px;" data-total={"num":'+sbqFix+',"unit":"mmHg","color":"'+sbpRangeColor+'","fontColor":"'+sbpFontColor+'"}></canvas>');
                    $('#record .recordCon .figure div:eq(1)').html('<canvas id="canvas2" width="171" height="171" style="width:86px; height:86px;" data-total={"num":'+bbqFix+',"unit":"mmHg","color":"'+dbpRangeColor+'","fontColor":"'+dbpFontColor+'"}></canvas>');
                    $('#record .recordCon .figure div:eq(2)').html('<canvas id="canvas3" width="171" height="171" style="width:86px; height:86px;" data-total={"num":"'+heartRateFix+'","unit":"bpm","color":"'+heartRateRangeColor+'","fontColor":"'+heartRateFontColor+'"}></canvas>');
                    new Percent(document.getElementById('canvas1'),250,queryLis.sbp);
                    new Percent(document.getElementById('canvas2'),200,queryLis.dbp);
                    new Percent(document.getElementById('canvas3'),150,queryLis.heartRate);
                    var queryLisDate=new Date(queryLis.measureTime).format('yyyy-MM-dd hh:mm');
                    $('#record .recordCon .date span').html(queryLisDate);
                    /*console.log(JSON.parse($('#record .recordCon .figure canvas:eq(0)').attr('data-total')).num=10);*/
                    if(data.data.result.length==1){
                        $('#record .recordCon .goMore').css('display','none');
                    }else{
                        $('#record .recordCon .goMore').css('display','block');
                        $('#record .recordCon .goMore').off('click').on('click',function(){
                            _t.goMore();
                        });
                    }
                }
            },function(data){
                /*console.log(data)*/

            },1);
        },
        /*显示二维码*/
        showQRcode:function(){
            Common.router.trigger("QRcode", {
                module : "QRcode",
                method : "init",
                params : [ "index" ]
            });
        }
    }

    return Record;
});