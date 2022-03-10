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
const port = 12345;     //set your port number to deploy api server
const wjs = require('./websocket-jsonrpc-server.js');   //import this library
const logger = wjs.logger;  //get logger

const router = wjs.router;      //get router
const Subscription = wjs.Subscription;  //get Subscription class
const Route = wjs.Route;        //get Route class

//log - logger will create logger.log, error.log, send.log files under src/
logger.enableLogger();      //enable logging
logger.disableLogger();     //disable logging

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
function getTime(){
    let date = new Date();
    return {
        "date": date.toString();
    }
}
const mySubscription = new Subscription("get.time", getTime);   //bind subscription name and its method
router.addSubscription(mySubscription);     //add subscription to router
const timer = () => {
    mySubscription.broadCast();
}
setInterval(mySubscription, 1000);

wjs.startServer(port);      //start api server

```