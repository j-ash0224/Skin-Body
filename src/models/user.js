const UserStorage = require("./userStorage");
const SkinStorage = require("./skinStorage");

class User{

    constructor(body){
        this.body = body
    }

    //사용자 로그인
    async userLogin(){
        const client =this.body;
        try{
            var data = await UserStorage.checkPsword(client.userId)
            if(data[0] != null){
                var userPW = data[0].psword
                if (userPW == client.psword){
                    return {success:true, message: "로그인 성공", property: 200}    
                }
                else{
                    return {success:false, message: "비밀번호가 올바르지 않습니다.", property: 301}    
                }
            }else{
                return {success:false, message: "존재하지 않는 회원정보 입니다.", property: 301}    
            }
                
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //사용자 서비스 가입
    async userCreate(){
        const client =this.body;
        try{
            //서비스 가입 정보 중복 여부 확인
            var IdCheck = await UserStorage.checkId(client.userId)
            var nicknameCheck = await UserStorage.checkNickname(client.nickname)
            var telCheck = await UserStorage.checkTel(client.tel)

            if(IdCheck[0]==undefined && nicknameCheck[0]==undefined && telCheck[0]==undefined){
                UserStorage.userCreate(client.userId, client.psword, client.nickname, client.tel)
                return {success:true, message: "회원 가입 성공", property: 200}    
            }
            else if(IdCheck[0]!=undefined){
                return {success:false, message: "이미 사용 중인 아이디 입니다.", property: 302}    
            }
            else if(nicknameCheck[0] != undefined){
                return {success:false, message: "이미 사용 중인 닉네임 입니다.", property: 302}    
            }
            else if(telCheck[0] != undefined){
                return {success:false, message: "이미 등록된 전화번호 입니다.", property: 302}    
            }
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //사용자 아이디 찾기
    async userFindId(){
        const client =this.body;
        try{
            var data = await UserStorage.findId(client.tel)
            if(data[0]==undefined) return {userId:null, success:false, message: "존재하지 않는 회원정보 입니다.", property: 301}    
            else return {userId:data[0].userId, success:true, message: "아이디 반환 성공", property: 200}    
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //사용자 비밀번호 찾기
    async userFindPW(){
        const client =this.body;
        try{
            var data = await UserStorage.findPW(client.userId, client.tel)
            if(data[0]==undefined) return {psword:null, success:false, message: "존재하지 않는 회원정보 입니다.", property: 301}    
            else{
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

                UserStorage.userPswordUpdtae(client.userId, newPsword)
                return {psword:newPsword, success:true, message: "비밀번호 반환 성공", property: 200}    
            }
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //홈페이지 사용자 프로필 반환
    async userHomeProfile(){
        const client = this.body
        try {
            var data = await UserStorage.userProfile(client.userId)
            if(data.skinType!=null){
                var {typeColor} = await SkinStorage.typeColor(data.skinType)
            } else typeColor="사용자가 아직 피부 유형 검사를 수행하지 않음"
            
            
            return {nickname:data.nickname, 
                    typeColor: typeColor,
                    skinType:data.skinType, 
                    oilyScore:data.oilyScore, 
                    resistanceScore:data.resistanceScore, 
                    non_pigmentScore:data.non_pigmentScore, 
                    tightScore:data.tightScore, 
                    success:true, message: "홈페이지 프로필 반환 성공", property: 200}    
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //환경설정 페이지 사용자 프로필 반환
    async setPageProfile (){
        const client = this.body
        try {
            var data = await UserStorage.userProfile(client.userId)
            return {nickname:data.nickname, success:true, message: "환경설정 닉네임 반환 성공", property: 200}    
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //사용자 프로필 반환
    async userProfile(){
        const client = this.body
        try {
            var data = await UserStorage.userProfile(client.userId)
            return {nickname:data.nickname,tel: data.tel, skinType:data.skinType, success:true, message: "프로필 반환 성공", property: 200}    
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //사용자 프로필 수정
    async profileUpdate(){
        const client = this.body
        try {
            //프로필 수정 정보 중복 여부 확인
            var data = await UserStorage.userProfile(client.userId)
            var pastNickname = data.nickname
            var pastTel = data.tel
            
            var nicknameCheck = await UserStorage.checkNickname(client.nickname)
            if(nicknameCheck[0]==undefined) nicknameCheck=true //중복되지 않음
            else if(client.nickname == pastNickname) nicknameCheck=true //변경하지 않음
            else nicknameCheck = false //변경했는데 다른 사람이 이미 사용 중

            var telCheck = await UserStorage.checkTel(client.tel)
            if(telCheck[0]==undefined) telCheck=true //중복되지 않음
            else if(client.tel == pastTel) telCheck=true //변경하지 않음
            else telCheck = false //변경했는데 다른 사람이 이미 사용 중

            
            if(nicknameCheck==true && telCheck==true){
                UserStorage.profileUpdate(client.userId, client.nickname, client.tel)
                return {success:true, message: "프로필 수정 성공", property: 200}    
            }
            else if(nicknameCheck ==false){
                return {success:false, message: "이미 사용 중인 닉네임 입니다.", property: 304}    
            }
            else if(telCheck ==false){
                return {success:false, message: "이미 등록된 전화번호 입니다.", property: 304}    
            }
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //사용자 비밀번호 수정
    async userPswordUpdtae (){
        const client = this.body
        try {
            //비밀번호 수정을 위해서 기존 비밀번호로 인증
            var data = await UserStorage.checkPsword(client.userId)
            var userPW = data[0].psword
            if (userPW == client.psword){
                UserStorage.userPswordUpdtae(client.userId, client.newPsword)
                return {success:true, message: "비밀번호 수정 성공", property: 200}   
            }
            else{
                return {success:false, message: "비밀번호가 올바르지 않습니다.", property: 301}    
            }
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

     //사용자 계정 삭제
     async userDelete (){
        const client = this.body
        try{
            //계정 삭제를 위해 비밀번호로 인증
            var data = await UserStorage.checkPsword(client.userId)
            var userPW = data[0].psword
            if (userPW == client.psword){
                UserStorage.userDelete(client.userId)
                return {success:true, message: "계정 삭제 성공", property: 200}    
            }
            else{
                return {success:false, message: "비밀번호가 올바르지 않습니다.", property: 301}    
            }
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    /*-------------------------------------------관리자용-----------------------------------------------*/
    //사용자 수 및 피부유형 반환
    async userSkinTypeCount(){
        try{
            var {totalUserCount} = await UserStorage.userCount();
            var DRPTCount = await UserStorage.userSkinTypeCount("DRPT");
            var DRNTCount = await UserStorage.userSkinTypeCount("DRNT");
            var DSPTCount = await UserStorage.userSkinTypeCount("DSPT");
            var DSNTCount = await UserStorage.userSkinTypeCount("DSNT");
            var DRPWCount = await UserStorage.userSkinTypeCount("DRPW");
            var DRNWCount = await UserStorage.userSkinTypeCount("DRNW");
            var DSPWCount = await UserStorage.userSkinTypeCount("DSPW");
            var DSNWCount = await UserStorage.userSkinTypeCount("DSNW");
            var ORPTCount = await UserStorage.userSkinTypeCount("ORPT");
            var ORNTCount = await UserStorage.userSkinTypeCount("ORNT");
            var OSPTCount = await UserStorage.userSkinTypeCount("OSPT");
            var OSNTCount = await UserStorage.userSkinTypeCount("OSNT");
            var ORNWCount = await UserStorage.userSkinTypeCount("ORNW");
            var ORPWCount = await UserStorage.userSkinTypeCount("ORPW");
            var OSPWCount = await UserStorage.userSkinTypeCount("OSPW");
            var OSNWCount = await UserStorage.userSkinTypeCount("OSNW");

            return {
                DRPT: DRPTCount,
                DRNT: DRNTCount,
                DSPT: DSPTCount,
                DSNT: DSNTCount,
                DRPW: DRPWCount,
                DRNW: DRNWCount,
                DSPW: DSPWCount,
                DSNW: DSNWCount,
                ORPT: ORPTCount,
                ORNT: ORNTCount,
                OSPT: OSPTCount,
                OSNT: OSNTCount,
                ORNW: ORNWCount,
                ORPW: ORPWCount,
                OSPW: OSPWCount,
                OSNW: OSNWCount,
                userCount:totalUserCount, success:true, message: "홈페이지 정보 반환 성공", property: 301}
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //사용자 리스트 반환 (+검색)
    async userList(){
        const client = this.body
        try{
            var list = []
            //전체 리스트 조회일 경우 검색값이 all
            if (client.userId=='all') {list = await UserStorage.userList() }
            //특정 사용자의 이름으로 검색
            else{
                var data = await UserStorage.userProfile(client.userId)
                if(data!=undefined){list = [{nickname: data.nickname, userId: client.userId, tel : data.tel, skinType:data.skinType}]}
                else list=[]
            } 
            return{list, success:true, message:"사용자 검색 성공", property:200}
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //사용자 정보 삭제
    async userDeleteByM(){
        const client =this.body;
        try {
            UserStorage.userDelete(client.userId)
            return {success:true, message: "사용자 정보 삭제 성공", property: 200}    
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }


}

module.exports = User;