package com.lansive.dispatch.config;

import com.lansive.dispatch.constant.enums.ResultCode;
import com.lansive.dispatch.exception.BaseException;
import com.lansive.dispatch.vo.Result;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authz.AuthorizationException;
import org.slf4j.Logger;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import javax.servlet.http.HttpServletRequest;

import static org.slf4j.LoggerFactory.*;

@RestControllerAdvice
public class ResultAdvice implements ResponseBodyAdvice<Object> {
    private static final Logger logger = getLogger(ResultAdvice.class);

    public ResultAdvice() {
    }

    @ExceptionHandler(value = BaseException.class)
    public Result baseExceptionHandler(HttpServletRequest req, BaseException e) {
        logger.error("业务异常！原因是:", e);
        Result result = new Result();
        result.error(e.getCode(), e.getMessage());
        return result;
    }

    @ExceptionHandler(value = AuthorizationException.class)
    public Result authorizationExceptionHandler(HttpServletRequest req, AuthorizationException e) {
        logger.error("授权异常！原因是:", e);
        Result result = new Result();
        if (e.getCause() instanceof BaseException) {
            result.error(((BaseException) e.getCause()).getCode(), e.getCause().getMessage());
        } else {
            result.error(ResultCode.AUTH_ERROR, e.getMessage());
        }
        return result;
    }

    @ExceptionHandler(value = AuthenticationException.class)
    public Result authenticationExceptionHandler(HttpServletRequest req, AuthenticationException e) {
        logger.error("验证异常！原因是:", e);
        Result result = new Result();
        if (e.getCause() instanceof BaseException) {
            result.error(((BaseException) e.getCause()).getCode(), e.getCause().getMessage());
        } else {
            result.error(ResultCode.AUTH_ERROR, e.getMessage());
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

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return AbstractJackson2HttpMessageConverter.class.isAssignableFrom(converterType);
    }

    @Nullable
    @Override
    public final Object beforeBodyWrite(@Nullable Object body, MethodParameter returnType, MediaType contentType, Class<? extends HttpMessageConverter<?>> converterType, ServerHttpRequest request, ServerHttpResponse response) {
        MappingJacksonValue container = this.getOrCreateContainer(body);
        this.beforeBodyWriteInternal(container, contentType, returnType, request, response);
        return container;
    }

    protected MappingJacksonValue getOrCreateContainer(Object body) {
        return body instanceof MappingJacksonValue ? (MappingJacksonValue) body : new MappingJacksonValue(body);
    }

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
            if (null == value || !(value instanceof Result)) {
                Result result = new Result();
                result.success(value);
                mappingJacksonValue.setValue(result);
            }
        }
    }
}
