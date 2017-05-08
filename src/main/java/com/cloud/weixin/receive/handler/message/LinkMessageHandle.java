package com.cloud.weixin.receive.handler.message;

import java.util.Map;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.IMessageHandle;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

/**
 *
 * 链接消息处理器<br>
 *	<xml>
 *	<ToUserName><![CDATA[toUser]]></ToUserName>
 *	<FromUserName><![CDATA[fromUser]]></FromUserName>
 *	<CreateTime>1351776360</CreateTime>
 *	<MsgType><![CDATA[link]]></MsgType>
 *	<Title><![CDATA[公众平台官网链接]]></Title>
 *	<Description><![CDATA[公众平台官网链接]]></Description>
 *	<Url><![CDATA[url]]></Url>
 *	<MsgId>1234567890123456</MsgId>
 *	</xml> 
 *	         参数	                描述
 *	ToUserName	                 接收方微信号<br>
 *	FromUserName	             发送方微信号，若为普通用户，则是一个OpenID<br>
 *	CreateTime	                 消息创建时间<br>
 *	MsgType	                     消息类型，link<br>
 *	Title	                     消息标题<br>
 *	Description	                 消息描述<br>
 *	Url	                         消息链接<br>
 *	MsgId	                     消息id，64位整型 <br>
 *
 * @author guoyanyong
 *
 */
@Service
public class LinkMessageHandle implements IMessageHandle {
	
	private Logger logger = Logger.getLogger(getClass());
	
	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		// TODO Auto-generated method stub
		logger.info("LinkMessageHandle----->responseXml");
		return null;
	}
}
