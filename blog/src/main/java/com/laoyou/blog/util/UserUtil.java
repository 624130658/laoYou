package com.lansive.dispatch.util;

import com.lansive.dispatch.entity.system.Organization;
import com.lansive.dispatch.entity.system.Permission;
import com.lansive.dispatch.entity.system.Role;
import com.lansive.dispatch.entity.system.User;

import com.lansive.dispatch.service.system.OrganizationService;
import com.lansive.dispatch.service.system.PermissionService;
import com.lansive.dispatch.service.system.RoleService;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author : YL
 * @description : 用户工具类
 * @date : 2020/11/17 10:07
 **/
@Component
public class UserUtil {
    private static RoleService roleService;
    private static PermissionService permissionService;
    private static OrganizationService organizationService;

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

    /**
     * @return : 当前登录人的组织机构信息
     * @author : YL
     * @description : 获得当前登录人的组织机构信息
     * @date : 2020年12月30日 15:59:29
     **/
    public static List<Organization> getCurrentOrganizations() {
        User currentUser = getCurrentUser();
        List<Organization> organizations = organizationService.getOrganizations(currentUser);
        return organizations;
    }

    @Autowired
    public void setRoleService(RoleService roleService) {
        UserUtil.roleService = roleService;
    }

    @Autowired
    public void setPermissionService(PermissionService permissionService) {
        UserUtil.permissionService = permissionService;
    }

    @Autowired
    public void setOrganizationService(OrganizationService organizationService) {
        UserUtil.organizationService = organizationService;
    }
}
