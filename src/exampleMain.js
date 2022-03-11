const deployPort = 9888;

const wjs = require('./websocket-jsonrpc-server.js');

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
