package com.cloud.modules.wx.autoreply.service.impl;

import com.cloud.modules.wx.autoreply.model.AutoReplyTemplate;
import com.cloud.modules.wx.autoreply.service.IAutoReplyService;
import org.springframework.stereotype.Service;

@Service
public class AutoReplyService implements IAutoReplyService {
	
	@Override
	public AutoReplyTemplate queryAutoReplyTemplate(String keyword) {
//		logger.debug("调用接口查询关键字为："+keyword);
//		String queryWxPublicaccountsUrl = serverpath + "/wx/querykeywordreply";
//		try {
//			StringBuffer sb = new StringBuffer();
//			initPara(sb, basicReq);
//			sb.append("&keyword=").append(keyword.trim());
//			sb.append("&matchtype=").append(0);
//			String resultText = HttpUtil.postMethod(queryWxPublicaccountsUrl,
//					sb.toString());
//			logger.debug("调用接口查询关键字结果 ："+resultText);
//			JSONObject result = JSONObject.fromObject(resultText);
//			if (result.getInt("status") == 0) {
//				AutoReplyTemplate art = (AutoReplyTemplate) JSONObject.toBean(
//						result.getJSONObject("autoreplytemplate"),
//						AutoReplyTemplate.class);
//				if (null != art.getId()) {
//					return art;
//				}
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
		return null;
	}
	
	/**
	 * 查询关联消息内容
	 * @return
	 */
	@Override
	public String queryRelatedMsg(Integer autoReplyTemplateId){
//		String queryWxPublicaccountsUrl = serverpath + "/wx/querykeywordreplyrelated";
//		try {
//			StringBuffer sb = new StringBuffer();
//			initPara(sb, basicReq);
//			sb.append("&replytemplateid=").append(autoReplyTemplateId);
//			String resultText = HttpUtil.postMethod(queryWxPublicaccountsUrl,sb.toString());
//			JSONObject result = JSONObject.fromObject(resultText);
//			if (result.getInt("status") == 0) {
//				logger.debug(result.getJSONArray("data"));
//				JSONArray ja = result.getJSONArray("data");
//				String relatedMsg = "";
//				for(int i=0; i<ja.size(); i++){
//					if(i!=0){
//						relatedMsg+="\n";
//					}
//					relatedMsg+=ja.getJSONObject(i).getString("content");
//				}
//				return relatedMsg;
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
		return null;
	}
}
