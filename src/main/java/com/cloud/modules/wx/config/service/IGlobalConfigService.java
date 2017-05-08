package com.cloud.modules.wx.config.service;

import com.cloud.modules.wx.config.entity.GlobalConfig;

public interface IGlobalConfigService {

    /**
     * 根据属性键值查询配置信息
     * @return
     */
    public GlobalConfig queryConfigByKey(String key);
}
