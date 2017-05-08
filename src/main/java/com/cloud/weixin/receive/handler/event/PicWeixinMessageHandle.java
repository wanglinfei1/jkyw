package com.cloud.weixin.receive.handler.event;

import java.util.Map;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.IMessageHandle;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

/**
 * 	处理点击view类型菜单的处理器<br>
 *	pic_weixin：弹出微信相册发图器<br>
 *	用户点击按钮后，微信客户端将调起微信相册，完成选择操作后，将选择的相片发送给开发者的服务器，并推送事件给开发者，同时收起相册，随后可能会收到开发者下发的消息。
 *  @author guoyanyong
 */
@Service
public class PicWeixinMessageHandle implements IMessageHandle {

	private Logger logger = Logger.getLogger(getClass());
	
	@Override
	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		logger.info("PicWeixinMessageHandle----->responseXml");
		
		
		return null;
	}

}
