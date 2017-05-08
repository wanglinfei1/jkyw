package com.cloud.modules.wx.material.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.cloud.core.utils.MessageUtil;
import com.cloud.modules.wx.material.service.IMaterialService;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.model.response.ImageMessageResp;
import com.cloud.weixin.receive.handler.model.response.NewsMessageResp;
import com.cloud.weixin.receive.handler.model.response.TextMessageResp;
import org.springframework.stereotype.Service;

@Service
public class MaterialService implements IMaterialService {
	
	/**
	 * 根据配置组装素材回复消息
	 */
	@Override
	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account, Integer Materialtype, String MaterialId) {
		
		switch (Materialtype) {
		case 0:
			// 自动回复文本消息
			TextMessageResp textMessage = new TextMessageResp();
			textMessage.setToUserName(requestMap.get("FromUserName").toString());
			textMessage.setFromUserName(requestMap.get("ToUserName").toString());
			textMessage.setMsgType(MessageUtil.REQ_MESSAGE_TYPE_TEXT);
			textMessage.setCreateTime(System.currentTimeMillis());
			textMessage.setContent("我是文本消息，给我点赞哟...）");
			return textMessage;
		case 1:
			// 自动回复图片消息
			ImageMessageResp imageMessage = new ImageMessageResp();
			imageMessage.setToUserName(requestMap.get("FromUserName").toString());
			imageMessage.setFromUserName(requestMap.get("ToUserName").toString());
			imageMessage.setMsgType(MessageUtil.REQ_MESSAGE_TYPE_IMAGE);
			imageMessage.setCreateTime(System.currentTimeMillis());
			ImageMessageResp.Image image = imageMessage.new Image();
			image.setMediaId("RrFknjE5IPMVpsA8sBXDHWdR-inGSrn2OKf9gRlsWrAU_Wwzxg4OurrmRl0QvIZl");
			imageMessage.setImage(image);
			return imageMessage;
		case 2:
			// 自动回复图文消息
			NewsMessageResp newsMessage = new NewsMessageResp();
			newsMessage.setToUserName(requestMap.get("FromUserName").toString());
			newsMessage.setFromUserName(requestMap.get("ToUserName").toString());
			newsMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_NEWS);
			newsMessage.setCreateTime(System.currentTimeMillis());
			newsMessage.setArticleCount(1);
			NewsMessageResp.Article aticle = newsMessage.new Article();
			aticle.setTitle("我是图文消息标题");
			aticle.setDescription("我是图文消息描述");
			aticle.setUrl("http://www.baidu.com");
			aticle.setPicUrl("http://guoyanyong.duapp.com/common/img/index/1.jpg");
			List<NewsMessageResp.Article> articles = new ArrayList<NewsMessageResp.Article>();
			articles.add(aticle);
			newsMessage.setArticles(articles);
			return newsMessage;
		}

		// 自动回复文本消息
		TextMessageResp textMessage = new TextMessageResp();
		textMessage.setToUserName(requestMap.get("FromUserName").toString());
		textMessage.setFromUserName(requestMap.get("ToUserName").toString());
		textMessage.setMsgType(MessageUtil.REQ_MESSAGE_TYPE_TEXT);
		textMessage.setCreateTime(System.currentTimeMillis());
		textMessage.setContent("对不起，系统暂时还没有您想要的东西哟，敬请等待。");
		return textMessage;
		
	}

}
