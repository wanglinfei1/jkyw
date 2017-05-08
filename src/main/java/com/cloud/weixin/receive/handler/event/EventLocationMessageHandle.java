package com.cloud.weixin.receive.handler.event;

import java.util.Date;
import java.util.Map;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.receive.handler.IMessageHandle;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 微信自动上送的地理位置信息处理器
 * @author guoyanyong
 *
 */
@Service
public class EventLocationMessageHandle implements IMessageHandle {
	
	@Value("${baidu_map_api}")
	private String baiduMapApi;
	
	private Logger logger = Logger.getLogger(getClass());
	

	public BaseMessageResp responseMsgBean(Map<String, Object> requestMap, WxPublicaccount account) {
		logger.info("EventLocationMessageHandle----->responseXml");
		//{MsgId=6112182428885883112, FromUserName=ogs8vs3fH3Pwk02l70QD_iR-CSKQ, CreateTime=1423103369, Label=, Scale=16, 
		// Location_X=39.909595, ToUserName=gh_514ec943e037, Location_Y=116.469955, MsgType=location}
		
//		try {
//			baiduMapApi = baiduMapApi.replace("{longitude}", requestMap.get("Latitude").toString());
//			baiduMapApi = baiduMapApi.replace("{latitude}", requestMap.get("Longitude").toString());
//			String result = HttpUtil.postMethod(baiduMapApi, null);
//			JSONObject jo = JSONObject.fromObject(result);
//			jo.put("x", Base64Decoder.decode(jo.getString("x")));
//			jo.put("y", Base64Decoder.decode(jo.getString("y")));
//			logger.debug("转为后的地图坐标为："+jo.toString());
//
//			if(jo.getInt("error")==0){
//				//保存转换得到的百度坐标
//				cacheClient = memCachedPool.getMemCachedClient();
//				cacheClient.set("wx_location_"+requestMap.get("FromUserName"), jo, new Date(1000*60*60*24));//缓存一天
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
		
		return null;
	}

}
