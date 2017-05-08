/**
 * Created by 160506 on 2017/3/22.
 */
/**
 * Created by wanglinfei on 2017/3/16.
 */
define(["jquery","common","errorConfig","fastclick","jweixin","extend","weui","jqWeui","touchSwiper","wangCommon"],function($,Common,Error,FastClick,wx) {
    function Knowledge() {
        this.ejs = "views/knowledge";
        this.cssPath = ["styles/reset.css","styles/knowledge.css", "styles/weui.min.css", "styles/jquery-weui.css","styles/style.css"];
        this.pageNum = 1;
        this.pageSize = 20;
        this.len;
        this.loading = false;
        this.listArr={};
    }

    Knowledge.prototype = {
        init: function (business) {
            var _t = this;
            Common.panel.add(_t.ejs, {}, "knowledge").open(true);
            $(function () {
                FastClick.attach(document.body);
            });
            this.queryArticleList(_t.pageNum,true);
            this.share();
            /*$("#knowledge").swipe({
                swipeRight: function() {
                    console.log('prev');
                    _t.closeWind();
                },
                preventDefaultEvents:true
            });*/
        },
        /*关闭窗口*/
        closeWind:function(){
            wx.ready(function() {
                wx.closeWindow();
            });
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
        /*微信分享SDK*/
        share:function(){
            /*分享到朋友圈*/
            var _t=this;
            wx.ready(function() {
                console.log(Common.param.domainName);
                wx.hideAllNonBaseMenuItem();
                /*wx.hideMenuItems({
                    menuList: [
                        "menuItem:refresh"
                    ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });*/
                wx.showMenuItems({
                    menuList: [
                        "menuItem:addContact",//查看公众号（未添加）:
                        "menuItem:profile",//查看公众号（已添加）
                        "menuItem:share:appMessage",//发送给朋友:
                        "menuItem:share:timeline" //分享到朋友圈
                    ] // 要显示的菜单项，所有menu项见附录3
                });
                wx.onMenuShareTimeline({
                    title: '关爱健康，从点滴做起！来智医与大家分享健康服务吧！', // 分享标题
                    link: Common.param.domainName+'app_1_knowledge.html', // 分享链接
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
                    title: '关爱健康，从点滴做起！来智医与大家分享健康服务吧！', // 分享标题
                    desc: '关注智医，共享家人健康管理！', // 分享描述
                    link: Common.param.domainName+'app_1_knowledge.html', // 分享链接
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
        queryArticleList: function (pageNum,loading) {
            var _t = this;
            Common.req("wxportal.queryArticleList", "get", {
                pageSize: _t.pageSize,
                pageNum: pageNum
            }, function (data) {
               /* data.data.result.length=0*/
                if (data.data.result.length > 0) {
                    _t.createElement(data.data, pageNum);
                    $('.weui-loadmore1').css('display', 'none');

                } else {
                    $('.weui-loadmore2').css('display','none');
                    $('.weui-loadmore1').css('display', 'block');
                    $('.weui-loadmore1 .weui-loadmore__tips').html('暂无数据');
                }
            }, function (data) {
                $('.weui-loadmore2').css('display','none');
                $('.weui-loadmore1').css('display', 'block');
                $('.weui-loadmore1 .weui-loadmore__tips').html('加载失败');
            },loading);
        },
        createElement: function (data, pageNum) {
            var _t=this;
            console.log(data);
            var pages=data.pages;
            var dataResult = data.result;
            var num = dataResult.length;
            var arrTime=[];
            /*console.log(num)*/
            if(num<_t.pageSize){
                $('.weui-loadmore3').css('display','block');
                $('.weui-loadmore2').css('display','none');
            }else{
                $('.weui-loadmore3').css('display','none');
            }
            for (var i = 0; i < num; i++) {
                if(dataResult[i].updateTime){
                    arrTime.push(new Date(dataResult[i].updateTime).format('yyyy-MM-dd'));
                }else{
                    arrTime.push('');
                }

            }
            /*console.log(arrTime);*/
            if (pageNum == 1) {
                var html = new EJS({url: "views/knowledgePage"}).render({dataResult: dataResult,arrTime:arrTime});
                $('#knowledge .knowledge').html(html);
                $(document).scrollTop(sessionStorage.getItem('scrollTop'));
            } else {
                var html = new EJS({url: "views/knowledgePage"}).render({dataResult: dataResult,arrTime:arrTime});
                $(html).appendTo('#knowledge .knowledge');
                _t.loading=false;
                if(sessionStorage.getItem('scrollTop')>2143*(pageNum-1)){
                    $(document).scrollTop(sessionStorage.getItem('scrollTop'));
                }
            }

            $('.knowledge-item').unbind('click').bind('click', function () {
                var id = $(this).attr('data-id')
                /*history.replaceState({}, "", "app_1_articleDetails.html?id=" + id);*/
                _t.pushHistory("title","#");
                Common.param.id=id;
                Common.router.trigger("articleDetails", {
                    module: "articleDetails",
                    method: "init",
                    params: ["index"]
                });
                sessionStorage.setItem('scrollTop',$(document).scrollTop());
            })
            /*$('.weui-loadmore2').css('display', 'none');*/
            $('.weui-loadmore2 .weui-loadmore__tips').html('上拉加载更多');
            $(document.body).off('infinite').infinite(10).on("infinite", function () {
                pageNum++;
                if(pageNum>pages){
                    return;
                }
                if(_t.loading) return;
                _t.loading = true;
                $('.weui-loadmore2 .weui-loadmore__tips').html('加载中');
                _t.queryArticleList(pageNum,true);
            });
        },
    }

    return Knowledge;
});

