package com.cloud.weixin.send.handler.impl;

import java.util.ArrayList;

import com.cloud.core.utils.HttpClientUtil;
import com.cloud.core.utils.MessageUtil;
import com.cloud.modules.wx.config.service.IGlobalConfigService;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.model.response.ImageMessageResp;
import com.cloud.weixin.receive.handler.model.response.MusicMessageResp;
import com.cloud.weixin.receive.handler.model.response.NewsMessageResp;
import com.cloud.weixin.receive.handler.model.response.TextMessageResp;
import com.cloud.weixin.send.handler.ICustomerService;
import com.cloud.weixin.send.model.*;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService implements ICustomerService {
	
	private Logger logger = Logger.getLogger(getClass());

	@Autowired
	private IGlobalConfigService globalConfigService;
	
	public String sendMessage(BaseMessageResp respMsgBean, WxPublicaccount account) {
		String msgType = respMsgBean.getMsgType();
		if(msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_TEXT)){
			
			return this.sendTextMessage((TextMessageResp)respMsgBean,account);
			
		}else if(msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_IMAGE)){
			
			return this.sendImageMessage((ImageMessageResp)respMsgBean, account);
			
		}else if(msgType.equals(MessageUtil.RESP_MESSAGE_TYPE_NEWS)){
			
			return this.sendNewsMessage((NewsMessageResp)respMsgBean, account);
			
		}else if(msgType.equals(MessageUtil.RESP_MESSAGE_TYPE_MUSIC)){
			
			return this.sendMusicMessage((MusicMessageResp)respMsgBean, account);
		}
		
		return null;
	}
	
	/**
	 * 直接发送客服消息
	 */
	public String sendMessage(BaseMessage msgText, WxPublicaccount account) {
		return this.sendMsgFromCustom(msgText, account);
	}
	
	/**
	 * 发送文本客服消息
	 * @param message
	 * @param account
	 * @return
	 */
	private String sendTextMessage(TextMessageResp message,WxPublicaccount account) {
		
		TextMessage textMessage = new TextMessage();
		textMessage.setMsgtype(message.getMsgType());
		textMessage.setTouser(message.getToUserName());
		
		TextMessage.Text text = textMessage.new Text();
		text.setContent(message.getContent());
		textMessage.setText(text);
		
		return this.sendMsgFromCustom(textMessage, account);
	}

	/**
	 * 发送图片客服消息
	 * @param message
	 * @param account
	 * @return
	 */
	private String sendImageMessage(ImageMessageResp message,WxPublicaccount account) {
		
		ImageMessage imageMessage = new ImageMessage();
		imageMessage.setTouser(message.getToUserName());
		imageMessage.setMsgtype(message.getMsgType());
		
		ImageMessage.Image image = imageMessage.new Image();
		image.setMedia_id(message.getImage().getMediaId());
		imageMessage.setImage(image);
		
		return this.sendMsgFromCustom(imageMessage, account);
	}

	/**
	 * 发送图文客服消息
	 * @param message
	 * @param account
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private String sendNewsMessage(NewsMessageResp message,WxPublicaccount account) {
		
		NewsMessage newsMessage = new NewsMessage();
		newsMessage.setTouser(message.getToUserName());
		newsMessage.setMsgtype(message.getMsgType());
		
		NewsMessage.News news = newsMessage.new News();
		
		for(NewsMessageResp.Article art : message.getArticles()){
			NewsMessage.News.Article article = news.new Article();
			article.setTitle(art.getTitle());
			article.setDescription(art.getDescription());
			article.setUrl(art.getUrl());
			article.setPicurl(art.getPicUrl());
			if(null==news.getArticles()) news.setArticles(new ArrayList());
			news.getArticles().add(article);
		}
		
		newsMessage.setNews(news);
		
		return this.sendMsgFromCustom(newsMessage, account);
	}

	/**
	 * 发送音乐客服消息
	 * @param message
	 * @param account
	 * @return
	 */
	private String sendMusicMessage(MusicMessageResp message,WxPublicaccount account) {
		MusicMessage musicMessage = new MusicMessage();
		musicMessage.setTouser(message.getToUserName());
		musicMessage.setMsgtype(message.getMsgType());
		
		MusicMessage.Music music = musicMessage.new Music();
		music.setTitle(message.getMusic().getTitle());
		music.setDescription(message.getMusic().getDescription());
		music.setMusicurl(message.getMusic().getMusicUrl());
		music.setHqmusicurl(message.getMusic().getHQMusicUrl());
		music.setThumb_media_id(message.getMusic().getThumbMediaId());
		
		musicMessage.setMusic(music);
		
		return this.sendMsgFromCustom(musicMessage, account);
	}
	
	/**
	 * 
	 * @param msg
	 * @param account
	 * @return
	 */
	private String sendMsgFromCustom(final BaseMessage msg, final WxPublicaccount account){

		new Thread(new Runnable() {
			@Override
			public void run() {
				String messageJson = JSONObject.fromObject(msg).toString();
				
				String customerPostUrl = globalConfigService.queryConfigByKey("customMsgService").getValue();
				logger.info("获取发送客服消息的接口地址："+customerPostUrl);
				logger.info("开始获取AccessToken...");
				String accessToken = account.getToken();
				customerPostUrl+=accessToken;
				logger.info("发送客服消息的接口URL："+customerPostUrl);
				HttpClientUtil.postMethod(customerPostUrl, messageJson);
			}
		}).start();
		return null;
	}

}
