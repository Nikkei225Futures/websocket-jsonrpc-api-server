let dstLcl = "localhost";
let dstRmt = "3.143.243.86"

let svr = new WebSocket(`ws://${dstLcl}:9888`);
let log = document.getElementById("log");
let res;

svr.addEventListener("open", () => {
    log.innerHTML = "sock open";
});

svr.addEventListener("message", msg => {
    msg = JSON.parse(msg.data);
    if(msg.id == 987){
        console.warn(msg);
    }else{
        res = msg.result;
        log.innerHTML = JSON.stringify(msg);
        console.log(msg);
    }
});

svr.addEventListener("close", msg => {
    log.innerHTML = "sock close";
});

function sendMsg(msg){
    svr.send(msg);
}