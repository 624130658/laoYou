package com.laoyou.blog.repository.system;

import com.laoyou.blog.entity.system.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByAccount(String account);
}
