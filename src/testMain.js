
const wjs = require('./websocket-jsonrpc-server.js');
const jr = require('./jsonrpc.js');

const rt = require('./route.js');
const ss = require('./subscription.js');

const rter = require('./router.js');
const router = rter.router;

const methods = require('./methods.js');


const rs = new rt.Route("register/subscriptions", methods.registerSubscriptions);
router.addRoute(rs);

const dm = new rt.Route("delete/subscriptions", methods.deleteSubscriptions);
router.addRoute(dm);

const dam = new rt.Route("delete/allSubscriptions", methods.deleteAllSubscriptions);
router.addRoute(dam);

const subscriptionRandomValue = new ss.Subscription("get.randomValue", methods.getRandomValue);
console.log(subscriptionRandomValue);
router.addSubscription(subscriptionRandomValue);
console.log("register: " + subscriptionRandomValue.getSubscriptionName());

/*
(async() => {
  await wjs.startServer(9888);
})
*/


const randomValSubscription = () => {
    subscriptionRandomValue.run();
    subscriptionRandomValue.broadCast(wjs.ws);
}
setInterval(randomValSubscription, 100);