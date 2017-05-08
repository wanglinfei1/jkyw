package com.cloud.modules.wx.autoreply.model;

import lombok.Data;

@Data
public class AutoReplyTemplate {

	/**
	 * '主键',
	 */
	private Integer id;
	/**
	 * '公众平台帐号id',
	 */
	private Integer pubid;
	/**
	 * '规则关键字',
	 */
	private String keyword;
	/**
	 * '内容',
	 */
	private String content;
	/**
	 * '匹配方式 0:全部 1:包含',
	 */
	private String matchtype;
	/**
	 * '0:文本 1:图片 2:图文',
	 */
	private String materialtype;
	/**
	 * `素材表相关ID[消息类型6张表的ID]',
	 */
	private String materialid;
	/**
	 * 'Bean 说明',
	 */
	private String beandesc;
	/**
	 * '编辑时间',
	 */
	private Integer updatetime;
	/**
	 * '删除标志 0:正常 1:删除'
	 */
	private Integer delflag;

}
