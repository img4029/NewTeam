package com.child.project.entity;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttandanceId implements Serializable{

    private String memSerial;

    private String attDate;
    
}
