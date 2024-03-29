import { useState, useEffect } from 'react';
import './Member_Leaving.css';
import axios from 'axios';

function Member_Leaving({ memDataOne , lvngMem , dataDML}){
    // 가져온 DATA 를 Mem의 정보를 가져옴 -> 변할 때마다 leaving이 serial전달
    const[lvngMemD,setLvngMemD]=useState({});
    console.log({memDataOne});

    useEffect(()=>{
            console.log("Leaving");
            setLvngMemD({...lvngMem }) ; 
        
    },[memDataOne]);
    console.log({lvngMemD});

    // 함수 받아오기 
    const setDataDML = (type,dml, data)=>{
        dataDML(type,dml, data);
    }

    return (
        <div>
            <div className="lvnggridBox">
                <div>퇴소/종결 일자</div>
                <div><input type="date" value={lvngMemD.leavingDate || ''}/></div>

                <div>퇴소/종결 유형</div>
                <div><input type="text" value={lvngMemD.leavingType || ''}/></div>

                <div>퇴소/종결 예정일자</div>
                <div><input type="date" value={lvngMemD.leaving_prop_date || ''}/></div>

                <div>퇴소/종결 신청일자</div>
                <div><input type="date" value={lvngMemD.leavingExpctDate || ''}/></div>

                <div>퇴소/종결 사유</div>
                <div><input type="text" value={lvngMemD.leavingRs || ''} /></div>

                <div></div><div></div>

                <div>퇴소/종결 비고</div>
                <div><textarea value={lvngMemD.leavingDetail || ''}></textarea></div>
            </div>

            <div className='buttonBox'>
                <div>
                    <button type="reset" onClick={()=> setLvngMemD({}) }>입력취소</button>
                    <button type="submit" value='삭제'  onClick={()=>setDataDML("2","delete",lvngMemD)}>삭제</button>
                    <button type="submit" value='신규' onClick={()=>setDataDML("2","insert",lvngMemD)}>신규</button>
                    <button type="submit" value='저장' onClick={()=>setDataDML("2","update",lvngMemD)}>저장</button>
                </div>
            </div>
        </div>
    );
}
export default Member_Leaving;