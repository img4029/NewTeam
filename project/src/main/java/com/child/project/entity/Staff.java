package com.child.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@ToString
@Table(name = "staff")
public class Staff {

    @Column(name = "staff_pst")
    private String staffPst;

    @Column(name = "staff_nm")
    private String staffNm;

    @Id
    @Column(name = "staff_id")
    private String staffId;

    @Column(name = "staff_psw", updatable = false) //
    private String staffPsw;

    @Column(name = "staff_phnn")
    private String staffPhnn;

    @Column(name = "staff_leave")
    private int staffLeave;

    @Column(name = "staff_lvdy")
    private String staffLvdy;

    @Column(name = "rmr")
    private String rmr;
    
    @Transient
    private String type;
}
