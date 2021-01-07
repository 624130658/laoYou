package com.lansive.dispatch.exception;

import com.lansive.dispatch.constant.enums.BaseEnum;
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

    public BaseException(BaseEnum baseEnum) {
        super(baseEnum.getDesc());
        this.code = baseEnum.getCode();
    }
}
