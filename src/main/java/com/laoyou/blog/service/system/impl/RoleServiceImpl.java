package com.laoyou.blog.service.system.impl;

import com.laoyou.blog.entity.system.Role;
import com.laoyou.blog.entity.system.User;
import com.laoyou.blog.repository.system.RoleRepository;
import com.laoyou.blog.service.system.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role getRoleById(Long id) {
        Role one = roleRepository.getOne(id);
        return one;
    }

    @Override
    public Role save(Role role) {
        Role save = roleRepository.save(role);
        return save;
    }

    @Override
    public List<Role> getRoles(User user) {
        if (null == user || null == user.getRoles() || "".equals(user.getRoles().trim())) {
            return null;
        }
        Set<Long> collect = Arrays.stream(user.getRoles().split(",")).filter(x -> !"".equals(x.trim())).map(x -> Long.valueOf(x.trim())).collect(Collectors.toSet());
        List<Role> rolesByIdIn = roleRepository.findRolesByIdIn(collect);
        return rolesByIdIn;
    }
}
