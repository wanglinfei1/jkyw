package com.cloud.weixin.receive.handler.model.request;

import com.cloud.weixin.model.BaseMessage;

/**
 * 音频消息
 * 
 * @author guoyanyong
 */
public class VoiceMessage extends BaseMessage {
	// 媒体ID
	private String MediaId;
	// 语音格式
	private String Format;

	public String getMediaId() {
		return MediaId;
	}

	public void setMediaId(String mediaId) {
		MediaId = mediaId;
	}

	public String getFormat() {
		return Format;
	}

	public void setFormat(String format) {
		Format = format;
	}
}
