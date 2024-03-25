import './MemberDetail.css'
import { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
// import DaumPostcode from 'react-daum-postcode';

// import Postcode from './Postcode';
// import DaumPost from './DaumPost';

// data={memDataOne} eduData={eduDataOne} setData={setMemDataOne} setEduDataOne={setEduDataOne}
function MemberDetail({ data, eduData, setData, setEduDataOne }) {

    // 우편번호
    // <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>

    // 우편번호 팝업창 input 일단 꺼놓음
    const [enroll_company, setEnroll_company] = useState({
        address: '',
    });
    const [popup, setPopup] = useState(false);
    const handleInput = (e) => {
        setEnroll_company({
            ...enroll_company,
            [e.target.name]: e.target.defaultValue,
        })
    }
    const handleComplete = (data) => {
        setPopup(!popup);
    }

    // input 태그 입력 시 데이터
    const formData = useRef({
        memSerial: 'formData.memSerial',
    })

    // 입력된 값을 상태에 업데이트하는 함수를 정의
    const handleChange = (e) => {
        const { name, value } = e.target.value;
        // useRef로 생성한 객체의 current 프로퍼티를 통해 직접 접근하여 값을 업데이트
        formData.current[name] = value;
    };

    // 입력된 값들을 저장하는 함수를 정의
    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 기본 동작 방지
        console.log(formData.current); // 입력된 데이터들을 출력 : 가긴함..
        // 이후 이 값을 서버로 전송하거나 다른 처리
    };

    //=================================================

    // Member Entity DB : 가져온 멤버 한명의 멤버 데이터를 사용하기 위해 useState에 저장
    const [memDataOneD, setMemDataOneD] = useState({});
    useEffect(() => {
        setMemDataOneD({
            ...data,
        })
    }, [data])
    // console.log(memDataOneD.memSerial);   // 입력해도 업데이트가 안된다....ㅠㅠ그럼 따로 저장을?

    // text,radio 타입 input 태그 ,select 태그 defaultValue 값 제어
    const memDataChange = useCallback((event) => {
        memDataOneD[event.target.name] = event.target.defaultValue;
        setMemDataOneD({ ...memDataOneD });
    }, [memDataOneD]);

    // 동일한 함수 테스트
    // const memDataChange = useCallback((event) => {
    //     setMemDataOneD(data => ({
    //         ...data,
    //         [event.target.name]: event.target.defaultValue
    //     }));
    // }, []);

    // Edu Entity DB :  가져온 멤버 한명의 학력 데이터를 사용하기 위해 useState에 저장
    const [eduDataOneD, setEduMemOneD] = useState({});
    useEffect(() => {
        setEduMemOneD({
            ...eduData
        })
    }, [eduData])
    // console.log(eduDataOneD);

    // text,radio 타입 input 태그 ,select 태그 defaultValue 값 제어
    const eduDataChange = useCallback((event) => {
        eduDataOneD[event.target.name] = event.target.defaultValue;
        setEduMemOneD({ ...eduDataOneD });
    }, [eduDataOneD]);

    //=================================================

    

    // 1. insert & update 기능 요청 : 입력한 DB 업데이트
    function saveMemDate() {
        const params = {
            // memSerial: memDataOneD.memSerial,
            ...memDataOneD
        }
        axios.post('/api/mem/memInesert', params)
            // params: { memSerial: memDataOneD.memSerial }
            // }).then((response) =>  {     // 자꾸 홈으로 다시 가서 일단 수정했는데 똑같음;;;;;
            .then(function (response) {
                console.log("데이터 넘어오나? response.data =>" + response.data);
                console.log("==============");
                console.log(params);
                setData({
                    ...params,
                });
                // }).catch((err) => {  // 자꾸 홈으로 가서 일단 수정222
            }).catch((err) => {
                alert("memInesert 요청 실패")
                console.log(err);
            }).then(() => {
            });
    }

    // 2. Delete 기능 요청 : 선택한 DB 삭제
    function deleteByMemserial() {
        if (memDataOneD.memSerial && window.confirm("해당 아동을 삭제하시겠습니까?")) {
            axios
                .post('/api/mem/memDelete', null, { params: { memSerial: memDataOneD.memSerial } })
                // .then((response) => {    // 자꾸 홈으로 다시 가서 일단 수정
                .then(function (response) {
                    setData({});    // 부모로부터 전달받은 setMemDataOne 실행하여 빈객체 삽입
                    alert(response.data);
                    console.log(response.data);
                    // }).catch((err) => {  // 자꾸 홈으로 가서 일단 수정222
                }).catch(function (err) {
                    console.log(err);
                });
        } else {
            alert("아동 삭제 취소")
        }
    }

    // 3. 입력 데이터 전체 리셋
    function resutData() {
        setMemDataOneD({})
        setEduDataOne({})
    }




    return (
        // <form onSubmit={handleSubmit}>
        // <form >
        <div>
            <b>기본인적사항</b>
            <div className='mem_gridBox'>
                <div><span>*</span>대상자번호</div>
                <div className='mem_serial'>
                    <input type='text' name='memSerial'
                        defaultValue={memDataOneD.memSerial}
                        onChange={handleChange} disabled={memDataOneD.memSerial || ""}>
                    </input>
                </div>

                <div><span>*</span>대상자명</div>
                <div className='mem_name'>
                    <input type='text' name='memName'
                        onChange={memDataChange} defaultValue={memDataOneD.memName || ""} >
                    </input>
                </div>

                <div>개인정보활용동의</div>
                <div>
                    <div>
                        {/* checked가안먹는다.. */}
                        <input type='radio' name='memAgreeP' defaultValue='Y'
                            checked={memDataOneD.memAgreeP === 'Y'}
                            onChange={memDataChange} defaultChecked>
                        </input>
                        <label htmlFor='agreeP'>&nbsp;Y&nbsp;&nbsp;</label>
                    </div>
                    <div>
                        <input type='radio' name='memAgreeP' defaultValue='N'
                            checked={memDataOneD.memAgreeP === 'Y'}
                            onChange={memDataChange}>
                        </input>
                        <label htmlFor='agreeP'>&nbsp;N</label>
                    </div>
                </div>

                <div><span>*</span>주민등록번호</div>
                <div className='mem_responsible_person'>
                    <input type='text' name='memRegNum'
                        defaultValue={memDataOneD.memRegNum}
                        onChange={memDataChange} disabled={memDataOneD.memSerial}>
                    </input>
                    &nbsp;
                    <label htmlFor='memRegNum'></label>
                    <input type='button' defaultValue='중복확인'></input>
                </div>

                <div>실명확인여부</div>
                <div>
                    <div>
                        <input type='radio' name='memAgreeN' defaultValue='Y'
                            defaultChecked={memDataOneD.memAgreeN === 'Y'} onChange={memDataChange}></input>
                        <label htmlFor='agreeN'>&nbsp;Y&nbsp;&nbsp;</label>
                    </div>
                    <div>
                        <input type='radio' name='memAgreeN' defaultValue='N'
                            checked={memDataOneD.memAgreeN === 'N'} onChange={memDataChange} ></input>
                        <label htmlFor='agreeN'>&nbsp;N</label>
                    </div>
                </div>

                <div><span>*</span>생년월일</div>
                <div>
                    <input type='date' name='memBirth'
                        defaultValue={memDataOneD.memBirth || ""}
                        onChange={memDataChange}>
                    </input>
                </div>

                <div><span>*</span>성별</div>
                <div>
                    <select name="memSex"
                        defaultValue={memDataOneD.memSex || ""}
                        onChange={memDataChange}>
                        <option defaultValue="none">전체</option>
                        <option defaultValue='1'>여성</option>
                        <option defaultValue='2'>남성</option>
                    </select>
                </div>

                <div><span>*</span>연령(만나이)</div>
                <div className='mem_age'>
                    <input type='text' name='memAge'
                        defaultValue={memDataOneD.memAge || ""} onChange={handleChange}>
                    </input>
                </div>

                <div>담당자</div>
                <div className='mem_responsible_person'>
                    <input type='text' name='memResPerson'
                        onChange={memDataChange} defaultValue={memDataOneD.memResPerson || ""}>
                    </input>
                </div>

                <div><span>*</span>전화번호</div>
                <div className='mem_tel'>
                    <input type='tel' name='memTel' placeholder='하이픈(-) 포함하여 작성'
                        defaultValue={memDataOneD.memTel || ""}
                        onChange={memDataChange}>
                    </input>
                </div>

                <div>휴대전화번호</div>
                <div className='mem_phone'>
                    <input type='tel' name='memPhone' placeholder='하이픈(-) 포함하여 작성'
                        defaultValue={memDataOneD.memPhone || ""}
                        onChange={memDataChange}>

                    </input>
                </div>


                <div>이메일</div>
                <div className='mem_mail'>
                    <input type='email' name='memMail'
                        defaultValue={memDataOneD.memMail || ""}
                        onChange={memDataChange}>

                    </input>
                </div>

                <div>우편번호</div>
                <div className='mem_zipcode'>
                    {/* <input type='text' name='memZipCode' defaultValue={memDataOneD.memZipCode} onChange={memDataChange}>
                        </input>&nbsp;
                        <input type='button' defaultValue='주소검색' onClick={<Postcode />}></input> */}
                    {/* <input className="user_enroll_text" placeholder="주소" type="text" required={true} name="address" onChange={handleInput} defaultValue={enroll_company.address} /> */}
                    {/* <button onClick={handleComplete}>우편번호 찾기</button> */}
                    {/* {popup && <Postcode company={enroll_company} setcompany={setEnroll_company}></Postcode>} */}

                    {/* 안됨 */}
                    {/* <DaumPost setAddressObj={setAddressObj} setLocationObj={setLocationObj} /> */}
                </div>


                <div>주소</div>
                <div className='mem_address1'>
                    <input type='text' name='memAddress1' placeholder='도로명 주소'
                        defaultValue={memDataOneD.memAddress1}
                        onChange={memDataChange} readOnly>
                    </input>
                </div>

                <div>상세주소</div>
                <div className='mem_address2'>
                    <input type='text' name='memAddress2' placeholder='상세주소'
                        defaultValue={memDataOneD.memAddress2}
                        onChange={memDataChange}>
                    </input>
                </div>
            </div>

            <b>계좌번호</b>
            <div className='mem_gridBox2'>
                <div>은행명</div>
                <div className='mem_bank'>
                    <select name='mem_bank' onChange={memDataChange}>
                        <option defaultValue='국민'>국민</option>
                        <option defaultValue='농협'>농협</option>
                        <option defaultValue='기업'>기업</option>
                        <option defaultValue='쉽게'>쉽게</option>
                        <option defaultValue='하는'>하는</option>
                        <option defaultValue='방법'>방법</option>
                        <option defaultValue='없을'>없을</option>
                        <option defaultValue='까요'>까요</option>
                    </select>
                </div>

                <div>계좌번호</div>
                <div className='mem_account'>
                    <input type='text' name='memAccount' placeholder='하이픈(-) 포함하여 작성'
                        defaultValue={memDataOneD.memAccount}
                        onChange={memDataChange}>
                    </input>
                </div>

                <div>예금주</div>
                <div className='mem_depositor'>
                    <input type='text' name='memDepositor'
                        defaultValue={memDataOneD.memDepositor}
                        onChange={memDataChange}>
                    </input>
                </div>
            </div>



            <b>학력</b>
            <div className='mem_gridBox3'>
                <div>학력구분</div>
                <div>
                    <input type='text' name='eduBack'
                        Value={eduDataOneD.eduBack || ""}
                        onChange={eduDataChange}>

                    </input>
                </div>

                <div>학교명</div>
                <div>
                    <input type='text' name='eduName'
                        Value={eduDataOneD.eduName || ""}
                        onChange={eduDataChange}>
                    </input>
                </div>

                <div>학년(반)</div>
                <div>
                    <input type='text' name='eduGrade'
                        Value={eduDataOneD.eduGrade || ""}
                        onChange={eduDataChange}>
                    </input>
                </div>

                <div>담임명</div>
                <div>
                    <input type='text' name='eduTeacher'
                        Value={eduDataOneD.eduTeacher || ""}
                        onChange={eduDataChange}>
                    </input>
                </div>

                <div>담임연락처</div>
                <div>
                    <input type='tel' name='eduTeacherPhone'
                        Value={eduDataOneD.eduTeacherPhone || ""}
                        onChange={eduDataChange}>
                    </input>
                </div>

                <div></div>
                <div></div>
            </div>



            <div className='buttonBox'>
                <div>
                    <button type="reset" onClick={resutData}>입력취소</button>
                    <button type="submit" defaultValue='삭제' onClick={deleteByMemserial}>삭제</button>
                    <button type="submit" defaultValue='신규등록' onClick={() => saveMemDate()}>신규등록</button>
                    <button type="submit" defaultValue='업데이트' >업데이트</button>
                </div>
            </div>
        </div >
        // </form >
    )

}

export default MemberDetail;