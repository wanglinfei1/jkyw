package com.cloud.core.utils;

import com.cloud.core.config.WxApIUrlConfig;
import com.cloud.core.constant.Constants;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.modules.wx.publicaccount.service.IWxPublicaccountService;
import net.sf.json.JSONObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * Created by ethan on 17/3/24.
 */
@Component
public class AccessTokenUtil {

    private Log logger = LogFactory.getLog(AccessTokenUtil.class);

    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private IWxPublicaccountService publicaccountService;

    public String getAccessToken(String pubid, String appid, String appSecret){
        String accesstoken_key = Constants.getAccesstoken_key_for_redis(pubid,appid);
        Object accesstoken = redisTemplate.opsForValue().get(accesstoken_key);
        if(accesstoken==null){
            //如果 accessToken 也已过期，则重新获取 accessToken
            JSONObject result = WxApIUrlConfig.sendRequest(WxApIUrlConfig.access_token,appid, appSecret);
            accesstoken = result.getString("access_token");
            String accessToken = accesstoken.toString();
            long expires_in = result.getLong("expires_in");

            logger.debug("accessToken缓存时间为： "+expires_in+" 秒");

            redisTemplate.opsForValue().set(accesstoken_key, accessToken, expires_in, TimeUnit.SECONDS);
            return accessToken;
        }
        return accesstoken.toString();
    }

    public String getOauthAccessToken(String pubid, String openid){
        String oauth2Accesstoken_key = Constants.getOauth2Accesstoken_key_for_redis(pubid.toString(),openid.toString());
        Object oauth2AccessToken = redisTemplate.opsForValue().get(oauth2Accesstoken_key);
        if(oauth2AccessToken==null){

        }
        return  null;
    }
}
