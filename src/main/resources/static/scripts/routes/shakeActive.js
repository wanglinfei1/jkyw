define(["jquery", "common", "jweixin", "ejs"], function($, Common, wx, Ejs) {
	function Shake() {
		console.info(Common.param.openid);
		this.ejs = "framework/views/activity";
		this.cssPath = ["framework/styles/common.css"];
	}

	Shake.prototype = {
		headUrl : '',
		methodType : {
			get : "get",
			post : "post",
			put : "put"
		},
		dataType : {
			xml : "XML",
			html : "html",
			script : "script",
			json : "json",
			jsonp : "jsonp"
		},

		init : function() {
			var self = this;
			wx.hideOptionMenu();
			$("body").append(new EJS({
						url : self.ejs
					}).render({}));
			$.temp = {};
			$.temp.shake = this;
			$.temp.cinemaId = Common.param.cinemaID;
			$.temp.ticket = Common.param.ticket;

			$("#shakeBtn").bind("click", self, self.getCard);// 
			$("#batchAddCard").bind("click", self, self.addCardPackage);// 加入卡包
			$("#doEnergy").bind("mousedown", self.doEnergy);// 机器人动画
			$("#doEnergy").bind("keypress", self.doEnergy);// 机器人动画
			$("#registerFwd").bind("click", self.fwdRegister); // 跳转注册页面
			$("#doRegister").bind("click", self, self.doRegister); // 注册事件
			$("#getVerifyCode").bind("click", self, self.checkSmsauthcode);
			$("#login").bind("click", self, self.login);
			$("#getPrizeTest").bind("click", self.addCardPackage);
			$(".i-back").bind("click", function() {
						wx.closeWindow();
					});
			$("#getPrize").bind("click", self.getPrize);

		},
		/**
		 * 机器人充电方法
		 */
		doEnergy : function() {
			var self = $.temp.shake;
			$("#doEnergy").hide();
			$(".thunder").animate({
						height : 'toggle'
					});
			$(".battery").fadeIn(1000);
			$(".thunder_none").hide();
			// 1 动态进行充电动作
			var energy = $(".battery");
			var i = 1;
			var picUrl1 = "framework/img/battery-";
			setTimeout(function() {
						i++;
						$(".battery").find("img").attr("src",
								picUrl1 + i + ".png");
						if (i == 5) {
							// 2 open robot eyes
							$("#sleep").hide();
							$("#wakeUp").show();
							// 检测是否领取过卡券
							var flag = $.temp.shake.checkIfGetCard();
							if (flag) {
								alert("您已经参加过抽奖!");
								$("#doEnergy").hide();
								$("#lightbox").hide();
								return false;
							}
							// get card
							if (!self.getCard()) {
								return false;
							}
						} else {
							setTimeout(arguments.callee, 1000);
						}

					}, 1000);

		},
		/**
		 * 添加卡包信息
		 */
		addCardPackage : function() {
			var self = $.temp.shake;
			var timestamp = $("body").attr("timestamp") || "0";
			var apiTicket = $("body").attr("AppSecket") || "0";
			var card_id = $.temp.cardId;
			var cardCode = $.temp.cardInfo.code || "0";
			// 获取signature
			self.commonAjax(self.methodType.get,
					"rest/thirdpart/getSign/apiTicket/" + apiTicket
							+ "/cardId/" + card_id + "/cardCode/" + cardCode
							+ "/timestamp/" + timestamp + "/openId/" + "0", "",
					self.dataType.json, function(data) {
						if (!!data && !!data.signature) {
							var signature = data.signature;
							if (!self.record()) {
								WeixinJSBridge.invoke('batchAddCard', {
											"card_list" : [{
												"card_id" : card_id,
												"card_ext" : "{\"code\":\""
														+ cardCode + "\","
														+ "\"timestamp\":\""
														+ timestamp + "\","
														+ "\"signature\":\""
														+ signature + "\"}"
											}]
										}, function(res) {
											if (!!res && !!res.cardList
													&& res.cardList.length > 0) {
												alert("领奖成功,请去卡包查看或使用卡券!");
											}

										});
							} else {
								alert("系统故障请联系管理员!")
								return false;
							}
						} else {
							alert("获取签名错误");
							return false;
						}
					});

		},
		/**
		 * 万达接口 注册事件
		 */
		doRegister : function(outSideThis) {
			var self = this;
			var shake = $.temp.shake;
			var url = shake.headUrl + 'fastregister';

			var mobile = $.trim($("#registerMobile").val());
			if (!mobile) {
				alert("手机号不可为空!");
				$("#mobileNo").focus();
				return false
			}
			var verifyCode = $.trim($("#verifyCode").val());
			if (!verifyCode) {
				alert("验证码不可为空!");
				$("#verifyCode").focus();
				return false
			}
			var loginpassword = $.trim($("#registerpassword").val());
			if (!loginpassword) {
				alert("密码不可为空!");
				$("#loginpassword").focus();
				return false
			}
			var reloginpassword = $.trim($("#reRegisterpassword").val());
			if (!reloginpassword) {
				alert("确认密码不可为空!");
				$("#reRegisterpassword").focus();
				return false
			} else {
				if (loginpassword != reloginpassword) {
					alert("确认密码和输入密码不一致 请重新出入!");
					$("#reRegisterpassword").focus();
					return false;
				}
			}
			shake.commonAjax(shake.methodType.get,
					"rest/thirdpart/register?url=" + url + "&mobile=" + mobile
							+ "&password=" + loginpassword + "&code="
							+ verifyCode, "", shake.dataType.json, function(
							data) {
						$.temp.shake.bindMemeber();
						if (!!data && data.status == 0) {
							$.temp.User = data.user;
							$.temp.SessionID = $.temp.shake.getSessionId();
							$.temp.UID = data.user.uid;
							// 注册页面hide
							$(".register").hide();
							// 注册成功以后调用会员绑定接口
						} else {
							return false;

						}
					});

		},

		/**
		 * 添加中奖信息
		 */
		record : function() {
			var self = this;
			var cinemaid = $.temp.cinemaId || "0";
			var code = $.temp.cardInfo.code || "0";
			var type = $.temp.cardInfo.type || "0";
			var openid = $("body").attr("openid") || "0";

			$.temp.shake.commonAjaxSync($.temp.shake.methodType.post,
					'rest/activity/record/cinemaid/' + cinemaid + '/code/'
							+ code + '/openid/' + openid + '/type/' + type, "",
					$.temp.shake.dataType.json, function(data) {
						return !!data && data.status == 0 ? true : false;
					});
		},

		/**
		 * 用户领取奖品以后更新表状态
		 */
		consume : function() {
			var self = this;
			var code = $.temp.cardInfo.code;;
			$.temp.shake.commonAjax($.temp.shake.methodType.put,
					'rest/activity/claimlottery/code/' + code, "",
					$.temp.shake.dataType.json, function(data) {
						return !!data && data.status == 0 ? true : false;
					});
		},

		/**
		 * 万达接口 判断是否绑定
		 */

		checkIfBind : function(outSideThis) {
			var shake = outSideThis.data;
			var self = this;
			var url = shake.headUrl + 'isthirdaccountbind';
			var param = "source=" + 3 + "@thirdaccount="
					+ "ogs8vs3fH3Pwk02l70QD_iR-CSKQ1"
			shake.commonAjax(shake.methodType.get,
					"rest/thirdpart/interface?url=" + url + "&param=" + param,
					"", shake.dataType.json, function(data) {
						if (!!data && data.status == 0) {
							$.temp.User = data.user;
							$.temp.SessionID = $.temp.shake.getSessionId();
							$.temp.UID = data.user.uid;
							return true;
							// 注册页面hide
						} else if (data.status == 18007) {
							// 展现注册页面
							$(".popup").show();

						} else {
							alert(data.msg);
							return false;
						}
					});
		},

		/**
		 * 万达接口 会员绑定接口
		 */
		bindMemeber : function() {
			var self = $.temp.shake;
			var cookieinfo = "sessionoid=" + $.temp.SessionID + ";" + "uid="
					+ $.temp.UID;
			var url = self.headUrl + 'thirdaccountbind';
			var param = "Source=" + 3 + "@ThirdAccount="
					+ $("body").attr("openId") + "@cookie=" + cookieinfo;
			self.commonAjax(self.methodType.get,
					"rest/thirdpart/interface?url=" + url + "&param=" + param,
					"", self.dataType.json, function(data) {
						if (!!data && data.Status == 0) {
							alert(data.Status);
							return data.Status;
						} else {
							alert(data.msg);
							return false;
						}
					});

		},
		/**
		 * 万达接口
		 */
		checkSmsauthcode : function(outSideThis) {
			var shake = outSideThis.data;
			var self = this;
			var mobile = $.trim($("#registerMobile").val());
			if (!mobile) {
				alert("手机号不可为空!");
				$("#mobileNo").focus();
				return false
			}
			var url = shake.headUrl + 'smsauthcode';
			var param = "mobile=" + mobile + "@type=" + 1;
			shake.commonAjax(shake.methodType.get,
					"rest/thirdpart/interface?url=" + url + "&param=" + param,
					"", shake.dataType.json, function(data) {
						if (!!data && data.Status == 0) {
							alert(data.Status);
							return data.Status;
						} else {
							alert(data.msg);
							return false;
						}
					});

		},
		/**
		 * 获取卡片信息
		 */
		getCard : function() {
			var self = this;
			$("#lightbox").show();
			var cinemaId = $.temp.cinemaId || "1000";
			var openId = $("body").attr("openid") || "2";
			var ticket = $.temp.ticke;
			// 获取卡片
			// 判断用户是否跳转过索尼页面,如果跳转过,就一直跳转
			$.temp.shake.commonAjax($.temp.shake.methodType.get,
					'rest/thirdpart/getIfGetSony/openId/' + openId, "",
					$.temp.shake.dataType.json, function(res) {
						if (res && res.flag == "1") {
							$.temp.shake.commonAjax(
									$.temp.shake.methodType.get,
									"rest/thirdpart/getSign/apiTicket/"
											+ ticket + "/cardId/" + cinemaId
											+ "/cardCode/" + openId
											+ "/timestamp/" + "wanda"
											+ "/openId/" + "sony", "",
									$.temp.shake.dataType.json, function(
											dataInfo) {
										if (!!dataInfo && !!dataInfo.signature) {
											var signature = dataInfo.signature;
											window.location.href = "http://sony.5ylb.com/chappie/default.aspx?ticket="
													+ ticket
													+ "&cinema_id="
													+ cinemaId
													+ "&wd_openid="
													+ openId
													+ "&key="
													+ signature;
										}
									});

						} else {
							$.temp.shake.commonAjax(
									$.temp.shake.methodType.get,
									'rest/activity/lottery/cinemaId/'
											+ cinemaId + "/openId/" + openId,
									"", $.temp.shake.dataType.json, function(
											data) {
										if (!!data && data.status == 0) {
											$.temp.cardInfo = data;
											$.temp.shake.dealShowCard(data);
											$("#robot").hide();
											$(".battery-container").hide();
											$("#prizeInfo").show();
											$(".bg").show();
											$(".no").hide();
											$(".yes").show();
											$("#shakeBtn").hide();
											$("#getPrize").show();
											$("#lightbox").hide();
										} else {
											$("#robot").hide();
											$(".battery-container").hide();
											$("#prizeInfo").show();
											$(".bg").show();
											$(".yes").hide();
											$(".no").show();
											$("#getPrize").hide();
											$("#shakeBtn").show();
											$("#lightbox").hide();
										}
									});

						}
					});
		},
		/**
		 * 领奖
		 */
		getPrize : function() {
			var shake = $.temp.shake;
			var self = this;
			shake.addCardPackage();
		},
		/**
		 * 展现闪电动态
		 */
		showFlash : function() {
			$(".thunder").show();
			$(".thunder").animate({
						height : "172px"
					}, "slow", function() {
						$(".battery").fadeIn();
					});
		},
		/**
		 * 处理跳转那个中奖页面
		 */
		dealShowCard : function(data) {
			var self = this;
			var ticket = $.temp.ticke;
			var cinemaId = $.temp.cinemaId;
			var openId = $("body").attr("openid");
			// 如果是索尼 直接跳转到索尼的页面
			if (!data.isWanda) {
				// 需要记录摇到索尼的用户
				// 获取接口key加密
				// 获取signature
				self
						.commonAjax(self.methodType.get,
								"rest/thirdpart/getSign/apiTicket/" + ticket
										+ "/cardId/" + cinemaId + "/cardCode/"
										+ openId + "/timestamp/" + "wanda"
										+ "/openId/" + "sony", "",
								self.dataType.json, function(data) {
									if (!!data && !!data.signature) {
										var signature = data.signature;
										window.location.href = "http://sony.5ylb.com/chappie/default.aspx?ticket="
												+ ticket
												+ "&cinema_id="
												+ cinemaId
												+ "&wd_openid="
												+ openId + "&key=" + signature;
									}
								});

			} else {
				self.fillCardInfo(data);
			}

		},
		/**
		 * 填充中奖信息
		 */
		fillCardInfo : function(data) {
			if (!!data) {
				switch (data.type) {
					case 1 :
						$.temp.cardId = "pLRPZjjpo0Yu4sa3o9BSUBO-iLcw"
						break;
					case 2 :
						$.temp.cardId = "pLRPZjqIeJ4Bv1_Ym03KYb1eqA-U"
						break;
					case 3 :
						$.temp.cardId = "pLRPZjtanZWhUCDnpZHh_MQ9v7iU"
						break;
					case 4 :
						$.temp.cardId = "pLRPZjpbMQJqMRiZfdGSKS4u9OyE"
						break;
					case 5 :
						$.temp.cardId = "pLRPZjjB_e3swmLOX-Ec9iom0ZlU"
						break;
					case 6 :
						$.temp.cardId = "pLRPZjrDLgScsKeTJpk6F1x9JBzY"
						break;	
				}
				$("#square_yes_p").text("您获得 " + data.description);
				$("#square_yes_Div").attr("type", data.type);
				$(".yes").show();
				$("#lightbox").hide();
			}
		},
		/**
		 * 判断是否已经领取过奖品
		 */
		checkIfGetCard : function() {
			var self = this;
			var flag = false;
			var openId = $("body").attr("openid") || "0";
			self.commonAjaxSync($.temp.shake.methodType.get,
					'rest/user/isclaim/openid/' + openId, "",
					self.dataType.json, function(data) {
						flag = !!data && data.status == 0
								&& data.isclaim == true ? true : false;
					});
			return flag;

		},
		/**
		 * 公用ajax方法
		 */
		commonAjax : function(method, url, param, datatype, callback) {
			// 根据不同的URL 做相应的处理
			$.ajax({
						type : method || self.methodType.get,
						url : url,
						async : "async",
						data : param,
						dataType : datatype || self.datatype.json,
						success : function(data) {
							callback(data);
						},
						error : function() {
							alert("连接超时");
							$("#lightbox").hide();
						}
					});
		},
		commonAjaxSync : function(method, url, param, datatype, callback) {
			// 根据不同的URL 做相应的处理
			$.ajax({
						type : method || self.methodType.get,
						url : url,
						async : false,
						data : param,
						dataType : datatype || self.datatype.json,
						success : function(data) {
							callback(data);
						},
						error : function() {
							alert("连接超时");
							$("#lightbox").hide();
						}
					});
		},
		login : function(outSideThis) {
			var shake = outSideThis.data;
			var self = this;
			//
			var mobile = $.trim($("#mobileNo").val());
			if (!mobile) {
				alert("用户名不可为空!");
				$("#mobileNo").focus();
				return false
			}
			var loginpassword = $.trim($("#loginpassword").val());
			if (!loginpassword) {
				alert("密码不可为空!");
				$("#loginpassword").focus();
				return false
			}
			var url = shake.headUrl + 'login';
			shake.commonAjax(shake.methodType.get, "rest/thirdpart/login?url="
							+ url + "&mobile=" + mobile + "&password="
							+ loginpassword, "", shake.dataType.json, function(
							data) {
						if (!!data && data.status == 0) {
							$.temp.User = data.user;
							$.temp.SessionID = $.temp.shake.getSessionId();
							$.temp.UID = data.user.uid;
							$(".popup").hide();
							$(".lightbox").hide();
							// 需要判断是否绑定万达账户 绑定的直接插入卡包，未绑定的需要绑定账户
							$.temp.shake.addCardPackage();
						} else {
							alert(data.msg);
							return false;
						}
					});
		},
		fwdRegister : function() {
			$(".lightbox").hide();
			$(".popup").hide();
			$(".register").show();
		},
		getSessionId : function() {
			var c_name = 'JSESSIONID';
			if (document.cookie.length > 0) {
				c_start = document.cookie.indexOf(c_name + "=")
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1
					c_end = document.cookie.indexOf(";", c_start)
					if (c_end == -1)
						c_end = document.cookie.length
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
		},
		bindCard : function() {
			var self = $.temp.shake;
			var cookieinfo = "sessionoid=" + $.temp.SessionID + ";" + "uid="
					+ $.temp.UID;
			var url = self.headUrl + 'bindcoupon';
			var param = "cinemaid=" + $.temp.cinemaId + "@couponid="
					+ $.temp.carInfo.cardId + "@cookie=" + cookieinfo;
			self.commonAjax(self.methodType.get,
					"rest/thirdpart/interface?url=" + url + "&param=" + param,
					"", self.dataType.json, function(data) {
						if (!!data && data.Status == 0) {
							alert(data.Status);
							return data.Status;
						} else {
							alert(data.msg);
							return false;
						}
					});
		},

		validCard : function() {
			var url = "http://10.199.202.23:8080/filmserver/thirdparty/trade/querycoupon";
			var param = "couponid=" + couponid;
			shake.commonAjax(shake.methodType.get,
					"rest/thirdpart/interface?url=" + url + "&param=" + param,
					"", shake.dataType.json, function(data) {
						if (!!data && data.Status == 0) {
							alert(data.Status);
							return data.Status;
						} else {
							alert(data.msg);
							return false;
						}
					});
		}

	}
	return Shake;
});