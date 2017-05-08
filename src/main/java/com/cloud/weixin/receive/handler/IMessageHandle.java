package com.cloud.weixin.receive.handler;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;

import java.util.Map;

/**
 * 消息处理基类接口
 * @author guoyanyong
 *
 */
public interface IMessageHandle{
	
	String MESSAGE_MATCH_TYPE_ALL="0";	//精确匹配
	String MESSAGE_MATCH_TYPE_CONTAINS="1";//糊糊匹配
	
	String MESSAGE_MATERIAL_TYPE_TEXT="0";	//文本类型
	String MESSAGE_MATERIAL_TYPE_IMG="1";		//图片类型
	String MESSAGE_MATERIAL_TYPE_IMGTEXT="2";	//图文类型

	/**
	 * 处理消息
	 * @param requestMap
	 * @param account
	 * @return
	 */
	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account);
	
}
