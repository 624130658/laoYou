package com.lansive.dispatch.exception;

import com.lansive.dispatch.constant.enums.BaseEnum;

/**
 * @author : YL
 * @description : 系统异常类
 * @date : 2020/11/18 15:53
 **/
public class SystemException extends BaseException {
    public SystemException() {
    }

    public SystemException(Integer code, String message) {
        super(code, message);
    }

    public SystemException(Integer code) {
        super(code);
    }

    public SystemException(BaseEnum baseEnum) {
        super(baseEnum);
    }
}
