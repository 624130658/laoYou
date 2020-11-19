package com.laoyou.blog.config.shiro;

import com.laoyou.blog.entity.system.User;
import com.laoyou.blog.service.system.UserService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.Set;

/**
 * @author : YL
 * @description : 自定义Realm
 * @date : 2020/11/18 15:42
 **/
public class CustomRealm extends AuthorizingRealm {
    @Autowired
    private UserService userService;

    /**
     * @param principalCollection :
     * @return : null
     * @author : YL
     * @description : 权限配置
     * @date : 2020/11/18 15:42
     **/
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        String account = (String) SecurityUtils.getSubject().getPrincipal();
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        Set<String> stringSet = new HashSet<>();
        // TODO: 2020/11/18  
        stringSet.add("user:show");
        stringSet.add("user:admin");
        info.setStringPermissions(stringSet);
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
        return new SimpleAuthenticationInfo(account, password, getName());
    }
}
