package com.cloud.core.config;

import com.cloud.core.config.exception.PageException;
import com.cloud.core.config.exception.RestException;
import com.cloud.core.utils.ErrorMsg;
import com.cloud.core.utils.Result;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
public class AppExceptionHandler {

	/**
	 * 处理异常信息，并返回客户端JSON数据
	 * @return
	 */
	@ExceptionHandler({PageException.class})
	public ModelAndView restExceptionHandler(PageException pe){
		Object ex = pe.getException();
		ModelAndView mav = new ModelAndView();
		Result result = null;
		if(ex!=null){
			result = Result.assembly(pe.getState(), pe.getMsg(), pe.getException().getMessage());
		}else{
			result = Result.assembly(pe.getState(), pe.getMsg(), null);
		}
		mav.addObject(result);
		mav.setViewName("/error");
		return mav;
	}

	/**
	 * 处理异常信息，并返回客户端JSON数据
	 * @return
	 */
	@ExceptionHandler(RestException.class)
	@ResponseBody
	public Result restExceptionHandler(RestException re){
		Object ex = re.getException();
		if(ex!=null){
			return Result.assembly(re.getState(), re.getMsg(), re.getException().getMessage());
		}else{
			return Result.assembly(re.getState(), re.getMsg(), null);
		}
	}
	
	/**
	 * 处理异常信息，并返回客户端JSON数据
	 * @return
	 */
	@ExceptionHandler({RuntimeException.class, Exception.class})
	@ResponseBody
	public Result ExceptionHandler(Exception e){
		e.printStackTrace();
		return Result.assembly(ErrorMsg.SystemException.state, ErrorMsg.SystemException.msg, null);
	}
	
}
