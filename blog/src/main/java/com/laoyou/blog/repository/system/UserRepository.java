package com.laoyou.blog.repository.system;

import com.laoyou.blog.entity.system.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByAccount(String account);
}
