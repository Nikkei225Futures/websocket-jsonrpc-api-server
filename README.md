# websocket-jsonrpc-api-server
api server with websocket and jsonrpc.  
easily build a websocket server with jsonrpc.  

# this will provide
- request - response like api - called Route in this api
- subscription api - called Subscription in this api

subscription is used to broadcast some continuous data to client who are subscribed

## default Route
to support subscription, this api provide 3 default Route below
 - "register/subscriptions": use when client subscribe some subscriptions.  
    request should be like   
    ``
    {"jsonrpc": "2.0","method": "register/subscriptions","params": {"subscriptions": ["your.subscription.name1", "your,subscription.name2"]}}
    ``

 - "delete/subscriptions": use when client unsubscribe some subscriptions.
    request should be like  
    ``
    {"jsonrpc": "2.0","method": "delete/subscriptions","params": {"subscriptions": ["your.subscription.name1", "your,subscription.name2"]}}
    ``
 - "delete/allSubscriptions": use when client unsubscribe all subscriptions.
    request should be like   
    ``
    {"jsonrpc": "2.0","method": "delete/allSubscriptions","params": {}}
    ``

# How to use

``` const deployPort = 9888;

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

//register route by bindRoute(rName: string, function(req));
//when error, throw exception in function to bind
//any return will be interpreted as success
router.bindRoute("get/nhoge", (req) => {
    let params = req.getParams();
    if(!(params.hasOwnProperty('n'))){
        throw 'parameter n should be contained into params';
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
router.bindSubscription("get.randomValue", () => {
    let val = Math.floor(Math.random() * 1000);
    let res = {
        "val": val
    }
    return res;
}, wjs.ws, 1000);


```