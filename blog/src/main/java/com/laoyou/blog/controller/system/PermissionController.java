package com.lansive.dispatch.controller.system;

import com.lansive.dispatch.constant.enums.BaseEnum;
import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.constant.enums.system.PermissionType;
import com.lansive.dispatch.entity.system.Permission;
import com.lansive.dispatch.service.system.PermissionService;
import com.lansive.dispatch.vo.system.PermissionByRoleViewDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @ClassName PermissionController
 * @Author YL
 * @Date 2020/12/24/024 16:12
 **/
@RestController
@RequestMapping("/permission")
public class PermissionController {
    @Autowired
    private PermissionService permissionService;

    @RequestMapping("/menu")
    public List<Permission> menu() {
        List<Permission> list = permissionService.getMenu();
        return list;
    }

    /**
     * 权限页面
     *
     * @Author YL
     * @Date 2021年1月5日 09:43:16
     **/
    @RequestMapping(value = "/page", method = RequestMethod.GET)
    public ModelAndView page() {
//        Map<String, Object> map = new HashMap<>();
//        map.put("permissionTypes", BaseEnum.enum2List(PermissionType.class));
//        ModelAndView modelAndView = new ModelAndView("system/permission/page", map);
        ModelAndView modelAndView = new ModelAndView("system/permission/page");
        return modelAndView;
    }

    /**
     * 组织机构详情页面
     *
     * @Author YL
     * @Date 2021年1月4日 13:13:40
     **/
    @RequestMapping(value = "/detail", method = RequestMethod.GET)
    public ModelAndView detail(Permission permission) {
        Map<String, Object> detail = permissionService.detail(permission);
        ModelAndView modelAndView = new ModelAndView("system/permission/detail", detail);
        return modelAndView;
    }

    /**
     * 获得权限分页数据
     *
     * @Author YL
     * @Date 2021年1月5日 09:47:53
     **/
    @RequestMapping("/page")
    public Page<Permission> page(Pageable pageable, Permission permission) {
        Page<Permission> page = permissionService.getTreePage(permission, pageable);
        return page;
    }

    /**
     * 批量删除
     *
     * @Author YL
     * @Date 2021年1月5日 10:04:17
     **/
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public Map delete(@RequestParam("ids[]") List<Long> ids) {
        permissionService.changeStatusByIds(ids, Status.INVALID);
        Map map = new HashMap(1);
        map.put("ids", ids);
        return map;
    }

    /**
     * 新增
     *
     * @Author YL
     * @Date 2021年1月5日 10:06:27
     **/
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Permission add(Permission permission) {
        Permission result = permissionService.add(permission);
        return result;
    }

    /**
     * 修改
     *
     * @Author YL
     * @Date 2021年1月5日 10:08:30
     **/
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public Permission update(Permission permission) {
        Permission result = permissionService.update(permission);
        return result;
    }

    /**
     * 根据角色id获得有效权限
     *
     * @Author YL
     * @Date 2021年1月6日 13:56:17
     **/
    @RequestMapping("/rolePermissions")
    public LinkedHashMap<String, PermissionByRoleViewDto> rolePermissions(@RequestParam Long roleId) {
        LinkedHashMap<String, PermissionByRoleViewDto> roleResources = permissionService.getRolePermissions(roleId);
        return roleResources;
    }
}
