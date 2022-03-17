const api = new WebSocket('ws://localhost:9999');

let log = document.getElementById("log");
let chats = [];

const idGetRecent = 0;
const idPostChat = 1;
const idSubscribe = 2;
const nameSubscription = "subscription.chat";

api.addEventListener("open", () => {
    sendReqGetRecent();
    sendReqSubscribe();
});

api.addEventListener("message", msg => {
    msg = JSON.parse(msg.data);
    console.log(msg);

    //if not subscription
    if(msg.hasOwnProperty('id')){
        //if request success
        if(msg.hasOwnProperty('result')){
            if(msg.id == idGetRecent){
                let recents = msg.result.chats;
                console.warn(recents);
    
                for(let i = 0; i < recents.length; i++){
                    log.innerHTML += recents[i] + "<br>";
                }
    
            }else if(msg.id == idPostChat){
                const notification = msg.result;
                console.warn(notification);
    
            }else if(msg.id == idSubscribe){
                console.warn(msg.result);
            }

        //if request failed
        }else if(msg.hasOwnProperty('error')){
            const errMsg = msg.error.message;
            let errLog = document.getElementById('error-log');
            errLog.innerHTML = errMsg;
            //delete err meg after 5sec
            setTimeout(() => {
                errLog.innerHTML = "";
            }, 5000);
        }

    }

    //if subscription result
    if(msg.hasOwnProperty('method')){
        if(msg.method == nameSubscription){
            const result = msg.result;
            console.warn("new chat: " + result);
            log.innerHTML += result + "<br>";
            
            //scroll to under 
            const chatBody = document.getElementById('chat-body');
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

});

api.addEventListener("close", () => {
    console.error('api closed');
});

function sendReqSubscribe(){
    const req = {
        "jsonrpc": "2.0",
        "id": idSubscribe,
        "method": "register/subscriptions",
        "params": {
            "subscriptions": [nameSubscription]
        }
    }
    api.send(JSON.stringify(req));
}

function sendReqGetRecent(){
    const req = {
        "jsonrpc": "2.0",
        "id": idGetRecent,
        "method": "get/recent",
        "params": {
            "n": 20
        }
    }
    api.send(JSON.stringify(req));
}

function postChat(str){
    const req = {
        "jsonrpc": "2.0",
        "id": idPostChat,
        "method": "post/chat",
        "params": {
            "talk": str
       }
    }
    api.send(JSON.stringify(req));
}

//func for front events
function sendBtnPush(){
    let inputText = document.getElementById('chat');
    postChat(inputText.value);
    inputText.value = "";
}

window.document.onkeydown = function(e){
    if(e.key === 'Enter'){
        sendBtnPush();
    }
}