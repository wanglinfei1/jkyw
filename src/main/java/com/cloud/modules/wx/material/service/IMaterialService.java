package com.cloud.modules.wx.material.service;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;

import java.util.Map;

public interface IMaterialService {

	/**
	 * 根据配置组装素材回复消息
	 * @param requestMap	用户请求内容
	 * @param account		公众帐号配置信息
	 * @param Materialtype	素材类型
	 * @param MaterialId	素材在库中的唯一标识（ID）
	 * @return
	 */
	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account, Integer Materialtype, String MaterialId);
}
