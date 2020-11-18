package com.laoyou.blog.vo;

import com.laoyou.blog.constant.enums.ResultCode;
import lombok.Data;

@Data
public class Result<T> {
    private T data;
    private Boolean success;
    private Integer code;
    private String message;

    public void success(T data) {
        success(data, ResultCode.SUCCESS);
    }

    public void success(T data, ResultCode resultCode) {
        setData(data);
        setCode(resultCode.getCode());
        setMessage(resultCode.getDesc());
        setSuccess(true);
    }

    public void error() {
        error(ResultCode.ERROR);
    }

    public void error(ResultCode resultCode) {
        setCode(resultCode.getCode());
        setMessage(resultCode.getDesc());
        setSuccess(false);
    }

    public void error(ResultCode resultCode, String message) {
        setCode(resultCode.getCode());
        setMessage(message);
        setSuccess(false);
    }

    public void error(String message) {
        setCode(ResultCode.ERROR.getCode());
        setMessage(message);
        setSuccess(false);
    }
}
