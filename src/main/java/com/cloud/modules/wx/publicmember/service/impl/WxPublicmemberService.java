package com.cloud.modules.wx.publicmember.service.impl;

import com.cloud.modules.wx.publicmember.entity.WxPublicmember;
import com.cloud.modules.wx.publicmember.service.IWxPublicmemberService;
import org.springframework.stereotype.Service;

@Service
public class WxPublicmemberService implements IWxPublicmemberService {

    @Override
    public void savePublicmember(WxPublicmember pm) {

    }

    @Override
    public WxPublicmember queryPublicmemberByOpenid(String openid, Integer id) {
        return null;
    }
}
