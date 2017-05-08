package com.cloud.weixin.receive.handler.event;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.modules.wx.publicmember.service.IWxPublicmemberService;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.IMessageHandle;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * 取消关注处理器
 * @author guoyanyong
 *
 */
@Service
public class UnsubscribeMessageHandle implements IMessageHandle {
	
	private Logger logger = Logger.getLogger(getClass());
	
	@Autowired
	private IWxPublicmemberService publicmemberService;

	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		// TODO Auto-generated method stub
		logger.info("UnsubscribeMessageHandle----->requestXml"+requestMap);


		return null;
	}

}
