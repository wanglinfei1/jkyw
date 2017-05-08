package com.cloud.core.config;

import com.cloud.core.utils.HttpUtil;
import lombok.Data;
import net.sf.json.JSONObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

/**
 * Created by ethan on 2017/3/16.
 */
@Data
public class WxApIUrlConfig {

    public static Log log = LogFactory.getLog(WxApIUrlConfig.class);

    public static String jsapi_ticket = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi";

    public static String access_token = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s";

    public static String oauth2_accesstoken = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code";

    public static String sns_userinfo = "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN";

    public static String cgi_bin_user_info="https://api.weixin.qq.com/cgi-bin/user/info?access_token=%s&openid=%s&lang=zh_CN ";

    public static JSONObject sendRequest(String api, Object... params){
        String url = String.format(api,params);
        try {
            String result = HttpUtil.sendByGet(url, null);
            return JSONObject.fromObject(result);
        } catch (Exception e) {
            log.error("访问网络异常：" + url);
            e.printStackTrace();
        }
        return null;
    }
}
