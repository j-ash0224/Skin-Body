const winston = require('winston')

const printFormat = winston.format.printf(({timestamp,label,level,message})=>{
    return `${timestamp} [${label}] ${level} : ${message}`
})

const logFormat = winston.format.combine( // 로그 형식 지정
winston.format.label({label : "졸업 프로젝트"}),
winston.format.timestamp({format : "YYYY-MM-DD HH:mm:ss"}),
printFormat
)

//로그 설정
const logger = winston.createLogger({   // 매개변수 -> JSON 객체
    transports : [new winston.transports.File({
        dirname : "./src/log",
        filename : "access.log",
        level : "info", //출력하고자 하는 최저 레벨
        format : logFormat
    })],
})

module.exports = logger