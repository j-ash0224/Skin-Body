const { reduce, reject } = require("async");
const db = require("../database/connect.js");
const fs = require("fs");



class SkinStorage {
    //비우만 테스트 결과 저장 및 수정
    static baumanTest(skinType, oilyScore, resistanceScore, non_pigmentScore, tightScore, userId){
        const query = `update userTypeScore set skinType=?, 
                       oilyScore=?, resistanceScore=?, non_pigmentScore=?, tightScore=? 
                       where userId=?;`
        db.query(query, [skinType, oilyScore, resistanceScore, non_pigmentScore, tightScore, userId])
        const query2 = 'update user set skinType=? where userId =?'
        db.query(query2,[skinType, userId])
    }

    //피부 유형 테마 색깔 반환
    static typeColor(skinType){
        return new Promise((resolve, reject)=>{
            const query = `SELECT typeColor from skinTypes where skinType=?`;
            db.query(query ,[skinType], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data[0])
            })
        })
    }

    //트러블 유형 분류 결과 저장
    static classificationeSave(userId, imageURL, aiType, troubleType){
        return new Promise((resolve, reject)=>{
            //정보 저장
            const query = `insert into record (userId, photoPath, takeDay, aiType, troubleType) 
            values(?, ?,  DATE_FORMAT(NOW(), '%Y-%m-%d'), ?, ?);`;
            //진단 아이디 반환
            const query2 = `SELECT max(recordId) AS latest_recordId FROM record;`
            db.query(query, [userId, imageURL, aiType, troubleType])
            db.query(query2 , (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data[0])
            })
        })
    }

    //트러블 호전도 분석 결과 저장
    static detectionSave(userId, imageURL, aiType, troubleTotal){
        return new Promise((resolve, reject)=>{
            //정보 저장
            const query = `insert into record (userId, photoPath, takeDay, aiType, troubleTotal) 
            values(?, ?,  DATE_FORMAT(NOW(), '%Y-%m-%d'), ?, ?);`;
            //저장한 진단 아이디 반환
            const query2 = `SELECT max(recordId) AS latest_recordId FROM record;`
            db.query(query, [userId, imageURL, aiType, troubleTotal])
            db.query(query2 , (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data[0])
            })
        })
    }

    //비교 데이터 검사
    static pastDetectionRecord(userId, recordId){
        return new Promise((resolve, reject)=>{
            const query = `SELECT recordId, troubleTotal, photoPath FROM record WHERE userId = ? AND aiType = 'AI 호전도 분석' AND recordId < ? ORDER BY recordId DESC LIMIT 1;`;
            db.query(query ,[userId, recordId] ,(err, data) =>{
                if(err) reject(`${err}`)
                resolve(data)
            })
        })
    }

    //진단 사진 경로 반환
    static photoPath(recordId){
        return new Promise((resolve, reject)=>{
            const query = `SELECT photoPath from record where recordId=?`;
            db.query(query ,[recordId], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data[0])
            })
        })
    }

    //특정 사용자 진단 기록 리스트 반환
    static recordList(userId){
        return new Promise((resolve, reject)=>{
            const query = `SELECT recordId, userId, takeDay, aiType FROM record WHERE userId = ? ORDER BY recordId DESC`;
            db.query(query ,[userId] ,(err, data) =>{
                if(err) reject(`${err}`)
                const formattedData = data.map(item => ({
                    recordId: item.recordId,
                    userId : item.userId,
                    takeDay: item.takeDay.toISOString().split('T')[0], // 'YYYY-MM-DD' 형식으로 변환
                    aiType: item.aiType
                    
                }));
                resolve(formattedData)
            })
        })
    }

    //전체 진단 기록 리스트 반환
    static allRecordList(){
        return new Promise((resolve, reject)=>{
            const query = `SELECT recordId, userId, takeDay, aiType FROM record ORDER BY recordId DESC`;
            db.query(query ,(err, data) =>{
                if(err) reject(`${err}`)
                const formattedData = data.map(item => ({
                    recordId: item.recordId,
                    userId: item.userId,
                    takeDay: item.takeDay.toISOString().split('T')[0], // 'YYYY-MM-DD' 형식으로 변환
                    aiType: item.aiType
                    
                }));
                resolve(formattedData)
            })
        })
    }

    //트러블 유형 분석 정보 반환
    static classificationData(recordId){
        return new Promise((resolve, reject)=>{
            const query = `SELECT recordId, troubleType, photoPath FROM record WHERE recordId=?`;
            db.query(query ,[recordId] ,(err, data) =>{
                if(err) reject(`${err}`)
                resolve(data)
            })
        })
    }
    
    //트러블 호전도 분석 정보 반환
    static detectionData(recordId){
        return new Promise((resolve, reject)=>{
            const query = `SELECT recordId, troubleTotal, photoPath FROM record WHERE recordId=?`;
            db.query(query ,[recordId] ,(err, data) =>{
                if(err) reject(`${err}`)
                resolve(data)
            })
        })
    }

    //특정 진단 기록 삭제
    static recordDelete(recordId){
        const query = `DELETE FROM record WHERE recordId =?`
            db.query(query, [recordId])
    }

}




module.exports = SkinStorage;