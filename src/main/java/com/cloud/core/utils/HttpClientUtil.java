package com.cloud.core.utils;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.log4j.Logger;

public final class HttpClientUtil {

	private static Logger logger = Logger.getLogger(HttpClientUtil.class);
	public static String postMethod(String url) {
		return postMethod(url, null);
	}

	/**
	 * post请求
	 * 
	 * @param url	请求的URL
	 * @param param		请求传参
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public static String postMethod(String url, String param) {
		logger.info("调用接口--开始:"+url);
		logger.info("调用接口--参数:"+param);
		HttpClient client = new HttpClient();
//		client.getHostConfiguration().setProxy(ip, port);
		PostMethod method = new PostMethod(url);

		if (null != param && !"".equals(param)) {
			method.setRequestBody(param);
		}

		method.getParams().setContentCharset("UTF-8");

		String result = "";
		try {
			int state = client.executeMethod(method);
			logger.info("调用接口--状态：" + state);
			if (state == HttpStatus.SC_OK) {
				result = method.getResponseBodyAsString();
			}
			logger.info("调用接口--结果：" + result);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("调用接口--出错：", e);
		}
		return result;
	}
}
