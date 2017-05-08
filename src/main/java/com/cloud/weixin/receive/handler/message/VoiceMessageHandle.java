package com.cloud.weixin.receive.handler.message;

import java.util.Map;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.IMessageHandle;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * 主意消息处理器
 * @author guoyanyong
 *
 */
@Service
public class VoiceMessageHandle implements IMessageHandle {

	@Qualifier("textMessageHandle")
	@Autowired
	private IMessageHandle textMessageHandle;
	private Logger logger = Logger.getLogger(getClass());

	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		// TODO Auto-generated method stub
		logger.info("VoiceMessageHandle----->responseXml");
		
		String Content = requestMap.get("Recognition").toString();
		if(Content.trim().equals("")){
			return null;
		}

		requestMap.put("Content", Content);
		return textMessageHandle.responseMsgBean(requestMap, account);
	}
}
