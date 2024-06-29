const { reduce, reject } = require("async");
const db = require("../database/connect.js");

class UserStoreage {

    //비밀번호 반환
    static checkPsword(userId){
        return new Promise((resolve, reject)=>{
            const query = "select psword from user where userId = ?";
            db.query(query ,[userId], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data);     
            })         
        })
    }

    //아이디 반환
    static checkId(userId){
        return new Promise((resolve, reject)=>{
            const query = "select userId from user where userId = ?";
            db.query(query ,[userId], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data)
            })         
        })
    }

    //닉네임 반환
    static checkNickname(nickname){
        return new Promise((resolve, reject)=>{
            const query = "select nickname from user where nickname = ?";
            db.query(query ,[nickname], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data)
            })         
        })
    }

    //전화번호 반환
    static checkTel(tel){
        return new Promise((resolve, reject)=>{
            const query = "select tel from user where tel = ?";
            db.query(query ,[tel], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data)
            })         
        })
    }

    //회원 가입
    static userCreate(userId, psword, nickname, tel){
        const query = 'insert into user values (?, ?, ?, ?, null);'
        db.query(query, [userId, psword, nickname, tel])
        const query2 = 'insert into userTypeScore values (?, null, null, null, null, null);'
        db.query(query2, [userId])
    }

    //아이디 찾기
    static findId(tel){
        return new Promise((resolve, reject)=>{
            const query = "select userId from user where tel = ?";
            db.query(query ,[tel], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data)
            })         
        })
    }

    //비밀번호 찾기
    static findPW(userId, tel) {
        return new Promise((resolve, reject)=>{
            const query = "select psword from user where userId=? and tel = ?";
            db.query(query ,[userId, tel], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data)
            })         
        })
    }

    //비밀번호 변경
    static userPswordUpdtae(userId, newPsword){
        const query = 'update user set psword=? where userId=?'
        db.query(query, [newPsword, userId])
    }

    //프로필 반환
    static userProfile(userId){
        return new Promise((resolve, reject)=>{
            const query = `SELECT u.nickname, u.tel, uts.skinType, uts.oilyScore, uts.resistanceScore, uts.non_pigmentScore, uts.tightScore 
                           FROM user u
                           JOIN userTypeScore uts 
                           ON u.userId = uts.userId
                           WHERE u.userId = ?`;
            db.query(query ,[userId], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data[0])
            })
        })
    }

    //프로필 수정
    static profileUpdate(userId, nickname, tel){
        const query = 'update user set nickname=?, tel=? where userId=?'
        db.query(query,[nickname, tel, userId])
    }

    //계정 삭제
    static userDelete (userId){
        const query = `delete from user where userId = ?`
        const query2 =  `delete from userTypeScore where userId = ?`
        const query3 =  `delete from QandA where userId = ?`
        const query4 =  `delete from record where userId = ?`
        db.query(query, [userId])
        db.query(query2, [userId])
        db.query(query3, [userId])
        db.query(query4, [userId])
    }

    //사용자 수 반환
    static userCount(){
        return new Promise((resolve, reject)=>{
            const query = `SELECT COUNT(*) AS totalUserCount FROM user;`;
            db.query(query, (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data[0]);     
            })         
        })
    }

    //사용자 피부유형 분포 반환
    static userSkinTypeCount(type){
        return new Promise((resolve, reject)=>{
            const query = `SELECT COUNT(*) AS userCount FROM userTypeScore where skinType=?`;
            db.query(query,[type], (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data[0].userCount);     
            })         
        })
    }

    //사용자 리스트 반환
    static userList(){
        return new Promise((resolve, reject)=>{
            const query = `select nickname, userId, tel, skinType from user`;
            db.query(query, (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data);     
            })         
        })
    }    

}

module.exports = UserStoreage;