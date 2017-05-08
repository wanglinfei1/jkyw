package com.cloud.weixin.model;

import java.io.Serializable;

/**
 * jssdk签名类
 * @author guoyanyong
 *
 */
public class JsapiSignature implements Serializable {

	private static final long serialVersionUID = 1L;

	private String appId; // 必填，公众号的唯一标识

	private Long timestamp;// 必填，生成签名的时间戳

	private String nonceStr; // 必填，生成签名的随机串

	private String signature;// 必填，签名，见附录1
	
	private String jsapiTicket;//签名时，从微信获取到的ticket

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public Long getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Long timestamp) {
		this.timestamp = timestamp;
	}

	public String getNonceStr() {
		return nonceStr;
	}

	public void setNonceStr(String nonceStr) {
		this.nonceStr = nonceStr;
	}

	public String getSignature() {
		return signature;
	}

	public void setSignature(String signature) {
		this.signature = signature;
	}

	public String getJsapiTicket() {
		return jsapiTicket;
	}

	public void setJsapiTicket(String jsapiTicket) {
		this.jsapiTicket = jsapiTicket;
	}
}
