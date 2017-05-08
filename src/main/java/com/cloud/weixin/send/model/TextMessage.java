package com.cloud.weixin.send.model;

/**
 * 客服接口发送文本消息 信息类
 * @author yanyong
 *
 */
public class TextMessage extends BaseMessage {

	/*
	 * 文本消息内容
	 */
	private Text text;
	
	public Text getText() {
		return text;
	}
	
	public void setText(Text text) {
		this.text = text;
	}
	
	/**
	 * 文本内容类
	 * @author yanyong
	 *
	 */
	public class Text{
		/*
		 * 文本内容
		 */
		private String content;
		
		public String getContent() {
			return content;
		}
		
		public void setContent(String content) {
			this.content = content;
		}
	}
}
