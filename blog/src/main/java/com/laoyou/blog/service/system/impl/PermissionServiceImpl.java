package com.lansive.dispatch.service.system.impl;

import com.lansive.dispatch.constant.enums.BaseEnum;
import com.lansive.dispatch.constant.enums.ResultCode;
import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.constant.enums.system.PermissionType;
import com.lansive.dispatch.entity.system.Permission;
import com.lansive.dispatch.entity.system.Role;
import com.lansive.dispatch.entity.system.RolePermission;
import com.lansive.dispatch.entity.system.User;
import com.lansive.dispatch.exception.SystemException;
import com.lansive.dispatch.repository.system.PermissionRepository;
import com.lansive.dispatch.repository.system.RolePermissionRepository;
import com.lansive.dispatch.repository.system.RoleRepository;
import com.lansive.dispatch.repository.system.UserRoleRepository;
import com.lansive.dispatch.service.system.PermissionService;
import com.lansive.dispatch.service.system.RoleService;
import com.lansive.dispatch.util.EntityUtil;
import com.lansive.dispatch.util.SpringUtil;
import com.lansive.dispatch.vo.system.PermissionByRoleViewDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class PermissionServiceImpl implements PermissionService {
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private RoleService roleService;
    @Autowired
    private RolePermissionRepository rolePermissionRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Permission getPermissionById(Long id) {
        Permission one = permissionRepository.getOne(id);
        return one;
    }

    @Override
    public Permission save(Permission permission) {
        Long id = permission.getId();
        Long parentId = permission.getParentId();
        String parentIds = null;
        if (null != parentId) {
            Permission parent = permissionRepository.getOne(permission.getParentId());
            String tempParentIds = parent.getParentIds();
            if (null != tempParentIds && !"".equals(tempParentIds)) {
                parentIds = tempParentIds + "," + parentId;
            } else {
                parentIds = parentId.toString();
            }
        }
        permission.setParentIds(parentIds);
        if (null == id) {
            EntityUtil.create(permission);
        } else {
            Permission one = permissionRepository.getOne(id);
            SpringUtil.copyPropertiesIgnoreNull(permission, one);
            permission = EntityUtil.modify(one);
        }
        Permission save = permissionRepository.saveAndFlush(permission);
        return save;
    }

    @Override
    public List<Permission> getPermissions(Role role) {
        if (null == role) {
            return null;
        }
        List<RolePermission> rolePermissionByRoleId = rolePermissionRepository.findRolePermissionByRoleId(role.getId());
        if (null == rolePermissionByRoleId || rolePermissionByRoleId.size() == 0) {
            return null;
        }
        Set<Long> collect = rolePermissionByRoleId.stream().map(x -> x.getPermissionId()).distinct().collect(Collectors.toSet());
        if (null == collect || collect.size() == 0) {
            return null;
        }
        List<Permission> permissionsByIdIn = permissionRepository.findPermissionsByIdIn(collect);
        return permissionsByIdIn;
    }

    @Override
    public List<Permission> getPermissions(User user) {
        List<Role> roles = roleService.getRoles(user);
        if (null == roles || roles.size() == 0) {
            return null;
        }
        List<Long> roleIds = roles.stream().map(x -> x.getId()).collect(Collectors.toList());
        List<RolePermission> rolePermissionByRoleIdIn = rolePermissionRepository.findRolePermissionByRoleIdIn(roleIds);
        Set<Long> permissionIds = rolePermissionByRoleIdIn.stream().map(x -> x.getPermissionId()).distinct().collect(Collectors.toSet());
        List<Permission> permissionsByIdIn = permissionRepository.findPermissionsByIdIn(permissionIds);
        return permissionsByIdIn;
    }

    @Override
    public List<Permission> getMenu() {
        Sort sort = Sort.by(Sort.Order.asc("parentIds"), Sort.Order.asc("priority"));
        List<PermissionType> types = new ArrayList<>();
        types.add(PermissionType.MENU);
        types.add(PermissionType.PAGE);
        List<Permission> permissions = permissionRepository.findPermissionsByTypeInAndStatus(types, Status.VALID, sort);
        return permissions;
    }

    @Override
    public Page<Permission> getPage(Permission permission, Pageable pageable) {
        permission.setStatus(Status.VALID);
        Example<Permission> example = Example.of(permission);
        Page<Permission> all = permissionRepository.findAll(example, pageable);
        return all;
    }

    @Override
    public Map<String, Object> detail(Permission permission) {
        Map<String, Object> result = new HashMap<>();
        Permission parent = new Permission();
        Permission my = new Permission();
        if (null == permission) {
            return null;
        }
        Long parentId = permission.getParentId();
        Long id = permission.getId();
        if (null != parentId) {
            Permission temp = permissionRepository.getOne(parentId);
            if (null != temp) {
                parent = temp;
            }
        }
        if (null != id) {
            Permission temp = permissionRepository.getOne(id);
            if (null != temp) {
                my = temp;
                Long tempParentId = temp.getParentId();
                if (null != tempParentId) {
                    Permission one = permissionRepository.getOne(tempParentId);
                    if (null != one) {
                        parent = one;
                    }
                }
            }
        }
        result.put("parent", parent);
        result.put("my", my);
        result.put("permissionTypes", BaseEnum.enum2List(PermissionType.class));
        return result;
    }

    @Override
    public Page<Permission> getTreePage(Permission permission, Pageable pageable) {
        if (null == pageable.getSort()) {
            Sort sort = Sort.by(Sort.Order.asc("parentIds"), Sort.Order.asc("priority"));
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }
        Specification<Permission> spec = new Specification<Permission>() {
            @Override
            public Predicate toPredicate(Root<Permission> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList();
                Predicate status = criteriaBuilder.equal(root.get("status"), Status.VALID);
                predicates.add(status);
                Predicate parentId;
                if (null == permission || null == permission.getParentId()) {
                    parentId = criteriaBuilder.isNull(root.get("parentId"));
                } else {
                    parentId = criteriaBuilder.equal(root.get("parentId"), permission.getParentId());
                }
                predicates.add(parentId);
                if (null != permission) {
                    if (null != permission.getName() && !"".equals(permission.getName())) {
                        parentId = criteriaBuilder.like(root.get("name"), "%" + permission.getName() + "%");
                        predicates.add(parentId);
                    }
                    if (null != permission.getType()) {
                        Predicate type = criteriaBuilder.equal(root.get("type"), permission.getType());
                        predicates.add(type);
                    }
                    if (null != permission.getCode() && !"".equals(permission.getCode())) {
                        Predicate code = criteriaBuilder.like(root.get("code"), "%" + permission.getCode() + "%");
                        predicates.add(code);
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        Page<Permission> permissions = permissionRepository.findAll(spec, pageable);
        return permissions;
    }

    @Override
    public List<Permission> changeStatusByIds(List<Long> ids, Status status) {
        List<Permission> collect = permissionRepository.findPermissionsByIdIn(ids).stream().map(x -> {
            x.setStatus(status);
            EntityUtil.modify(x);
            return x;
        }).collect(Collectors.toList());
        List<Permission> result = permissionRepository.saveAll(collect);
        return result;
    }

    @Override
    public Permission add(Permission permission) {
        permission.setId(null);
        Permission save = save(permission);
        return save;
    }

    @Override
    public Permission update(Permission permission) {
        Long id = permission.getId();
        if (null == id) {
            throw new SystemException(ResultCode.SERVICE_ERROR.getCode(), "id不能为空");
        }
        Permission save = save(permission);
        return save;
    }

    @Override
    public LinkedHashMap<String, PermissionByRoleViewDto> getRolePermissions(Long roleId) {
        LinkedHashMap<String, PermissionByRoleViewDto> result = new LinkedHashMap<>();
        List<RolePermission> rolePermissionByRoleId = rolePermissionRepository.findRolePermissionByRoleId(roleId);
        List<Long> permissionIdList = rolePermissionByRoleId.stream().map(x -> x.getPermissionId()).collect(Collectors.toList());
        Permission permission = new Permission();
        permission.setStatus(Status.VALID);
        Sort sort = Sort.by(Sort.Order.asc("parentIds"), Sort.Order.asc("priority"));
        Example<Permission> example = Example.of(permission);
        List<Permission> permissions = permissionRepository.findAll(example, sort);
        for (int i = 0; i < permissions.size(); i++) {
            PermissionByRoleViewDto one = new PermissionByRoleViewDto();
            SpringUtil.copyPropertiesIgnoreNull(permissions.get(i), one);
            PermissionByRoleViewDto temp = setOwnByPermissionIdList(one, permissionIdList);
            setPermissionByRoleViewDtoChild(result, temp, null);
        }
        return result;
    }

    /**
     * 根据权限id集合设置是否持有
     *
     * @Author YL
     * @Date 2021年1月6日 14:18:15
     **/
    private PermissionByRoleViewDto setOwnByPermissionIdList(PermissionByRoleViewDto permission, List<Long> permissionIdList) {
        if (permissionIdList.contains(permission.getId())) {
            permission.setOwn(true);
        } else {
            permission.setOwn(false);
        }
        return permission;
    }

    /**
     * 设置PermissionByRoleViewDto的子数据
     *
     * @Author YL
     * @Date 2021年1月6日 14:20:52
     **/
    private void setPermissionByRoleViewDtoChild(LinkedHashMap<String, PermissionByRoleViewDto> permissions, PermissionByRoleViewDto child, Long permissionsParentId) {
        PermissionType type = child.getType();
        Long parentId = child.getParentId();
        Long id = child.getId();
        String key_prefix = "id_";
        boolean isRootMenu = null == permissionsParentId && null == parentId && (PermissionType.MENU.equals(type) || PermissionType.PAGE.equals(type));
        if (isRootMenu) {
            permissions.put(key_prefix + id, child);
        } else if (null != permissionsParentId && permissionsParentId.equals(parentId)) {
            permissions.put(key_prefix + id, child);
        } else {
            for (Map.Entry<String, PermissionByRoleViewDto> entry : permissions.entrySet()) {
                PermissionByRoleViewDto parent = entry.getValue();
                if (PermissionType.MENU.equals(type) || PermissionType.PAGE.equals(type)) {
                    if (null == parent.getId() || null == parentId) {
                        if (null == parent.getId() && null == parentId) {
                            permissions.put(key_prefix + id, child);
                        }
                    } else if (parentId.equals(parent.getId())) {
                        parent.getChildMenu().put(key_prefix + id, child);
                    } else {
                        setPermissionByRoleViewDtoChild(parent.getChildMenu(), child, parent.getId());
                    }
                } else if (PermissionType.NODE.equals(type)) {
                    if (null == parent.getId() || null == parentId) {
                        /**
                         * 说明此节点/权限没有父节点则无法展示出来(即数据是异常的)
                         **/
                    } else if (parentId.equals(parent.getId())) {
                        parent.getChildNode().put(key_prefix + id, child);
                    } else {
                        setPermissionByRoleViewDtoChild(parent.getChildMenu(), child, parent.getId());
                    }
                }
            }
        }
    }
}
