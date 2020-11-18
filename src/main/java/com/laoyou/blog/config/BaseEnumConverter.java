package com.laoyou.blog.config;

import com.laoyou.blog.constant.enums.BaseEnum;

import javax.persistence.AttributeConverter;
/**
 * @author : YL
 * @description : 枚举转换类基类
 * @date : 2020/11/17 9:55
 **/
public abstract class BaseEnumConverter<T extends BaseEnum> implements AttributeConverter<T, Integer> {
    Class clazz;

    @Override
    public Integer convertToDatabaseColumn(T attribute) {
        clazz = attribute.getClass();
        if (null == attribute) {
            return null;
        }
        return attribute.getCode();
    }

    @Override
    public T convertToEntityAttribute(Integer dbData) {
        BaseEnum baseEnum = BaseEnum.valueOf(clazz, dbData);
        return (T) baseEnum;
    }
}