package com.laoyou.blog.util;

import com.laoyou.blog.entity.system.Permission;
import com.laoyou.blog.entity.system.Role;
import com.laoyou.blog.entity.system.User;

import com.laoyou.blog.service.system.PermissionService;
import com.laoyou.blog.service.system.RoleService;
import com.laoyou.blog.service.system.UserService;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

/**
 * @author : YL
 * @description : 用户工具类
 * @date : 2020/11/17 10:07
 **/
// TODO: 2020/11/16 未编写完成
@Component
public class UserUtil {
    private static RoleService roleService;
    private static PermissionService permissionService;

    /**
     * @return : 当前登录人的用户信息
     * @author : YL
     * @description : 获得当前登录人的用户信息
     * @date : 2020/11/19 13:40
     **/
    public static User getCurrentUser() {
        User user = (User) SecurityUtils.getSubject().getPrincipal();
        return user;
    }

    /**
     * @return : 当前登录人的角色信息
     * @author : YL
     * @description : 获得当前登录人的角色信息
     * @date : 2020/11/19 13:46
     **/
    public static List<Role> getCurrentRoles() {
        User currentUser = getCurrentUser();
        List<Role> roles = roleService.getRoles(currentUser);
        return roles;
    }

    /**
     * @return : 当前登录人的权限信息
     * @author : YL
     * @description : 获得当前登录人的权限信息
     * @date : 2020/11/19 13:49
     **/
    public static List<Permission> getCurrentPermissions() {
        User currentUser = getCurrentUser();
        List<Permission> permissions = permissionService.getPermissions(currentUser);
        return permissions;
    }

    @Autowired
    public void setRoleService(RoleService roleService) {
        UserUtil.roleService = roleService;
    }

    @Autowired
    public void setPermissionService(PermissionService permissionService) {
        UserUtil.permissionService = permissionService;
    }
}
