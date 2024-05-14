import React, { useEffect, useRef, useState } from 'react';
import './AttandanceManagement.css'
import { Icon } from '@iconify/react'
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subMonths, addDays, addMonths } from 'date-fns';
// import ChildAttandanceList from './ChildAttandanceList';
import axios from 'axios';
import { apiCall } from '../../server/apiService';
import isEqual from 'lodash/isEqual';


function AttandanceMangement() {
    const loginInfo = JSON.parse(sessionStorage.getItem("staffname"));
    // Attandance : DB 전체 list
    const [attData, setAttData] = useState([]);   // 출석 list
    // Member : Attandance 중복없는 memSerial list useState
    const [admissionData, setAdmissionData] = useState([]); // 이름 serial list

    // Attandance 한명 useState : 출/결석 변경을 위한 상태값 => attData씀
    // const [memAttDataOne, setMemAttDataOne] = useState({});

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    // 권한 에러 확인용
    const [authErr, setAuthErr] = useState();

    // 출석일자 카운팅 해야함 : 필요없다
    // const [attCount, setAttCount] = useState();


    // ===================================================================

    const [checkList, setCheckList] = useState([]); // 체크된 아이템 리스트 상태 관리
    const [memListUpdate, setMemListUpdate] = useState(true);   // insert 시 상태값 변경을 위해서

    // 전체 선택 기능
    const handleAllChecked = (event) => {
        if (event.target.checked) {
            // 전체 선택이 체크되었을 때
            const allItems = admissionData.map((o) => ({ memSerial: o.memSerial, memName: o.memName }));
            setCheckList(allItems); // 모든 아이템을 선택한 것으로 설정
        } else {
            // 전체 선택이 해제되었을 때
            setCheckList([]); // 선택된 아이템 리스트를 빈 배열로 설정하여 모두 해제
        }
    };

    // 단일 아이템 선택
    const handleItemChecked = (event, memSerial, memName) => {
        if (event.target.checked) {
            // 아이템이 선택되었을 때
            setCheckList(prevState => [...prevState, { memSerial, memName }]); // 선택된 아이템의 memSerial을 추가
        } else {
            // 아이템이 해제되었을 때
            // setCheckList(prevState => prevState.filter(item => item !== memSerial)); // 선택 해제된 아이템의 memSerial을 제외
            setCheckList(prevState => prevState.filter(item => item.memSerial !== memSerial));
        }
    };

    // console.log(checkList); // 데이터 담기긴함 => map돌려서 전달해야하나..?
    // ===================================================================

    // 관리자 페이지 출/결석 변경을 위한 요청 발송 1
    const handleAttendanceChange = (memSerial, memName, day, currentStatus, index) => {
        const newStatus = currentStatus === '출' ? '결' : '출';
        attData[index].attStatus = newStatus;

        // const params = { memSerial, day, newStatus } 
        // 출석 상태 변경 요청 보내기
        apiCall('/jwtMem/mem/attChange', 'POST',
            {
                memSerial: memSerial,
                memName: memName,
                attDate: day,
                attStatus: newStatus
            }, loginInfo.data.token)
            .then(response => {
                // controller 확인 시 response에는 지금 message를 전달하고 있음

                // 출석 status 변경 : 콜백사용하여 이전 상태 데이터 배열을 업데이트
                // attData는 배열 내 하나의 객체들이 쭉 담겨있는 상태이므로 [ ] 중괄호 안에 펼쳐줘야 typeError미발생
                setAttData([...attData]);

            })
            .catch(error => {
                console.error('출석 상태 변경 실패:', error);
                if (error === 403) alert("권한이 없습니다. ");
                // else alert("서버 통신 에러로 요청에 실패했습니다.");
            });
    };

    // 첫 authErr의 상태값 변경 후 alert창을 띄워주기 위함
    useEffect(() => {
        if (authErr === 403) {
            alert("변경 권한이 없습니다.");
        }
    }, [authErr]);

    // 관리자 페이지 체크 후 결석 데이터 요청
    const handleAttendanceRegistration = () => {
        // checkList 배열에 있는 각 memSerial에 대해 insert 요청
        checkList.forEach(memData => {
            // checkList.forEach(memData => {

            const { memSerial, memName } = memData;
            console.log("들어오니");
            apiCall('/jwtMem/mem/attChange', 'POST',
                {
                    memSerial: memSerial,
                    memName: memName,
                    attDate: format(currentMonth, 'yyyy-MM-dd'),
                    attStatus: '결'
                }, loginInfo.data.token)
                .then(response => {
                    // controller 확인 시 response에는 지금 message를 전달하고 있음

                    // 출석 status 변경 : 콜백사용하여 이전 상태 데이터 배열을 업데이트
                    // attData는 배열 내 하나의 객체들이 쭉 담겨있는 상태이므로 [ ] 중괄호 안에 펼쳐줘야 typeError미발생
                    // setAttData([...attData]);    // 리렌더링 테스트1
                    // setAttData(attData);         // 리렌더링 테스트2

                    // 리렌더링 테스트3
                    // 출석 상태 변경 후에 해당 상태를 업데이트
                    // item : attData 배열의 각 요소(그니까 리스트 데이터를 다시 map 돌려서 '결'이라는 상태값을 추가해준겨)

                    // alert("출석등록하시겠습니까?")   // 여러명 체크했을 때 체크한 갯수만큼 뜬다..에바
                    const updatedAttData = attData.map(item => {
                        if (item.memSerial === memSerial && item.attDate == format(currentMonth, 'yyyy-MM-dd')) {
                            return { ...item, attStatus: '결' };
                        }
                        return item;
                    });
                    // 업데이트된 출석 데이터로 상태를 업데이트
                    // setAttData(updatedAttData);
                    if (!isEqual(updatedAttData, attData)) { // lodash의 isEqual 함수를 사용하여 배열 비교
                        setAttData(updatedAttData);
                    }
                    // console.log(updatedAttData);
                })
                .catch(error => {
                    setAuthErr(error);  // 에러의 상태값 변경
                    console.error('출석 상태 변경 실패:', error);
                });
        });
        
        setMemListUpdate(!memListUpdate);
        alert("출석등록하시겠습니까?")
    };

    function authorityErrAlert(){
        console.log(authErr);
        if(authErr === 403 ) alert("변경 권한이 없습니다.");
    }

    // 출석 리스트(입소리스트) & 리스트 별 출석 현황 요청
    useEffect(() => {

        // 입소중인 멤버 리스트 요청 : mem_serial , mem_name 컬럼
        apiCall("/mem/admissionList", "GET")
            .then((response) => {
                // console.log(response.data);  // 전체 데이터 들어옴
                setAdmissionData(response.data);

            }).catch((err) => {
                console.log(err);
            })

        // 멤버 리스트 출력을 위해 DB로 요청보내기 : 리스트를 가지고 오기 위한 DB요청(1~31일 데이터 나열)
        // mem_serial, att_status, att_date
        apiCall("/att/attList", "GET", {
            yearMonth: format(currentMonth, 'yyyy-MM')
        })
            .then((response) => {
                // console.log(response.data);  //
                setAttData(response.data);
                // setAttCount();
            }).catch((err) => {
                console.log(err);
            })

        // }
    }, [format(currentMonth, 'yyyy-MM'), memListUpdate]); // 리스트 중 한명이라도 출결석 변경 시 렌더링..전체를 할 필요가 있나?



    // 오늘 일자 확인 => 지우기 필요없슴
    // const today = currentMonth.getDate();
    // const month = currentMonth.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
    // const year = currentMonth.getFullYear();
    // console.log(today);  // 1일
    // console.log("currentMonth를 찍으면?" + currentMonth);
    // console.log("지금 렌더링해야할 월은?" + month);  // 4월
    // console.log(year);
    // console.log(date);

    // 날짜 라이브러리
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    // const endDate = endOfWeek(monthEnd);
    let day = startDate;
    let count = 0;
    let color = ""
    const thisMonth = format(currentMonth, 'yyyy') + format(currentMonth, 'M')
        === format(selectedDate, 'yyyy') + format(selectedDate, 'M') ? "block" : "none";
    let size = format(monthEnd, 'd');
    let rows = 70 / size + "%";

    // 출석률 계산
    var attDate;

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    // 해당하는 달의 일자만큼 전체 사이즈를 70%로
    for (let i = 1; i < size; i++) {
        rows += " " + 70 / size + "%";
    }

    if (format(monthStart, 'M') === format(startDate, 'M')) {
        count = format(startDate, 'd') * 1
    } else {
        count = format(addDays(startDate, 7), 'd') * 1
    }

    // console.log("보낼날짜확인" + format(currentMonth, 'yyyy-MM'));

    // console.log(attData);
    // console.log(admissionData);

    return (
        <div className="att_mng">
            <div className='month_button'>
                <div className="att_" style={{
                }}>
                    <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth}></Icon>
                </div>
                <div style={{
                    fontSize: '13px'
                }}>
                    {/* {format(currentMonth, 'yyyy')}년 */}
                    {format(currentMonth, 'M')}월
                </div>
                <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth}></Icon>
                <div style={
                    {
                        display: thisMonth,
                        fontSize: '13px'
                    }}>오늘의 날짜는 {format(currentMonth, 'dd')}일</div>

            </div>
            <div></div>
            <div>
                <div className='att_mng_list attheader' style={{
                    display: 'grid',
                    gridTemplateColumns: "2% 8% 7% 5% 4% 4% " + rows,
                    backgroundColor: "var(--admin)",
                }}>
                    <div>
                        <input type="checkbox"
                            onChange={handleAllChecked}
                            checked={checkList.length === admissionData.length}

                        /></div>
                    <div>대상자 번호</div>
                    <div>이름</div>
                    <div>출석률</div>
                    <div>출석</div>
                    <div>결석</div>
                    {Array.from({ length: size }, (_, index) => {
                        // 4월기준 6일 index : 5(0부터시작)
                        // count : 첫 주의 시작 7
                        if ((index + 1) % 7 === (count - 1) % 7) {
                            color = "colorBlue"
                        } else if ((index + 1) % 7 === (count) % 7) {
                            color = "colorRed"
                        } else {
                            color = ""
                        }
                        return (
                            <div className={color} key={index + 1}>{index + 1}

                            </div>
                        );
                    })}
                </div>

                {admissionData && admissionData.map((o, i) => {
                    let attcount = attData.reduce((cnt, item) => cnt + (item.memSerial === o.memSerial && item.attStatus === "출"), 0);
                    let abscount = attData.reduce((cnt, item) => cnt + (item.memSerial === o.memSerial && item.attStatus === "결"), 0);
                    let attRate;
                    if (isNaN(attcount / (attcount + abscount))) {
                        attRate = "0"
                    } else {
                        attRate = attcount / (attcount + abscount) * 100;
                    }

                    return (

                        <div className='att_mng_list attdata' key={o.memSerial} style={{
                            display: 'grid',
                            gridTemplateColumns: "2% 8% 7% 5% 4% 4% " + rows,
                        }}>
                            <>
                                {/* 우측에서는 체크박스, serial, 이름만 출력  */}
                                <div>
                                    <input type="checkbox" className='checkbox'
                                        // checked={checkList.includes(o.memSerial)}    // 체크안됨이슈
                                        // some 함수 : 배열을 순회하면서 일치하는 조건이 있는지 확인
                                        checked={checkList.some(item => item.memSerial === o.memSerial)}    // 체크안됨이슈해결
                                        onChange={(e) => handleItemChecked(e, o.memSerial, o.memName)}
                                    /></div>
                                <div>{o.memSerial}</div>
                                <div>{o.memName}</div>
                                <div>{Math.floor(attRate)}%</div>
                                {/* 해당하는 인덱스 반환 */}
                                {/* <div>{attData.findIndex((item) => ((item.memSerial === o.memSerial)))}</div> */}

                                <div>{attcount}</div>
                                <div>{abscount}</div>

                                {/* index : 날짜 count : 첫 번째 주 일요일*/}
                                {Array.from({ length: size }, (_, index) => {
                                    let day;

                                    // 날짜가 한자리 수 일 때 앞에 0을 붙여줘야된다
                                    if (index.length == 1) {
                                        day = "0" + (index + 1);
                                    } else {
                                        day = "" + (index + 1);
                                    }

                                    // console.log(attData);
                                    // console.log(o.memSerial);

                                    // 시리얼 번호 비교 & 날짜 데이터 동일한지 비교하고 찾기 : 객체형태임
                                    var count = attData.find((item) => (item.memSerial === o.memSerial) && (parseInt(item.attDate.split("-")[2]) === parseInt(day)));
                                    // 인덱스도 찾아주기
                                    let attindex = attData.findIndex((item) => (item.memSerial === o.memSerial) && (parseInt(item.attDate.split("-")[2]) === parseInt(day)));

                                    console.log();
                                    attDate = (index + 1);
                                    // console.log(count);
                                    // console.log(attindex);

                                    if (count) {
                                        return (
                                            <div
                                                className={`attandance_data attcheck ${count.attStatus === '결' ? 'red-text' : ''}`}
                                                // 기본적으로 index가 0에서 시작하기때문에 + 1
                                                key={index + 101}
                                                // onClick={() => setAttData([count.attStatus])}>
                                                onClick={() => handleAttendanceChange(o.memSerial, o.memName, count.attDate, count.attStatus, attindex)}>
                                                {count.attStatus}


                                            </div>


                                        );
                                    } else {
                                        return (
                                            <div className="attandance_data" key={index + 1}>
                                                {/* 출석이 없으면 빈문자열 반환 */}·
                                            </div>
                                        )
                                    }
                                })}

                            </>
                        </div>
                    )
                })}
                {/* <div className='att_mng_list'
                    style={{
                        display: 'grid',
                        gridTemplateColumns: "2% 8% 5% 5% 5% 5% " + rows,
                    }}
                >
                    <div></div>
                    <div>합계</div>
                    <div>하는게</div>
                    <div>맞을까?</div>
                    <div></div>
                    <div></div>

                </div> */}

            </div>
            <div className='buttonBox attButton'>
                <div>

                    <button type="submit" value='출석등록' onClick={() => { handleAttendanceRegistration({}); authorityErrAlert()} }>{format(currentMonth, 'dd')}일 출석 등록</button>
                    {/* <button type="reset" onClick={() => { setData({}); setEduDataOne({}) }}>입력취소</button> */}
                    {/* <button type="submit" value='출석삭제'>출석 삭제</button> */}
                </div>
            </div>
        </div>
    );

}

export default AttandanceMangement;

