package com.cloud.core.utils;

/**
 * 异常枚举
 * 
 * @author guoyanyong
 * @email 
 * @time 
 */
public enum ErrorMsg {
	/** ------@Valid 输入参数绑定错误 ----- */
	SystemException(999,"系统异常，请稍后重试"),
	ParamsError(1001, "参数错误"),
	NotFindPublicAccount(1002,"未能找到公众号"),
	HttpPostError(1003,"http请求错误");

	public int state;
	public String msg;

	ErrorMsg(int state, String msg) {
		this.state = state;
		this.msg = msg;
	}
}
