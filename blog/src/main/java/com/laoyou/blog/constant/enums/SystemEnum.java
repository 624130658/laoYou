package com.lansive.dispatch.constant.enums;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.lansive.dispatch.config.EnumSerializer;

/**
 * 系统枚举
 *
 * @Author YL
 * @Date 2020/12/23/023 11:33
 **/
@JsonSerialize(using = EnumSerializer.class)
public enum SystemEnum implements BaseEnum {
    SYSTEM_ACCOUNT_PASSWORD_ERROR(100001, "帐号密码错误"),SYSTEM_ACCOUNT_CANCELLED(100002, "帐号已注销");
    private Integer code;
    private String desc;

    SystemEnum(int code, String desc) {
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
    public SystemEnum getEnum(Integer code) {
        SystemEnum result = BaseEnum.valueOf(SystemEnum.class, code);
        return result;
    }
}
