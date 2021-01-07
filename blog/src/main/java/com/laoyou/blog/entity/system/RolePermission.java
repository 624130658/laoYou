package com.lansive.dispatch.entity.system;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * @ClassName RolePermission
 * @Author YL
 * @Date 2020/12/30/030 9:58
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sys_role_permission")
@org.hibernate.annotations.Table(appliesTo = "sys_role_permission", comment = "角色权限关联表")
public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "role_id", columnDefinition = "int not null comment '角色id'")
    private Long roleId;

    @Column(name = "permission_id", columnDefinition = "int not null comment '权限id'")
    private Long permissionId;
}
