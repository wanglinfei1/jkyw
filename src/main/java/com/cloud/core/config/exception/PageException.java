package com.cloud.core.config.exception;

import com.cloud.core.utils.ErrorMsg;
import lombok.Data;

@Data
public class PageException extends Exception {

	private static final long serialVersionUID = 1613673813728958882L;

	private int state;

	private String msg;

	private Exception exception;

	public PageException(ErrorMsg me) {
		this.state = me.state;
		this.msg = me.msg;
	}
	
	public PageException(ErrorMsg me, Exception e) {
		this.state = me.state;
		this.msg = me.msg;
		this.exception = e;
	}

}
