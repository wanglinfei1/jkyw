package com.cloud.modules.bussines;

import com.cloud.core.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * Created by ethan on 17/3/20.
 */
@Api("资讯管理相关接口")
@RestController
public class ArticleController {

    @Autowired
    private RestTemplate restTemplate;

    @ApiOperation(value = "获取资讯内容列表", notes = "根据分页的页序号，获取资讯列表")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "query",name="pageSize",value="分页大小",dataType = "int"),
            @ApiImplicitParam(paramType = "query",name="pageNum",value="页码",dataType = "int")
    })
    @GetMapping("queryArticleList")
    public Result queryArticleList(Integer pageSize,Integer pageNum){

//        ResponseEntity<Result> forEntity = restTemplate.postForEntity("http://base-api-service/article/getArticleList?pageSize={pageSize}&pageNum={pageNum}",null, Result.class, pageSize, pageNum);
        ResponseEntity<Result> forEntity = restTemplate.getForEntity("http://base-api-service/article/queryListByChannel?appid=wechat&pageSize={pageSize}&pageNum={pageNum}",Result.class, pageSize, pageNum);

        return forEntity.getBody();
    }

    @ApiOperation(value = "阅读资讯", notes = "终端用户阅读资讯的时候，需要通知服务器进行资讯阅读量的记录")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "阅读的资讯id", required = true, dataType = "int", paramType = "query")})
    @GetMapping("queryArticleInfo")
    public Result queryArticleInfo(Integer id){

        ResponseEntity<Result> forEntity = restTemplate.postForEntity("http://base-api-service/article/articleRead?id={id}",null, Result.class, id);

        return forEntity.getBody();
    }
}
