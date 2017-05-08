/**
 * Created by 160506 on 2017/3/22.
 */
define(["jquery","common","errorConfig","fastclick","jweixin","extend","weui","jqWeui","touchSwiper"],function($,Common,Error,FastClick,wx){
    function ArticleDetails(){
        this.ejs = "views/article-details";
        this.cssPath = ["styles/reset.css","styles/articleDetails.css","styles/weui.min.css","styles/jquery-weui.css","styles/style.css"];
    }

    ArticleDetails.prototype={
        init:function(business) {
            /*console.info("文章ID："+Common.param.id);*/
            var _t = this;
            $(function () {
                FastClick.attach(document.body);
            });
            $(document.body).off('infinite');
            var id=Common.param.id;
            var from=Common.param.from||getRequestParam('from');
            if(!id){
                _t.goBeforPage(business);
            }else{
                Common.panel.add(_t.ejs,{}, "ArticleDetails").open(true);
                this.queryArticleInfo(business);
                this.share();
            }
            if(from!='app'){
                $("#ArticleDetails").swipe({
                    swipeRight: function() {
                        console.log('prev');
                        _t.goBeforPage(business);
                    },
                    preventDefaultEvents:true
                });
            }
        },
        /*微信分享SDK*/
        share:function(){
            /*分享到朋友圈*/
            var _t=this;
            wx.ready(function() {
                console.log(1);
                /*history.replaceState({},"",'app_1_articleDetails.html?id='+Common.param.id);*/
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

            });
        },
        queryArticleInfo:function(business){
            var _t=this;
            Common.req("wxportal.queryArticleInfo", "get", {id:Common.param.id}, function (data) {
                var data=data.data;
                if(data.updateTime){
                    data.timer=new Date(data.updateTime).format('yyyy-MM-dd');
                }
                console.log(data);
                var html = new EJS({url: "views/article-details1"}).render({data:data});
                $('#ArticleDetails').html(html);
                $(document).scrollTop(0);
               var imgWidth= $('#ArticleDetails .imgWrapper img').outerWidth();
                $('#ArticleDetails .imgWrapper img').css('height',imgWidth*3/4+'px');
                var smallImage=data.smallImage;
                wx.onMenuShareTimeline({
                    title: '关爱健康，从点滴做起！来智医与大家分享健康服务吧！', // 分享标题
                    link: Common.param.domainName+'app_1_articleDetails.html?id='+Common.param.id, // 分享链接
                    imgUrl: smallImage, // 分享图标
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
                    link: Common.param.domainName+'app_1_articleDetails.html?id='+Common.param.id, // 分享链接
                    imgUrl: smallImage, // 分享图标
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
            }, function (data) {

            },true);
        },
        goBeforPage:function(business){
            //history.replaceState({},"",'app_1_knowledge.html');
            if(business=="knowledge"){
                Common.router.go(business);
            }else{
                Common.router.trigger("knowledge", {
                    module : "knowledge",
                    method : "init",
                    params : [ "index" ]
                });
            }
        }

    }

    return ArticleDetails;
});