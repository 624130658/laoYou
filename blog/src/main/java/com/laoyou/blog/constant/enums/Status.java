package com.laoyou.blog.constant.enums;

import com.laoyou.blog.config.BaseEnumConverter;

/**
 * @author : YL
 * @description : 状态枚举
 * @date : 2020/11/17 9:57
 **/
public enum Status implements BaseEnum {
    INVALID(0, "无效"), VALID(1, "有效");

    private Integer code;
    private String desc;

    Status(int code, String desc) {
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
    public Status getEnum(Integer code) {
        Status result = BaseEnum.valueOf(Status.class, code);
        return result;
    }

    public static class Convert extends BaseEnumConverter<Status> {
        @Override
        protected Class<Status> getClazz() {
            return Status.class;
        }
    }
}
