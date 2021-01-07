package com.lansive.dispatch.controller.system;

import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.entity.system.Role;
import com.lansive.dispatch.service.system.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @ClassName RoleController
 * @Author YL
 * @Date 2021/1/6 9:01
 **/
@RestController
@RequestMapping("/role")
public class RoleController {
    @Autowired
    private RoleService roleService;

    /**
     * 角色页面
     *
     * @Author YL
     * @Date 2021年1月6日 09:03:32
     **/
    @RequestMapping(value = "/page", method = RequestMethod.GET)
    public ModelAndView page() {
        ModelAndView modelAndView = new ModelAndView("system/role/page");
        return modelAndView;
    }

    /**
     * 角色详情页面
     *
     * @Author YL
     * @Date 2021年1月6日 09:05:25
     **/
    @RequestMapping(value = "/detail", method = RequestMethod.GET)
    public ModelAndView detail(Role role) {
        Map<String, Object> detail = roleService.detail(role);
        ModelAndView modelAndView = new ModelAndView("system/role/detail", detail);
        return modelAndView;
    }

    /**
     * 获得角色分页数据
     *
     * @Author YL
     * @Date 2021年1月6日 09:05:41
     **/
    @RequestMapping("/page")
    public Page<Role> page(Pageable pageable, Role role) {
        Page<Role> page = roleService.getPage(role, pageable);
        return page;
    }

    /**
     * 批量删除
     *
     * @Author YL
     * @Date 2021年1月6日 09:10:46
     **/
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public Map delete(@RequestParam("ids[]") List<Long> ids) {
        roleService.changeStatusByIds(ids, Status.INVALID);
        Map map = new HashMap(1);
        map.put("ids", ids);
        return map;
    }

    /**
     * 新增
     *
     * @Author YL
     * @Date 2021年1月6日 09:13:34
     **/
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Role add(Role role) {
        Role result = roleService.add(role);
        return result;
    }

    /**
     * 修改
     *
     * @Author YL
     * @Date 2021年1月6日 16:06:26
     **/
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public Role update(Role role) {
        Role result = roleService.update(role);
        return result;
    }

    /**
     * 给角色赋权
     *
     * @Author YL
     * @Date 2021/1/6 17:44
     **/
    @RequestMapping(value = "/empowered", method = RequestMethod.POST)
    public void empowered(@RequestParam("roleId") Long roleId, @RequestParam(value = "permissionIds[]", required = false) List<Long> permissionIds) {
        roleService.empowered(roleId, permissionIds);
    }

}
