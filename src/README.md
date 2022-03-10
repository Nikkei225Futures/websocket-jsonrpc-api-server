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

``` 
const port = 9888;  //port to deploy api
const wjs = require('websocket-jsonrpc-api-server');    //get package

const logger = wjs.logger;  //get logger
const router = wjs.router;  //get router
const Route = wjs.Route;    //get Route class
const Subsciption = wjs.Subsciption;    //get Subscription class

logger.enableLogger();  //enableLogger, to write log, this is required

wjs.startServer(port);  //start server

//argument of Route must be only req(object of JsonRpcRequest)
//create Route
function hogeRoute(req){
    return {
        "msg": "hogehoge"
    }
}
const myRoute = new Route("get/hogehoge", hogeRoute);   //bind route name and its method
router.addRoute(myRoute);       //add route to router


//create Subscription
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
    subscriptionRandomValue.broadCast(wjs.ws);
}
setInterval(randomValSubscription, 100);

```