package com.lansive.dispatch.constant.enums.system;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.lansive.dispatch.config.BaseEnumConverter;
import com.lansive.dispatch.config.EnumSerializer;
import com.lansive.dispatch.constant.enums.BaseEnum;

/**
 * 权限类型
 *
 * @Author YL
 * @Date 2020/12/24/024 9:02
 **/
@JsonSerialize(using = EnumSerializer.class)
public enum PermissionType implements BaseEnum {
    MENU(1, "菜单权限"), PAGE(2, "页面权限"), NODE(3, "节点权限");

    private Integer code;
    private String desc;

    PermissionType(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @Override
    public Integer getCode() {
        return code;
    }

    @Override
    public String getDesc() {
        return desc;
    }

    @Override
    public PermissionType getEnum(Integer code) {
        PermissionType result = BaseEnum.valueOf(PermissionType.class, code);
        return result;
    }

    public static class Convert extends BaseEnumConverter<PermissionType> {
        @Override
        protected Class<PermissionType> getClazz() {
            return PermissionType.class;
        }
    }
}
