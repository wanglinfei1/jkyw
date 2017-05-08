package com.cloud.core.constant;

/**
 * 系统常量
 * @author guoyanyong
 *
 */
public class Constants {

	public static final String SYSTEM_COMMON_FAIL_PAGE = "fail";
	public static final String WEIXIN_SESSION_PUBID = "wx_pubid";
	public static final String WEIXIN_SESSION_publicAccount = "wx_publicaccount_%s";
	public static final String WEIXIN_SESSION_PUBID_OPENID = "wx_pubid_openid";

	public static String accesstokenForRedisKey="accesstoken:%s:%s";
	public static String refreshAccesstokenForRedisKey="refresh_accesstoken:%s:%s";

	public static String oauth2accesstokenForRedisKey="oauth2accesstoken:%s:%s";


	public static String getRefreshAccesstoken_key_for_redis(String pubid, String appId){
		return String.format(refreshAccesstokenForRedisKey,pubid,appId);
	}

	public static String getAccesstoken_key_for_redis(String pubid, String appId){
		return String.format(accesstokenForRedisKey,pubid,appId);
	}

	public static String getOauth2Accesstoken_key_for_redis(String pubid, String openid){
		return String.format(oauth2accesstokenForRedisKey,pubid,openid);
	}
}
