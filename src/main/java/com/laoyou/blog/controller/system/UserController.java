package com.laoyou.blog.controller.system;

import com.laoyou.blog.entity.system.User;
import com.laoyou.blog.service.system.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : YL
 * @description : 用户controller
 * @date : 2020/11/19 15:21
 **/
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping("/page")
    public Page<User> page(Pageable pageable,User user) {
        return null;
    }
}
