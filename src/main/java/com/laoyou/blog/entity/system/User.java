package com.laoyou.blog.entity.system;

import com.laoyou.blog.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

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

    @Column(name = "roles", columnDefinition = "varchar(1000) comment '角色id拼接，英文逗号分隔'")
    private String roles;
}
