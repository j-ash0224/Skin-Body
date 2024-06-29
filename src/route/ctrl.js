const { baumanTest } = require('../models/skinStorage');
const User = require('../models/user');
const Skin = require('../models/skin');
const Communication = require('../models/communication')
const Manager = require('../models/manager')
const Advertisement = require('../models/advertisement');
const path = require('path');
const fs = require('fs');
const logger = require('../log/logger')


const userContrl = {
    //사용자 로그인
    userLogin : async (req, res) =>{
        const user = new User(req.body);
        const response = await user.userLogin();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //사용자 서비스 가입
    userCreate : async (req, res) =>{
        const user = new User(req.body);
        const response = await user.userCreate();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //사용자 아이디 찾기
    userFindId : async (req, res) =>{
        const user = new User(req.body);
        const response = await user.userFindId();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //사용자 비밀번호 찾기
    userFindPW : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.userFindPW();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //홈페이지 사용자 프로필 반환
    userHomeProfile : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.userHomeProfile();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //환경설정 페이지 사용자 닉네임 반환
    setPageProfile : async (req, res)=> {
        const user = new User(req.body);
        const response = await user.setPageProfile();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //사용자 프로필 반환
    userProfile : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.userProfile();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //사용자 프로필 수정
    profileUpdate : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.profileUpdate();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //사용자 비밀번호 변경
    userPswordUpdtae : async (req, res) =>{
        const user = new User(req.body);
        const response = await user.userPswordUpdtae();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //사용자 계정 삭제
    userDelete : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.userDelete();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //사용자 수 및 피부유형 반환
    userSkinTypeCount : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.userSkinTypeCount();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    // 사용자 정보 조회 (관리자용)
    userList : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.userList();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    // 사용자 정보 삭제 (관리자용)
    userDeleteByM : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.userDeleteByM();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    }
}

const skinControl = {
    //트러블 유형 분류 결과 저장
    classificationSave : async (req, res)=>{        
        const imageURL = `/home/ubuntu/GraProject/server/images/${req.file.filename}`; //EC2 파일 저장
        const skin = new Skin(req.body);
        const response = await skin.recordsave(imageURL);
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //트러블 호전도 분석 결과 저장
    detectionSave : async (req, res)=>{
        const imageURL = `/home/ubuntu/GraProject/server/images/${req.file.filename}`; //EC2 파일 저장
        const skin = new Skin(req.body);
        const response = await skin.recordsave(imageURL);
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //비우만 테스트 결과 저장 및 수정
    baumanTest : async (req, res)=>{
        const skin = new Skin(req.body);
        const response = await skin.baumanTest();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //과거 진단 기록 리스트 반환
    recordList : async (req, res)=>{
        const skin = new Skin(req.body);
        const response = await skin.recordList();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //특정 진단 기록 정보 반환
    recordData : async (req, res)=>{
        const skin = new Skin(req.body);
        const response = await skin.recordData();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    // 과거 특정 진단 기록 삭제
    recordDelete : async (req, res)=>{
        const skin = new Skin(req.body);
        const response = await skin.recordDelete();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    }
}

const communicationControl = {
    //공지사항 리스트 반환
    noticeList : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.noticeList();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //이용 약관 반환
    terms : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.terms();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //Q&A 작성
    QAcreate : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.QAcreate();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //Q&A 반환
    QAList : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.QAList();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //공지사항 작성 (관리자용)
    noticeCreate : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.noticeCreate();
        
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //공지사항 수정 (관리자용)
    noticeUpadate : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.noticeUpadate();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //공지사항 삭제 (관리자용)
    noticeDelete : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.noticeDelete();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //이용약관 수정 (관리자용)
    termsUpadate : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.termsUpadate();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //Q&A 리스트 반환 (관리자용)
    questionList : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.questionList();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //Q&A 답변 (관리자용)
    questionAnswer : async (req, res)=>{
        const communication = new Communication(req.body);
        const response = await communication.questionAnswer();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },
}

const managerContrl = {

    //관리자 로그인
    managerLogin :  async (req, res)=>{
        const manager = new Manager(req.body);
        const response = await manager.managerLogin();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //관리자 아이디 찾기
    managerFindId :  async (req, res)=>{
        const manager = new Manager(req.body);
        const response = await manager.managerFindId();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //관리자 비밀번호 찾기
    managerFindPW :  async (req, res)=>{
        const manager = new Manager(req.body);
        const response = await manager.managerFindPW();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //관리자 리스트 반환 (+검색)
    managerList : async (req, res)=>{
        const manager = new Manager(req.body);
        const response = await manager.managerList();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //관리자 정보 추가
    managerCreate : async (req, res)=>{
        const manager = new Manager(req.body);
        const response = await manager.managerCreate();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //관리자 정보 수정
    managerUpdate : async (req, res)=>{
        const manager = new Manager(req.body);
        const response = await manager.managerUpdate();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //관리자 정보 삭제
    managerDelete : async (req, res)=>{
        const manager = new Manager(req.body);
        const response = await manager.managerDelete();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //관리자 비밀번호 수정 
    managerPswordUpdate : async (req, res)=>{
        const manager = new Manager(req.body);
        const response = await manager.managerPswordUpdate();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //AI 트러블 분석 학습률 등록
    aiSaveClassificationGrp : async (req, res)=>{
        const imageURL = `/home/ubuntu/GraProject/server/images/${req.file.filename}`;
        const manager = new Manager(req.body);
        const model = "AI 트러블 분석"
        const response = await manager.aiSave(imageURL, model);
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //AI 호전도 분석 학습률 등록
    aiSaveDetectionGrp : async (req, res)=>{
        const imageURL = `/home/ubuntu/GraProject/server/images/${req.file.filename}`;
        const manager = new Manager(req.body);
        const model = "AI 호전도 분석"
        const response = await manager.aiSave(imageURL, model);
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //AI 학습률 반환
    aiGet : async (req, res)=>{
        const manager = new Manager(req.body);
        const response = await manager.aiGet();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

}

const advertisementControl = {
    //광고 등록
    adCreate : async (req, res)=>{
        const imageURL = `/home/ubuntu/GraProject/server/images/${req.file.filename}`;
        const advertise = new Advertisement(req.body);
        const response = await advertise.adCreate(imageURL);
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //광고 리스트 반환
    adList : async (req, res)=>{
        const advertise = new Advertisement(req.body);
        const response = await advertise.adList();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    },

    //광고 삭제
    adDelete : async (req, res)=>{
        const advertise = new Advertisement(req.body);
        const response = await advertise.adDelete();
        if(response.err){logger.error(`success: ${response.success} err: ${response.err}`)}
        else{logger.info(`success: ${response.success} message: ${response.message}`)}
        return res.json(response)
    }

}


module.exports = {userContrl, skinControl, communicationControl, managerContrl, advertisementControl}