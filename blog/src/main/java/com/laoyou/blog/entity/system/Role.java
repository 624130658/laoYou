package com.laoyou.blog.entity.system;

import com.laoyou.blog.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sys_role")
@org.hibernate.annotations.Table(appliesTo = "sys_role", comment = "角色表")
public class Role extends BaseEntity {

    @Column(name = "code", columnDefinition = "varchar(100) not null comment '编码'")
    private String code;

    @Column(name = "name", columnDefinition = "varchar(100) not null comment '名称'")
    private String name;

    @Column(name = "extra", columnDefinition = "varchar(1000) comment '额外说明'")
    private String extra;

    @Column(name = "permissions", columnDefinition = "varchar(1000) comment '权限id拼接，英文逗号分隔'")
    private String permissions;
}
