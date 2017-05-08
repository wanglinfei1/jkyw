package com.cloud.modules.wx.menubutton.service;

import com.cloud.modules.wx.menubutton.entity.WxMenubutton;

public interface IWxMenubuttonService{

    /**
     * 查询菜单内容
     * @param pubid
     * @param menuKey
     * @return
     */
    public WxMenubutton queryPubMenu(Integer pubid, String menuKey);
}
