package com.cloud.weixin.service;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;

import java.util.Map;

public interface ICoreService {

	/**
	 * 核心请求处理（用户--->微信公众号）
	 * @param requestMap
	 * @param account
	 * @return
	 */
	public BaseMessageResp processRequest(Map<String, Object> requestMap, WxPublicaccount account);

}
