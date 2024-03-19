import './programManagement.css';
import ProgramTree from './ProgramTree'
import ProgramDetails from './ProgramDetails'
import ProgramDetailsPrg from './ProgramDetailsPrg';
import Container from '../Container'
import { useState, useEffect } from 'react'
import SearchBox from '../searchbox/SearchBox';
import { prg_mng } from '../searchbox/searchData'
import axios from "axios";

function ProgramManagement() {
    const [prgDataOne, setPrgDataOne] = useState({}); //프로그램 테이블 전체 보관
    const [prgDetail, setPrgDetail] = useState([]); //프로그램 테이블 전체중에 트리에서 선택한 행의 프로그램 ID의 세부테이블 정보 보관
    const [prgData, setPrgData] = useState({}); //프로그램 테이블 전체중에 트리에서 선택한 행 보관
    const [subCurrentTab, setSubCurrentTab] = useState(0);
    // const [subMenuArr, setSubMenuArr] = useState([
    //     { name: '프로그램 상세정보', content: <ProgramDetails data={programId} setData={setProgramId} /> },
    //     { name: '세부 프로그램', content: <ProgramDetailsPrg data={programId} setData={setProgramId} /> }
    // ]);
    // console.log(programId);
    const subMenuArr = [
        { name: '프로그램 상세정보', content: '' },
        { name: '세부 프로그램', content: '' }
    ];
    subMenuArr[0].content = <ProgramDetails data={prgDataOne} />;
    subMenuArr[1].content = <ProgramDetailsPrg data={prgDetail} />;

    useEffect(() => {
        axios.get('/api/prg/prgList')
            .then((res) => {
                setPrgData(res.data);
            })
    }, []);

    useEffect(() => {
        if (prgDataOne.constructor === Object
            && Object.keys(prgDataOne).length !== 0){
            axios.get('/api/prg/prgDetails', {
                params: {
                    prg_id: prgDataOne.prg_id,
                    rec: '프로그램세부'
                }
            }).then((res) => {
                setPrgDetail(res.data);
            })
        }
    }, [prgDataOne]);

    let treeCount = 2;
    let check = '';
    let check2 = '';
    let check3 = '';
    const prgTreeData = [];
    if (prgData.length > 0) {
        for (let i = 0; i < prgData.length; i++) {
            if (prgData[i].prg_big_cls !== check) {
                check = prgData[i].prg_big_cls;
                prgTreeData.push({
                    prg_big_cls: prgData[i].prg_big_cls,
                    count: `${treeCount++}`,
                    contents: []
                });
                for (let j = 0; j < prgData.length; j++) {
                    if (prgData[j].prg_big_cls === check && prgData[j].prg_mid_cls !== check2) {
                        check2 = prgData[j].prg_mid_cls;
                        prgTreeData.at(-1).contents.push({
                            prg_mid_cls: prgData[j].prg_mid_cls,
                            count: `${treeCount++}`,
                            contents: []
                        });
                        for (let k = 0; k < prgData.length; k++) {
                            if (prgData[k].prg_big_cls === check && prgData[k].prg_mid_cls === check2 && prgData[k].prg_sub_cls !== check3) {
                                check3 = prgData[k].prg_sub_cls;
                                prgTreeData.at(-1).contents.at(-1).contents.push({
                                    prg_sub_cls: prgData[k].prg_sub_cls,
                                    count: `${treeCount++}`,
                                    contents: [{
                                        prg_id: prgData[k].prg_id,
                                        prg_nm: prgData[k].prg_nm,
                                        count: `${treeCount++}`,
                                    }]
                                })
                            }
                        }
                        check3 = ''; 
                    }
                }
                check2 = ''; 
            }
            
        }
        check = '';   
    }

    return (
        <div className='pgr_mng' >
            <SearchBox data={prg_mng} />
            <div className='pgr_mng_mainBox'>
                <div style={{
                    width: '30%',
                    height: '100%',
                }}>
                    <ProgramTree name={'프로그램 목록'} setData={setPrgDataOne}
                        treeData={prgTreeData} prgData={prgData}
                    ></ProgramTree>
                </div>
                <div style={{
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'rgb(223, 222, 222)',
                    marginLeft: '5px',
                    marginRight: '5px'
                }}></div>
                <div style={{
                    width: '70%',
                    height: '100%'
                }}>
                    <Container menuArr={subMenuArr} currentTab={subCurrentTab} setCurrentTab={setSubCurrentTab} mainSub={'sub'} ></Container>
                </div>
            </div>
        </div>
    );
}

export default ProgramManagement;