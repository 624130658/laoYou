package com.lansive.dispatch.repository.system;

import com.lansive.dispatch.entity.system.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

    List<UserRole> findUserRoleByUserIdIn(Iterable<Long> userIds);

    List<UserRole> findUserRoleByUserId(Long userId);
}
