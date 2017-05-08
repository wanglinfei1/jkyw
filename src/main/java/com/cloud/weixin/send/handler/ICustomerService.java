package com.cloud.weixin.send.handler;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.send.model.BaseMessage;

/**
 * 客服消息服务
 * @author guoyanyong
 *
 */
public interface ICustomerService {
	
	/**
	 * 通过客服接口发送消息
	 * @param msgText	消息内容 com.wanda.weixin.core.model.response.BaseMessageResp
	 * @param account	发送消息的公众帐号信息
	 * @return
	 */
	public String sendMessage(BaseMessageResp msgText, WxPublicaccount account);
	
	/**
	 * 通过客服接口发送消息
	 * @param msgText	消息内容 com.wanda.weixin.module.send.custom.model.BaseMessage
	 * @param account	发送消息的公众帐号信息
	 * @return
	 */
	public String sendMessage(BaseMessage msgText, WxPublicaccount account);
}
