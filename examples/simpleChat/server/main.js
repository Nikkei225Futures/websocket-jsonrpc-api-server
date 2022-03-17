const deployPort = 9999;

const { EventEmitter } = require('events');
const wjs = require('websocket-jsonrpc-api-server');

const logger = wjs.logger;
const logFile = logger.logFile;
const errLogFile = logger.errLogFile;
const sendLog = logger.sendLog;

//start logging, to write log, this is required
logger.enableLogger();

//start server on your port
wjs.startServer(deployPort);

//get router
const router = wjs.router;

const Chat = require('./chat.js').Chat;
let chats = [];

/**
 * reqest should be jsonrpc
 * params should be like 
 * "params": {
 *      "n": 15
 * }
 */
router.bindRoute("get/recent", (req) => {
    const params = req.getParams();
    let n = 10;
    
    if(params.hasOwnProperty('n')){
        n = params.n;
    } 

    n = Number(n);
    const recents = chats.slice(-n);

    let res = [];
    for(let i = 0; i < recents.length; i++){
        res.push(recents[i].toString());
    }

    return {"chats": res};
});



const chatEvent = new EventEmitter();
/**
 * request should be jsonrpc
 * params should be like 
 * "params": {
 *      "talk": "something to talk to chat"
 * }
 */
router.bindRoute("post/chat", (req) => {
    const params = req.getParams();
    const requester = req.getRequesterId();
    const time = new Date();
    console.log("date: " + time);

    let chat;
    if(params.hasOwnProperty('talk')){
        if(typeof(params.talk) == "string"){
            const name = getShortName(requester);
            chat = new Chat(time, name, params.talk);
        }else{
            throw 'params.talk should be string';
        }
    }else{
        throw 'field talk should be constained into params';
    }

    chats.push(chat);
    console.log(chats);
    chatEvent.emit('result');
    return "accepted.";
});

//when new chat pushed, broadcast latest to all clients
router.bindSubscriptionByEvent("chat", () => {
    return chats[chats.length-1].toString();
}, chatEvent);

function getShortName(uuid){
    const token = uuid.split('-');
    return token[0];
}