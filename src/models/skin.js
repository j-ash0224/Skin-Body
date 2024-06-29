const SkinStorage = require("./skinStorage");
const PhotoStorage = require("./photoStorage")
const fs = require("fs");

class Skin{
    constructor(body){
        this.body = body
    }

    //비우만 테스트 결과 저장 및 수정
    async baumanTest(){
        const client = this.body
        try {
            SkinStorage.baumanTest(client.skinType, client.oilyScore, client.resistanceScore, 
                                   client.non_pigmentScore, client.tightScore, client.userId)
            const {typeColor} = await SkinStorage.typeColor(client.skinType)
            return {typeColor:typeColor , success: true, message: "피부 유형 저장 성공", property: 200}
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //진단 결과 저장
    async recordsave(imageURL){
        const client = this.body;
        try{
            if(client.aiType =="AI 트러블 분석"){
                const recordId = await SkinStorage.classificationeSave(client.userId, imageURL, client.aiType, client.troubleType)
                const incodeData = await PhotoStorage.base64Incode(imageURL)
                const data = {recordId:recordId.latest_recordId, troubleType:client.troubleType, photo:incodeData} 
                return { data: data, success: true, message: "트러블 유형 검사 결과 저장 성공", property: 200}
            }
            else if(client.aiType =="AI 호전도 분석"){
                const recordId = await SkinStorage.detectionSave(client.userId, imageURL, client.aiType, client.troubleTotal)
                const incodeData = await PhotoStorage.base64Incode(imageURL)
                var past = await SkinStorage.pastDetectionRecord(client.userId, recordId.latest_recordId)
                var improvement = ``
                var pastData = {}
                if (past[0]==undefined){
                    improvement = "처음으로 호전도 검사 서비스를 사용 하였으므로 과거 기록이 존재하지 않습니다"
                    past[0]={}
                }
                else{
                    const incodeData2 = await PhotoStorage.base64Incode(past[0].photoPath)
                    pastData = {recordId:past[0].recordId, troubleTotal:past[0].troubleTotal, photo: incodeData2}
                    var total = (client.troubleTotal - past[0].troubleTotal)
                    if (total<0)
                    {improvement = `지난번 보다 트러블 개수가 ${-total}개 줄었어요 (.• ᵕ •.)`}
                    else if(total>0)
                    {improvement = `지난번 보다 트러블 개수가 ${total}개 늘었어요 (•́︿•̀) `}
                    else if(total==0)
                    {improvement = `지난번과 트러블 개수가 변함없어요 (.• - •.)`}
                }
                const currentData = {recordId: recordId.latest_recordId, troubleTotal:client.troubleTotal, photo : incodeData} 

                return {currentData:currentData, pastData:pastData, improvement:improvement, success: true, message: "트러블 호전도 검사 결과 저장 성공", property: 200}
            }
        } catch(err){
            return {success: false, message: "에러 발생", property: 404}
        }
    }

    //과거 진단 기록 리스트 반환
    async recordList(){
        const client = this.body;
        try{
            if(client.userId!="all"){
                const list = await SkinStorage.recordList(client.userId);
                return {list:list , success: true, message: "사용자 진단 기록 리스트 반환 성공", property: 200}
            }else{
                const list = await SkinStorage.allRecordList();
                return {list:list , success: true, message: "사용자 진단 기록 리스트 반환 성공", property: 200}
            }
            
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //특정 진단 기록 내용 반환
    async recordData(){
        const client = this.body;
        try{
            if(client.aiType=="AI 트러블 분석"){
                const data = await SkinStorage.classificationData(client.recordId)
                const incodeData = await PhotoStorage.base64Incode(data[0].photoPath)
                const recordData = {recordId: data[0].recordId, troubleType: data[0].troubleType, photo:incodeData}
                return {data: recordData, success: true, message: "진단 기록 정보 반환 성공", property: 200}
            }
            else if(client.aiType =="AI 호전도 분석"){
                const current = await SkinStorage.detectionData(client.recordId)
                const incodeData = await PhotoStorage.base64Incode(current[0].photoPath)
                const cData = {recordId:client.recordId, troubleTotal:current[0].troubleTotal ,photo:incodeData}

                const past = await SkinStorage.pastDetectionRecord(client.userId, client.recordId)
                var pData = {}

                var improvement = ``
                if (past[0]==undefined){improvement = "처음으로 호전도 검사 서비스를 사용 하였으므로 과거 기록이 존재하지 않습니다"}
                else{
                    const incodeData2 = await PhotoStorage.base64Incode(past[0].photoPath)
                    pData = {recordId:past[0].recordId, troubleTotal:past[0].troubleTotal, photo: incodeData2}
                    var total = (current[0].troubleTotal - past[0].troubleTotal)
                    if (total<0)
                    {improvement = `지난번 보다 트러블 개수가 ${-total}개 줄었어요 (.• ᵕ •.)`}
                    else if(total>0)
                    {improvement = `지난번 보다 트러블 개수가 ${total}개 늘었어요 (•́︿•̀) `}
                    else if(total==0)
                    {improvement = `지난번과 트러블 개수가 변함없어요 (.• - •.)`}
                }
                return {currentData:cData, pastData:pData, improvement:improvement, success: true, message: "진단 기록 정보 반환 성공", property: 200}
            }
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //특정 진단 기록 삭제
    async recordDelete(){
        const client = this.body;
        try{
            const {photoPath} = await SkinStorage.photoPath(client.recordId);
            fs.unlink(photoPath, (err) => {
                if (err) { console.error(err); return;}
                });
            SkinStorage.recordDelete(client.recordId)
            return {success: true, message: "진단 기록 삭제 성공", property: 200}
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }



}

module.exports = Skin;