package com.cloud.weixin.receive.handler.event;

import java.util.Map;

import com.cloud.core.utils.SpringContextUtil;
import com.cloud.modules.wx.material.service.IMaterialService;
import com.cloud.modules.wx.menubutton.entity.WxMenubutton;
import com.cloud.modules.wx.menubutton.service.IWxMenubuttonService;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.receive.handler.IMessageHandle;
import com.cloud.weixin.model.BaseMessageResp;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * click：点击推事件 用户点击click类型按钮后，微信服务器会通过消息接口推送消息类型为event
 * 的结构给开发者（参考消息接口指南），并且带上按钮中开发者填写的key值，开发者可以通过自定义的key值与用户进行交互；
 * 
 * @author guoyanyong
 *
 */
@Service
public class ClickMessageHandle implements IMessageHandle {

	private Logger logger = Logger.getLogger(getClass());
	@Autowired
	private IWxMenubuttonService WxMenubuttonService;
	@Autowired
	private IMaterialService materialService;

	@Qualifier("textMessageHandle")
	@Autowired
	private IMessageHandle textMessageHandler;

	@Autowired
	private SpringContextUtil springContextUtil;

	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		// TODO Auto-generated method stub
		
		logger.info("ClickMessageHandle----->requestXml：" + requestMap);
		WxMenubutton menuButton = WxMenubuttonService.queryPubMenu(account.getId(), requestMap.get("EventKey").toString());

		if (menuButton == null)
			return null;
		
		//当有业务处理器配置时，优先路由业务处理器
		if (!"".equals(menuButton.getBusiid()) && !"null".equalsIgnoreCase(menuButton.getBusiid()) && menuButton.getBusiid() != null) {
			logger.debug("菜单点击跳转的业务处理器：" + menuButton.getBusiid());
			IMessageHandle messageHandler = (IMessageHandle) springContextUtil.getBean(menuButton.getBusiid());
			requestMap.put("menuButton", menuButton);
			return messageHandler.responseMsgBean(requestMap, account);
		}else if(menuButton.getMaterialtype()!=null && menuButton.getMaterialid()!=null){
			//如果没有配置业务处理器时，继续调用素材消息回复
			BaseMessageResp respMessage = materialService.responseMsgBean(requestMap, account, menuButton.getMaterialtype(), menuButton.getMaterialid());
			if(respMessage!=null){
				return respMessage;
			}
		}else{
			//按照菜单的Key，查找配置的关键字消息
			requestMap.put("Content", menuButton.getKey());
			return textMessageHandler.responseMsgBean(requestMap, account);
		}
		return null;
	}
}
