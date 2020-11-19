package com.laoyou.blog.service.system.impl;

import com.laoyou.blog.entity.system.Permission;
import com.laoyou.blog.entity.system.Role;
import com.laoyou.blog.entity.system.User;
import com.laoyou.blog.repository.system.PermissionRepository;
import com.laoyou.blog.service.system.PermissionService;
import com.laoyou.blog.service.system.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class PermissionServiceImpl implements PermissionService {
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private RoleService roleService;

    @Override
    public Permission getPermissionById(Long id) {
        Permission one = permissionRepository.getOne(id);
        return one;
    }

    @Override
    public Permission save(Permission permission) {
        Permission save = permissionRepository.save(permission);
        return save;
    }

    @Override
    public List<Permission> getPermissions(Role role) {
        if (null == role || null == role.getPermissions() || "".equals(role.getPermissions().trim())) {
            return null;
        }
        Set<Long> collect = Arrays.stream(role.getPermissions().split(",")).filter(x -> !"".equals(x.trim())).map(x -> Long.valueOf(x.trim())).collect(Collectors.toSet());
        List<Permission> permissionsByIdIn = permissionRepository.findPermissionsByIdIn(collect);
        return permissionsByIdIn;
    }

    @Override
    public List<Permission> getPermissions(User user) {
        List<Role> roles = roleService.getRoles(user);
        if (null == roles || roles.size() == 0) {
            return null;
        }
        Set<Long> param = new HashSet<>();
        Stream<String> stringStream = roles.stream().filter(x -> (null != x && null != x.getPermissions() && !"".equals(x.getPermissions().trim()))).map(x -> x.getPermissions().trim());
        Set<Set<Long>> collect = stringStream.map(x -> {
            Set<Long> temp = Arrays.stream(x.split(",")).filter(y -> null != y && !"".equals(y.trim())).map(y -> Long.valueOf(y.trim())).collect(Collectors.toSet());
            return temp;
        }).collect(Collectors.toSet());
        for (Set<Long> set : collect) {
            param.addAll(set);
        }
        List<Permission> permissionsByIdIn = permissionRepository.findPermissionsByIdIn(param);
        return permissionsByIdIn;
    }
}
