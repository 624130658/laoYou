package com.laoyou.blog.entity;

import com.laoyou.blog.constant.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

/**
 * @author : YL
 * @description : 实体类基类
 * @date : 2020/11/17 9:58
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "status", columnDefinition = "int not null comment '状态'")
    @Convert(converter = Status.Convert.class)
    private Status status;

    @Column(name = "creator", columnDefinition = "int not null comment '创建人id'")
    private Long creator;

    @Column(name = "created", columnDefinition = "datetime not null comment '创建时间'")
    private Date created;

    @Column(name = "modifier", columnDefinition = "int not null comment '修改人id'")
    private Long modifier;

    @Column(name = "modified", columnDefinition = "datetime not null comment '修改时间'")
    private Date modified;
}
