package com.lansive.dispatch.controller.system;

import com.lansive.dispatch.config.ResultAdviceAnnotation;
import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.entity.system.Organization;
import com.lansive.dispatch.entity.system.User;
import com.lansive.dispatch.service.system.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

/**
 * @author : YL
 * @description : 用户controller
 * @date : 2020/11/19 15:21
 **/
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * 用户页面
     *
     * @Author YL
     * @Date 2020年12月31日 10:44:10
     **/
    @RequestMapping(value = "/page", method = RequestMethod.GET)
    public ModelAndView page() {
        ModelAndView modelAndView = new ModelAndView("system/user/page");
        return modelAndView;
    }

    /**
     * 获得用户分页数据
     *
     * @Author YL
     * @Date 2020年12月31日 10:45:22
     **/
    @RequestMapping("/page")
    public Page<User> page(Pageable pageable, @RequestParam(value = "organizationId", required = false) Long organizationId, User user) {
        if (null != organizationId) {
            user.setOrganizations(new HashSet<Organization>() {{
                add(new Organization() {{
                    setId(organizationId);
                }});
            }});
        }
        Page<User> page = userService.getPageByOrganizations(user, pageable);
        return page;
    }

    /**
     * 用户详情页面
     *
     * @Author YL
     * @Date 2021年1月7日 13:36:36
     **/
    @RequestMapping(value = "/detail", method = RequestMethod.GET)
    public ModelAndView detail(User user, @RequestParam(value = "organizationId", required = false) Long organizationId) {
        Map<String, Object> detail = userService.detail(user);
        detail.put("organizationId", organizationId);
        ModelAndView modelAndView = new ModelAndView("system/user/detail", detail);
        return modelAndView;
    }

    /**
     * 批量删除
     *
     * @Author YL
     * @Date 2021年1月7日 13:37:02
     **/
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public Map delete(@RequestParam("ids[]") List<Long> ids) {
        userService.changeStatusByIds(ids, Status.INVALID);
        Map map = new HashMap(1);
        map.put("ids", ids);
        return map;
    }

    /**
     * 新增
     *
     * @Author YL
     * @Date 2021年1月7日 13:37:51
     **/
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public User add(User user, @RequestParam(value = "organizationId", required = false) Long organizationId) {
        User result = userService.add(user, organizationId);
        return result;
    }

    /**
     * 修改
     *
     * @Author YL
     * @Date 2021年1月7日 13:38:20
     **/
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public User update(User user) {
        User result = userService.update(user);
        return result;
    }

    /**
     * 修改密码页面
     *
     * @Author YL
     * @Date 2021年1月7日 13:36:36
     **/
    @RequestMapping(value = "/editPassword", method = RequestMethod.GET)
    public ModelAndView editPassword(User user) {
        Map<String, Object> detail = userService.detail(user);
        ModelAndView modelAndView = new ModelAndView("system/user/editPassword", detail);
        return modelAndView;
    }
}
