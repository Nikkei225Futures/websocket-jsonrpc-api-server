# websocket-jsonrpc-api-server
api server with websocket and jsonrpc.  
easily build a websocket server with jsonrpc.  

# this provides
- request/response like api - called Route in this api
- subscription api - used to broadcast some continuous data to client who are subscribing.

## default Route
to support subscription, this api provide 3 default Route below
 - "register/subscriptions": use when client subscribe some subscriptions.  
    request/response should be like   
    ``
    --> {"jsonrpc": "2.0", "id": 0, "method": "register/subscriptions","params": {"subscriptions": ["your.subscription.name1", "your,subscription.name2"]}}
    ``

    ``
    <-- {"jsonrpc":"2.0", "id": 0, "result": "accepted"}    //when request is not notification(= when field 'id' is included)
    ``

 - "delete/subscriptions": use when client unsubscribe some subscriptions.  
    request/response should be like   
    ``
    --> {"jsonrpc": "2.0", "id": 1, "method": "delete/subscriptions","params": {"subscriptions": ["your.subscription.name1", "your,subscription.name2"]}}
    ``

    ``
    <-- {"jsonrpc": "2.0", "id": 1, "result": "accepted"}   //when request is not notification(= when field 'id' is included)
    ``

 - "delete/allSubscriptions": use when client unsubscribe all subscriptions.  
    request/response should be like   
    ``
    --> {"jsonrpc": "2.0", "id": 2, "method": "delete/allSubscriptions","params": {}}
    ``

    ``
    <-- {"jsonprc": "2.0", "id": 2, "result": "accepted"}   //when request is not notification(= when field 'id' is included)
    ``

# How to use

## Installation
this package is published on [npm](https://www.npmjs.com/package/websocket-jsonrpc-api-server).  
``` 
$ npm i websocket-jsornpc-api-server
```

## Example of code
``` js
const deployPort = 9888;

const { EventEmitter } = require('events');
const wjs = require('websocket-jsonrpc-api-server');

const logger = wjs.logger;
const logFile = logger.logFile;
const errLogFile = logger.errLogFile;
const sendLog = logger.sendLog;

//start logging, to write log, this is required
logger.enableLogger();

//argument of startSecureServer(pathCert, pathKey) is specified by path to key files.
const pathCert = "./certs/selfCert.pem";
const pathKey = "./certs/selfKey.pem";

//start server on your port
//wjs.startServer(deployPort);

//or start server as websocket secure(wss://)
wjs.startSecureServer(pathCert, pathKey);

//get router
const router = wjs.router;

//register route by bindRoute(rName: string, function(req));
//when error, throw exception in function to bind
//any return will be interpreted as success
router.bindRoute("get/nhoge", (req) => {
    let params = req.getParams();
    if(!(params.hasOwnProperty('n'))){
        throw 'parameter n should be contained into params';
    }

    if(isNaN(params.n)){
        throw 'parameter n should be number';
    }

    let msg = "";
    let n = Number(params.n);


    for(let i = 0; i < n; i++){
        msg += "hoge";
    }

    return {
        "msg": msg
    };

});

//register subscription by bindSubscription(sName: string, function(), ws: wjs.ws, interval: number);
//subscription name will be "subscription.get.randomValue"
router.bindSubscriptionByInterval("get.randomValue", () => {
    let val = Math.floor(Math.random() * 1000);
    let res = {
        "val": val
    }
    return res;
}, 1000);


const timeEvent = new EventEmitter();
/**
 * register subscription by bindSubscriptionByEvent(sName, function, EventEmitter);
 * when eventEmitter.emit('result') -> execute registered method and broadcast to subscriber;
 * when eventEmitter.emit('notice', arg) -> broadcast notification to subscriber;
 */
router.bindSubscriptionByEvent("get.currentTime", () => {
    const currentTime = Date.now().toString();
    return {"t": currentTime};
}, timeEvent);

//emit event to excecute subscription method
setInterval( () => {
    timeEvent.emit('result');
}, 1000);

/**
setTimeout( () => {
    timeEvent.emit('notice', "subscription.get.currentTime is deleted");
    router.unbindSubscription('subscription.get.currentTime');
    router.unbindSubscription("subscription.get.randomValue");  // delete subscription dynamically
    router.unbindRoute("get/nhoge");    //delete route dynamically
}, 30000);
 * 
 */
```