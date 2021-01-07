package com.lansive.dispatch.service.system.impl;

import com.lansive.dispatch.constant.enums.ResultCode;
import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.entity.system.Organization;
import com.lansive.dispatch.entity.system.User;
import com.lansive.dispatch.entity.system.UserOrganization;
import com.lansive.dispatch.exception.SystemException;
import com.lansive.dispatch.repository.system.OrganizationRepository;
import com.lansive.dispatch.repository.system.UserOrganizationRepository;
import com.lansive.dispatch.service.system.OrganizationService;
import com.lansive.dispatch.util.EntityUtil;
import com.lansive.dispatch.util.SpringUtil;
import com.lansive.dispatch.util.UserUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @ClassName OrganizationServiceImpl
 * @Author YL
 * @Date 2020/12/30/030 11:05
 **/
@Service
public class OrganizationServiceImpl implements OrganizationService {
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private UserOrganizationRepository userOrganizationRepository;

    @Override
    public List<Organization> getOrganizations(User user) {
        if (null == user) {
            return null;
        }
        List<UserOrganization> userOrganizationByUserId = userOrganizationRepository.findUserOrganizationByUserId(user.getId());
        if (null == userOrganizationByUserId || userOrganizationByUserId.size() == 0) {
            return null;
        }
        Set<Long> collect = userOrganizationByUserId.stream().map(x -> x.getOrganizationId()).collect(Collectors.toSet());
        List<Organization> organizationsByIdIn = organizationRepository.findOrganizationsByIdIn(collect);
        return organizationsByIdIn;
    }

    @Override
    public List<Organization> getMenu() {
        Sort sort = Sort.by(Sort.Order.asc("parentIds"), Sort.Order.asc("priority"));
        Subject currentUser = SecurityUtils.getSubject();
        Specification<Organization> spec = new Specification<Organization>() {
            @Override
            public Predicate toPredicate(Root<Organization> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList();
                List<Long> organizationIds = null;
                Predicate status = criteriaBuilder.equal(root.get("status"), Status.VALID);
                predicates.add(status);
                if (currentUser.hasRole("system")) {
                } else if (currentUser.hasRole("manager")) {
                    List<Organization> currentOrganizations = UserUtil.getCurrentOrganizations();
                    organizationIds = getChildrenOrganizations(currentOrganizations).stream().map(x -> x.getId()).distinct().collect(Collectors.toList());
                } else {
                    List<Organization> currentOrganizations = UserUtil.getCurrentOrganizations();
                    organizationIds = currentOrganizations.stream().map(x -> x.getId()).distinct().collect(Collectors.toList());
                }
                if (null != organizationIds && organizationIds.size() > 0) {
                    CriteriaBuilder.In<Object> in = criteriaBuilder.in(root.get("id"));
                    for (int i = 0; i < organizationIds.size(); i++) {
                        in.value(organizationIds.get(i));
                    }
                    predicates.add(in);
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Organization> organizations = organizationRepository.findAll(spec, sort);
        return organizations;
    }

    @Override
    public Page<Organization> getPage(Organization organization, Pageable pageable) {
        organization.setStatus(Status.VALID);
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains());
        Example<Organization> example = Example.of(organization, matcher);
        Page<Organization> all = organizationRepository.findAll(example, pageable);
        return all;
    }

    @Override
    public Page<Organization> getTreePage(Organization organization, Pageable pageable) {
        if (null == pageable.getSort()) {
            Sort sort = Sort.by(Sort.Order.asc("parentIds"), Sort.Order.asc("priority"));
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }
        Specification<Organization> spec = new Specification<Organization>() {
            @Override
            public Predicate toPredicate(Root<Organization> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList();
                Predicate status = criteriaBuilder.equal(root.get("status"), Status.VALID);
                predicates.add(status);
                Predicate parentId;
                if (null == organization || null == organization.getParentId()) {
                    parentId = criteriaBuilder.isNull(root.get("parentId"));
                } else {
                    parentId = criteriaBuilder.equal(root.get("parentId"), organization.getParentId());
                }
                predicates.add(parentId);
                if (null != organization) {
                    if (null != organization.getName() && !"".equals(organization.getName())) {
                        parentId = criteriaBuilder.like(root.get("name"), "%" + organization.getName() + "%");
                        predicates.add(parentId);
                    }
                }
                return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        Page<Organization> organizations = organizationRepository.findAll(spec, pageable);
        return organizations;
    }

    @Override
    public List<Organization> getChildrenOrganizations(Collection<Organization> organizations) {
        Set<Organization> organizationsSet = new HashSet<>();
        organizationsSet.addAll(organizations);
        List<String> collect = organizations.stream().map(x -> "," + x.getId() + ",").distinct().collect(Collectors.toList());
        for (int i = 0; i < collect.size(); i++) {
            List<Organization> organizationsByParentIdsLike = organizationRepository.findOrganizationsByParentIdsLike(collect.get(i));
            organizationsSet.addAll(organizationsByParentIdsLike);
        }
        return new ArrayList<>(organizationsSet);
    }

    @Override
    public List<Organization> changeStatusByIds(List<Long> ids, Status status) {
        List<Organization> collect = organizationRepository.findOrganizationsByIdIn(ids).stream().map(x -> {
            x.setStatus(status);
            EntityUtil.modify(x);
            return x;
        }).collect(Collectors.toList());
        List<Organization> result = organizationRepository.saveAll(collect);
        return result;
    }

    @Override
    public Map<String, Object> detail(Organization organization) {
        Map<String, Object> result = new HashMap<>();
        Organization parent = new Organization();
        Organization my = new Organization();
        if (null == organization) {
            return null;
        }
        Long parentId = organization.getParentId();
        Long id = organization.getId();
        if (null != parentId) {
            Organization temp = organizationRepository.getOne(parentId);
            if (null != temp) {
                parent = temp;
            }
        }
        if (null != id) {
            Organization temp = organizationRepository.getOne(id);
            if (null != temp) {
                my = temp;
                Long tempParentId = temp.getParentId();
                if (null != tempParentId) {
                    Organization one = organizationRepository.getOne(tempParentId);
                    if (null != one) {
                        parent = one;
                    }
                }
            }
        }
        result.put("parent", parent);
        result.put("my", my);
        return result;
    }

    @Override
    public Organization add(Organization organization) {
        organization.setId(null);
        Organization save = save(organization);
        return save;
    }

    @Override
    public Organization update(Organization organization) {
        Long id = organization.getId();
        if (null == id) {
            throw new SystemException(ResultCode.SERVICE_ERROR.getCode(), "id不能为空");
        }
        Organization save = save(organization);
        return save;
    }

    /**
     * 保存（根据id确定是新增还是修改）
     *
     * @return
     * @Author YL
     * @Date 2021/1/4 16:09
     * @Param
     **/
    private Organization save(Organization organization) {
        Long id = organization.getId();
        Long parentId = organization.getParentId();
        String parentIds = null;
        if (null != parentId) {
            Organization parent = organizationRepository.getOne(organization.getParentId());
            String tempParentIds = parent.getParentIds();
            if (null != tempParentIds && !"".equals(tempParentIds)) {
                parentIds = tempParentIds + "," + parentId;
            } else {
                parentIds = parentId.toString();
            }
        }
        organization.setParentIds(parentIds);
        if (null == id) {
            EntityUtil.create(organization);
        } else {
            Organization one = organizationRepository.getOne(id);
            SpringUtil.copyPropertiesIgnoreNull(organization, one);
            organization = EntityUtil.modify(one);
        }
        Organization save = organizationRepository.saveAndFlush(organization);
        return save;
    }
}
