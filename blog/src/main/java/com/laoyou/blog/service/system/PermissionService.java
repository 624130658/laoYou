package com.lansive.dispatch.service.system;

import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.entity.system.Permission;
import com.lansive.dispatch.entity.system.Role;
import com.lansive.dispatch.entity.system.User;
import com.lansive.dispatch.vo.system.PermissionByRoleViewDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public interface PermissionService {
    /**
     * @param id : 权限id
     * @return : 权限信息
     * @author : YL
     * @description : 根据权限id获得权限信息
     * @date : 2020年11月18日 17:20:53
     **/
    Permission getPermissionById(Long id);

    /**
     * @param permission : 权限信息
     * @return : 保存后的权限信息
     * @author : YL
     * @description : 保存权限信息（根据id确定是新增还是修改）
     * @date : 2021年1月5日 10:13:44
     **/
    Permission save(Permission permission);

    /**
     * @param role : 角色信息
     * @return : 权限信息的集合
     * @author : YL
     * @description : 根据角色信息获得权限信息的集合
     * @date : 2020/11/18 17:38
     **/
    List<Permission> getPermissions(Role role);

    /**
     * @param user : 用户信息
     * @return : 权限信息的集合
     * @author : YL
     * @description : 根据用户信息获得权限信息的集合
     * @date : 2020/11/18 17:47
     **/
    List<Permission> getPermissions(User user);

    /**
     * 获得菜单数据（已排序好的）
     *
     * @return 菜单数据
     * @Author YL
     * @Date 2020/12/24/024 16:25
     **/
    List<Permission> getMenu();

    /**
     * @param permission : 查询参数
     * @param pageable   : 分页参数
     * @return : 权限分页列表
     * @author : YL
     * @description : 获得权限分页列表
     * @date : 2020年12月31日 09:07:24
     **/
    Page<Permission> getPage(Permission permission, Pageable pageable);

    /**
     * 获得详情页面的数据
     *
     * @return 详情页面的数据
     * @Author YL
     * @Date 2021年1月5日 09:45:12
     * @Param permission 查询参数
     **/
    Map<String, Object> detail(Permission permission);

    /**
     * 获得权限树形分页列表
     *
     * @param permission : 查询参数
     * @param pageable   : 分页参数
     * @return 权限树形分页列表
     * @Author YL
     * @Date 2021年1月5日 09:49:01
     **/
    Page<Permission> getTreePage(Permission permission, Pageable pageable);

    /**
     * 批量修改权限状态
     *
     * @return
     * @Author YL
     * @Date 2021年1月5日 10:05:00
     * @Param ids    权限id的集合
     * @Param status 状态
     **/
    List<Permission> changeStatusByIds(List<Long> ids, Status status);

    /**
     * 新增
     *
     * @return 新增后的权限
     * @Author YL
     * @Date 2021年1月5日 10:07:11
     * @Param permission 新增参数
     **/
    Permission add(Permission permission);

    /**
     * 修改
     *
     * @return 修改后的权限
     * @Author YL
     * @Date 2021年1月5日 10:08:57
     * @Param permission 修改参数
     **/
    Permission update(Permission permission);

    /**
     * 根据角色id获得权限
     *
     * @Author YL
     * @Date 2021年1月6日 14:03:37
     * @Param roleId 角色id
     **/
    LinkedHashMap<String, PermissionByRoleViewDto> getRolePermissions(Long roleId);
}
