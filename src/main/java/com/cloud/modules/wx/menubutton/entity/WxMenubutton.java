package com.cloud.modules.wx.menubutton.entity;

import lombok.Data;

import java.io.Serializable;

/**
 * @Object entity.
 * @author ethan
 * @currentTime
 */
@Data
public class WxMenubutton implements Serializable{
	//
    private Integer id;
	//公众账号ID
    private Integer pubid;
	//上级菜单ID
    private Integer parentid;
	//菜单名称
    private String name;
	//菜单Code
    private String code;
	//菜单key值
    private String key;
	//菜单类型 0:CLICK, 1:VIEW
    private Integer type;
	//菜单链接
    private String url;
	//菜单排序字段
	private Integer order;
	//素材code
	private String materialid;
	//素材类型 0:文本,1:图片,2:图文,3:语音,4:视频,5:音乐,6:链接
	private Integer materialtype;
	//引用的业务code
	private String busiid;
	//创建时间
	private Integer createtime;
	//0:正常 1:删除
	private Integer delflag;
}