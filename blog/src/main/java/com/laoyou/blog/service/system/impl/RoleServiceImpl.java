package com.lansive.dispatch.service.system.impl;

import com.lansive.dispatch.constant.enums.ResultCode;
import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.entity.system.Role;
import com.lansive.dispatch.entity.system.RolePermission;
import com.lansive.dispatch.entity.system.User;
import com.lansive.dispatch.entity.system.UserRole;
import com.lansive.dispatch.exception.SystemException;
import com.lansive.dispatch.repository.system.RolePermissionRepository;
import com.lansive.dispatch.repository.system.RoleRepository;
import com.lansive.dispatch.repository.system.UserRoleRepository;
import com.lansive.dispatch.service.system.RoleService;
import com.lansive.dispatch.util.EntityUtil;
import com.lansive.dispatch.util.SpringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    @Override
    public Role getRoleById(Long id) {
        Role one = roleRepository.getOne(id);
        return one;
    }

    @Override
    public Role save(Role role) {
        Long id = role.getId();
        if (null == id) {
            EntityUtil.create(role);
        } else {
            Role one = roleRepository.getOne(id);
            SpringUtil.copyPropertiesIgnoreNull(role, one);
            role = EntityUtil.modify(one);
        }
        Role save = roleRepository.saveAndFlush(role);
        return save;
    }

    @Override
    public List<Role> getRoles(User user) {
        if (null == user) {
            return null;
        }
        List<UserRole> userRoleByUserId = userRoleRepository.findUserRoleByUserId(user.getId());
        if (null == userRoleByUserId || userRoleByUserId.size() == 0) {
            return null;
        }
        Set<Long> collect = userRoleByUserId.stream().map(x -> x.getRoleId()).collect(Collectors.toSet());
        if (null == collect || collect.size() == 0) {
            return null;
        }
        List<Role> rolesByIdIn = roleRepository.findRolesByIdIn(collect);
        return rolesByIdIn;
    }

    @Override
    public List<Role> getAllRoles() {
        Role role = new Role();
        role.setStatus(Status.VALID);
        Example<Role> example = Example.of(role);
        List<Role> all = roleRepository.findAll(example);
        return all;
    }

    @Override
    public Page<Role> getPage(Role role, Pageable pageable) {
        role.setStatus(Status.VALID);
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains())
                .withMatcher("code", ExampleMatcher.GenericPropertyMatchers.contains());
        Example<Role> example = Example.of(role, matcher);
        Page<Role> all = roleRepository.findAll(example, pageable);
        return all;
    }

    @Override
    public Map<String, Object> detail(Role role) {
        Map<String, Object> result = new HashMap<>();
        Role my = new Role();
        if (null == role) {
            return null;
        }
        Long id = role.getId();
        if (null != id) {
            Role temp = roleRepository.getOne(id);
            if (null != temp) {
                my = temp;
            }
        }
        result.put("my", my);
        return result;
    }

    @Override
    public List<Role> changeStatusByIds(List<Long> ids, Status status) {
        List<Role> collect = roleRepository.findRolesByIdIn(ids).stream().map(x -> {
            x.setStatus(status);
            EntityUtil.modify(x);
            return x;
        }).collect(Collectors.toList());
        List<Role> result = roleRepository.saveAll(collect);
        return result;
    }

    @Override
    public Role add(Role role) {
        role.setId(null);
        Role save = save(role);
        return save;
    }

    @Override
    public Role update(Role role) {
        Long id = role.getId();
        if (null == id) {
            throw new SystemException(ResultCode.SERVICE_ERROR.getCode(), "id不能为空");
        }
        Role save = save(role);
        return save;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void empowered(Long roleId, List<Long> permissionIds) {
        rolePermissionRepository.deleteByRoleId(roleId);
        if (null != permissionIds && permissionIds.size() != 0) {
            List<RolePermission> rolePermissions = permissionIds.stream().distinct().map(x -> {
                RolePermission rp = new RolePermission();
                rp.setPermissionId(x);
                rp.setRoleId(roleId);
                return rp;
            }).collect(Collectors.toList());
            rolePermissionRepository.saveAll(rolePermissions);
        }
    }
}
