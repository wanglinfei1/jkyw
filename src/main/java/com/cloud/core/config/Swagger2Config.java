package com.cloud.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Profile({"dev","test"})
@Configuration
@EnableSwagger2
public class Swagger2Config {
	
	@Bean
    public Docket buildDocket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(buildApiInf())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.cloud"))//要扫描的API(Controller)基础包
                .paths(PathSelectors.any())
                .build();
    }
	
    private ApiInfo buildApiInf() {
        return new ApiInfoBuilder()
                .title("智医 微信端 API 1.0版本")
                .contact("服务Rest Api")
                .version("1.0")
                .build();
    }
}
