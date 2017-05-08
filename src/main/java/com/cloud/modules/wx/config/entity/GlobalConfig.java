package com.cloud.modules.wx.config.entity;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

/**
 * @Object entity.
 * @author ethan
 * @currentTime
 */
@Data
public class GlobalConfig implements Serializable{
	//主键
	private Integer id;
	//属性名称
    private String name;
	//属性键
    private String key;
	//属性值
    private String value;
	//需要传送的默认值
    private String defaultParam;

	private String remark;
}  