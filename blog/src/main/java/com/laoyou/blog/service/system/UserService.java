package com.lansive.dispatch.service.system;


import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.entity.system.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

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

    /**
     * @param user     : 查询参数
     * @param pageable : 分页参数
     * @return : 用户分页列表
     * @author : YL
     * @description : 获得用户分页列表（根据组织机构）
     * @date : 2020年12月31日 16:52:06
     **/
    Page<User> getPageByOrganizations(User user, Pageable pageable);

    /**
     * 获得详情页面的数据
     *
     * @return 详情页面的数据
     * @Author YL
     * @Date 2021年1月7日 13:40:32
     * @Param user 查询参数
     **/
    Map<String, Object> detail(User user);

    /**
     * 批量修改用户状态
     *
     * @return
     * @Author YL
     * @Date 2021年1月7日 13:41:51
     * @Param ids    用户id的集合
     * @Param status 状态
     **/
    List<User> changeStatusByIds(List<Long> ids, Status status);

    /**
     * 新增
     *
     * @return 新增后的用户
     * @Author YL
     * @Date 2021年1月7日 13:41:55
     * @Param user 新增参数
     * @Param organizationId 组织结构id
     **/
    User add(User user, Long organizationId);

    /**
     * 修改
     *
     * @return 修改后的用户
     * @Author YL
     * @Date 2021年1月7日 13:42:02
     * @Param user 修改参数
     **/
    User update(User user);
}
