package com.laoyou.blog.config.shiro;

import com.laoyou.blog.entity.system.Permission;
import com.laoyou.blog.entity.system.Role;
import com.laoyou.blog.entity.system.User;
import com.laoyou.blog.service.system.PermissionService;
import com.laoyou.blog.service.system.RoleService;
import com.laoyou.blog.service.system.UserService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author : YL
 * @description : 自定义Realm
 * @date : 2020/11/18 15:42
 **/
public class CustomRealm extends AuthorizingRealm {
    @Autowired
    private UserService userService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private PermissionService permissionService;

    /**
     * @param principalCollection :
     * @return : null
     * @author : YL
     * @description : 权限配置
     * @date : 2020/11/18 15:42
     **/
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        User user = (User) SecurityUtils.getSubject().getPrincipal();
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        List<Role> roles = roleService.getRoles(user);
        Set<String> roleSet = roles.stream().map(x -> x.getCode().trim()).collect(Collectors.toSet());
        List<Permission> permissions = permissionService.getPermissions(user);
        Set<String> permissionSet = permissions.stream().map(x -> x.getCode().trim()).collect(Collectors.toSet());
        info.setRoles(roleSet);
        info.setStringPermissions(permissionSet);
        return info;
    }

    /**
     * @param authenticationToken :
     * @return : null
     * @author : YL
     * @description : 认证配置
     * @date : 2020/11/18 15:43
     **/
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) {
        String account = (String) authenticationToken.getPrincipal();
        String password = new String((char[]) authenticationToken.getCredentials());
        User user = userService.validationLogin(account, password);
        return new SimpleAuthenticationInfo(user, password, getName());
    }
}
