package com.cloud.modules.wx.autoreply.service;

import com.cloud.modules.wx.autoreply.model.AutoReplyTemplate;

public interface IAutoReplyService {

	/**
	 * 查询关键字自动回复内容
	 * @param keyword
	 * @return
	 */
	public AutoReplyTemplate queryAutoReplyTemplate(String keyword);
	
	/**
	 * 查询关联消息内容
	 * @return
	 */
	public String queryRelatedMsg(Integer autoReplyTemplateId);
}
