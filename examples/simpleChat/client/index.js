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
    }

    //if subscription result
    if(msg.hasOwnProperty('method')){
        if(msg.method == nameSubscription){
            const result = msg.result;
            console.warn("new chat: " + result);
            log.innerHTML += result + "<br>";
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