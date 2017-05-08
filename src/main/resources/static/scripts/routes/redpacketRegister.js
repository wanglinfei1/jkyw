define([ "jquery", "ejs", "common","errorConfig","extend","fn","uilib"], function($, EJS, Common,Error) {
	function RedpacketRegister() {
		this.ejs = "framework/views/redpacket/register";
		this.cssPath = [ "framework/styles/global.css", "framework/styles/layout.css", "framework/styles/ui.css","framework/styles/redpacket.css" ];
	}
	RedpacketRegister.prototype = {
		init : function(moduleName) {
			var _t = this;
			Common.panel.add(_t.ejs,"redpacketRegister").open(true);
			
			$("#redpacketregisterbtn").unbind("click").bind("click",function(){
				var params= $("#registorForm").serializeObject();
				if($.trim(params.mobile)=="" ){
					Error.show("手机号不能空");
					return;
				}
				if($.trim(params.password)==""){
					Error.show("密码不能为空");
					return;
				}
				if(params.password!=params.password1){
					Error.show("您两次输入的密码不一致");
					return;
				}
				if($.trim(params.checkcode)==""){
					Error.show("验证码不能为空");
					return;
				}
				Common.req("wxportal.WDUserRegistor",params,function(result){
					$.Confirm({
						"html" : "注册成功！",
						"buttons" : {
							"确定" : function() {
								Common.router.go(moduleName);
							}
						}
					});
				});
			});
			
			//获取手机验证码
			$("#getphonecode").unbind("click").bind("click",function(){
				var mobile=$("#registorForm input[name='mobile']").val();
				if(mobile==""){
					$.FloatingHint({id:"errorFloatingHint",width:"",holdTime:3000,text:"请输入的手机号！"});
					//$.FloatingHint({id:"FloatingHint",width:"",holdTime:0,type:"error",text:"请输入的手机号！"});
					return;
				}
				if(!checkMobile(mobile)){
					$.FloatingHint({id:"FloatingHint",width:"",holdTime:3000,text:"你输入的手机号不正确！"});
					return;
				}
				Common.req("wxportal.smsauthcode",{mobile:mobile},function(result){
					$.Confirm({
						"html" : "验证码发送成功！",
						"buttons" : {
							"确定" : function() {
								
							}
						}
					});
				});
			});
		}
	}
	return RedpacketRegister;
});