
const wjs = require('./websocket-jsonrpc-server.js');
const router = wjs.router;
const Subsciption = wjs.Subsciption;


/**
 * return random value, for subscription
 * @returns {Object} - random value
 */
 function getRandomValue(){
  let res = {
      "value": Math.floor(Math.random() * 1000)
  }
  return res;
}

const subscriptionRandomValue = new Subsciption("get.randomValue", getRandomValue);
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