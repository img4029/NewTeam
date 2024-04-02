package com.child.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.child.project.entity.Attandance;
import com.child.project.entity.AttandanceId;


public interface AttandanceRepository extends JpaRepository<Attandance, AttandanceId>  {

    // DB리스트 데이터 싹 가져오기 : 학생별, 일자별 출석현황은 front단에서 처리
    @Query(value = "select * from attandance order by mem_name", nativeQuery = true)
    List<Attandance> findAttList();

    // 월을 기준으로 데이터 전체 가져오기
    // @Query(value = "select * from attandance "
    // + "where substring(attandance_date, locate(\"-\",attandance_date)+1, 2) = (:month);", nativeQuery = true)
    // List<Attandance> findAttList(@Param("month")String month);

    

    @Query(value = "select mem_name, attandance_status from attandance where attandance_date = (:curruentDate)", nativeQuery = true)
    List<Attandance> findAttList2(@Param("curruentDate") String curruentDate);
    
    // 문제 : 지난달 데이터는 어떻게 받아올거임..? 이게 무슨 의미가 있는 쿼리문이냐
    @Query(value = "select * from attandance where substring(attandance_date, 1, 7) = substring(DATE(NOW()), 1, 7)", nativeQuery = true)
    // @Query(value = "select * from attandance where attandance_date = substring(DATE(NOW()), 1, 10)", nativeQuery = true)
    // @Query(value = "select * from attandance where attandance_date = DATE_FORMAT(NOW(), '%Y-%m-%d')", nativeQuery = true)
    List<Attandance> findAttList3();

    // 리스트에서 중복된 시리얼 값을 제외하고 가져오기
    @Query(value = "with unique_serials AS (select distinct mem_serial from attandance) select mem_serial from unique_serials ", nativeQuery = true)
    List<Attandance> findSerialList();
}
