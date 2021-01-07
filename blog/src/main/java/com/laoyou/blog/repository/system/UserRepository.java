package com.lansive.dispatch.repository.system;

import com.lansive.dispatch.entity.system.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    List<User> findByAccount(String account);

    List<User> findUsersByIdIn(List<Long> ids);
}
