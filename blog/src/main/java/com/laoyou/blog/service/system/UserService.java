package com.laoyou.blog.service.system;


import com.laoyou.blog.entity.system.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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

    /**
     * @param account  : 帐号
     * @param password : 密码
     * @return : User 登录的帐号信息
     * @author : YL
     * @description : 登录验证
     * @date : 2020/11/18 15:49
     **/
    User validationLogin(String account, String password);

    /**
     * @param user     : 查询参数
     * @param pageable : 分页参数
     * @return : 用户分页列表
     * @author : YL
     * @description : 获得用户分页列表
     * @date : 2020/11/19 16:45
     **/
    Page<User> getPage(User user, Pageable pageable);
}