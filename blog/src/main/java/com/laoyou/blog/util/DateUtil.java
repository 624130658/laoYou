package com.lansive.dispatch.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 时间工具类
 *
 * @ClassName DateUtil
 * @Author YL
 * @Date 2020/12/24/024 14:34
 **/
public class DateUtil {
    /**
     * getDays方法的默认SimpleDateFormat
     *
     * @Author YL
     * @Date 2020/12/24/024 14:45
     **/
    private static SimpleDateFormat getDaysFormat = new SimpleDateFormat("yyyy-MM-dd");

    /**
     * 获得两个日期之间的日字符串
     *
     * @return 日字符串
     * @Author YL
     * @Date 2020/12/24/024 14:45
     * @Param startTime 开始时间
     * @Param endTime 结束时间
     * @Param sdf 转换成字符串的SimpleDateFormat
     **/
    public static List<String> getDays(Date startTime, Date endTime, SimpleDateFormat sdf) {
        List<String> result = new ArrayList<>();
        Long oneDay = 1000 * 60 * 60 * 24L;
        Long startTimeMsec = startTime.getTime();
        Long endTimeMsec = endTime.getTime();
        while (startTimeMsec <= endTimeMsec) {
            Date d = new Date(startTimeMsec);
            if (null == sdf) {
                sdf = getDaysFormat;
            }
            String date = sdf.format(d);
            result.add(date);
            startTimeMsec += oneDay;
        }
        return result;
    }

}
