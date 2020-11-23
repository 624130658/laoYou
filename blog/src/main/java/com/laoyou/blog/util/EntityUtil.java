package com.laoyou.blog.util;

import com.laoyou.blog.constant.enums.Status;
import com.laoyou.blog.entity.BaseEntity;
import com.laoyou.blog.entity.system.User;

import java.util.Date;

/**
 * @author : YL
 * @description : 实体工具类
 * @date : 2020/11/17 10:01
 **/
public class EntityUtil {
    /**
     * @param target : 源实体
     * @return : 创建后的源实体
     * @author : YL
     * @description : 创建实体（即插入一条数据前要调用）
     * @date : 2020/11/17 10:01
     **/
    public static <T extends BaseEntity> T create(T target) {
        User currentUser = UserUtil.getCurrentUser();
        Date date = new Date();
        target.setCreated(date);
        target.setCreator(currentUser.getId());
        target = modify(target, currentUser.getId(), date);
        return target;
    }

    /**
     * @param target : 源实体
     * @param id     : 创建用户的id
     * @param date   : 创建的时间
     * @return : 创建后的源实体
     * @author : YL
     * @description : 创建实体（即插入一条数据前要调用）
     * @date : 2020/11/17 10:01
     **/
    public static <T extends BaseEntity> T create(T target, Long id, Date date) {
        if (null != date) {
            target.setCreated(date);
        } else {
            Date nowDate = new Date();
            target.setCreated(nowDate);
        }
        if (null != id) {
            target.setCreator(id);
        } else {
            User currentUser = UserUtil.getCurrentUser();
            target.setCreator(currentUser.getId());
        }
        target = modify(target, target.getCreator(), target.getCreated());
        return target;
    }

    /**
     * @param target  : 源实体
     * @param consult : 参考实体
     * @return : 创建后的源实体
     * @author : YL
     * @description : 创建实体（即插入一条数据前要调用）
     * @date : 2020/11/17 10:01
     **/
    public static <T extends BaseEntity, C extends BaseEntity> T create(T target, C consult) {
        if (null != consult) {
            target = create(target, consult.getId(), consult.getModified());
        } else {
            target = create(target);
        }
        return target;
    }

    /**
     * @param target : 源实体
     * @return : 修改后的源实体
     * @author : YL
     * @description : 修改实体（即更新一条数据前要调用）
     * @date : 2020/11/17 10:01
     **/
    public static <T extends BaseEntity> T modify(T target) {
        User currentUser = UserUtil.getCurrentUser();
        Date date = new Date();
        target.setModified(date);
        target.setModifier(currentUser.getId());
        if (null == target.getStatus()) {
            target.setStatus(Status.VALID);
        }
        return target;
    }

    /**
     * @param target : 源实体
     * @param id     : 修改用户的id
     * @param date   : 修改的时间
     * @return : 修改后的源实体
     * @author : YL
     * @description : 修改实体（即更新一条数据前要调用）
     * @date : 2020/11/17 10:01
     **/
    public static <T extends BaseEntity> T modify(T target, Long id, Date date) {
        if (null != date) {
            target.setModified(date);
        } else {
            Date nowDate = new Date();
            target.setModified(nowDate);
        }
        if (null != id) {
            target.setModifier(id);
        } else {
            User currentUser = UserUtil.getCurrentUser();
            target.setModifier(currentUser.getId());
        }
        if (null == target.getStatus()) {
            target.setStatus(Status.VALID);
        }
        return target;
    }

    /**
     * @param target  : 源实体
     * @param consult : 参考实体
     * @return : 修改后的源实体
     * @author : YL
     * @description : 修改实体（即更新一条数据前要调用）
     * @date : 2020/11/17 10:01
     **/
    public static <T extends BaseEntity, C extends BaseEntity> T modify(T target, C consult) {
        if (null != consult) {
            target = modify(target, consult.getId(), consult.getModified());
        } else {
            target = modify(target);
        }
        return target;
    }
}
