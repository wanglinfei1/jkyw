package com.cloud.weixin.receive.handler.model.request;

import com.cloud.weixin.model.BaseMessage;

/**
 * 视频消息
 * 
 * @author guoyanyong
 */
public class VideoMessage extends BaseMessage {
	//视频消息媒体id，可以调用多媒体文件下载接口拉取数据
	private String MediaId;

	//视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据
	private String ThumbMediaId;
	
	public void setMediaId(String mediaId) {
		MediaId = mediaId;
	}
	
	public String getMediaId() {
		return MediaId;
	}
	
	public void setThumbMediaId(String thumbMediaId) {
		ThumbMediaId = thumbMediaId;
	}
	
	public String getThumbMediaId() {
		return ThumbMediaId;
	}
}
