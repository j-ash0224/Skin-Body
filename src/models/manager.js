const ManagerStorage = require("./managerStorage");
const fs = require('fs');

class Manager{
    constructor(body){
        this.body = body
    }

    //관리자 로그인
    async managerLogin(){
        const client = this.body
        try {
            const data = await ManagerStorage.managerLogin(client.managerId);
            if (data !== undefined) {
                if (data.psword === client.psword) {
                    return { success: true, message: "로그인 성공", property: 200 };
                } else {
                    return { success: false, message: "비밀번호가 올바르지 않습니다.", property: 301 }
                }
            } else {
                return { success: false, message: "존재하지 않는 관리자 정보입니다.", property: 301 }
            }

        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //관리자 아이디 찾기
    async managerFindId(){
        const client = this.body
        try {
            const data = await ManagerStorage.managerFindId(client.tel);
            if (data[0] != undefined) {
                return {managerId:data[0].managerId, success: true, message: "아이디 반환 성공", property: 200 }
            } else {
                return {managerId:null, success: false, message: "존재하지 않는 관리자 정보입니다.", property: 301 }
            }
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }

    }

    //관리자 비밀번호 찾기
    async managerFindPW(){
        const client = this.body
        try {
            const data = await ManagerStorage.managerFindPW(client.managerId, client.tel);
            
            if (data[0] != undefined) {
                var newPsword = '';
                var characters = 'abcdefghijklmnopqrstuvwxyz';
                for (var i = 0; i < 4; i++) {
                    newPsword += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                characters = '0123456789';
                for (var i = 0; i < 3; i++) {
                    newPsword += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                characters = '!@#$&';
                newPsword += characters.charAt(Math.floor(Math.random() * characters.length));
                
                ManagerStorage.managerPswordUpdate(client.managerId,newPsword)
                
                return {psword:newPsword, success: true, message: "비밀번호 반환 성공", property: 200 }
            } else {
                return {managerId:null, success: false, message: "존재하지 않는 관리자 정보입니다.", property: 301 }
            }
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }

    }

    //관리자 리스트 반환 (+검색)
    async managerList(){
        const client = this.body
        try{
            var list = []
            //전체 리스트 조회일 경우 검색값이 all
            if (client.name=='all') list = await ManagerStorage.managerList() 
            //특정 관리자의 이름으로 검색
            else list = await ManagerStorage.managerFind(client.name)

            return{list, success:true, message:"관리자 검색 성공", property:200}
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //관리자 정보 추가
    async managerCreate(){
        const client = this.body
        try{
            //추가 정보 중복 여부 확인
            var idCheck = await ManagerStorage.checkId(client.managerId)
            var telCheck = await ManagerStorage.checkTel(client.tel)
            if(idCheck[0]==undefined) idCheck=true //중복되지 않음
            else idCheck=false
            if(telCheck[0]==undefined) telCheck=true //중복되지 않음
            else telCheck=false

            if(idCheck==true && telCheck==true){
                ManagerStorage.managerCreate(client.managerId, client.psword, client.name, client.tel)
                return {success:true, message: "관리자 등록 성공", property: 200}    
            }
            else if(idCheck ==false){
                return {success:false, message: "이미 사용 중인 아이디 입니다.", property: 304}    
            }
            else if(telCheck ==false){
                return {success:false, message: "이미 등록된 전화번호 입니다.", property: 304}    
            }
            
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //관리자 정보 수정
    async managerUpdate(){
        const client = this.body
        try {
            //다른 관리자 정보 수정은 최고 관리자(코드:0)만 수행 가능하므로 관리자 코드 조회
            var data = await ManagerStorage.managerData(client.loginManagerId)
            var codCheck = data.code

            if (codCheck==0 || client.loginManagerId==client.managerId){
                //수정 정보 중복 여부 확인
                var data = await ManagerStorage.managerData(client.managerId)
                var pastTel = data.tel //변경 여부 확인을 위한 과거 전화번호

                var telCheck = await ManagerStorage.checkTel(client.tel)
                if(telCheck[0]==undefined) telCheck=true //중복되지 않음
                else if(client.tel == pastTel) telCheck=true //변경하지 않음
                else telCheck = false //중복

                if(telCheck ==false){
                    return {success:false, message: "이미 등록된 전화번호 입니다.", property: 304}    
                }else{
                    ManagerStorage.managerUpdate(client.managerId, client.name, client.tel)
                    return {success:true, message: "관리자 정보 수정 성공", property: 200}    
                }
            }else{
                return {success:false, message: "권한이 없습니다", property: 1006}    
            }
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //관리자 정보 삭제
    async managerDelete(){
        const client = this.body
        try {
            //다른 관리자 정보 삭제는 최고 관리자(코드:0)만 수행 가능하므로 관리자 코드 조회
            var data = await ManagerStorage.managerData(client.loginManagerId)
            var codCheck = data.code

            if (codCheck==0 || client.loginManagerId==client.managerId){
                ManagerStorage.managerDelete(client.managerId)
                return {success:true, message: "관리자 정보 삭제 성공", property: 200}    
            }else{
                return {success:false, message: "권한이 없습니다", property: 1006}    
            }
        } catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //관리자 비밀번호 수정
    async managerPswordUpdate(){
        const client = this.body
        try {
            //비밀번호 수정을 위해서 기존 비밀번호로 인증
            var data = await ManagerStorage.managerData(client.managerId)
            var managerPW = data.psword 

            if (managerPW == client.psword){
                ManagerStorage.managerPswordUpdate(client.managerId, client.newPsword)
                return {success:true, message: "비밀번호 수정 성공", property: 200}    
            }
            else{
                return {success:false, message: "비밀번호가 올바르지 않습니다.", property: 301}    
            }
        } catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //AI 그래프 저장
    async aiSave(imageURL, model){
        try{
            ManagerStorage.aiSave(imageURL, model)
            return {success:true, message:"그래프 저장 성공", property:200}
        }
        catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //AI 그래프 반환
    async aiGet(){
        try{
            const data = await ManagerStorage.aiGet()
            var adArray = []
            for(var i=0; i<data.length ; i++){
                const fileData = fs.readFileSync(data[i].photoPath); // EC2 파일 읽기
                const base64Data = fileData.toString('base64'); // Base64로 인코딩
                const aiData = {model: data[i].modelType, photo: base64Data}
                adArray.push(aiData)
                }

            return {data: adArray, success:true, message:"그래프 반환 성공", property:200}
        }
        catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }
}

module.exports = Manager