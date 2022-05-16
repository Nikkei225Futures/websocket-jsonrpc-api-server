let dstLcl = "localhost";

let svr = new WebSocket(`ws://${dstLcl}:9888`);
//let svr = new WebSocket(`wss://${dstLcl}`);

let log = document.getElementById("log");
let res;


svr.addEventListener("open", () => {
    //log.innerHTML = "sock open";
    
    console.warn('send tests');
    for(let i = 0; i < tests.length; i++){
        console.warn(tests[i]);
        svr.send(JSON.stringify(tests[i]));
    }

});

let responses = [];
let strReqs = [];
let resIdx = 0;
svr.addEventListener("message", msg => {
    msg = JSON.parse(msg.data);
    if (msg.id == 987) {
        console.warn(msg);
    } else {
        res = msg.result;
        //log.innerHTML = JSON.stringify(msg);
        
        strReqs[resIdx] =  "--> " + JSON.stringify(tests[resIdx]); 
        responses[resIdx] = "<-- " + JSON.stringify(msg);
        resIdx++;
        console.log(msg);
    }

    //if all req done
    if(resIdx > tests.length-1){
        for(let i = 0; i < tests.length; i++){
            log.innerHTML += strReqs[i] + '<br>';
            log.innerHTML += responses[i] + '<br><br>';
        }
    }

});

svr.addEventListener("close", msg => {
    log.innerHTML = "sock close";
});


//testcases below
const test1 = {
    "jsonrpc": "2.0",
    "method": "register/subscriptions",
    "id": 1,
    "params": {
        "subscriptions": ["get.randomValue"]
    }
}

const test2 = {
    "jsonrpc": "2.0",
    "method": "delete/subscriptions",
    "id": "qwrety",
    "params": {
        "subscriptions": ["get.randomValue"]
    }
}

const test3b = {
    "jsonrpc": "2.0",
    "method": "register/subscriptions",
    "id": 3,
    "params": {
        "subscriptions": ["get.randomValue"]
    }
}

const test3 = {
    "jsonrpc": "2.0",
    "method": "delete/allSubscriptions",
    "id": 3,
    "params": {}
}

//send req of method that is not exist
const test4 = {
    "jsonrpc": "2.0",
    "method": "nilMethod",
    "id": 4,
    "params": {}
}

//send req of subscription that is not exist
const test5 = {
    "jsonrpc": "2.0",
    "method": "register/subscriptions",
    "id": 5,
    "params": {
        "subscriptions": ["nil.subscription"]
    }
}

//send req of subscription that is type error
const test6 = {
    "jsonrpc": "2.0",
    "method": "register/subscriptions",
    "id": 6,
    "params": {
        "subscriptions": [0]
    }
}

//send empty object
const test7 = {} 

//send invalid msg
const test8 = {
    "jsonrpc": "2.0",
    "id": 8
}


const tests = [test1, test2, test3b, test3, test4, test5, test6, test7, test8];