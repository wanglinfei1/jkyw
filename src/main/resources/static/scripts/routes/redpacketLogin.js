define([ "jquery", "ejs", "common","errorConfig", "extend", "fn", "uilib", "md5" ], function($, EJS, Common,Error) {
	function RedpacketLogin() {
		this.ejs = "framework/views/redpacket/login";
		this.cssPath = [ "framework/styles/global.css", "framework/styles/layout.css", "framework/styles/ui.css", "framework/styles/redpacket.css" ];
	}
	RedpacketLogin.prototype = {
		init : function(moduleName) {
			var _t = this;
			Common.panel.add(_t.ejs,"redpacketlogin").open(true);

			_t.refreshVerifyCode();// 初始化验证码
			$("#redpacketloginverifyCodeImg").click(function() {
				_t.refreshVerifyCode();// 刷新验证码
			});

			$("#binding").unbind("click").bind("click", function() {
				_t.bindingAndLogin(moduleName);
			});

			$("#toredpacketregister").unbind("click").bind("click", function() {
				Common.router.trigger("redpacketregister", {
					module : "redpacketregister",
					method : "init",
					params : [ "redpacketlogin" ]
				});
			});
		},
		refreshVerifyCode : function() {
			$("#redpacketloginVerifyCode").val("");
			var time = (new Date()).valueOf();
			this.key = "redpacketlogin_" + Common.param.openid + "_checkcode";
			//alert(Common.param.serverPath + "/checkcode?key=" + this.key + "&time=" + time);
			//$("#redpacket_binding").append(Common.param.serverPath + "/checkcode?key=" + this.key + "&time=" + time);
			$("#redpacketloginverifyCodeImg").attr("src", Common.param.serverPath + "/filmserver/checkcode?key=" + this.key + "&time=" + time);
		},
		bindingAndLogin : function(moduleName) {
			var _t = this;
			var params = $("#redpacket_binding").serializeObject();
			$.extend(params, {
				password : hex_md5(params.password),
				openid : Common.param.openid,
				validatecodekey : this.key
			});

			// 调登录并绑定
			Common.req("wxportal.WDUserBindingToWX", params, function() {
				$.Confirm({
					"html" : "绑定成功！",
					"buttons" : {
						"确定" : function() {
							// 点确认执行的代码
							if (moduleName)
								Common.router.go(moduleName);
						}
					}
				});
			}, function(result) {
				if(result.status==18009){
					Error.show(18009,"wxportal.WDUserBindingToWX");
				}else{
					Error.show(result.msg);
				}
			});
		}
	}
	return RedpacketLogin;
});