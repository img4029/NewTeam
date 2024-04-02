package com.child.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.child.project.entity.MealMngm;
import com.child.project.entity.MealMngmId;
import com.child.project.repository.MealMngmRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor
@Log4j2
@Service
public class MealMngmServiceImpl implements MealMngmService {

    private final MealMngmRepository mealRepository;
    
    @Override
    public List<MealMngm> selectList() {
        
        return mealRepository.findAll();
    }

    // @Override
    // public MealMngm selectOne(MealMngmId mealMngmId) {
        
    //     return mealRepository.findById(mealMngmId);
    // }

}
