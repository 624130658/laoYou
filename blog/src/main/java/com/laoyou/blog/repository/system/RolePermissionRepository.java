package com.lansive.dispatch.repository.system;

import com.lansive.dispatch.entity.system.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import javax.transaction.Transactional;
import java.util.List;

public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {

    List<RolePermission> findRolePermissionByRoleIdIn(Iterable<Long> roleIds);

    List<RolePermission> findRolePermissionByRoleId(Long roleId);

    @Transactional
    void deleteByRoleId(Long roleId);
}
