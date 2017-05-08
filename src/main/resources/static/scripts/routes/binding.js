define([ "jquery", "ejs", "common", "errorConfig","jweixin", "extend", "fn", "uilib", "md5" ], function($, EJS, Common,Error,wx) {
	function Binding() {
		this.ejs = "framework/views/binding";
		this.cssPath = [ "framework/styles/form.css", "framework/styles/global.css", "framework/styles/layout.css", "framework/styles/ui.css" ];
	}
	Binding.prototype = {
		init : function(business) {
			var _t = this;
			
			wx.showAllNonBaseMenuItem();
			
			Common.panel.add(_t.ejs,"binding").open(true);

			_t.refreshVerifyCode();// 初始化验证码

			$("#verifyCodeImg").click(function() {
				_t.refreshVerifyCode();// 刷新验证码
			});
			$("#goback").unbind("click").bind("click", function(event) {
				event.preventDefault();
				Common.router.go(business);
			});
			$("#submit").bind("click", function(event) {
				var mobile = $("#mobile").val();
				var password = $("#password").val();
				var verifycode = $("#verifycode").val();
				if (!checkMobile(mobile)) {
					$.Confirm({
						"html" : "请输入正确手机号！",
						"buttons" : {
							"确定" : function() {
							}
						}
					});
					return;
				}
				if (!checkOldPassword($.trim(password))) {
					$.Confirm({
						"html" : "请输入密码！",
						"buttons" : {
							"确定" : function() {
							}
						}
					});
					return;
				}
				_t.bindingMember();
			});
		},
		refreshVerifyCode : function() {
			$("#loginVerifyCode").val("");
			var time = (new Date()).valueOf();
			this.key = "binding_" + Common.param.openid + "_checkcode";
			$("#verifyCodeImg").attr("src", Common.param.serverPath + "/checkcode?key=" + this.key + "&time=" + time);
		},
		bindingMember : function() {
			var _t = this;
			var params = $("#binding_form").serializeObject();
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
							WeixinJSBridge.call('closeWindow');
						}
					}
				});
			}, function(result) {
				if(result.status==18009){
					Error.show(18009,"wxportal.WDUserBindingToWX");
				}else{
					Error.show(result.msg);
				}
				_t.refreshVerifyCode();
			});
		}
	}
	return Binding;
});