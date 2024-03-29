package com.child.project.service;

import java.util.List;

import com.child.project.entity.MemAdmission;
import com.child.project.entity.Member;

public interface MemAdmissionService {

    // 입소 맴버 리스트 불러오기 => Admission에 있는 정보를 가지고 오려면 작성되어야 함. 
    // 하지만, 명단만을 불러올 거라면, memberList에서 작성하는 것이 맞음
    List<MemAdmission> selectList();

    // 입소 맴버 선택한 아동의 정보만 불러오기 
    MemAdmission selectOne(String memSerial);

    // 입소 맴버 정보 입력하여 새로 insert 하기 
    MemAdmission save(MemAdmission entity);

    //delete
    MemAdmission delete(MemAdmission entity);
    
    //searchBox -> memberList를 불러오는 것.
    List<Member>  findSearch(Member entity);
    
}
