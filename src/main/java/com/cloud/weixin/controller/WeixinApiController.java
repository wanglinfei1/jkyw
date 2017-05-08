package com.cloud.weixin.controller;

import com.cloud.core.config.WxApIUrlConfig;
import com.cloud.core.config.exception.RestException;
import com.cloud.core.constant.Constants;
import com.cloud.core.utils.AccessTokenUtil;
import com.cloud.core.utils.ErrorMsg;
import com.cloud.core.utils.HttpUtil;
import com.cloud.core.utils.Result;
import com.cloud.modules.wx.config.entity.GlobalConfig;
import com.cloud.modules.wx.config.service.IGlobalConfigService;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.ResourceUrlEncodingFilter;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by ethan on 17/3/24.
 */
@RestController
@RequestMapping("weixin/api")
public class WeixinApiController {

    @Autowired
    private AccessTokenUtil accessTokenUtil;

    /**
     * 获取微信用户基本信息
     * @return
     * @throws RestException
     */
    @GetMapping("getCgibinUserInfo")
    public Result getCgibinUserInfo(HttpSession session) throws RestException {
        WxPublicaccount publicaccount = (WxPublicaccount) session.getAttribute(Constants.WEIXIN_SESSION_publicAccount);
        if(publicaccount==null){
            return Result.assembly();
        }
        String openid = (String) session.getAttribute(Constants.WEIXIN_SESSION_PUBID_OPENID);

        String accessToken = accessTokenUtil.getAccessToken(publicaccount.getId().toString(),publicaccount.getAppid(),publicaccount.getAppsecret());
        JSONObject userinfo = WxApIUrlConfig.sendRequest(WxApIUrlConfig.cgi_bin_user_info, accessToken,openid);

        return Result.assembly(userinfo);
    }
}
