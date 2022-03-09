const deployPort = 9888;

const wjs = require('./websocket-jsonrpc-server.js');


const logger = wjs.logger;
const logFile = logger.logFile;
const errLogFile = logger.errLogFile;
const sendLog = logger.sendLog;
logger.enableLogger();

wjs.startServer(deployPort);

const router = wjs.router;
const Subsciption = wjs.Subsciption;



/**
 * return random value, for subscription
 * @returns {Object} - random value
 */
function getRandomValue() {
    let val = Math.floor(Math.random() * 1000);
    let res = {
        "value": val
    }
    return res;
}

const subscriptionRandomValue = new Subsciption("get.randomValue", getRandomValue);
router.addSubscription(subscriptionRandomValue);


console.log("register: " + subscriptionRandomValue.getSubscriptionName());

const randomValSubscription = () => {
    subscriptionRandomValue.run();
    subscriptionRandomValue.broadCast(wjs.ws);
}
setInterval(randomValSubscription, 100);