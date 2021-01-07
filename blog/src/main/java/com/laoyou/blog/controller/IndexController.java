package com.lansive.dispatch.controller;

import com.lansive.dispatch.config.ResultAdviceAnnotation;
import com.lansive.dispatch.entity.system.Organization;
import com.lansive.dispatch.entity.system.Permission;
import com.lansive.dispatch.entity.system.Role;
import com.lansive.dispatch.entity.system.User;
import com.lansive.dispatch.service.system.OrganizationService;
import com.lansive.dispatch.util.UserUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author : YL
 * @description : IndexController
 * @date : 2020/11/17 9:58
 **/
@RestController
public class IndexController {

    /**
     * @param account  : 帐号
     * @param password : 密码
     * @return : 当前登陆用户信息
     * @author : YL
     * @description : 登陆
     * @date : 2020/11/19 14:15
     **/
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public User login(@RequestParam("account") String account, @RequestParam("password") String password) {
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken(account, password);
        subject.login(token);
        User currentUser = UserUtil.getCurrentUser();
        return currentUser;
    }

    /**
     * 登出
     *
     * @return 布尔值 true登出成功
     * @Author YL
     * @Date 2020/12/22/022 15:45
     **/
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public Boolean logout() {
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
        return true;
    }

    /**
     * 获得权限
     *
     * @Author YL
     * @Date 2020/12/25/025 10:04
     **/
    @RequestMapping(value = "/auth", method = RequestMethod.POST)
    public Map<String, Object> auth() {
        Map<String, Object> map = new HashMap<>();
        User currentUser = UserUtil.getCurrentUser();
        map.put("user", currentUser);
        List<Permission> currentPermissions = UserUtil.getCurrentPermissions();
        if (null != currentPermissions && currentPermissions.size() > 0) {
            List<String> permissions = currentPermissions.stream().map(x -> x.getCode()).collect(Collectors.toList());
            map.put("permissions", permissions);
        } else {
            map.put("permissions", new ArrayList<>());
        }
        List<Role> currentRoles = UserUtil.getCurrentRoles();
        if (null != currentRoles && currentRoles.size() > 0) {
            List<String> roles = currentRoles.stream().map(x -> x.getCode()).collect(Collectors.toList());
            map.put("roles", roles);
        } else {
            map.put("roles", new ArrayList<>());
        }
        return map;
    }

    /**
     * 登录页面
     *
     * @Author YL
     * @Date 2020/12/23/023 9:08
     **/
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView loginPage() {
        ModelAndView modelAndView = new ModelAndView("login");
        return modelAndView;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView index() {
        Map map = new HashMap();
        User user = UserUtil.getCurrentUser();
        map.put("user", user);
        ModelAndView modelAndView = new ModelAndView("index", map);
        return modelAndView;
    }

    @Autowired
    private OrganizationService organizationService;

    @RequestMapping("/test")
    @ResultAdviceAnnotation(intercept = true)
//    @RequiresPermissions("user:show")
    public Object test() throws Exception {
        Map<String, Object> param = new HashMap<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        param.put("startTime", sdf.parse("20201201"));
        param.put("endTime", new Date());
        Pageable pageable = PageRequest.of(0, 6);
        List<Organization> menu = organizationService.getMenu();
//        Page<LogDelivery> page = logDeliveryService.getPage(param, pageable);
        return menu;
//        Subject subject = SecurityUtils.getSubject();
////        boolean admin = subject.isPermitted("admin");
////        throw new Exception("2222");
//        User user = new User();
//        user.setAccount("admin");
//        user.setEmail("624130658@qq.com");
//        user.setName("系统管理员");
//        user.setPassword("123456");
//        return user;
//        User save = userService.save(user);
//        User userById = userService.getUserById(save.getId());
//        return userById;
    }
}
