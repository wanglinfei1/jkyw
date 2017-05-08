package com.cloud.weixin.controller;

import com.cloud.core.utils.MessageUtil;
import com.cloud.core.utils.SignUtil;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.modules.wx.publicaccount.service.IWxPublicaccountService;
import com.cloud.weixin.send.handler.ICustomerService;
import com.cloud.weixin.service.ICoreService;
import com.cloud.weixin.model.BaseMessageResp;
import com.cloud.weixin.model.WeChat;
import net.sf.json.JSONObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 微信消息核心入口
 * 接入微信服务
 *
 * @author guoyanyong
 *
 * 用户微信接口的相关接入工作。
 */
@Controller
@RequestMapping("wechat")
public class WeChatController {
    private Log logger = LogFactory.getLog(WeChatController.class);

    @Autowired
    private ICoreService CoreService;
    @Autowired
    private IWxPublicaccountService WxAccountService;
    @Autowired
    private ICustomerService customerService;

    @Autowired
    private StringRedisTemplate redisTemplate;

    /**
     * 校验消息是否是从微信服务器发过来的。
     *
     * @param weChat	微信get消息
     */
//    @RequestMapping(method = { RequestMethod.GET }, produces = "application/json;charset=UTF-8")
    @RequestMapping(method = { RequestMethod.GET })
    public void valid(WeChat weChat, PrintWriter out) {
        logger.info("signature:" + weChat.getSignature());
        logger.info("timestamp:" + weChat.getTimestamp());
        logger.info("nonce:" + weChat.getNonce());
        logger.info("echostr:" + weChat.getEchostr());
        logger.info("1.get：开始验证消息是否为腾讯的请求...");
        if (this.checkSignature(weChat, null)) {
            logger.info("1.get：请求验证通过。");
            out.print(weChat.getEchostr());
        } else {
            logger.info("1.get：不是微信服务器发来的请求,请小心!");
        }
        out.flush();
        out.close();

    }

    /**
     * <h1>微信消息的处理</h1><br>
     * <b>接入处理（核心）,主要功能描述：</b><br>
     * 1.验证消息是否微信服务器发送的（对于非微信服务器发送的消息拒之门外），解析微信发送过来的XML消息内容<br>
     * 2.拦截由于服务器响应缓慢时，微信对同一请求多次发送的问题<br>
     * 3.自动匹配用户消息对应的公众帐号<br>
     * 4.调用核心消息处理器，进入消息分发<br>
     * 5.记录服务器处理响应所消耗的时间，当未超过5秒钟时，直接返回，反之则调用客服接口将响应消息发送给用户<br>
     * @param request		微信服务器请求数据
     * @param response		响应微信服务器消息
     * @param weChat		微信请求携带的安全验证信息
     * @throws IOException
     */
//    @RequestMapping(method = { RequestMethod.POST }, produces = "application/xml;charset=UTF-8")
    @RequestMapping(method = { RequestMethod.POST })
    public void dispose(HttpServletRequest request,
                        HttpServletResponse response, WeChat weChat) throws IOException {

        logger.debug("signature:" + weChat.getSignature());
        logger.debug("timestamp:" + weChat.getTimestamp());
        logger.debug("nonce:" + weChat.getNonce());
        logger.debug("echostr:" + weChat.getEchostr());

        // 将用户请求信息转化为Map参数集
        Map<String, Object> requestMap = MessageUtil.parseMap(request);

        logger.debug("用户请求参数：" + JSONObject.fromObject(requestMap).toString());
        // 获取用户openid
        String openid = requestMap.get("FromUserName").toString();
        // 获取消息的创建时间
        String createTime = requestMap.get("CreateTime").toString();

        if (createTime.equals(redisTemplate.opsForValue().get("weixin_user_" + openid))) {
            // 有同样的请求正在处理....
            logger.info("当前有相同的请求正在处理...");
        } else {
            redisTemplate.opsForValue().set("weixin_user_" + openid, createTime, new Date(60 * 1000).getTime());

            logger.info("1.post：开始验证消息是否为腾讯的请求...");

            // 记录请求到达的开始时间
            Long startTime = System.currentTimeMillis();
            logger.debug("记录开始处理请求的开始时间：" + startTime);

            if (this.checkSignature(weChat, request)) {
                logger.info("1.post：请求验证通过。");

				/* 消息的接收、处理、响应 */
                logger.info("消息的接收、处理、响应");

                // 将请求、响应的编码均设置为UTF-8（防止中文乱码）
                request.setCharacterEncoding("UTF-8");
                response.setCharacterEncoding("UTF-8");
                // 公众帐号信息
                WxPublicaccount account = (WxPublicaccount) request.getAttribute("accout");

                // 调用核心业务类接收消息、处理消息
                BaseMessageResp messageResp = CoreService.processRequest(requestMap, account);

                // 记录请求处理结束时间，并计算处理过程是否超出了腾讯的等待时间：5秒，如果超时，则调用客服接口给用户回复
                Long finishTime = System.currentTimeMillis();
                Long mistiming = (finishTime - startTime) / 1000;
                logger.debug("记录请求处理完成时间：" + startTime + " total time："
                        + mistiming + "秒");
                logger.debug("请求响应结果：" +  JSONObject.fromObject(requestMap).toString());

                if (messageResp != null) {
                    Long start = System.currentTimeMillis();
                    if (mistiming >= 5) {// 回复超时调用客服接口回复用户
                        customerService.sendMessage(messageResp, account);
                        Long end = System.currentTimeMillis();
                        logger.debug("调用客服接口发送消息消耗时间-weixin：" + (end - start));
                    } else {//
                        String respXml = MessageUtil.messageToXml(messageResp);
                        logger.info("请求响应消息体：" + respXml);
                        // 响应消息
                        PrintWriter out = response.getWriter();
                        out.print(respXml);
                        out.close();
                    }
                    // 客服接口回复关联答复消息
                    if (null != messageResp.getRealtedMessageResp()) {
                        start = System.currentTimeMillis();
                        customerService.sendMessage(messageResp.getRealtedMessageResp(), account);
                        Long end = System.currentTimeMillis();
                        logger.debug("调用客服接口发送消息消耗时间2-weixin：" + (end - start));
                    }
                } else {
                    // 响应消息
                    PrintWriter out = response.getWriter();
                    out.print("");
                    out.flush();
                    out.close();
                }
            } else {
                logger.info("1.post：不是微信服务器发来的请求,请小心!");
            }
        }

    }

    /**
     * 检查签名，自动匹配公众帐号信息
     *
     * @param weChat
     * @return
     */
    private Boolean checkSignature(WeChat weChat, HttpServletRequest request) {

        String signature = weChat.getSignature(); // 微信加密签名
        String timestamp = weChat.getTimestamp(); // 时间戳
        String nonce = weChat.getNonce();// 随机数

        Boolean checkFlag = false;

        if (null == signature || null == timestamp || null == nonce) {
            return checkFlag;
        }

        List<WxPublicaccount> wxAccountes = WxAccountService.queryWxPublicaccountsFromRibbonServer();

        if (wxAccountes==null || wxAccountes.size() == 0) {
            logger.info("系统中不存在帐户信息，请检查后台数据！");
            return false;
        }
        for (WxPublicaccount account : wxAccountes) {
            // 通过检验signature对请求进行校验，若校验成功则返回true，表示接入成功，否则接入失败
            if (SignUtil.checkSignature(signature, timestamp, nonce, account.getToken())) {
                checkFlag = true;
                // 如果是post请求，将微信用户访问匹配到的公众帐号信息存入此次请求中
                if (null != request)
                    request.setAttribute("accout", account);
                break;
            }
        }
        return checkFlag;
    }

}
