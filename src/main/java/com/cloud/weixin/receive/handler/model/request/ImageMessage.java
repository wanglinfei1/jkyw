package com.cloud.weixin.receive.handler.model.request;


import com.cloud.weixin.model.BaseMessage;

/**
 * 图片消息
 * 
 * @author guoyanyong
 */
public class ImageMessage extends BaseMessage {
	// 图片链接
	private String PicUrl;

	public String getPicUrl() {
		return PicUrl;
	}

	public void setPicUrl(String picUrl) {
		PicUrl = picUrl;
	}
}
