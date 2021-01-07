package com.lansive.dispatch.vo.system;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lansive.dispatch.constant.enums.Status;
import com.lansive.dispatch.constant.enums.system.PermissionType;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.LinkedHashMap;

/**
 * @ClassName PermissionByRoleViewDto
 * @Author YL
 * @Date 2021/1/6 13:57
 **/
@Data
public class PermissionByRoleViewDto {
    /**
     * 主键
     */
    private Long id;

    /**
     * 权限名
     */
    private String name;

    /**
     * 权限类型
     */
    private PermissionType type;

    /**
     * 显示顺序
     */
    private Integer priority;

    /**
     * 父级id
     */
    private Long parentId;

    /**
     * 父级id列表
     */
    private String parentIds;

    /**
     * 权限路径
     */
    private String url;

    /**
     * 权限
     */
    private String permission;

    /**
     * 创建时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd")
    private Date created;

    /**
     * 创建人
     */
    private String creator;

    /**
     * 修改时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd")
    private Date modified;

    /**
     * 修改人
     */
    private String modifier;

    /**
     * 状态（0:无效,1：有效）
     */
    private Status status;
    /**
     * 是否拥有 true 拥有 false 未拥有
     **/
    private Boolean own;
    /**
     * 子菜单(key为"id_"id 如id_1 有序)
     **/
    private LinkedHashMap<String, PermissionByRoleViewDto> childMenu = new LinkedHashMap<>();
    /**
     * 子节点(key为"id_"id 如id_1 有序)
     **/
    private LinkedHashMap<String, PermissionByRoleViewDto> childNode = new LinkedHashMap<>();
}
