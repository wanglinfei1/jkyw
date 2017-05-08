define([ "jquery", "uilib" ], function($) {
	return {
		codeConfig : {
			global : {// 全局错误映射配置
				timeout:"当前访问人数过多，请稍候再试！",
				parsererror:"系统繁忙，请稍候再试！",
				error:"系统繁忙，请稍候再试！",
				1999 : "系统繁忙，请稍候再试！",
				1011 : "请求失败，请重试！"
			},
			"wxportal.WDUserBindingToWX" : {
				999 : "系统繁忙，请稍候再试！",
				18009:"您的万达帐号已被其他微信用户绑定"
			},
			"wxportal.WDUserRegistor" :{
				13006 : "短信验证码不正确",
				19001 : "短信验证码不为空"
			},
			"wxportal.robRedpacket":{
				999:"系统繁忙，请重试！",
//				12320 : "券不存在或券不可用"
			}
		},
		show : function(code, method) {
			var msg = "";
			if(typeof code === "string" && !method){
				msg = code;
			}else{
				if (method) {
					msg = this.codeConfig[method][code];
				}else{
					msg = this.codeConfig.global[code];
				}
			}
			/*$.Confirm({
				"html" : msg,
				"buttons" : {
					"确定" : function() {
            
					}
				}
			});*/
		}
	}
});
