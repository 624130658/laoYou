package com.lansive.dispatch.config;

import com.lansive.dispatch.constant.enums.BaseEnum;

import javax.persistence.AttributeConverter;

/**
 * @author : YL
 * @description : 枚举转换类基类
 * @date : 2020/11/17 9:55
 **/
public abstract class BaseEnumConverter<T extends BaseEnum> implements AttributeConverter<T, Integer> {

    @Override
    public Integer convertToDatabaseColumn(T attribute) {
        if (null == attribute) {
            return null;
        }
        return attribute.getCode();
    }

    @Override
    public T convertToEntityAttribute(Integer dbData) {
        BaseEnum baseEnum = BaseEnum.valueOf(getClazz(), dbData);
        return (T) baseEnum;
    }

    /**
     * @return : 枚举类模版
     * @author : YL
     * @description : 获得枚举类模版
     * @date : 2020/11/19 14:10
     **/
    protected abstract Class<T> getClazz();
}