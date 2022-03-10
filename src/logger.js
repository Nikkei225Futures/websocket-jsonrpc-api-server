const logFile = "./logs/logger.log";
const errLogFile = "./logs/error.log";
const sendLog = "./logs/send.log";

exports.logFile = logFile;
exports.errLogFile = errLogFile;
exports.sendLog = sendLog;

let isAllowed = false;

function writeLog(fileName, content){
    if(isAllowed){
        if(typeof fileName != "string"){
            throw 'argument fileName should be string';
        }
    
        if( typeof content != "string"){
            throw 'argument content shoud be string';
        }
        
        const fs = require("fs");
    
        let date = new Date();
        let strDate = date.getFullYear()
        + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
        + '/' + ('0' + date.getDate()).slice(-2)
        + ' ' + ('0' + date.getHours()).slice(-2)
        + ':' + ('0' + date.getMinutes()).slice(-2)
        + ':' + ('0' + date.getSeconds()).slice(-2); 
    
        try{
            fs.appendFileSync(fileName, `${strDate}: ${content}\n`, 'utf8');
        }catch(e){
            console.error(e);
        }
    }
}

function enableLogger(){
    isAllowed = true;
    const fs = require("fs");
    try{
        fs.mkdirSync('logs');
    }catch(e){
        writeLog(errLogFile, e.toString());
    }
}

function disableLogger(){
    isAllowed = false;
}
exports.enableLogger = enableLogger;
exports.disableLogger = disableLogger;
exports.writeLog = writeLog;
