package com.laoyou.blog.service.system.impl;

import com.laoyou.blog.constant.enums.ResultCode;
import com.laoyou.blog.constant.enums.Status;
import com.laoyou.blog.entity.system.User;
import com.laoyou.blog.exception.BaseException;
import com.laoyou.blog.repository.system.UserRepository;
import com.laoyou.blog.service.system.UserService;
import com.laoyou.blog.util.EntityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
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
        List<User> byAccount = userRepository.findByAccount(account);
        if (null == byAccount || byAccount.size() == 0) {
            return null;
        }
        return byAccount.get(0);
    }

    @Override
    public User validationLogin(String account, String password) {
        User userByAccount = getUserByAccount(account);
        if (null == userByAccount) {
            throw new BaseException(ResultCode.ERROR);
        }
        if (!password.equals(userByAccount.getPassword())) {
            throw new BaseException(ResultCode.ERROR);
        }
        if (Status.INVALID.equals(userByAccount.getStatus())) {
            throw new BaseException(ResultCode.ERROR);
        }
        return userByAccount;
    }

    @Override
    public Page<User> getPage(User user, Pageable pageable) {
        Example<User> example = Example.of(user);
        Page<User> all = userRepository.findAll(example, pageable);
        return all;
    }
}
