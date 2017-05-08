package com.cloud.core.constant;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * Created by ethan on 2017/3/16.
 */
@Data
public class OauthConfig{
    /*
     * oauth验证拦截方式为snsapi_base的模块名称列表
     */
    private List<String> snsapi_base = Lists.newArrayList();
    /*
     * oauth验证拦截方式为snsapi_userinfo的模块名称列表
     */
    private List<String> snsapi_userinfo = Lists.newArrayList();
}