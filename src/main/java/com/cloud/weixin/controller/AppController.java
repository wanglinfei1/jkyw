package com.cloud.weixin.controller;

import ch.qos.logback.core.joran.spi.ActionException;
import com.cloud.core.config.WxApIUrlConfig;
import com.cloud.core.config.WxConfig;
import com.cloud.core.config.exception.PageException;
import com.cloud.core.config.exception.RestException;
import com.cloud.core.constant.Constants;
import com.cloud.core.constant.Test;
import com.cloud.core.utils.AccessTokenUtil;
import com.cloud.core.utils.ErrorMsg;
import com.cloud.core.utils.HttpUtil;
import com.cloud.core.utils.SHA1;
import com.cloud.modules.wx.config.entity.GlobalConfig;
import com.cloud.modules.wx.config.service.IGlobalConfigService;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.modules.wx.publicaccount.service.IWxPublicaccountService;
import com.cloud.weixin.model.JsapiSignature;
import net.sf.json.JSONObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.ClusterOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.Serializable;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * Created by ethan on 2017/3/6.
 */
@Controller
public class AppController {

    private String jsapi_ticket_key = "app_%s_%s";
    private String SHA1EncodeStr = "jsapi_ticket=%s&noncestr=%s&timestamp=%s&url=%s";
    private String oauth_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s#wechat_redirect";

    Log logger = LogFactory.getLog(AppController.class);
    @Value("${domain}")
    private String domain;

    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private IWxPublicaccountService wxPublicAccountService;
    @Autowired
    private WxConfig wxConfig;
    @Autowired
    private AccessTokenUtil accessTokenUtil;

    /**
     * <b>页面入口控制器，进入相应的访问模块，主要功能如下：</b><br>
     * 1.验证是否强制微信浏览器打开（可配置两种oauth验证方式，即snsapi_userinfo和snsapi_base）<br>
     * 2.获取Oauth2AccessToken，取得用户的openid(当oauth配置为snsapi_userinfo时，还可同时取得用户的unionid)<br>
     * 3.JsapiTicket 签名，以确保页面可以调用jssdk api<br>
     * <span style="color:red">提示：</span>具体配置参数可查看
     *
     * @param request
     * @param mav
     * @param pubid      会话所在的公众帐号标识
     * @param module     要访问的js[AMD]模块名
     * @param session    用户会话
     * @param state      标识是否为授权后重定向的回来的请求
     * @return
     * @throws PageException
     */
    @SuppressWarnings("deprecation")
    @GetMapping("app_{pubid}_{module}.html")
    public ModelAndView index(HttpServletRequest request, ModelAndView mav, @PathVariable("pubid") Integer pubid, @PathVariable("module") String module, HttpSession session, Integer state) throws PageException {

        mav.setViewName("main");
        for (String key : request.getParameterMap().keySet()) {
            mav.addObject(key, request.getParameter(key));
        }

        //如果要是APP访问的链接，刚不做任务限制
        String from = request.getParameter("from");
        if("app".equals(from)){
            return mav;
        }

        //如果该模块不用做任何事情，则直接跳到页面
        if (wxConfig.getNotTodoAnything().contains(module)) {
            return mav;
        }

        if (pubid == null) {
            throw new PageException(ErrorMsg.ParamsError);
        }

        session.setAttribute(Constants.WEIXIN_SESSION_PUBID, pubid);

        logger.debug("=========================验证是否为微信浏览器===========start==========");

        String brower = request.getHeader("user-agent");
        if (brower.toLowerCase().indexOf("micromessenger") < 0) {
            state = null;
            logger.debug("removeParameter : state");
        }
        logger.info("brower:  " + brower);
        logger.debug("=========================验证是否为微信浏览器===========end==========");


        logger.debug("=========================匹配公众帐号=============start============");
        WxPublicaccount account = null;
        List<WxPublicaccount> accounts = wxPublicAccountService.queryWxPublicaccountsFromRibbonServer();
        for (WxPublicaccount at : accounts) {
            if (at.getId().equals(pubid)) {
                account = at;
                session.setAttribute(Constants.WEIXIN_SESSION_publicAccount, account);
                break;
            }
        }
        if (account == null) {
            throw new PageException(ErrorMsg.NotFindPublicAccount);
        }

        logger.debug("=========================匹配公众帐号=============end============");


        try {

            String queryString = request.getQueryString();
            if (queryString != null && queryString.indexOf("&from") > -1) {
                state = null;
            }
            if (state == null) {
                if (wxConfig.getOauth().getSnsapi_userinfo().contains(module)) {
                    logger.debug("===========(" + state + ")==============(userinfo模式)进行oauth过滤验证==================");
                    logger.debug("------------------处理拼接(snsapi_userinfo) redirect_uri----------start----------------");
                    StringBuffer url = new StringBuffer(request.getRequestURI());
                    if (queryString != null && queryString != "") {
                        logger.info("进行oauth验证的uri（处理前）:" + queryString);
                        queryString = queryString.replaceAll("&code=.*", "").replaceAll("&state=.*", "").replaceAll("&from=.*isappinstalled.*", "");
                        logger.info("进行oauth验证的uri（处理后）:" + queryString);
                        url.append("?").append(queryString);
                    }
                    url.insert(0,domain);
                    logger.debug("url:" + url);
                    logger.debug("------------------处理拼接(snsapi_userinfo) redirect_uri----------end----------------");
                    String oauthUrl = String.format(oauth_url, account.getAppid(), URLEncoder.encode(url.toString()), "snsapi_userinfo", 1);
                    logger.info("snsapi_userinfo oauthUrl:" + oauthUrl);
                    mav.setViewName("redirect:" + oauthUrl);
                    return mav;
                } else if (wxConfig.getOauth().getSnsapi_base().contains(module)) {
                    logger.debug("===========(" + state + ")==============(base模式)进行oauth过滤验证==================");
                    logger.debug("------------------处理拼接(snsapi_base) redirect_uri----------start----------------");
                    StringBuffer url = new StringBuffer(request.getRequestURI());
                    if (queryString != null && queryString != "") {
                        logger.info("进行oauth验证的uri（处理前）:" + queryString);
                        queryString = queryString.replaceAll("&code=.*", "").replaceAll("&state=.*", "").replaceAll("&from=.*isappinstalled.*", "");
                        logger.info("进行oauth验证的uri（处理后）:" + queryString);
                        url.append("?").append(queryString);
                    }
                    url.insert(0,domain);
                    logger.debug("url:" + url);
                    logger.debug("------------------处理拼接(snsapi_base) redirect_uri----------end----------------");
                    String oauthUrl = String.format(oauth_url, account.getAppid(), URLEncoder.encode(url.toString()), "snsapi_base", 1);
                    logger.info("snsapi_base oauthUrl:" + oauthUrl);
                    mav.setViewName("redirect:" + oauthUrl);
                    return mav;
                }
            } else if (state == 1) {
                logger.debug("------------------处理oauth跳转回来的请求----------start----------------");
                if (wxConfig.getOauth2AccessToken().contains(module) && request.getParameter("code") != null) {
                    logger.debug("-----------------start---------------通过 Oauth2AccessToken 获取微信用户的基本信息");
                    String code = request.getParameter("code");
                    try {
                        JSONObject result = WxApIUrlConfig.sendRequest(WxApIUrlConfig.oauth2_accesstoken, account.getAppid(), account.getAppsecret(), code);
//                        mav.addObject("access_token", result.getString("access_token"));
//                        mav.addObject("refresh_token", result.getString("refresh_token"));
                        mav.addObject("openid", result.getString("openid"));
                        session.setAttribute(Constants.WEIXIN_SESSION_PUBID_OPENID, result.getString("openid"));

                        //只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段
                        if (null != result.get("unionid")) {
                            mav.addObject("unionid", result.getString("unionid"));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    logger.debug("-----------------end---------------通过 Oauth2AccessToken 获取微信用户的基本信息");
                }

			    /*获取签名认证结束*/
                logger.debug("------------------处理oauth跳转回来的请求----------end----------------");
            }


            if (wxConfig.getJs_sdk().contains(module)) {
                logger.info("------------------start-------------------开始获取签名认证");
                /*开始获取签名认证*/
                Long startTime = System.currentTimeMillis();//记录开始时间

                String signatureKey = String.format(jsapi_ticket_key, pubid, module);
                logger.info("signature cache Key:" + signatureKey);
                ValueOperations valueOperations = redisTemplate.opsForValue();
                JsapiSignature jsapiSignature = (JsapiSignature)valueOperations.get(signatureKey);

                logger.info(JSONObject.fromObject(jsapiSignature).toString());

                if (jsapiSignature == null) {

                    jsapiSignature = new JsapiSignature();
                    jsapiSignature.setNonceStr(getRandomString(28));
                    jsapiSignature.setTimestamp(System.currentTimeMillis() / 1000);
                    jsapiSignature.setAppId(account.getAppid());

                    String accessToken = accessTokenUtil.getAccessToken(account.getId().toString(),account.getAppid(), account.getAppsecret());

                    JSONObject rs = WxApIUrlConfig.sendRequest(WxApIUrlConfig.jsapi_ticket, accessToken);
                    logger.info(rs);

                    if (rs.getInt("errcode") == 0) {
                        String SHA1EncodeStr_temp = String.format(SHA1EncodeStr, rs.getString("ticket"), jsapiSignature.getNonceStr(), jsapiSignature.getTimestamp().toString(), domain+request.getRequestURI());
                        logger.info("SHA1EncodeStr:" + SHA1EncodeStr_temp);
                        // 将三个参数字符串拼接成一个字符串进行sha1加密
                        String signature = SHA1.encode(SHA1EncodeStr_temp);

                        jsapiSignature.setJsapiTicket(rs.getString("ticket"));
                        jsapiSignature.setSignature(signature);

                        long saveTime = (rs.getLong("expires_in") * 1000 - (System.currentTimeMillis() - startTime)) / 1000;

                        logger.debug("签名缓存时间为： "+saveTime+" 秒");

                        valueOperations.set(signatureKey, jsapiSignature, saveTime, TimeUnit.SECONDS);

                    }

                }
                mav.addObject("jsconfig", jsapiSignature);
                mav.addObject("needSignature",true);
                logger.info("------------------end-------------------结束获取签名认证");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new PageException(ErrorMsg.HttpPostError);
        }

        mav.addObject("appsecret", account.getAppsecret());
        return mav;
    }

    /**
     * 前端 JS 日志记录
     *
     * @param url    访问服务的URL地址
     * @param logMsg 日志内容
     * @return
     */
    @PostMapping("jsLogger.json")
    @ResponseBody
    public String recardJsLog(HttpSession session, String url, String logMsg) {
        Integer pubid = (Integer) session.getAttribute(Constants.WEIXIN_SESSION_PUBID);
        String openid = (String) session.getAttribute(Constants.WEIXIN_SESSION_PUBID_OPENID);
        logger.error("/===jslog=== " + pubid + " === " + openid + " ===" + url + "===/");
        logger.error("/");
        logger.error("/" + logMsg);
        logger.error("/");
        logger.error("/===jslog======================================================================================================/");
        return null;
    }

    /**
     * 重定向URL
     *
     * @param url URL地址
     * @return
     */
    @GetMapping("redirect.htm")
    public ModelAndView redirect(ModelAndView mav, String url) {

        mav.setViewName("redirect:" + url);
        return mav;
    }

    /**
     * 随机生成字符串
     *
     * @param length 表示生成字符串的长度
     * @return
     */
    private String getRandomString(int length) {
        String base = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(base.length());
            sb.append(base.charAt(number));
        }
        return sb.toString();
    }
}
