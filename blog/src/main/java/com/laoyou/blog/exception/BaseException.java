package com.laoyou.blog.exception;

import com.laoyou.blog.constant.enums.ResultCode;
import lombok.Data;

/**
 * @author : YL
 * @description : 异常类基类
 * @date : 2020/11/18 15:59
 **/
@Data
public class BaseException extends RuntimeException {
    private Integer code;

    public BaseException() {
    }

    public BaseException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public BaseException(Integer code) {
        this.code = code;
    }

    public BaseException(ResultCode resultCode) {
        super(resultCode.getDesc());
        this.code = resultCode.getCode();
    }
}
