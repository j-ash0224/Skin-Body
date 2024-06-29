const { reduce, reject } = require("async");
const db = require("../database/connect.js");
const fs = require("fs");

class PhotoStorage {
    //사진 인코딩 반환
    static base64Incode(path){
        const fileData = fs.readFileSync(path); // EC2 파일 읽기
        const base64Data = fileData.toString('base64'); // Base64로 인코딩
        return base64Data
    }
}

module.exports = PhotoStorage