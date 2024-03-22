import './MemberList.css';
import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';

// function MemberList(props) {
function MemberList({ setData}) {   // memData 는 6줄에서~
    const [memData, setMemData] = useState([]); 
    // console.log(props);
    // const {memData} = memData;   // memData로 받아왔으니까 구조분해할당필요음슴
    useEffect(() => {
        axios
            .get("/api/mem/memList")
            .then((res) => {
                // console.log(res.data); // 데이터 전달 확인용
                setMemData(res.data);
            })
    }, []);


    const testData = [
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff001',
            name: '김수옥',
            gender: '여',
            birth: '1995-08-08'
        },
        {
            serial: 'user2024ff002',
            name: '임시운',
            gender: '여',
            birth: '1994-06-17'
        },
        {
            serial: 'user2024ff003',
            name: '임명건',
            gender: '남',
            birth: '1993-04-18'
        },
        {
            serial: 'user2024ff004',
            name: '김창민',
            gender: '남',
            birth: '1993-04-18'
        },
        {
            serial: 'user2024ff005',
            name: '장근정',
            gender: '여',
            birth: '1993-04-18'
        },
        {
            serial: 'user2024ff006',
            name: '백승현',
            gender: '남',
            birth: '1993-04-18'
        },
        {
            serial: 'user2024ff007',
            name: '최승삼',
            gender: '남',
            birth: '1993-04-18'
        }
    ]

    

    let selectOne = memData.map((e)=>{
        return(
            <>
                
            </>
        )
    })


    
    return (
        <>
            <b>대상자 리스트</b>



            <div className="memberList">
                {/* <table>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>대상자번호</th>
                                <th>대상자명</th>
                                <th>성별</th>
                                <th>생년월일</th>
                            </tr>

                        </thead>
                        {testData.map((o, i) => {
                            // console.log(`test => ${name}`);
                            return (
                                <tbody>
                                    <tr>
                                        <td><input type='text' value='시퀀스 넘버' readonly /></td>
                                        <td><input type='text' value={o.serial} readonly /></td>
                                        <td><input type='text' value={o.name} readonly /></td>
                                        <td><input type='text' D value={o.gender} readonly /></td>
                                        <td><input type='text' value={o.birth} readonly /></td>
                                    </tr>
                                </tbody>

                            )
                        })

                        }
                    </table> */}

                <div className="memberList_container">
                    <div className="memberList_row header">
                        <div className="memberList_cell">번호</div>
                        <div className="memberList_cell">대상자번호</div>
                        <div className="memberList_cell">대상자명</div>
                        <div className="memberList_cell">성별</div>
                        <div className="memberList_cell">생년월일</div>
                    </div>
                    
                    {/* {testData.map((o, i) => (
                        <div className="memberList_row" key={i}>
                            <div className="memberList_cell">시퀀스 넘버</div>
                            <div className="memberList_cell">{o.serial}</div>
                            <div className="memberList_cell">{o.name}</div>
                            <div className="memberList_cell">{o.gender}</div>
                            <div className="memberList_cell">{o.birth}</div>
                        </div>
                    ))} */}
                    {memData && memData.map((o, i) => (
                        // key값에 인덱스보다는 식별번호 넣어주기 -> 인덱스는 최후의 수단?으로 입력
                        <div className="memberList_row" key={o.memSerial} onClick={()=>setData(o)}> 
                            <div className="memberList_cell">★</div>
                            <div className="memberList_cell">{o.memSerial}</div>
                            <div className="memberList_cell">{o.memName}</div>
                            <div className="memberList_cell">{o.memSex}</div>
                            <div className="memberList_cell">{o.memBirth}</div>
                        </div>
                    ))}

                    {/* {mList ? mList.map((o, i) => (
                        <div className="memberList_row" key={i}>
                            <div className="memberList_cell">시퀀스 넘버</div>
                            <div className="memberList_cell">{o.memSerial}</div>
                            <div className="memberList_cell">{o.memName}</div>
                            <div className="memberList_cell">{o.memSex}</div>
                            <div className="memberList_cell">{o.memBirth}</div>
                        </div>
                    )) : ''} */}
                </div>
            </div>
        </>
    );
}

export default MemberList;