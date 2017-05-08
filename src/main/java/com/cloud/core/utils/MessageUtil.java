package com.cloud.core.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.model.response.ImageMessageResp;
import com.cloud.weixin.receive.handler.model.response.MusicMessageResp;
import com.cloud.weixin.receive.handler.model.response.NewsMessageResp;
import com.cloud.weixin.receive.handler.model.response.TextMessageResp;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.core.util.QuickWriter;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.xml.PrettyPrintWriter;
import com.thoughtworks.xstream.io.xml.XppDriver;

public class MessageUtil {
	/**
	 * 返回消息类型：文本
	 */
	public static final String RESP_MESSAGE_TYPE_TEXT = "text";

	/**
	 * 返回消息类型：音乐
	 */
	public static final String RESP_MESSAGE_TYPE_MUSIC = "music";

	/**
	 * 返回消息类型：图文
	 */
	public static final String RESP_MESSAGE_TYPE_NEWS = "news";

	/**
	 * 请求消息类型：文本
	 */
	public static final String REQ_MESSAGE_TYPE_TEXT = "text";

	/**
	 * 请求消息类型：图片
	 */
	public static final String REQ_MESSAGE_TYPE_IMAGE = "image";

	/**
	 * 请求消息类型：链接
	 */
	public static final String REQ_MESSAGE_TYPE_LINK = "link";

	/**
	 * 请求消息类型：地理位置
	 */
	public static final String REQ_MESSAGE_TYPE_LOCATION = "location";

	/**
	 * 请求消息类型：音频
	 */
	public static final String REQ_MESSAGE_TYPE_VOICE = "voice";

	/**
	 * 请求消息类型：推送
	 */
	public static final String REQ_MESSAGE_TYPE_EVENT = "event";

	/**
	 * 事件类型：subscribe(订阅)
	 */
	public static final String EVENT_TYPE_SUBSCRIBE = "subscribe";

	/**
	 * 事件类型：unsubscribe(取消订阅)
	 */
	public static final String EVENT_TYPE_UNSUBSCRIBE = "unsubscribe";

	/**
	 * 事件类型：CLICK(自定义菜单点击事件)
	 */
	public static final String EVENT_TYPE_CLICK = "CLICK";
	/**
	 * 事件类型：VIEW(自定义菜单点击事件)
	 */
	public static final String EVENT_TYPE_VIEW = "VIEW";

	/**
	 * 解析微信发来的请求（XML）
	 * 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> parseMap(HttpServletRequest request) {
		// 将解析结果存储在HashMap中
		Map<String, Object> map = new HashMap<String, Object>();

		try {
			// 从request中取得输入流
			InputStream inputStream = request.getInputStream();
			// 读取输入流
			SAXReader reader = new SAXReader();
			Document document = reader.read(inputStream);
			// 得到xml根元素
			Element root = document.getRootElement();
			// 得到根元素的所有子节点
			List<Element> elementList = root.elements();

			// 遍历所有子节点
			for (Element e : elementList)
				map.put(e.getName(), e.getText());

			// 释放资源
			inputStream.close();
			inputStream = null;
		} catch (IOException e1) {
			e1.printStackTrace();
		} catch (DocumentException e1) {
			e1.printStackTrace();
		}
		return map;
	}

	public static String messageToXml(BaseMessageResp message) {
		if (message.getMsgType().equals(REQ_MESSAGE_TYPE_TEXT)) {
			
			//文本消息对象转换成xml
			TextMessageResp textMessage = (TextMessageResp) message;
			textMessage.setContent(textMessage.getContent().replaceAll("\r\n", "\n"));
			xstream.alias("xml", textMessage.getClass());
			xstream.autodetectAnnotations(true);
			return xstream.toXML(textMessage);
			
		} else if (message.getMsgType().equals(REQ_MESSAGE_TYPE_IMAGE)) {
			
			//图片消息对象转换成xml
			ImageMessageResp imageMessage = (ImageMessageResp) message;
			xstream.alias("xml", imageMessage.getClass());
			xstream.alias("Image", imageMessage.new Image().getClass());
			xstream.autodetectAnnotations(true);
			return xstream.toXML(imageMessage);
			
		} else if (message.getMsgType().equals(RESP_MESSAGE_TYPE_NEWS)) {
			
			//图文消息对象转换成xml
			NewsMessageResp newsMessage = (NewsMessageResp) message;
			xstream.alias("xml", newsMessage.getClass());
			xstream.alias("item", newsMessage.new Article().getClass());
			xstream.autodetectAnnotations(true);
			return xstream.toXML(newsMessage);
			
		} else if (message.getMsgType().equals(RESP_MESSAGE_TYPE_MUSIC)) {
			
			//音乐消息对象转换成xml
			MusicMessageResp musicMessage = (MusicMessageResp) message;
			xstream.alias("xml", musicMessage.getClass());
			xstream.autodetectAnnotations(true);
			return xstream.toXML(musicMessage);
			
		}
		return null;
	}
	
	/**
	 * 生成回复文本消息
	 * @param FromUserName	发送方
	 * @param ToUserName	接收方
	 * @param text			消息内容
	 * @return
	 */
	public static TextMessageResp getTextResponse(String FromUserName, String ToUserName, String text) {
		// 自动回复文本消息
		TextMessageResp textMessage = new TextMessageResp();
		textMessage.setToUserName(FromUserName);
		textMessage.setFromUserName(ToUserName);
		textMessage.setMsgType(REQ_MESSAGE_TYPE_TEXT);
		textMessage.setCreateTime(System.currentTimeMillis());
		textMessage.setContent(text);
		return textMessage;
	}

	/**
	 * 扩展xstream，使其支持CDATA块
	 * 
	 * @date 2013-05-19
	 */
	private static XStream xstream = new XStream(new XppDriver() {
		public HierarchicalStreamWriter createWriter(Writer out) {
			return new PrettyPrintWriter(out) {
				// 对所有xml节点的转换都增加CDATA标记
				boolean cdata = true;

				@SuppressWarnings("rawtypes")
				public void startNode(String name, Class clazz) {
					super.startNode(name, clazz);
				}

				protected void writeText(QuickWriter writer, String text) {
					if (cdata) {
						writer.write("<![CDATA[");
						writer.write(text);
						writer.write("]]>");
					} else {
						writer.write(text);
					}
				}
			};
		}
	});
}
