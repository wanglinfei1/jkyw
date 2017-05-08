package com.cloud.modules.wx.publicaccount.service.impl;

import com.cloud.core.utils.Result;
import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;
import com.cloud.modules.wx.publicaccount.service.IWxPublicaccountService;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class WxPublicaccountService implements IWxPublicaccountService {

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public List<WxPublicaccount> queryWxPublicaccountsFromRibbonServer() {
        ResponseEntity<Result> result = restTemplate.getForEntity("http://base-api-service/wxPublicaccount/getList", Result.class);
        JSONArray jsonArray = JSONArray.fromObject(result.getBody().getData());
        List<WxPublicaccount> publicaccounts = (List<WxPublicaccount>) JSONArray.toCollection(jsonArray,WxPublicaccount.class);
        return publicaccounts;
    }
}
