package com.cloud.modules.wx.publicaccount.entity;

import lombok.Data;

import java.io.Serializable;

/**
 * @Object entity.
 * @author ethan
 * @currentTime
 */
@Data
public class WxPublicaccount implements Serializable{
	//主键,公众平台ID
    private Integer id;
	//微信账号（英文）
    private String enName;
	//公众帐号中文名称
    private String zhName;
	//公众帐号TOKEN
    private String token;
	//公众微信号
    private String number;
	//微信账号类型：0：服务号，1：订阅号, 2.企业号
    private String accountType;
	//电子邮箱
    private String email;
	//公众帐号描述
    private String descr;
	//公众帐号APPID
    private String appid;
	//公众帐号APPSECRET
    private String appsecret;
	//
    private java.sql.Timestamp addTokenTime;
	//帐户状态：0:正常, 1:删除
    private Integer delFlag;


}  