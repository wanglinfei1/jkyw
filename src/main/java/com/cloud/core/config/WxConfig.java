package com.cloud.core.config;

import com.cloud.core.constant.OauthConfig;
import com.google.common.collect.Lists;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by ethan on 2017/3/16.
 */
@Component
@ConfigurationProperties(prefix = "wx")
@Data
public class WxConfig {

    private List<String> notTodoAnything = Lists.newArrayList();

    private OauthConfig oauth;

    private List<String> oauth2AccessToken = Lists.newArrayList();

    private List<String> js_sdk = Lists.newArrayList();

}
