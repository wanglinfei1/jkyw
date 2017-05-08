package com.cloud.core.utils;

import java.io.Serializable;

public class Result implements Serializable{
	
	private Integer state = 0;
	private String msg = "success";
	private Object data = null;

	public static Result assembly() {
		Result result = new Result();
		return result;
	}
	
	public static Result assembly(Object data) {
		Result result = new Result();
		result.data = data;
		return result;
	}
	
	public static Result assembly(Integer state, String msg, Object data) {
		Result result = new Result();
		result.state = state;
		result.msg = msg;
		result.data = data;
		return result;
	}

	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}
	
	
}
