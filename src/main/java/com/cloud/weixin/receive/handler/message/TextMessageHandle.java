package com.cloud.weixin.receive.handler.message;

import java.util.Date;
import java.util.Map;

import com.cloud.core.utils.HttpClientUtil;
import com.cloud.core.utils.MessageUtil;
import com.cloud.modules.wx.autoreply.model.AutoReplyTemplate;
import com.cloud.modules.wx.autoreply.service.IAutoReplyService;
import com.cloud.modules.wx.config.service.IGlobalConfigService;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.modules.wx.publicmember.entity.WxPublicmember;
import com.cloud.modules.wx.publicmember.service.IWxPublicmemberService;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.IMessageHandle;
import com.cloud.weixin.receive.handler.model.response.TextMessageResp;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * 文本消息处理器
 * @author guoyanyong
 *
 */
@Service
public class TextMessageHandle implements IMessageHandle {

	private Logger logger = Logger.getLogger(getClass());
	
	@Autowired
	private IAutoReplyService autoReplyService;
	@Autowired
	private IWxPublicmemberService publicmemberService;
	@Autowired
	public IGlobalConfigService globalConfigService;

	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		// TODO Auto-generated method stub
		logger.info("TextMessageHandle----->requestXml:  " + requestMap);

		/**
		 * 调用自动回复模版，
		 */
		
		Long start = System.currentTimeMillis();
		BaseMessageResp autoReplyMsg = this.autoReply(requestMap,account);
		Long end = System.currentTimeMillis();
		logger.debug("get autoReplyMsg time："+(end-start));
		
		// 如果存在自动回复消息，则反馈给用户
		if (null != autoReplyMsg) {
			return autoReplyMsg;
		} else {//查询默认回复内容
			logger.debug("not find matching reply，continue find default reply");
			String keyword = requestMap.get("Content").toString();//临时保存一下  关键字
			
			requestMap.put("Content", "default");
			start = System.currentTimeMillis();
			autoReplyMsg = this.autoReply(requestMap,account);
			end = System.currentTimeMillis();
			logger.debug("get autoReplyMsg time："+(end-start));
			
			if(null == autoReplyMsg){//如果默认未定义，刚继续调用小艾机器人答复用户

			}
		}

		return autoReplyMsg;
	}

	/**
	 * 自动回复模版
	 * 
	 * @param requestMap
	 * @return
	 */
	private BaseMessageResp autoReply(Map<String, Object> requestMap,WxPublicaccount account) {
		// 如果消息在关键字配置中
		String keyword = requestMap.get("Content").toString();
		
		AutoReplyTemplate art = autoReplyService.queryAutoReplyTemplate(keyword);
		// 如果存在自动回复模版，根据回复模版回复用户消息
		if (null != art) {
			if (art.getMaterialtype().equals(MESSAGE_MATERIAL_TYPE_TEXT)) {
				// 自动回复文本消息
				TextMessageResp textMessage = new TextMessageResp();
				textMessage.setToUserName(requestMap.get("FromUserName").toString());
				textMessage.setFromUserName(requestMap.get("ToUserName").toString());
				textMessage.setMsgType(MessageUtil.REQ_MESSAGE_TYPE_TEXT);
				textMessage.setCreateTime(new Date().getTime());
				textMessage.setContent(art.getContent().replace("{openid}", requestMap.get("FromUserName").toString()).replace("{pubid}", account.getId().toString()));
				
				//查询关联回复消息内容
				String relatedMsg = autoReplyService.queryRelatedMsg(art.getId());
				if(relatedMsg!=null && !relatedMsg.equals("")){
					TextMessageResp relatedMessage = new TextMessageResp();
					relatedMessage.setToUserName(requestMap.get("FromUserName").toString());
					relatedMessage.setFromUserName(requestMap.get("ToUserName").toString());
					relatedMessage.setMsgType(MessageUtil.REQ_MESSAGE_TYPE_TEXT);
					relatedMessage.setCreateTime(new Date().getTime());
					//替换关键字中的动态参数
					String content = relatedMsg.replace("{openid}", requestMap.get("FromUserName").toString()).replace("{pubid}", account.getId().toString());
					relatedMessage.setContent(content);
					
					textMessage.setRealtedMessageResp(relatedMessage);
				}
				
				return textMessage;
			} else if (art.getMaterialtype().equals(MESSAGE_MATERIAL_TYPE_IMG)) {
				// 自动回复图片消息

			} else if (art.getMaterialtype().equals(
					MESSAGE_MATERIAL_TYPE_IMGTEXT)) {
				// 自动回复图文消息

			}
		}
		return null;
	}
	
	/**
	 * 保存用户信息
	 * @param openid
	 * @param account
	 * @return
	 */
	private WxPublicmember saveUserInfoFromWeixin(String openid, WxPublicaccount account){
		Long start = System.currentTimeMillis();
		Long end = System.currentTimeMillis();
		logger.debug("not find userinfo in database，so call weixin'interface for get userinfo, and save userinfo to database");
		String userBasicInfoUrl = globalConfigService.queryConfigByKey("userBasicInfo").getValue().trim();
		String url = userBasicInfoUrl.replaceFirst("@accessToken", account.getToken()) + openid;
		String userinfo = HttpClientUtil.postMethod(url);
		JSONObject jo = JSONObject.fromObject(userinfo);
		if(null == jo.get("errcode")){

			// 记录用户基本信息-开始
			WxPublicmember member = publicmemberService.queryPublicmemberByOpenid(openid, account.getId());
			if (member == null) {
				member = new WxPublicmember();
			}
			member.setPubid(account.getId());
			member.setOpenid(openid);
			member.setNickname(jo.getString("nickname"));
			member.setSex(jo.getInt("sex"));
			member.setLanguages(jo.getString("language"));
			member.setCity(jo.getString("city"));
			member.setProvince(jo.getString("province"));
			member.setCountry(jo.getString("country"));
			member.setHeadimageurl(jo.getString("headimgurl"));
			member.setSubscribe(jo.getInt("subscribe"));
//			member.setSubscribetime(jo.getString("subscribe_time"));
			
			start = System.currentTimeMillis();
			publicmemberService.savePublicmember(member);
			end = System.currentTimeMillis();
			logger.debug("save userinfo time："+(end-start));
			// 记录用户基本信息-结束
			return member;
		}else if(jo.getInt("errcode")==40001){//accesstoken失效
//			AccessTokenUtil.getAccessTokenNew(account);
		}
		return null;
	}
}
