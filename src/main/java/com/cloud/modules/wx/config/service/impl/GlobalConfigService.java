package com.cloud.modules.wx.config.service.impl;

import com.cloud.modules.wx.config.entity.GlobalConfig;
import com.cloud.modules.wx.config.service.IGlobalConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GlobalConfigService implements IGlobalConfigService {

    @Autowired
    private RestTemplate restTemplate;
    @Override
    public GlobalConfig queryConfigByKey(String key) {
        return null;
    }
}
