package com.cloud.weixin.receive.handler.model.response;


import com.cloud.weixin.model.BaseMessageResp;

/**
 * 音乐消息
 * @author guoyanyong
 *
 */
public class ImageMessageResp extends BaseMessageResp {
	//图片
	private Image Image;
	
	public Image getImage() {
		return Image;
	}
	
	public void setImage(Image image) {
		Image = image;
	}

    public class Image{
    	private String MediaId;
    	
    	public String getMediaId() {
			return MediaId;
		}
    	
    	public void setMediaId(String mediaId) {
			MediaId = mediaId;
		}
    	
    }

}
