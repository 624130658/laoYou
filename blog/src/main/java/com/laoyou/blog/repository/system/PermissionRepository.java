package com.lansive.dispatch.repository.system;

import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.constant.enums.system.PermissionType;
import com.lansive.dispatch.entity.system.Permission;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {
    List<Permission> findPermissionsByIdIn(Iterable<Long> ids);

    List<Permission> findPermissionsByTypeInAndStatus(Iterable<PermissionType> types, Status status, Sort sort);
}
