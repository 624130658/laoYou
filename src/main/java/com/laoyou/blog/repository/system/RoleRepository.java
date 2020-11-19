package com.laoyou.blog.repository.system;

import com.laoyou.blog.entity.system.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findRolesByIdIn(Iterable<Long> ids);
}
