package com.laoyou.blog.constant.enums;

/**
 * @author : YL
 * @description : 请求返回枚举
 * @date : 2020/11/17 9:57
 **/
public enum ResultCode implements BaseEnum {
    SUCCESS(200, "请求成功"), ERROR(0, "未知错误"), AUTH_ERROR(1, "权限错误");
    private Integer code;
    private String desc;

    ResultCode(int code, String desc) {
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
        Status result = BaseEnum.valueOf(ResultCode.class, code);
        return result;
    }
}
