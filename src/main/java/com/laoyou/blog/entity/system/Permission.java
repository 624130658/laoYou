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
@Table(name = "sys_permission")
@org.hibernate.annotations.Table(appliesTo = "sys_permission", comment = "权限表")
public class Permission extends BaseEntity {

    @Column(name = "parent_id", columnDefinition = "int comment '父id'")
    private Long parentId;

    @Column(name = "url", columnDefinition = "varchar(100) comment '路径'")
    private String url;

    @Column(name = "code", columnDefinition = "varchar(100) not null comment '编码'")
    private String code;

    @Column(name = "name", columnDefinition = "varchar(100) not null comment '名称'")
    private String name;

    @Column(name = "sort", columnDefinition = "int comment '排序'")
    private Long sort;

    @Column(name = "icon", columnDefinition = "varchar(100) comment '图标'")
    private String icon;
    // TODO: 2020/11/16 要改成枚举
    @Column(name = "type", columnDefinition = "int not null comment '类型'")
    private Long type;

    @Column(name = "extra", columnDefinition = "varchar(1000) comment '额外说明'")
    private String extra;
}
