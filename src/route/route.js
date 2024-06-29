//router 모듈
const express = require('express');
const router = express.Router();

// 컨트롤러 호출
const ctroler = require("./ctrl"); 

//db 호출
const db = require('../database/connect.js').db

//사진 저장 설정
const multer = require('multer') //파일 업로드를 관리하는 모듈
const path = require("path") //파일 경로를 다루는 모듈

//diskStorage 메소드를 사용해 파일 저장방식을 정의
const storage = multer.diskStorage({
    destination : (req, file, cb) => { //파일이 저장되는 경로 설정
        cb(null, "./images");
    },
    filename : (req, file, cb) => { //서버에 저장될 파일 이름 설정, 중복 방지
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext)+"-"+Date.now()+ext);
    }
})
var upLoad = multer({storage:storage}); //파일 업로드 메소드 정의


//URL 분류기
/*------------------------------------------사용자---------------------------------------------*/
router.post('/user/login', ctroler.userContrl.userLogin) // 사용자 로그인
router.post('/user/create', ctroler.userContrl.userCreate) // 사용자 서비스 가입
router.post('/user/find/id', ctroler.userContrl.userFindId) //사용자 아이디 찾기
router.post('/user/find/psword', ctroler.userContrl.userFindPW) //사용자 비밀번호 찾기

router.post('/user/home/profile', ctroler.userContrl.userHomeProfile) //홈페이지 사용자 프로필 반환

router.post("/user/skin/classification/save", upLoad.single('photoFile'), ctroler.skinControl.classificationSave) //트러블 유형 분류 결과 저장
router.post('/user/skin/detection/save',  upLoad.single('photoFile'), ctroler.skinControl.detectionSave) //트러블 호전도 분석 결과 저장
router.put('/user/skin/bauman', ctroler.skinControl.baumanTest)//바우만 테스트 결과 저장 및 수정

router.post("/user/skin/record/list", ctroler.skinControl.recordList) // 과거 진단 기록 리스트 반환
router.post("/user/skin/record/select", ctroler.skinControl.recordData) // 과거 특정 진단 기록 내용 반환
router.delete("/user/skin/record/delete", ctroler.skinControl.recordDelete) // 과거 특정 진단 기록 삭제

router.post('/user/set', ctroler.userContrl.setPageProfile) //환경설정 페이지 사용자 프로필 반환
router.post('/user/profile', ctroler.userContrl.userProfile) //프로필 변경 페이지 사용자 프로필 반환
router.put('/user/profile/update', ctroler.userContrl.profileUpdate) //사용자 프로필 수정
router.get('/user/notice/list',ctroler.communicationControl.noticeList) //공지사항 리스트 반환
router.get('/user/terms',ctroler.communicationControl.terms) //이용약관 반환
router.post('/user/question/list',ctroler.communicationControl.QAList) // Q&A 리스트 반환
router.post('/user/question/create',ctroler.communicationControl.QAcreate) //Q&A 작성
router.put('/user/change/psword', ctroler.userContrl.userPswordUpdtae) //사용자 비밀번호 수정
router.delete('/user/delete', ctroler.userContrl.userDelete) //사용자 계정 삭제

/*------------------------------------------관리자---------------------------------------------*/
router.post('/manager/login', ctroler.managerContrl.managerLogin) // 관리자 로그인
router.post('/manager/find/id', ctroler.managerContrl.managerFindId) //관리자 아이디 찾기
router.post('/manager/find/psword', ctroler.managerContrl.managerFindPW) //관리자 비밀번호 찾기

router.get('/manager/home/user',ctroler.userContrl.userSkinTypeCount)  //사용자 수 및 피부유형 반환

router.post('/manager/list',ctroler.managerContrl.managerList) //관리자 리스트 반환 (+검색)
router.post('/manager/create',ctroler.managerContrl.managerCreate) //관리자 정보 추가
router.put('/manager/update',ctroler.managerContrl.managerUpdate) //관리자 정보 수정
router.delete('/manager/delete',ctroler.managerContrl.managerDelete)//관리자 정보 삭제
router.put('/manager/psword',ctroler.managerContrl.managerPswordUpdate)//관리자 비밀번호 수정 (자기 자신 비밀번호)

router.post('/manager/user/list', ctroler.userContrl.userList) //사용자 리스트 반환 (+검색)
router.delete('/manager/user/delete',ctroler.userContrl.userDeleteByM)//관리자 정보 삭제

router.post('/manager/advertise/create', upLoad.single('photoFile'),ctroler.advertisementControl.adCreate) //광고 등록
router.get('/manager/advertise/list', ctroler.advertisementControl.adList) //광고 리스트 반환
router.delete('/manager/advertise/delete',ctroler.advertisementControl.adDelete) //광고 삭제

router.post('/manager/notice/create',ctroler.communicationControl.noticeCreate) //공지사항 작성
router.put('/manager/notice/update',ctroler.communicationControl.noticeUpadate) //공지사항 수정
router.delete('/manager/notice/delete',ctroler.communicationControl.noticeDelete) //공지사항 삭제
router.put('/manager/terms/update',ctroler.communicationControl.termsUpadate) //이용약관 수정
router.get('/manager/question/list',ctroler.communicationControl.questionList) //Q&A 리스트 반환
router.post('/manager/question/answer',ctroler.communicationControl.questionAnswer) //Q&A 답변

router.put('/manager/ai/save/classificationGrp', upLoad.single('photoFile'), ctroler.managerContrl.aiSaveClassificationGrp); //트러블 모델 학습률 그래프 저장
router.put('/manager/ai/save/detectionGrp', upLoad.single('photoFile'), ctroler.managerContrl.aiSaveDetectionGrp); //호전도 모델 학습률 그래프 저장
router.get('/manager/ai/get', ctroler.managerContrl.aiGet); //학습률 그래프 반환



module.exports = router;