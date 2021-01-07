package com.lansive.dispatch.entity.system;

import com.lansive.dispatch.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 组织机构
 *
 * @Author YL
 * @Date 2020年12月29日 17:54:42
 **/
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sys_organization")
@org.hibernate.annotations.Table(appliesTo = "sys_organization", comment = "组织机构表")
public class Organization extends BaseEntity {

    @Column(name = "parent_id", columnDefinition = "int comment '父id'")
    private Long parentId;

    @Column(name = "parent_ids", columnDefinition = "varchar(1000) comment '父级id列表'")
    private String parentIds;

    @Column(name = "name", columnDefinition = "varchar(100) not null comment '名称'")
    private String name;

    @Column(name = "priority", columnDefinition = "int comment '排序'")
    private Long priority;
    //放弃对中间表的维护权，解决保存中主键冲突的问题
//    @ManyToMany(mappedBy="roles")
//    private Set<SysUser> users = new HashSet<SysUser>(0);
}