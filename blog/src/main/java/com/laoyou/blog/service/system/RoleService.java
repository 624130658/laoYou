package com.lansive.dispatch.service.system;


import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.entity.system.Role;
import com.lansive.dispatch.entity.system.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface RoleService {
    /**
     * @param id : 角色id
     * @return : 角色信息
     * @author : YL
     * @description : 根据角色id获得角色信息
     * @date : 2020年11月18日 17:16:16
     **/
    Role getRoleById(Long id);

    /**
     * @param role : 角色信息
     * @return : 保存后的角色信息
     * @author : YL
     * @description : 保存角色信息
     * @date : 2020年11月18日 17:17:26
     **/
    Role save(Role role);

    /**
     * @param user : 用户信息
     * @return : 角色信息列表
     * @author : YL
     * @description : 根据用户信息获得角色列表
     * @date : 2020/11/18 17:27
     **/
    List<Role> getRoles(User user);

    /**
     * 获得所有角色
     *
     * @return 角色集合
     * @Author YL
     * @Date 2020/12/31/031 9:02
     **/
    List<Role> getAllRoles();

    /**
     * @param role     : 查询参数
     * @param pageable : 分页参数
     * @return : 角色分页列表
     * @author : YL
     * @description : 获得角色分页列表
     * @date : 2020年12月31日 09:05:57
     **/
    Page<Role> getPage(Role role, Pageable pageable);

    /**
     * 获得详情页面的数据
     *
     * @return 详情页面的数据
     * @Author YL
     * @Date 2021年1月6日 09:07:43
     * @Param role 查询参数
     **/
    Map<String, Object> detail(Role role);

    /**
     * 批量修改角色状态
     *
     * @return
     * @Author YL
     * @Date 2021年1月6日 09:11:37
     * @Param ids    角色id的集合
     * @Param status 状态
     **/
    List<Role> changeStatusByIds(List<Long> ids, Status status);

    /**
     * 新增
     *
     * @return 新增后的角色
     * @Author YL
     * @Date 2021年1月6日 09:14:15
     * @Param role 新增参数
     **/
    Role add(Role role);

    /**
     * 修改
     *
     * @return 修改后的角色
     * @Author YL
     * @Date 2021年1月6日 09:14:49
     * @Param role 修改参数
     **/
    Role update(Role role);

    /**
     * 给角色赋权
     *
     * @Author YL
     * @Date 2021年1月6日 17:46:19
     **/
    void empowered(Long roleId, List<Long> permissionIds);
}
