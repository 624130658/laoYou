package com.lansive.dispatch.repository.system;

import com.lansive.dispatch.entity.system.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @ClassName OrganizationRepository
 * @Author YL
 * @Date 2020/12/30/030 11:08
 **/
public interface OrganizationRepository extends JpaRepository<Organization, Long>, JpaSpecificationExecutor<Organization> {

    List<Organization> findOrganizationsByIdIn(Iterable<Long> ids);

    @Query(value = "from Organization o where CONCAT(',',o.parentIds,',') like %:parentIds%")
    List<Organization> findOrganizationsByParentIdsLike(@Param("parentIds") String parentIds);
}
