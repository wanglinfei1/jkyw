package com.cloud.weixin.receive.handler.event;

import java.util.Map;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.IMessageHandle;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

/**
 * 处理点击view类型菜单的处理器<br>
 * view：跳转URL<br>
 * 用户点击view类型按钮后，微信客户端将会打开开发者在按钮中填写的网页URL，可与网页授权获取用户基本信息接口结合，获得用户基本信息。
 * @author guoyanyong
 */
@Service
public class ViewMessageHandle implements IMessageHandle {

	private Logger logger = Logger.getLogger(getClass());
	
	@Override
	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		logger.info("ViewMessageHandle----->responseXml");
		
		
		
		
		return null;
	}

}
