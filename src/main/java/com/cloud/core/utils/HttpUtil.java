package com.cloud.core.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.cloud.core.config.exception.RestException;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.util.HtmlUtils;

/**
 * Http传输工具类
 * 
 * @author QLong
 * @since 2014-7-20
 * @version 1.0
 */
public class HttpUtil {

	private static Log log = LogFactory.getLog(HttpUtil.class);

	/**
	 * 打印
	 */
	public static void printMessage(String result,
			HttpServletResponse response, String errorMessage) {
		try {
			response.setCharacterEncoding("UTF-8");
			response.setHeader("Cache-Control", "no-cache");
			if (StringUtils.isEmpty(result)) {
				result = "{\"result\":{\"resultCode\":\"request error\",\"message\":\"请求失败,请联系管理员\"}}";
			}
			response.getWriter().write(result);
			response.getWriter().flush();
			response.getWriter().close();
		} catch (IOException e) {
			log.error(errorMessage, e);
		}
	}

	/**
	 * 去除特殊字符串
	 */
	public static String matcherReplaceAll(String json) {
		String result = null;
		StringBuffer sb = new StringBuffer();
		if (!StringUtils.isEmpty(json)) {
			json = json.replaceAll("(\n|\r\n|\r|\n|\n\r)", "");
			String str = "(?<=\\:\\\").*?(?=(\\\",\\\"|\\\"\\}))";
			Pattern p = Pattern.compile(str, Pattern.MULTILINE);
			Matcher m = p.matcher(json);
			// 替换
			while (m.find()) {
				for (int i = 0; i < m.groupCount(); i++) {
					try {
						m.appendReplacement(sb, m.group(i).toString()
								.replaceAll("\"", "\\\\\\\\\\\\\""));
					} catch (Exception e) {
						log.error("-去除特殊字符串--i--=" + i, e);
					}
				}
			}
			m.appendTail(sb);
			result = sb.toString();
			result = HtmlUtils.htmlUnescape(result);
		}
		return result;
	}

	/**
	 * post方式请求
	 * 
	 * @param params
	 * @return
	 */
	public static String postMethod(String url, String params) throws RestException {

		log.debug("http post url：" + url);
		log.debug("http post params：" + params);
		String result = null;
		URL urlStr = null;
		HttpURLConnection httpConn = null;
		InputStream is = null;
		ByteArrayOutputStream bao = null;
		try {
			urlStr = new URL(url);
			httpConn = (HttpURLConnection) urlStr.openConnection();
			httpConn.setRequestProperty("Pragma:", "no-cache");
			httpConn.setRequestProperty("Cache-Control", "no-cache");
			httpConn.setRequestProperty("Content-Type",
					"application/x-www-form-urlencoded");
			httpConn.setRequestMethod("POST");
			httpConn.setRequestProperty("Charset", "UTF-8");
			httpConn.setDoOutput(true);
			httpConn.setDoInput(true);

			if (!StringUtils.isEmpty(params)) {
				OutputStream os = httpConn.getOutputStream();
				os.write(params.getBytes("UTF-8"));
				os.close();
			}
			is = httpConn.getInputStream();
			bao = new ByteArrayOutputStream();
			int b = 0;
			while ((b = is.read()) != -1) {
				bao.write(b);
			}
			is.close();
			httpConn.disconnect();
			result = new String(bao.toByteArray(), "UTF-8");
		} catch (Exception e) {
			e.printStackTrace();
			throw new RestException(ErrorMsg.HttpPostError, e);
		} finally {
			urlStr = null;
			httpConn = null;
			is = null;
			bao = null;
		}
		log.debug("http post resutl：" + result);
		return result;
	}

	/**
	 * 提交并获取服务器Cookie
	 * 
	 * @param session
	 * @param url
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public static String postAndSaveServerCookie(HttpSession session,
			String url, String params) throws Exception {

		String result = null;
		URL urlStr = null;
		HttpURLConnection httpConn = null;
		InputStream is = null;
		ByteArrayOutputStream bao = null;
		Map<String, String> serverCookies = null;
		try {
			urlStr = new URL(url);
			httpConn = (HttpURLConnection) urlStr.openConnection();
			httpConn.setRequestProperty("Pragma:", "no-cache");
			httpConn.setRequestProperty("Cache-Control", "no-cache");
			httpConn.setRequestProperty("Content-Type",
					"application/x-www-form-urlencoded");
			httpConn.setRequestMethod("POST");
			httpConn.setRequestProperty("Charset", "UTF-8");
			httpConn.setDoOutput(true);
			httpConn.setDoInput(true);

			if (!StringUtils.isEmpty(params)) {
				OutputStream os = httpConn.getOutputStream();
				os.write(params.getBytes("UTF-8"));
				os.close();
			}
			is = httpConn.getInputStream();
			bao = new ByteArrayOutputStream();
			int b = 0;
			while ((b = is.read()) != -1) {
				bao.write(b);
			}

			is.close();

			serverCookies = new ConcurrentHashMap<String, String>();
			Map<String, List<String>> headers = httpConn.getHeaderFields();
			List<String> cookies = headers.get("Set-Cookie");
			if (null != cookies) {
				for (String cookie : cookies) {
					if (null != cookie && cookie.indexOf("UID") != -1)
						serverCookies.put("UID", cookie.substring(
								cookie.indexOf("=") + 1,
								cookie.lastIndexOf(";")));
					if (null != cookie && cookie.indexOf("SESSIONID") != -1)
						serverCookies.put("SESSIONID", cookie.substring(
								cookie.indexOf("=") + 1,
								cookie.lastIndexOf(";")));
				}
			}
			if (null != session) {
				if (null == session.getAttribute("serverCookies")) {
					session.setAttribute("serverCookies", serverCookies);
				} else {
					session.removeAttribute("serverCookies");
					session.setAttribute("serverCookies", serverCookies);
				}
			}
			httpConn.disconnect();
			result = new String(bao.toByteArray(), "UTF-8");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			urlStr = null;
			httpConn = null;
			is = null;
			bao = null;
		}
		return result;
	}

	/**
	 * post方式请求包含cookie
	 * 
	 * @param params
	 * @return
	 */
	public static String postMethod(String url, String params, String cookieStr)
			throws Exception {

		log.debug("http post with cookies url：" + url);
		log.debug("http post with cookies param：" + params);
		String result = null;
		URL urlStr = null;
		HttpURLConnection httpConn = null;
		InputStream is = null;
		ByteArrayOutputStream bao = null;
		try {
			urlStr = new URL(url);
			httpConn = (HttpURLConnection) urlStr.openConnection();

			// 设置报文头
			httpConn.setRequestProperty("Pragma:", "no-cache");
			httpConn.setRequestProperty("Cache-Control", "no-cache");
			httpConn.setRequestProperty("Content-type", "text/xml");
			httpConn.setRequestMethod("POST");
			httpConn.setRequestProperty("Charset", "UTF-8");
			httpConn.setDoOutput(true);
			httpConn.setDoInput(true);
			if (null != cookieStr && !"".equals(cookieStr)) {
				httpConn.addRequestProperty("cookie", cookieStr);
			}
			if (!StringUtils.isEmpty(params)) {
				OutputStream os = httpConn.getOutputStream();
				os.write(params.getBytes("UTF-8"));
				os.close();
			}
			is = httpConn.getInputStream();
			bao = new ByteArrayOutputStream();
			int b = 0;
			while ((b = is.read()) != -1) {
				bao.write(b);
			}
			is.close();
			httpConn.disconnect();
			result = new String(bao.toByteArray(), "UTF-8");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			urlStr = null;
			httpConn = null;
			is = null;
			bao = null;
		}
		return result;
	}

	/**
	 * Get包含cookie
	 * 
	 * @param url
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public static String sendByGet(String url, String params, String cookieStr)
			throws Exception {
		String retStr = "";
		HttpURLConnection httpConn = null;
		URL urlObj = null;
		InputStream isr = null;
		ByteArrayOutputStream bao = null;
		try {
			// 创建url
			String tmpUrl = url;
			if (params != null) {
				tmpUrl += "?" + params;
			}
			log.info(tmpUrl);
			urlObj = new URL(tmpUrl);

			// 打开http连接
			httpConn = (HttpURLConnection) (urlObj.openConnection());

			// 设置http连接属性
			httpConn.setConnectTimeout(15000);
			httpConn.setRequestMethod("GET");
			// 设置报文头
			httpConn.setRequestProperty("Pragma:", "no-cache");
			httpConn.setRequestProperty("Cache-Control", "no-cache");
			httpConn.setRequestProperty("Content-type", "text/xml");
			httpConn.setRequestProperty("Charset", "UTF-8");
			httpConn.setDoOutput(true);
			httpConn.setDoInput(true);
			if (null != cookieStr && !"".equals(cookieStr)) {
				httpConn.addRequestProperty("cookie", cookieStr);
			}
			// 发送请求
			httpConn.connect();

			// 接受响应数据
			isr = httpConn.getInputStream();
			bao = new ByteArrayOutputStream();
			int b;
			while ((b = isr.read()) != -1) {
				bao.write(b);
			}
			isr.close();

			// 关闭http连接
			httpConn.disconnect();
			retStr = new String(bao.toByteArray(), "UTF-8");
			log.info(retStr);
		} catch (Exception e) {
			log.error("GET方式发送请求异常:", e);
		}
		return retStr;
	}

	public static String sendByGet(String url, String params) throws Exception {

		String retStr = "";
		HttpURLConnection httpConn = null;
		URL urlObj = null;
		InputStream isr = null;
		ByteArrayOutputStream bao = null;
		try {
			// 创建url
			String tmpUrl = url;
			if (params != null) {
				tmpUrl += "?" + params;
			}
			log.debug("http get url:"+ tmpUrl);
			log.debug("http get params:"+ params);
			urlObj = new URL(tmpUrl);

			// 打开http连接
			httpConn = (HttpURLConnection) (urlObj.openConnection());

			// 设置http连接属性
			httpConn.setConnectTimeout(15000);
			httpConn.setRequestMethod("GET");

			// 发送请求
			httpConn.connect();

			// 接受响应数据
			isr = httpConn.getInputStream();
			bao = new ByteArrayOutputStream();
			int b;
			while ((b = isr.read()) != -1) {
				bao.write(b);
			}
			isr.close();

			// 关闭http连接
			httpConn.disconnect();

			retStr = new String(bao.toByteArray(), "UTF-8");
			log.debug("http get result:"+retStr);
		} catch (Exception e) {
			log.error("GET方式发送请求异常:", e);
		}
		return retStr;
	}
}
