package com.laoyou.blog.config;

import java.lang.annotation.*;

/**
 * @author : YL
 * @description : 结果集拦截注解
 * @date : 2020/11/18 14:48
 **/
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ResultAdviceAnnotation {
    /**
     * @return : true为拦截，false不拦截
     * @author : YL
     * @description : 是否拦截
     * @date : 2020/11/18 14:48
     **/
    boolean intercept();
}
