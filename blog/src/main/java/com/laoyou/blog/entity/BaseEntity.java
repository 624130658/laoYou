package com.lansive.dispatch.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lansive.dispatch.constant.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

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

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd")
    @Column(name = "created", columnDefinition = "datetime not null comment '创建时间'")
    private Date created;

    @Column(name = "modifier", columnDefinition = "int not null comment '修改人id'")
    private Long modifier;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd")
    @Column(name = "modified", columnDefinition = "datetime not null comment '修改时间'")
    private Date modified;
}
