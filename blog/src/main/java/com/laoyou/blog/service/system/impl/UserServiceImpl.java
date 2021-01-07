package com.lansive.dispatch.service.system.impl;

import com.lansive.dispatch.constant.enums.ResultCode;
import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.constant.enums.SystemEnum;
import com.lansive.dispatch.entity.system.Organization;
import com.lansive.dispatch.entity.system.User;
import com.lansive.dispatch.entity.system.UserOrganization;
import com.lansive.dispatch.exception.BaseException;
import com.lansive.dispatch.exception.SystemException;
import com.lansive.dispatch.repository.system.UserOrganizationRepository;
import com.lansive.dispatch.repository.system.UserRepository;
import com.lansive.dispatch.service.system.OrganizationService;
import com.lansive.dispatch.service.system.UserService;
import com.lansive.dispatch.util.EntityUtil;
import com.lansive.dispatch.util.SpringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserOrganizationRepository userOrganizationRepository;
    @Autowired
    private OrganizationService organizationService;

    @Override
    public User getUserById(Long id) {
        Optional<User> byId = userRepository.findById(id);
        return byId.get();
    }

    @Override
    public User save(User user) {
        Long id = user.getId();
        if (null == id) {
            EntityUtil.create(user);
        } else {
            User one = userRepository.getOne(id);
            SpringUtil.copyPropertiesIgnoreNull(user, one);
            user = EntityUtil.modify(one);
        }
        User save = userRepository.saveAndFlush(user);
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
            throw new BaseException(SystemEnum.SYSTEM_ACCOUNT_PASSWORD_ERROR);
        }
        if (!password.equals(userByAccount.getPassword())) {
            throw new BaseException(SystemEnum.SYSTEM_ACCOUNT_PASSWORD_ERROR);
        }
        if (Status.INVALID.equals(userByAccount.getStatus())) {
            throw new BaseException(SystemEnum.SYSTEM_ACCOUNT_CANCELLED);
        }
        return userByAccount;
    }

    @Override
    public Page<User> getPage(User user, Pageable pageable) {
        user.setStatus(Status.VALID);
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("account", ExampleMatcher.GenericPropertyMatchers.contains())
                .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains())
                .withIgnorePaths("password");
        Example<User> example = Example.of(user, matcher);
        Page<User> all = userRepository.findAll(example, pageable);
        return all;
    }

    @Override
    public Page<User> getPageByOrganizations(User user, Pageable pageable) {
        List<Long> organizationIds = null;
        if (null != user && null != user.getOrganizations() && user.getOrganizations().size() > 0) {
            Set<Organization> organizations = user.getOrganizations();
            organizationIds = organizationService.getChildrenOrganizations(organizations).stream().map(x -> x.getId()).distinct().collect(Collectors.toList());
        }
        user.setOrganizations(null);
        if (null != organizationIds && organizationIds.size() > 0) {
            List<Long> userIds = userOrganizationRepository.findUserOrganizationByOrganizationIdIn(organizationIds).stream().map(x -> x.getUserId()).collect(Collectors.toList());
            Specification<User> spec = new Specification<User>() {
                @Override
                public Predicate toPredicate(Root<User> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                    List<Predicate> predicates = new ArrayList();
                    Predicate status = criteriaBuilder.equal(root.get("status"), Status.VALID);
                    predicates.add(status);
                    CriteriaBuilder.In<Object> in = criteriaBuilder.in(root.get("id"));
                    for (int i = 0; i < userIds.size(); i++) {
                        in.value(userIds.get(i));
                    }
                    predicates.add(in);
                    if (null != user) {
                        if (null != user.getAccount() && !"".equals(user.getAccount())) {
                            predicates.add(criteriaBuilder.like(root.get("account"), "%" + user.getAccount() + "%"));
                        }
                        if (null != user.getName() && !"".equals(user.getName())) {
                            predicates.add(criteriaBuilder.like(root.get("name"), "%" + user.getName() + "%"));
                        }
                    }
                    // TODO: 2020/12/30/030 computer其他查询参数需要放到predicates里
                    return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            Page<User> all = userRepository.findAll(spec, pageable);
            return all;
        } else {
            return getPage(user, pageable);
        }
    }


    @Override
    public Map<String, Object> detail(User user) {
        Map<String, Object> result = new HashMap<>();
        User my = new User();
        if (null == user) {
            return null;
        }
        Long id = user.getId();
        if (null != id) {
            User temp = userRepository.getOne(id);
            if (null != temp) {
                my = temp;
            }
        }
        result.put("my", my);
        return result;
    }

    @Override
    public List<User> changeStatusByIds(List<Long> ids, Status status) {
        List<User> collect = userRepository.findUsersByIdIn(ids).stream().map(x -> {
            x.setStatus(status);
            EntityUtil.modify(x);
            return x;
        }).collect(Collectors.toList());
        List<User> result = userRepository.saveAll(collect);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User add(User user, Long organizationId) {
        user.setId(null);
        User save = save(user);
        if (null != organizationId) {
            UserOrganization uo = new UserOrganization();
            uo.setUserId(save.getId());
            uo.setOrganizationId(organizationId);
            userOrganizationRepository.save(uo);
        }
        return save;
    }

    @Override
    public User update(User user) {
        Long id = user.getId();
        if (null == id) {
            throw new SystemException(ResultCode.SERVICE_ERROR.getCode(), "id不能为空");
        }
        User save = save(user);
        return save;
    }
}
