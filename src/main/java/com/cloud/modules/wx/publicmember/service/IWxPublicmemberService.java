package com.cloud.modules.wx.publicmember.service;

import com.cloud.modules.wx.publicmember.entity.WxPublicmember;

public interface IWxPublicmemberService {

    void savePublicmember(WxPublicmember pm);

    WxPublicmember queryPublicmemberByOpenid(String openid, Integer id);
}
