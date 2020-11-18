package com.laoyou.blog.repository.system;

import com.laoyou.blog.entity.system.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
