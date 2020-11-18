package com.laoyou.blog.controller;

import com.laoyou.blog.config.ResultAdviceAnnotation;
import com.laoyou.blog.entity.system.User;
import com.laoyou.blog.service.system.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : YL
 * @description : 系统controller
 * @date : 2020/11/17 9:58
 **/
@RestController
@RequestMapping("/system")
public class SystemController {
    @Autowired
    private UserService userService;

    @RequestMapping("/login")
    public void login() {

    }

    @RequestMapping("/test")
    @ResultAdviceAnnotation(intercept = true)
    public Object test() throws Exception {
//        throw new Exception("2222");
        User user = new User();
        user.setAccount("admin");
        user.setEmail("624130658@qq.com");
        user.setName("系统管理员");
        user.setPassword("123456");
        return user;
//        User save = userService.save(user);
//        User userById = userService.getUserById(save.getId());
//        return userById;
    }
}
