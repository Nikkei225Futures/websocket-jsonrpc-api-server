const logFile = "logger.log";
const errLogFile = "error.log";
const sendLog = "send.log";

exports.logFile = logFile;
exports.errLogFile = errLogFile;
exports.sendLog = sendLog;

function writeLog(fileName, content){
    
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

exports.writeLog = writeLog;
