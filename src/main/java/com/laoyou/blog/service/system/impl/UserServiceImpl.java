package com.laoyou.blog.service.system.impl;

import com.laoyou.blog.entity.system.User;
import com.laoyou.blog.repository.system.UserRepository;
import com.laoyou.blog.service.system.UserService;
import com.laoyou.blog.util.EntityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User getUserById(Long id) {
        Optional<User> byId = userRepository.findById(id);
        return byId.get();
    }

    @Override
    public User save(User user) {
        User create = EntityUtil.create(user);
        User save = userRepository.save(create);
        return save;
    }

    @Override
    public User getUserByAccount(String account) {
        User byAccount = userRepository.findByAccount(account);
        return byAccount;
    }
}
