package com.cloud.modules.wx.publicaccount.service;

import com.cloud.modules.wx.publicaccount.entity.WxPublicaccount;

import java.util.List;

public interface IWxPublicaccountService {

    List<WxPublicaccount> queryWxPublicaccountsFromRibbonServer();
}
