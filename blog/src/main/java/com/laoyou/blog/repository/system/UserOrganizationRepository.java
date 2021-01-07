package com.lansive.dispatch.repository.system;

import com.lansive.dispatch.entity.system.UserOrganization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserOrganizationRepository extends JpaRepository<UserOrganization, Long> {

    List<UserOrganization> findUserOrganizationByUserIdIn(Iterable<Long> userIds);

    List<UserOrganization> findUserOrganizationByUserId(Long userId);

    List<UserOrganization> findUserOrganizationByOrganizationIdIn(Iterable<Long> organizationIds);
}
