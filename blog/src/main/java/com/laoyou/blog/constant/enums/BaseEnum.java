package com.lansive.dispatch.constant.enums;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author : YL
 * @description : 枚举类基类
 * @date : 2020/11/17 9:56
 **/
public interface BaseEnum {
    /**
     * 获取枚举标识
     */
    Integer getCode();

    /**
     * 获取枚举描述
     */
    String getDesc();

    /**
     * 通过code值获取对应的枚举类型
     **/
    BaseEnum getEnum(Integer code);

    /**
     * 通过枚举类型和code值获取对应的枚举类型
     */
    static <T extends BaseEnum> T valueOf(Class<? extends BaseEnum> enumType, Integer code) {
        if (enumType == null || code == null) {
            return null;
        }
        T[] enumConstants = (T[]) enumType.getEnumConstants();
        if (enumConstants == null) {
            return null;
        }
        for (T enumConstant : enumConstants) {
            int enumCode = enumConstant.getCode();
            if (code.equals(enumCode)) {
                return enumConstant;
            }
        }
        return null;
    }

    /**
     * 将enum转换为list
     */
    static <T extends BaseEnum> List<Map<String, Object>> enum2List(Class<? extends BaseEnum> enumType) {
        if (enumType == null) {
            return null;
        }
        T[] enumConstants = (T[]) enumType.getEnumConstants();
        if (enumConstants == null) {
            return null;
        }
        ArrayList<Map<String, Object>> results = new ArrayList<>();
        for (T bean : enumConstants) {
            String desc = bean.getDesc();
            Integer code = bean.getCode();
            HashMap<String, Object> map = new HashMap<>(3);
            map.put("code", code);
            map.put("desc", desc);
            map.put("field", ((Enum) bean).name());
            results.add(map);
        }
        return results;
    }

}
