const CommunicationStorage = require("./communicationStorage");

class Communication{
    constructor (body){
        this.body = body
    }

    //공지사항 리스트 반환
    async noticeList (){
        try{
            const list = await CommunicationStorage.noticeList()
            return {list:list, success: true, message: "공지사항 반환 성공", property: 200}
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //이용약관 반환
    async terms (){
        try{
            const data = await CommunicationStorage.terms()
            return {terms:data.content, success: true, message: "이용약관 반환 성공", property: 200}
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //Q&A 작성
    async QAcreate(){
        const client = this.body
        try {
            var today = new Date();   
            var year = today.getFullYear();
            var month = today.getMonth() + 1; 
            var date = today.getDate();  
            var createDay = year + '-' + month + '-' + date
            CommunicationStorage.QAcreate(client.userId,client.question, createDay)
            return {success: true, message: "질문 등록 성공", property: 200}
        } catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //Q&A 반환
    async QAList(){
        const client = this.body
        try{
            const list = await CommunicationStorage.QAList(client.userId)
            return {list:list, success: true, message: "Q&A 반환 성공", property: 200}
        }catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //공지사항 작성
    async noticeCreate(){
        const client = this.body
        try {
            var today = new Date();   
            var year = today.getFullYear();
            var month = today.getMonth() + 1; 
            var date = today.getDate();  
            var createDay = year + '-' + month + '-' + date
            CommunicationStorage.noticeCreate(client.content, createDay)
            return {success: true, message: "공지사항 작성 성공", property: 200}
        } catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //공지사항 수정
    async noticeUpadate(){
        const client = this.body
        try {
            var today = new Date();   
            var year = today.getFullYear();
            var month = today.getMonth() + 1; 
            var date = today.getDate();  
            var createDay = year + '-' + month + '-' + date
            CommunicationStorage.noticeUpadate(client.noticeId, client.content, createDay)
            return {success: true, message: "공지사항 수정 성공", property: 200}
        } catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //공지사항 삭제
    async noticeDelete(){
        const client = this.body
        try {
            CommunicationStorage.noticeDelete(client.noticeId)
            return {success: true, message: "공지사항 삭제 성공", property: 200}
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //이용약관 수정
    async termsUpadate(){
        const client = this.body
        try {
            CommunicationStorage.termsUpadate(client.terms)
            return {success: true, message: "이용약관 수정 성공", property: 200}
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //Q&A 리스트 반환
    async questionList(){
        try {
            const data = await CommunicationStorage.questionList()
            return {list:data, success: true, message: "Q&A 리스트 반환 성공", property: 200}
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }
    
    //Q&A 답변 
    async questionAnswer(){
        const client = this.body
        try {
            CommunicationStorage.questionAnswer(client.questionId, client.answer)
            return {success: true, message: "Q&A 답변 성공", property: 200}
        } catch(err) {
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }


}

module.exports = Communication
