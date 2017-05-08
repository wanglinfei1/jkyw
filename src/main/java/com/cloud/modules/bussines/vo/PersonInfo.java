package com.cloud.modules.bussines.vo;

import lombok.Data;

/**
 * Created by think on 2017-03-08.
 */
@Data
public class PersonInfo {
    //手机号
    private String mobile;
    //姓名
    private String name;
    //头像
    private String headImg;
    //性别
    private Integer sex;
    //出生日期
    private String birthDate;
}
