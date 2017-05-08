package com.cloud.modules.bussines.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * @Object entity.
 * @author ethan
 * @currentTime
 */
@Data
public class MemberBloodPressureVO implements Serializable{

    private String openid;
	//高压
    private Integer sbp;
	//低压
    private Integer dbp;
	//心率
    private Integer heartRate;
	//备注
    private String comment;
}  