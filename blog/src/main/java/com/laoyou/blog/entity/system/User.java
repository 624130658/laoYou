package com.lansive.dispatch.entity.system;

import com.lansive.dispatch.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sys_user")
@org.hibernate.annotations.Table(appliesTo = "sys_user", comment = "用户表")
public class User extends BaseEntity {

    @Column(name = "name", columnDefinition = "varchar(100) not null comment '名称'")
    private String name;

    @Column(name = "account", columnDefinition = "varchar(100) not null comment '帐号'")
    private String account;

    @Column(name = "password", columnDefinition = "varchar(100) not null comment '密码'")
    private String password;

    @Column(name = "email", columnDefinition = "varchar(100) comment '电子邮箱'")
    private String email;

    @Column(name = "phone", columnDefinition = "varchar(100) comment '手机号码'")
    private String phone;
    
    @ManyToMany(targetEntity = Organization.class, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(name = "sys_user_organization",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "organization_id", referencedColumnName = "id")}
    )
    private Set<Organization> organizations = new HashSet<>();
}
