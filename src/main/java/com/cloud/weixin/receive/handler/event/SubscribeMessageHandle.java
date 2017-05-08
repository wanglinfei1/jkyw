package com.cloud.weixin.receive.handler.event;

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
import org.springframework.stereotype.Service;

/**
 * 关注消息处理器
 * @author guoyanyong
 *
 */
@Service
public class SubscribeMessageHandle implements IMessageHandle {

	private Logger logger = Logger.getLogger(getClass());

	@Autowired
	private IAutoReplyService autoReplyService;
	@Autowired
	private IWxPublicmemberService publicmemberService;
	@Autowired
	private IGlobalConfigService globalConfigService;

	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		// TODO Auto-generated method stub
		logger.info("SubscribeMessageHandle----->requestXml:  " + requestMap);
		/**
		 * 调用自动回复模版
		 */
		Long start = System.currentTimeMillis();
		BaseMessageResp autoReplyMsg = this.autoReply(requestMap,account);
		Long end = System.currentTimeMillis();
		logger.debug("get first subscribe replqy time："+(end-start));

		// 记录关注用户的的基本信息（从腾讯获取微信用户的信息）
		String openid = requestMap.get("FromUserName").toString();
		
		start = System.currentTimeMillis();
		this.saveSubscribeInfo(openid, account);
		end = System.currentTimeMillis();
		logger.debug("save usernfo for first subscribe time："+(end-start));
		
		return autoReplyMsg;
	}

	/**
	 * 从微信获取新关注用户的基本信息
	 * 
	 * @param openid
	 * @param account
	 * @return
	 */
	private void saveSubscribeInfo(final String openid,
			final WxPublicaccount account) {

		logger.debug("用户openid:" + openid);
		final String userBasicInfoUrl = globalConfigService.queryConfigByKey("userBasicInfo").getValue().trim();
		new Thread(new Runnable() {
			@Override
			public void run() {
				Long start = System.currentTimeMillis();
				String url = userBasicInfoUrl.replaceFirst("@accessToken",account.getToken())
						+ openid;
				Long end = System.currentTimeMillis();
				logger.debug("get accessToken time："+(end-start));
				
				logger.debug("userBasicInfo url " + url);
				start = System.currentTimeMillis();
				String userinfo = HttpClientUtil.postMethod(url);
				end = System.currentTimeMillis();
				logger.debug("get userinfo from weixin time："+(end-start));
				
				JSONObject jo = JSONObject.fromObject(userinfo);
				logger.info(jo);
				if(null == jo.get("errcode")){
					// 记录用户关注信息-开始
					WxPublicmember pm = publicmemberService.queryPublicmemberByOpenid(openid, account.getId());
					if (pm == null) {
						pm = new WxPublicmember();
					}
					pm.setPubid(account.getId());
					pm.setOpenid(openid);
					pm.setNickname(jo.getString("nickname"));
					pm.setSex(jo.getInt("sex"));
					pm.setLanguages(jo.getString("language"));
					pm.setCity(jo.getString("city"));
					pm.setProvince(jo.getString("province"));
					pm.setCountry(jo.getString("country"));
					pm.setHeadimageurl(jo.getString("headimgurl"));
					pm.setSubscribe(jo.getInt("subscribe"));
//					pm.setSubscribetime(jo.getString("subscribe_time"));
					
					start = System.currentTimeMillis();
					publicmemberService.savePublicmember(pm);
					end = System.currentTimeMillis();
					logger.debug("save userinfo time："+(end-start));
					// 记录用户基本信息-结束
					
				}else if(jo.getInt("errcode")==40001){//accesstoken失效
//					AccessTokenUtil.getAccessTokenNew(account);
				}
			}
		}).start();
	}

	/**
	 * 自动回复模版
	 * 
	 * @param requestMap
	 * @return
	 */
	private BaseMessageResp autoReply(Map<String, Object> requestMap,WxPublicaccount account) {

		AutoReplyTemplate art = autoReplyService.queryAutoReplyTemplate(MessageUtil.EVENT_TYPE_SUBSCRIBE);
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
}
