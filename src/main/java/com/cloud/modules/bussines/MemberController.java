package com.cloud.modules.bussines;

import com.cloud.core.utils.Result;
import com.cloud.modules.bussines.vo.MemberBloodPressureVO;
import com.cloud.modules.bussines.vo.PersonInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@Api("用户相关接口")
@RestController
@RequestMapping("member")
public class MemberController {

    @Autowired
    private RestTemplate restTemplate;

    @ApiOperation(value = "根据openid检查是否已经完善个人信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openid", value = "用户openid", required = true, dataType = "string", paramType = "query")
    })
    @GetMapping("isCompleteInfo")
    @ResponseBody
    public Result isCompleteInfo(String openid){
        ResponseEntity<Result> rs = restTemplate.getForEntity("http://base-api-service/wx/member/checkIsCompleteInfo?openid={openid}", Result.class,openid);
        return rs.getBody();
    }

    @ApiOperation(value = "根据openid完善用户信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openid", value = "用户openid", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "mobile", value = "手机号", required = true, dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "name", value = "姓名", required = true, dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "sex", value = "性别(1-男，2-女)", dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "birthDate", value = "出生日期(yyyy-MM-dd 例如:1986-11-11)", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "headImg", value = "头像URL", dataType = "String", paramType = "query"),})
    @PostMapping("completeInfo")
    @ResponseBody
    public Result completeInfo(String openid, PersonInfo info) {

        //根据openid更新用户信息
        ResponseEntity<Result> rs = restTemplate.postForEntity("http://base-api-service/wx/member/completeInfo?openid={openid}&mobile={mobile}&name={name}&sex={sex}&birthDate={birthDate}&headImg={headImg}", null, Result.class,
                openid, info.getMobile(), info.getName(), info.getSex(), info.getBirthDate(), info.getHeadImg());
        return rs.getBody();
    }

    @ApiOperation(value = "根据openid查询血压记录列表", notes = "查询血压记录列表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openid", value = "用户openid", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "pageNum", value = "第几页", dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "pageSize", value = "每页显示条数", dataType = "int", paramType = "query") })
    @GetMapping("queryBloodPressureList")
    @ResponseBody
    public Result queryBloodPressureList(String openid, Integer pageNum, Integer pageSize){
        ResponseEntity<Result> rs = restTemplate.getForEntity("http://base-api-service/wx/member/queryBloodPressureList?openid={openid}&pageNum={pageNum}&pageSize={pageSize}", Result.class,openid,pageNum,pageSize);
        return rs.getBody();
    }

    @ApiOperation(value = "根据openid新增血压记录", notes = "新增血压")
    @PostMapping(value = "addBloodPressure")
    @ResponseBody
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "query", name = "openid", value = "用户openid", dataType = "String"),
            @ApiImplicitParam(paramType = "query", name = "measureTime", value = "测量时间(2017-01-04  12:30:00)", dataType = "int"),
            @ApiImplicitParam(paramType = "query", name = "sbp", value = "高压", dataType = "int"),
            @ApiImplicitParam(paramType = "query", name = "dbp", value = "低压", dataType = "int"),
            @ApiImplicitParam(paramType = "query", name = "heartRate", value = "心率", dataType = "int"),
            @ApiImplicitParam(paramType = "query", name = "comment", value = "备注", dataType = "String")})
    public Result addBloodPressure(MemberBloodPressureVO mbp, java.lang.String measureTime) {
        ResponseEntity<Result> rs = restTemplate.postForEntity("http://base-api-service/wx/member/addBloodPressure?openid={openid}&measureTime={measureTime}&sbp={sbp}&dbp={dbp}&heartRate={heartRate}&comment={comment}", null, Result.class,
                mbp.getOpenid(), measureTime, mbp.getSbp(), mbp.getDbp(), mbp.getHeartRate(), mbp.getComment());
        return rs.getBody();
    }
}
