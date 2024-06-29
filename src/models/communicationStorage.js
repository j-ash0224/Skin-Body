const { reduce, reject } = require("async");
const db = require("../database/connect.js");

class CommunicationStorage{
    //공지사항 리스트 반환
    static noticeList (){
        return new Promise((resolve, reject)=>{
            const query = 'select * from notice order by noticeId desc;'
            db.query(query, (err,data)=>{
                if(err) reject(`${err}`)
                const formattedData = data.map(item => ({
                    noticeId: item.noticeId,
                    content: item.content,
                    reviceDay: item.reviceDay.toISOString().split('T')[0] // 'YYYY-MM-DD' 형식으로 변환
                }));
                resolve(formattedData)
            })
        })
    }

    //이용약관 반환
    static terms (){
        return new Promise((resolve, reject)=>{
            const query = 'select content from terms'
            db.query(query, (err,data)=>{
                if(err) reject(`${err}`)
                resolve(data[0])
            })
        })
    }

    //Q&A 등록
    static QAcreate(userId,question, createDay){
        const query = `insert into QandA (userId, question, createday) values (?, ?, ?)`
        db.query(query, [userId,question, createDay])
    }

    //Q&A 리스트 반환
    static QAList(userId){
        return new Promise((resolve, reject)=>{
            const query = 'select questionId, question, createday, answer from QandA where userId =?'
            db.query(query,[userId], (err,data)=>{
                if(err) reject(`${err}`)
                const formattedData = data.map(item => ({
                    questionId: item.questionId,
                    question: item.question,
                    createday: item.createday.toISOString().split('T')[0], // 'YYYY-MM-DD' 형식으로 변환
                    answer: item.answer,
                }));
                resolve(formattedData)
            })
        })
    }

    //공지사항 작성
    static noticeCreate(content, reviceDay){
        const query = `insert into notice (content, reviceDay) values (?, ?)`
        db.query(query, [content, reviceDay])
    }

    //공지사항 수정
    static noticeUpadate(noticeId, content, reviceDay){
        const query = `update notice set content=?, reviceDay=? where noticeId=?`
        db.query(query, [content, reviceDay,noticeId])
    }

    //공지사항 삭제
    static noticeDelete(noticeId){
        const query = `delete from notice where noticeId=?`
        db.query(query, [noticeId])
    }

    //이용약관 수정
    static termsUpadate(terms){
        const query = `delete from terms;`
        db.query(query)
        const query2 = `INSERT INTO terms VALUES (?)`
        db.query(query2, [terms])
    }

    //Q&A 리스트 반환
    static questionList(){
        return new Promise((resolve, reject)=>{
            const query = 'select userId, questionId, question, createday, answer from QandA'
            db.query(query, (err,data)=>{
                if(err) reject(`${err}`)
                const formattedData = data.map(item => ({
                    userId: item.userId,
                    questionId: item.questionId,
                    question: item.question,
                    createday: item.createday.toISOString().split('T')[0], // 'YYYY-MM-DD' 형식으로 변환
                    answer: item.answer,
                }));
                resolve(formattedData)
            })
        })
    }

    //Q&A 답변 
    static questionAnswer(questionId, answer){
        const query = 'update QandA set answer=? where questionId=?'
        db.query(query, [answer, questionId])
    }


}

module.exports = CommunicationStorage
