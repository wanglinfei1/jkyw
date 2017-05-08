package com.cloud.weixin.send.model;

/**
 * 客服接口发送图片消息 信息类
 * @author yanyong
 *
 */
public class ImageMessage extends BaseMessage {

	/*
	 * 图片信息
	 */
	private Image image;
	
	public Image getImage() {
		return image;
	}
	
	public void setImage(Image image) {
		this.image = image;
	}
	
	public class Image{
		
		/*
		 * 图片素材ID
		 */
		private String media_id;
		
		public String getMedia_id() {
			return media_id;
		}
		
		public void setMedia_id(String media_id) {
			this.media_id = media_id;
		}
	}
}
