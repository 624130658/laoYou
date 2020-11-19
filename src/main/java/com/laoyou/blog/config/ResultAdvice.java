package com.laoyou.blog.config;

import com.laoyou.blog.constant.enums.ResultCode;
import com.laoyou.blog.exception.BaseException;
import com.laoyou.blog.vo.Result;
import org.apache.shiro.authc.AuthenticationException;
import org.slf4j.Logger;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.AbstractMappingJacksonResponseBodyAdvice;

import javax.servlet.http.HttpServletRequest;

import static org.slf4j.LoggerFactory.*;

@RestControllerAdvice
public class ResultAdvice extends AbstractMappingJacksonResponseBodyAdvice {
    private static final Logger logger = getLogger(ResultAdvice.class);

    @Override
    protected void beforeBodyWriteInternal(MappingJacksonValue mappingJacksonValue, MediaType mediaType, MethodParameter methodParameter, ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse) {
        Object value = mappingJacksonValue.getValue();
        if (methodParameter.getMethod().isAnnotationPresent(ResultAdviceAnnotation.class)) {
            boolean intercept = methodParameter.getMethod().getAnnotation(ResultAdviceAnnotation.class).intercept();
            if (intercept) {
                Result result = new Result();
                result.success(value);
                mappingJacksonValue.setValue(result);
            }
        } else {
            if (!(value instanceof Result)) {
                Result result = new Result();
                result.success(value);
                mappingJacksonValue.setValue(result);
            }
        }
    }

    @ExceptionHandler(value = BaseException.class)
    public Result baseExceptionHandler(HttpServletRequest req, BaseException e) {
        logger.error("业务异常！原因是:", e);
        Result result = new Result();
        result.error(e.getCode(), e.getMessage());
        return result;
    }

    @ExceptionHandler(value = AuthenticationException.class)
    public Result authenticationExceptionHandler(HttpServletRequest req, AuthenticationException e) {
        logger.error("权限异常！原因是:", e);
        Result result = new Result();
        if (e.getCause() instanceof BaseException) {
            result.error(((BaseException) e.getCause()).getCode(), e.getCause().getMessage());
        } else {
            result.error(ResultCode.AUTH_ERROR, e.getCause().getMessage());
        }
        return result;
    }

    @ExceptionHandler(value = Exception.class)
    public Result exceptionHandler(HttpServletRequest req, Exception e) {
        logger.error("未知异常！原因是:", e);
        Result result = new Result();
        result.error(e.getMessage());
        return result;
    }
}
