package com.cloud.weixin.service;

import java.util.Map;

import com.cloud.core.utils.MessageUtil;
import com.cloud.core.utils.SpringContextUtil;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.model.Step;
import com.cloud.weixin.receive.handler.IMessageHandle;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * 响应消息—》核心处理器
 * 
 * @author yanyong
 *
 */
@Service
public class CoreService implements ICoreService {

	private Logger logger = Logger.getLogger(getClass());

	@Autowired
	private RedisTemplate redisTemplate;

	@Autowired
	private SpringContextUtil springContextUtil;

	public BaseMessageResp processRequest(Map<String, Object> requestMap, WxPublicaccount account) {
		// 反馈给用户的消息变量
		BaseMessageResp responseMsg = null;
		try {
			// 获取消息处理器
			Long start = System.currentTimeMillis();
			IMessageHandle messageHandle = this.getMessageBean(requestMap);
			Long end = System.currentTimeMillis();
			logger.debug("get messageHandle time：" + (end - start));
			// 处理用户消息并反馈消息
			responseMsg = messageHandle.responseMsgBean(requestMap, account);

			// 记录消息到数据库
			this.recordMessage(requestMap, responseMsg);
		} catch (Exception e1) {
			e1.printStackTrace();
		}

		return responseMsg;
	}

	/**
	 * 获取消息类型并返回相应的处理器<br>
	 * 1、<br>
	 * 2、<br>
	 * 3、scancode_push：扫码推事件<br>
	 * 用户点击按钮后，微信客户端将调起扫一扫工具，完成扫码操作后显示扫描结果（如果是URL，将进入URL），且会将扫码的结果传给开发者，开发者可以下发消息。<br>
	 * 4、scancode_waitmsg：扫码推事件且弹出“消息接收中”提示框<br>
	 * 用户点击按钮后，微信客户端将调起扫一扫工具，完成扫码操作后，将扫码的结果传给开发者，同时收起扫一扫工具，然后弹出“消息接收中”提示框，随后可能会收到开发者下发的消息。<br>
	 * 5、pic_sysphoto：弹出系统拍照发图<br>
	 * 用户点击按钮后，微信客户端将调起系统相机，完成拍照操作后，会将拍摄的相片发送给开发者，并推送事件给开发者，同时收起系统相机，随后可能会收到开发者下发的消息。<br>
	 * 6、pic_photo_or_album：弹出拍照或者相册发图<br>
	 * 用户点击按钮后，微信客户端将弹出选择器供用户选择“拍照”或者“从手机相册选择”。用户选择后即走其他两种流程。<br>
	 * 7、<br>
	 * 8、location_select：弹出地理位置选择器<br>
	 * 用户点击按钮后，微信客户端将调起地理位置选择工具，完成选择操作后，将选择的地理位置发送给开发者的服务器，同时收起位置选择工具，随后可能会收到开发者下发的消息。<br>
	 * @return
	 */
	private IMessageHandle getMessageBean(Map<String, Object> requestMap) {
		String openid = requestMap.get("FromUserName").toString();

		// 处理消息类型
		String handleType = requestMap.get("MsgType").toString();

		// 首先判断是否事件信息，若是事件事件信息则交给事件处理器处理

		boolean isEvent = false;
		if (handleType.equals("event")) {
			isEvent = true;
			// 判断是否关注事件
			String eventType = requestMap.get("Event").toString();
			if (eventType.equals("subscribe")) {
				// 关注消息
				handleType = "subscribe";
			} else if (eventType.equals("unsubscribe")) {
				// 取消关注消息
				handleType = "unsubscribe";
			} else if (eventType.equals("CLICK")) {
				// 菜单点击消息
				handleType = "click";
			} else if (eventType.equals("LOCATION")) {
				// 上送地理位置消息
				handleType = "eventLocation";
			} else if (eventType.equals("VIEW")) {
				// 菜单点击消息
				handleType = "view";
			} else if (eventType.equals("pic_weixin")) {
				handleType = "picWeixin";
			}
		}

		// 获取微信的当前会话
//		Step step = (Step) cacheClient.get(openid + "_step");
		Step step = (Step) redisTemplate.opsForHash().get(openid + ":step", Step.class);
		if (step != null) {// 如果存在会话步骤
			if(step.isMatchEvent()&&isEvent&&handleType.matches(step.getMatchExpression())){//是否拦截匹配事件类型事件
				// 返回消息处理器
				return (IMessageHandle) springContextUtil.getBean(step.getBusinessBean());
			}else if(!isEvent){//匹配非事件消息
				if(handleType.equals(MessageUtil.REQ_MESSAGE_TYPE_TEXT) && step.getMatchMsgType().equals(MessageUtil.REQ_MESSAGE_TYPE_TEXT)){//匹配文本消息
					String content = requestMap.get("Content").toString();
					if(content.matches(step.getMatchExpression())){
						// 返回消息处理器
						return (IMessageHandle) springContextUtil.getBean(step.getBusinessBean());
					}
				}
			}
		}

		// 返回消息处理器
		return (IMessageHandle) springContextUtil.getBean(handleType
				+ "MessageHandle");
	}

	/**
	 * 记录消息
	 * @param requestMap
	 * @param replyMessage
	 */
	private void recordMessage(final Map<String, Object> requestMap,
			final BaseMessageResp replyMessage) {

		Runnable runnable = new Runnable() {
			public void run() {
				logger.debug("开始记录用户请求消息(未实现)：");

				logger.debug("开始记录请求响应消息(未实现)：");
			}
		};
		new Thread(runnable).start();
	}

}
