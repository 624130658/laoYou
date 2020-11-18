package com.laoyou.blog.repository.system;

import com.laoyou.blog.entity.system.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
