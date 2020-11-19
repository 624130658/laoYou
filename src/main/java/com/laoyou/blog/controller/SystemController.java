package com.laoyou.blog.controller;

import com.laoyou.blog.config.ResultAdviceAnnotation;
import com.laoyou.blog.entity.system.User;
import com.laoyou.blog.service.system.UserService;
import com.laoyou.blog.util.UserUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    /**
     * @param account  : 帐号
     * @param password : 密码
     * @return : 当前登陆用户信息
     * @author : YL
     * @description : 登陆
     * @date : 2020/11/19 14:15
     **/
    @RequestMapping("/login")
    public User login(@RequestParam("account") String account, @RequestParam("password") String password) {
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken(account, password);
        subject.login(token);
        User currentUser = UserUtil.getCurrentUser();
        return currentUser;
    }

    @RequestMapping("/test")
    @ResultAdviceAnnotation(intercept = true)
    @RequiresPermissions("user:show")
    public Object test() throws Exception {
        Subject subject = SecurityUtils.getSubject();
        boolean admin = subject.isPermitted("admin");
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
