package com.laoyou.blog.service.system;


import com.laoyou.blog.entity.system.Permission;
import com.laoyou.blog.entity.system.Role;
import com.laoyou.blog.entity.system.User;

import java.util.List;

public interface PermissionService {
    /**
     * @param id : 权限id
     * @return : 权限信息
     * @author : YL
     * @description : 根据权限id获得权限信息
     * @date : 2020年11月18日 17:20:53
     **/
    Permission getPermissionById(Long id);

    /**
     * @param permission : 权限信息
     * @return : 保存后的权限信息
     * @author : YL
     * @description : 保存权限信息
     * @date : 2020年11月18日 17:20:56
     **/
    Permission save(Permission permission);

    /**
     * @param role : 角色信息
     * @return : 权限信息的集合
     * @author : YL
     * @description : 根据角色信息获得权限信息的集合
     * @date : 2020/11/18 17:38
     **/
    List<Permission> getPermissions(Role role);

    /**
     * @param user : 用户信息
     * @return : 权限信息的集合
     * @author : YL
     * @description : 根据用户信息获得权限信息的集合
     * @date : 2020/11/18 17:47
     **/
    List<Permission> getPermissions(User user);
}
