package com.cloud.weixin.receive.handler.model.request;


import com.cloud.weixin.model.BaseMessage;

/**
 * 文本消息
 * 
 * @author guoyanyong
 */
public class TextMessage extends BaseMessage {
	// 消息内容
	private String Content;

	public String getContent() {
		return Content;
	}

	public void setContent(String content) {
		Content = content;
	}
}