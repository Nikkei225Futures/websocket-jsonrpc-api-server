const { JsonRpcRequest } = require("./jsonrpc");
const { Route } = require("./route");
const rter = require("./router.js");
const clients = require('./clients.js').clients;
const router = rter.router;

exports.registerSubscriptions = registerSubscriptions;
exports.deleteSubscriptions = deleteSubscriptions;
exports.deleteAllSubscriptions = deleteAllSubscriptions;
exports.getRandomValue = getRandomValue;

/**
 * for Route, register subsciption
 * msg should be like
 * {
 *      "jsonrpc": "2.0",
 *      "id": 0,
 *      "params": {
 *          "subscriptions": ["subscription.a", "subscription.b", ..., "subscription.z"]
 *      }
 * }
 * @param {JsonRpcRequest} req - message of jsonrpc request
 */
function registerSubscriptions(req){
    console.log("registerSubscriptions");
    let params = req.getParams();

    if(!(params.hasOwnProperty("subscriptions"))){
        throw 'subscriptions should be contained in the params';
    }

    if(!(params.subscriptions instanceof Array)){
        throw 'params.subscriptions should be array';
    }

    //check api has such subscriptions
    let errMsg = "";
    for(let i = 0; i < params.subscriptions.length; i++){
        let isValid;
        try{
            isValid = router.hasSubscription(params.subscriptions[i]);
        }catch(e){
            console.log(e);
            errMsg += e + "\n";
            continue;
        }

        if(!isValid){
            errMsg += `there is no such subscription like ${params.subscriptions[i]}. \n`;
        }
    }

    //if err
    if(errMsg != ""){
        throw errMsg;
    }

    //register subscriptions
    for(let i = 0; i < params.subscriptions.length; i++){
        router.subscriptions[params.subscriptions[i]].addSubscriber(req.getRequesterId());
    }

    return "accepted";
}

function deleteSubscriptions(req){
    console.log("deleteSubscriptions");
    let params = req.getParams();

    if(!(params.hasOwnProperty("subscriptions"))){
        throw 'subscriptions should be contained in the params';
    }

    if(!(params.subscriptions instanceof Array)){
        throw 'params.subscriptions should be array';
    }

    let errMsg = "";

    for(let i = 0; i < params.subscriptions.length; i++){
        let isValid;
        try{
            isValid = router.hasSubscription(params.subscriptions[i]);
        }catch(e){
            console.log(e);
            errMsg += e + "\n";
            continue;
        }
        if(!isValid){
            errMsg += `there is no such subscription like ${params.subscriptions[i]}. \n`;
        }
    }

    if(errMsg != ""){
        throw errMsg;
    }

    for(let i = 0; i < params.subscriptions.length; i++){
        router.subscriptions[params.subscriptions[i]].removeSubscriber(req.getRequesterId());
    }

    return "accepted";

}

function deleteAllSubscriptions(req){
    console.log("deleteAllSubscriptions");
    let params = req.getParams();

    let client = clients.getClient(req.getRequesterId());
    let clientSubscriptions = client.getSubscriptions();

    for(let i = 0; i < clientSubscriptions.length; i++){
        router.subscriptions[clientSubscriptions[i]].removeSubscriber(client.id);
    }

    return "accepted";

}

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