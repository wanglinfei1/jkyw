package com.cloud.weixin.model;

import java.io.Serializable;

/**
 * 微信用户的会话步骤记步器
 * 
 * @author guoyanyong
 *
 */
public class Step implements Serializable {

	/**
	 * 序列化标识
	 */
	private static final long serialVersionUID = 1655951510656121517L;

	private boolean isMatchEvent;//是否匹配事件消息
	
	private String preStep;// 记录用户上一步的操作码

	private String matchExpression;// 匹配表达式（正则）

	private String matchMsgType;	//　拦截的消息类型

	private String businessBean;// 处理请求的　业务处理器

	/**
	 * 是否匹配事件消息
	 * @return
	 */
	public boolean isMatchEvent() {
		return isMatchEvent;
	}

	public void setMatchEvent(boolean isMatchEvent) {
		this.isMatchEvent = isMatchEvent;
	}
	
	/**
	 * 获取用户的上一步操作码
	 * 
	 * @return
	 */
	public String getPreStep() {
		return preStep;
	}

	public void setPreStep(String preStep) {
		this.preStep = preStep;
	}

	/**
	 * 获取拦截消息的表达式 
	 * 匹配表达式（正则）
	 * @return
	 */
	public String getMatchExpression() {
		return matchExpression;
	}

	public void setMatchExpression(String matchExpression) {
		this.matchExpression = matchExpression;
	}

	/**
	 * 拦截的消息类型
	 * @return
	 */
	public String getMatchMsgType() {
		return matchMsgType;
	}

	public void setMatchMsgType(String matchMsgType) {
		this.matchMsgType = matchMsgType;
	}

	/**
	 * 处理请求的　业务处理器
	 * @return
	 */
	public String getBusinessBean() {
		return businessBean;
	}

	public void setBusinessBean(String businessBean) {
		this.businessBean = businessBean;
	}

}
