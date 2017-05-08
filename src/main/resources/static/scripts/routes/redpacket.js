define([ "jquery", "ejs", "common", "jweixin", "extend", "fn", "uilib" ], function($, EJS, Common, wx) {
	function Redpacket() {
		this.ejs = "views/redpacket/index";
		this.cssPath = [ "styles/global.css", "styles/layout.css", "styles/ui.css", "styles/redpacket.css" ];
	}
	Redpacket.prototype = {
		init : function(moduleName) {
			var _t = this;
			var shareURL = window.location.href+"?packet="+Common.param.packet;
			history.pushState({},"",shareURL);
			history.replaceState({},"",shareURL);
			wx.showOptionMenu();
			
			var params = {
				openid : Common.param.openid
			};
			
			Common.req("wxportal.loginByOpenid", params, function(result) {
				_t.uid = result.user.uid;
				_t.mobile = result.user.mobile;
				Common.panel.add(_t.ejs, "redpacket").open(true);
				
				_t.getuserinfoFromWeixin();
			}, function(result) {
				Common.router.trigger("redpacketlogin", {
					module : "redpacketlogin",
					method : "init",
					params : [ "index" ]
				});
			});

		},
		getuserinfoFromWeixin : function() {
			var _t = this;
			Common.req("weixin.userinfo", {
				access_token : Common.param.accessToken,
				openid : Common.param.openid,
				lang : "zh_CN"
			}, function(data) {
				_t.robredpacket(data.nickname, data.headimgurl);
			});
		},
	}
	return Redpacket;
});