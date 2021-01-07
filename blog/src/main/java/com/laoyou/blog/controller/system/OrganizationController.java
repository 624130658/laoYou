package com.lansive.dispatch.controller.system;

import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.entity.system.Organization;
import com.lansive.dispatch.service.system.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @ClassName OrganizationController
 * @Author YL
 * @Date 2020/12/31/031 14:32
 **/
@RestController
@RequestMapping("/organization")
public class OrganizationController {
    @Autowired
    private OrganizationService organizationService;

    /**
     * 组织机构页面
     *
     * @Author YL
     * @Date 2021年1月4日 10:31:57
     **/
    @RequestMapping(value = "/page", method = RequestMethod.GET)
    public ModelAndView page() {
        ModelAndView modelAndView = new ModelAndView("system/organization/page");
        return modelAndView;
    }

    /**
     * 组织机构详情页面
     *
     * @Author YL
     * @Date 2021年1月4日 13:13:40
     **/
    @RequestMapping(value = "/detail", method = RequestMethod.GET)
    public ModelAndView detail(Organization organization) {
        Map<String, Object> detail = organizationService.detail(organization);
        ModelAndView modelAndView = new ModelAndView("system/organization/detail", detail);
        return modelAndView;
    }

    /**
     * 获得组织机构分页数据
     *
     * @Author YL
     * @Date 2020年12月31日 14:50:18
     **/
    @RequestMapping("/page")
    public Page<Organization> page(Pageable pageable, Organization organization) {
        Page<Organization> page = organizationService.getTreePage(organization, pageable);
        return page;
    }

    /**
     * 批量删除
     *
     * @Author YL
     * @Date 2021年1月4日 13:20:26
     **/
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public Map delete(@RequestParam("ids[]") List<Long> ids) {
        organizationService.changeStatusByIds(ids, Status.INVALID);
        Map map = new HashMap(1);
        map.put("ids", ids);
        return map;
    }

    /**
     * 新增
     *
     * @Author YL
     * @Date 2021年1月4日 15:47:54
     **/
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Organization add(Organization organization) {
        Organization result = organizationService.add(organization);
        return result;
    }

    /**
     * 修改
     *
     * @Author YL
     * @Date 2021年1月4日 15:48:54
     **/
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public Organization update(Organization organization) {
        Organization result = organizationService.update(organization);
        return result;
    }
}
