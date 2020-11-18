package com.laoyou.blog.service.system;


import com.laoyou.blog.entity.system.User;

public interface UserService {
    /**
     * @param id : 用户id
     * @return : 用户信息
     * @author : YL
     * @description : 根据用户id获得用户信息
     * @date : 2020/11/17 9:59
     **/
    User getUserById(Long id);

    /**
     * @param user : 用户信息
     * @return : 保存后的用户信息
     * @author : YL
     * @description : 保存用户信息
     * @date : 2020/11/17 9:59
     **/
    User save(User user);

    /**
     * @param account : 帐号
     * @return : 用户信息
     * @author : YL
     * @description : 根据帐号查询用户信息
     * @date : 2020/11/17 10:00
     **/
    User getUserByAccount(String account);
}
