package com.child.project.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.child.project.entity.MemAdmission;
import com.child.project.service.MemAdmissionService;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.RequestParam;


@Log4j2
@RestController
@RequestMapping(value = "/api/adm")
@AllArgsConstructor
public class AdmissionController {

    MemAdmissionService admService;

    @GetMapping("/admMem")
    public List<MemAdmission> admMem(){
        List<MemAdmission> list = admService.selectList();

        log.info("admission List 입소 아동들 확인 " + list);
        
        return list;
    }


    @GetMapping("/admMemOne")
    public MemAdmission admMemOne(@RequestParam("memSerial") String memSerial) {
        MemAdmission admOne =  admService.selectOne(memSerial);
        
        log.info("admission List 입소 아동 detail 확인 => " + admOne);

        return admOne;
    }
    



}
