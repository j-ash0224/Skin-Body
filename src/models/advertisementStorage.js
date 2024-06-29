const db = require("../database/connect.js");

class advertisementStorage{
    //광고 등록
    static adCreate (imageURL){
        const query = 'insert into advertisement (photoPath) values (?)'
        db.query(query, [imageURL])
    }

    //광고 리스트 반환
    static adList (){
        return new Promise((resolve, reject) => {
            const query = 'select * from advertisement;'
            db.query(query , (err, data) =>{
                if(err) reject(`${err}`)
                resolve(data)
            })
        })
    }

    //광고 삭제
    static adDelete(advertisementId){
        return new Promise((resolve, reject) => {
            const query = 'select photoPath from advertisement where advertisementId=?'
            db.query(query, [advertisementId], (err, data) =>{
                if(err) {reject(`${err}`)}
                else{
                    const query2 = 'delete from advertisement where advertisementId=?'
                    db.query(query2, [advertisementId]) 
                    resolve(data)
                }
            })
        })
    }
}

module.exports = advertisementStorage;