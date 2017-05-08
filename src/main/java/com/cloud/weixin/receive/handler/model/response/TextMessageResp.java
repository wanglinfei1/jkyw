package com.cloud.weixin.receive.handler.model.response;

import com.cloud.weixin.model.BaseMessageResp;

/**
 * 文本消息
 * @author guoyanyong
 *
 */
public class TextMessageResp extends BaseMessageResp {
	// 回复的消息内容
	private String Content;

	public String getContent() {
		return Content;
	}

	public void setContent(String content) {
		Content = content;
	}

}
