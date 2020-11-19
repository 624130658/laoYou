package com.laoyou.blog.service.system;


import com.laoyou.blog.entity.system.Role;
import com.laoyou.blog.entity.system.User;

import java.util.List;

public interface RoleService {
    /**
     * @param id : 角色id
     * @return : 角色信息
     * @author : YL
     * @description : 根据角色id获得角色信息
     * @date : 2020年11月18日 17:16:16
     **/
    Role getRoleById(Long id);

    /**
     * @param role : 角色信息
     * @return : 保存后的角色信息
     * @author : YL
     * @description : 保存角色信息
     * @date : 2020年11月18日 17:17:26
     **/
    Role save(Role role);

    /**
     * @param user : 用户信息
     * @return : 角色信息列表
     * @author : YL
     * @description : 根据用户信息获得角色列表
     * @date : 2020/11/18 17:27
     **/
    List<Role> getRoles(User user);
}
