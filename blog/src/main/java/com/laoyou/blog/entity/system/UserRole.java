package com.lansive.dispatch.entity.system;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * @ClassName UserRole
 * @Author YL
 * @Date 2020/12/30/030 9:56
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sys_user_role")
@org.hibernate.annotations.Table(appliesTo = "sys_user_role", comment = "用户角色关联表")
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", columnDefinition = "int not null comment '用户id'")
    private Long userId;

    @Column(name = "role_id", columnDefinition = "int not null comment '角色id'")
    private Long roleId;
}
