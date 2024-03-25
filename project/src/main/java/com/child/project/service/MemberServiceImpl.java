package com.child.project.service;

import java.util.List;
import java.util.Optional;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import com.child.project.entity.Education;
import com.child.project.entity.Member;
import com.child.project.repository.MemberEduRepository;
import com.child.project.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Log4j2
@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository repository;
    private final MemberEduRepository eduRepository;

    @Override
    public List<Member> selectList() {
        // log.info("리스트 출력 테스트" + repository.findAll());
        return repository.findAll();
    }

    @Override
    public Member selectOne(String memSerial) {
        Optional<Member> result = repository.findById(memSerial);
        return result.get();
    }

    // @Override
    // public List<Member> selectDetail(String memSerial) {

    // return repository.selectDetail(memSerial);
    // }

    // Delete
    @Override
    public void deleteByMemserial(String memSerial) {
        repository.deleteById(memSerial);
    }

    // Insert & Update
    @Override
    public Member save(Member memEntity) {
        // memEntity에 저장
        Member result = repository.save(memEntity);
        return result;
    }

    // ============================
    // Education 엔티티 접근
    @Override
    public Education selectEduData(String memSerial) {
        Optional <Education> result = eduRepository.findById(memSerial);
        log.info("&&&&&&&&&&&&&&"+result);
        return result.get();
    }

    // memSerial 매칭해서 맞는 학력정보 리턴하기 위함
    @Override
    public List<Education> selectEduList() {
        return eduRepository.findAll();
    }

}
