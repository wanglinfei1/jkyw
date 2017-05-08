package com.cloud.modules.wx.publicmember.entity;

import lombok.Data;

import java.io.Serializable;

/**
 * @Object entity.
 * @author ethan
 * @currentTime
 */
@Data
public class WxPublicmember implements Serializable{
	//主键
    private Integer id;
	//公众平台ID
    private Integer pubid;
	//用户的标识，对当前公众号唯一
    private String openid;
	//
    private Integer groupid;
	//用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息
    private Integer subscribe;
	//用户的昵称
    private String nickname;
	//用户性别 0:未知 1:男 2:女
    private Integer sex;
	//用户所在城市
    private String city;
	//用户所在国家
    private String country;
	//用户所在省份
    private String province;
	//用户的语言，简体中文为zh_CN
    private String languages;
	//用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像）,用户没有头像时该项为空
    private String headimageurl;
	//用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间
    private java.sql.Timestamp subscribetime;
	//创建时间
    private java.sql.Timestamp createtime;
	//备注
    private String remark;
}  