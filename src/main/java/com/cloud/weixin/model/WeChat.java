package com.cloud.weixin.model;

/**
 * 微信数字签名信息类
 * @author guoyanyong
 *
 */
public class WeChat {
	
	private String signature; // 微信加密签名  
	private String timestamp; // 时间戳  
	private String nonce;// 随机数  
	private String echostr;// 随机字符串  
	
	public String getSignature() {
		return signature;
	}
	public void setSignature(String signature) {
		this.signature = signature;
	}
	public String getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	public String getNonce() {
		return nonce;
	}
	public void setNonce(String nonce) {
		this.nonce = nonce;
	}
	public String getEchostr() {
		return echostr;
	}
	public void setEchostr(String echostr) {
		this.echostr = echostr;
	}
	
}
