package com.cloud.weixin.model;

import com.thoughtworks.xstream.annotations.XStreamOmitField;
import lombok.Data;

/**
 * 回复消息基类 公众账号->普通用户
 * 
 * @author guoyanyong
 *
 */
@Data
public class BaseMessageResp {
	// 接收方帐号（收到的OpenID）
	private String ToUserName;
	// 开发者微信号
	private String FromUserName;
	// 消息创建时间 （整型）
	private long CreateTime;
	// 消息类型（text/music/news）
	private String MsgType;
	// 关联回复信息
	@XStreamOmitField
	private BaseMessageResp realtedMessageResp;
}
