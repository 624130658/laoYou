package com.laoyou.blog.util;

import com.laoyou.blog.entity.system.User;

import java.util.Date;

/**
 * @author : YL
 * @description : 用户工具类
 * @date : 2020/11/17 10:07
 **/
// TODO: 2020/11/16 未编写完成
public class UserUtil {

    public static User getCurrentUser() {
        User user = new User();
        user.setAccount("admin");
        user.setEmail("624130658@qq.com");
        user.setName("系统管理员");
        user.setPassword("123456");
        user.setPhone("123");
        user.setCreated(new Date());
        user.setCreator(0L);
        user.setModified(new Date());
        user.setModifier(0L);
        user.setId(0L);
        return user;
    }
}
