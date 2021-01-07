package com.lansive.dispatch.service.system;

import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.entity.system.Organization;
import com.lansive.dispatch.entity.system.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface OrganizationService {

    /**
     * @param user : 用户信息
     * @return : 组织机构信息的集合
     * @author : YL
     * @description : 根据用户信息获得组织机构信息的集合
     * @date : 2020年12月30日 16:01:14
     **/
    List<Organization> getOrganizations(User user);

    /**
     * 获得部门的菜单数据（已排序好的、根据数据权限）
     *
     * @return
     * @Author YL
     * @Date 2020/12/30/030 11:03
     * @Param
     **/
    List<Organization> getMenu();

    /**
     * @param organization : 查询参数
     * @param pageable     : 分页参数
     * @return : 组织机构分页列表
     * @author : YL
     * @description : 获得组织机构分页列表
     * @date : 2020年12月31日 09:09:21
     **/
    Page<Organization> getPage(Organization organization, Pageable pageable);

    /**
     * 获得组织机构树形分页列表
     *
     * @param organization : 查询参数
     * @param pageable     : 分页参数
     * @return 组织机构树形分页列表
     * @Author YL
     * @Date 2020/12/31/031 14:58
     **/
    Page<Organization> getTreePage(Organization organization, Pageable pageable);

    /**
     * 根据父组织机构集合获得所有子组织机构及其自己的集合
     *
     * @return 所有子组织机构及其自己的集合
     * @Author YL
     * @Date 2020/12/30/030 17:35
     * @Param organizations 父组织机构集合
     **/
    List<Organization> getChildrenOrganizations(Collection<Organization> organizations);

    /**
     * 批量修改组织机构状态
     *
     * @return
     * @Author YL
     * @Date 2021/1/4 13:22
     * @Param ids    组织机构id的集合
     * @Param status 状态
     **/
    List<Organization> changeStatusByIds(List<Long> ids, Status status);

    /**
     * 获得详情页面的数据
     *
     * @return 详情页面的数据
     * @Author YL
     * @Date 2021/1/4 14:35
     * @Param organization 查询参数
     **/
    Map<String, Object> detail(Organization organization);

    /**
     * 新增
     *
     * @return 新增后的组织机构
     * @Author YL
     * @Date 2021/1/4 15:49
     * @Param organization 新增参数
     **/
    Organization add(Organization organization);

    /**
     * 修改
     *
     * @return 修改后的组织机构
     * @Author YL
     * @Date 2021年1月4日 15:50:39
     * @Param organization 修改参数
     **/
    Organization update(Organization organization);
}
