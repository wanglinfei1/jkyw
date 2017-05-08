package com.cloud.weixin.receive.handler.message;

import java.util.Map;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.IMessageHandle;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

/**
 * 视频消息处理器
 * @author guoyanyong
 *
 */
@Service
public class VideoMessageHandle implements IMessageHandle {

	private Logger logger = Logger.getLogger(getClass());

	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		// TODO Auto-generated method stub
		logger.info("VideoMessageHandle----->responseXml");

		return null;
	}
}
