const { error } = require("console");
const AdvertisementStorage = require("./advertisementStorage");
const PhotoStorage = require("./photoStorage")
const fs = require("fs");

class Advertisement{
    constructor(body){
        this.body = body
    }

    //광고 등록
    async adCreate(imageURL){
        const client = this.body;
        try{
            AdvertisementStorage.adCreate(imageURL)
            return {success:true, message:"광고 등록 성공", property:200}
        }
        catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //광고 리스트 반환
    async adList(){
        const client = this.body;
        try{
            const data = await AdvertisementStorage.adList()
            var adArray = []
            for(var i=0; i<data.length ; i++){
                const fileData = fs.readFileSync(data[i].photoPath); // EC2 파일 읽기
                const base64Data = fileData.toString('base64'); // Base64로 인코딩
                const adData = {advertisementId: data[i].advertisementId, photo: base64Data}
                adArray.push(adData)
                }

            return {data: adArray, success:true, message:"광고 반환 성공", property:200}
        }
        catch(err){
            console.log(err)
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }

    //광고 삭제
    async adDelete(){
        const client = this.body;
        try{
            const data = await AdvertisementStorage.adDelete(client.advertisementId)
            fs.unlink(data[0].photoPath, (err) => {
                if (err) { console.error(err); return;}
                });
            return {success:true, message:"광고 삭제 성공", property:200,}
        }
        catch(err){
            return {success: false, message: "에러 발생", property: 404, err}
        }
    }
}

module.exports = Advertisement;