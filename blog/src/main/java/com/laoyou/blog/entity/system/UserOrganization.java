package com.lansive.dispatch.entity.system;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * @ClassName UserOrganization
 * @Author YL
 * @Date 2020/12/30/030 9:36
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sys_user_organization")
@org.hibernate.annotations.Table(appliesTo = "sys_user_organization", comment = "用户组织机构关联表")
public class UserOrganization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", columnDefinition = "int not null comment '用户id'")
    private Long userId;

    @Column(name = "organization_id", columnDefinition = "int not null comment '组织机构id'")
    private Long organizationId;
}
