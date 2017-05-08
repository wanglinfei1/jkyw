// var appPath = document.body.getAttribute("appPath");
var appPath = "";
requirejs.config({
	baseUrl : appPath + "/scripts",
	paths : {
		jquery : "lib/jquery1.11",
		ejs : "lib/ejsforRequire",
		jweixin : "lib/jweixin-1.0.0",
		md5 : "lib/md5",
		wangCommon:"public/wangCommon",
		routes : "public/routes",
		form : "public/form",
		fn : "public/fn",
		uilib : "public/jqery.ui.all",
		common : "public/common",
		errorConfig : "public/errorConfig",
		jqWeui:"lib/jquery-weui",
		weui:"public/weui",
		fastclick:"lib/fastclick",
		percent:"public/Percent",
		touchSwiper:"lib/touchSwiper"
	},
	shim : {
		uilib : [ "jquery" ],
		fn : [ "jquery" ],
		jqWeui:["jquery","weui"]
	}
});

define("extend", [ "jquery", 'public/jquery.extend'], function() {
	return $;
});

define([ "jquery", "common", "jweixin", "weui", "fn" ], function($, Common, wx, weui) {
	$(function() {

		//去掉微信oauth验证后添加的相关参数
		//var url = window.location.href.replace(new RegExp(/[?&]code=\w+.+/g),"");
		var url = window.location.href.replace(new RegExp(/\?.+/g),"");
		var from=Common.param.from;
		var fromType=browser.versions.microMessenger;
		if(Common.param.needSignature=="true"&&from!='app'){
			if(url!=window.location.href){
                if(browser.versions.iPhone||browser.versions.iPad||browser.versions.ios){
                    /*window.location.href = url;*/
                    history.pushState({},"",url);
                    history.replaceState({},"",url);
					/*alert(window.location.href);*/
                }else{
                    history.pushState({},"",url);
                    history.replaceState({},"",url);
                }
			}

			wx.config({
				debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId : $("#config-appId").text(), // 必填，公众号的唯一标识
				timestamp : $("#config-timestamp").text(), // 必填，生成签名的时间戳
				nonceStr : $("#config-nonceStr").text(), // 必填，生成签名的随机串
				signature : $("#config-signature").text(),// 必填，签名，见附录1
				// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				jsApiList : [
					"hideOptionMenu",//隐藏右上角菜单接口
					"hideAllNonBaseMenuItem",//隐藏所有非基础按钮接口
					"hideMenuItems",//批量隐藏功能按钮接口
					"showMenuItems",//批量显示功能按钮接口
					"showAllNonBaseMenuItem",//显示所有功能按钮接口
					"onMenuShareTimeline",//分享到朋友圈
					"onMenuShareAppMessage",//分享给朋友
					"onMenuShareQQ",//分享到QQ
					"onMenuShareWeibo",//分享到腾讯微博
					"onMenuShareQZone",//分享到QQ空间
					"closeWindow",//关闭当前网页窗口接口
					"scanQRCode",//二维码分享
					"chooseImage",//相机和相册
					"previewImage",//预览图片
					"uploadImage",//上传图片
					"menuItem:refresh",//刷新
					"menuItem:addContact",//查看公众号（未添加）:
					"menuItem:profile",//查看公众号（已添加）
					"menuItem:share:appMessage",//发送给朋友:
					"menuItem:share:timeline" //分享到朋友圈
				]
			});
			wx.ready(function() {
				console.info("load success");
				wx.hideAllNonBaseMenuItem();
				// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				Common.router.trigger("index", {
					module : Common.param.module,
					metod : "init"
				});
			});
			wx.error(function(res) {
				console.error(res);
				console.log(111);
				/*$.toast("授权失败，请稍后再试！");*/
				//alert(JSON.stringify(res));
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			});
		}else{
			// 跳转路由
			Common.router.trigger("index", {
				module : Common.param.module,
				metod : "init"
			});
		}
		sessionStorage.setItem('scrollTop',$(document).scrollTop());


	});
});
