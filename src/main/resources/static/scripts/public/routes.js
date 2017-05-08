define('routes', function() {
	return {
		routerPath : {
			error : "../scripts/routes/error",// 公共错误处理
			jssdk:"../scripts/routes/jssdk",
			wang:"../scripts/routes/wang",
			moreRecords:"../scripts/routes/moreRecords",
			record:"../scripts/routes/record",
			myselfInfor:"../scripts/routes/myselfInfor",
			addData:"../scripts/routes/addData",
			QRcode:"../scripts/routes/QRcode",
			myName:"../scripts/routes/myName",
			knowledge:"../scripts/routes/knowledge",
			articleDetails:"../scripts/routes/articleDetails"
		},
		method : {
			weixin : {
				userinfo : "/weixin/api/getCgibinUserInfo",// 从微信拉取微信用户的信息 GET 请求
			},
			wxportal : {
				jsLogger : "/jsLogger.json",//记录前端日志
				smsauthcode : "/user/smsauthcode.json",// 获取手机验证码

				queryArticleList : "/queryArticleList",// 获取资讯内容列表
				queryArticleInfo : "/queryArticleInfo",// 阅读资讯
				isCompleteInfo: "/member/isCompleteInfo", //根据openid检查是否已经完善个人信息
				completeInfo : "/member/completeInfo",// 根据openid完善用户信息
				queryBloodPressureList:"/member/queryBloodPressureList",//根据openid查询血压记录列表
				addBloodPressure: "/member/addBloodPressure" //根据openid新增血压记录
			}
		}
	};
});
