package com.cloud.weixin.model;

import lombok.Data;

/**
 * 消息基类（普通用户 -> 公众帐号）
 * 
 * @author guoyanyong
 */
@Data
public class BaseMessage {
	// 开发者微信号
	private String ToUserName;
	// 发送方帐号（一个OpenID）
	private String FromUserName;
	// 消息创建时间 （整型）
	private long CreateTime;
	// 消息类型	(1 文本消息	2 图片消息	3 语音消息	4 视频消息	5 地理位置消息	6 链接消息)
	private String MsgType;
	// 消息id，64位整型
	private long MsgId;
}
