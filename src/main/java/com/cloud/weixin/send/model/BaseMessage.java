package com.cloud.weixin.send.model;

/**
 * 客服接口向腾讯上传消息基本内容
 * 接口地址：https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token
 * =ACCESS_TOKEN
 * 
 * @author yanyong
 * 
 */
public class BaseMessage {

	/*
	 * 普通用户openid
	 */
	private String touser;
	/*
	 * 消息类型(text，image，voice，video，music，news)
	 */
	private String msgtype;

	public String getMsgtype() {
		return msgtype;
	}

	public void setMsgtype(String msgtype) {
		this.msgtype = msgtype;
	}

	public String getTouser() {
		return touser;
	}

	public void setTouser(String touser) {
		this.touser = touser;
	}

}
