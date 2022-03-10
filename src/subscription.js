const clients = require('./clients.js').clients;

const logger = require('./logger.js');
const sendLog = logger.sendLog;

/**
 * class of subscription
 * caution: no argument to method is arrowed
 * @class
 */
class Subscription{

    #sName;
    #method;
    #subscribers = [];

    constructor(sName, method){
        if(typeof sName != "string"){
            console.error("sName should be String");
            return;
        }
        if(!(method instanceof Function)){
            console.error("method should be Function");
            return;
        }

        this.sName = "subscription." + sName;
        this.subscribers = [];
        this.method = method;
    }

    /**
     * return route name of subscription
     * @returns {String} like "subscription/routeName"
     */
    getSubscriptionName = function(){
        return this.sName;
    }

    /**
     * return array of subscribers id
     * @returns {Array} array of subscribers id(uuid)
     */
    getSubscribers = function(){
        return this.subscribers;
    }

    /**
     * add subscriber of subscription
     * @param {String} id - uuid of sock.id
     */
    addSubscriber = function(id){
        console.log("add subscriber: " + id);
        if(typeof(id) != "string"){
            console.error("id should be string");
            return;
        }
        this.subscribers[this.subscribers.length] = id;

        let client = clients.getClient(id);
        client.addSubscription(this.sName);
    }

    /**
     * remove subscriber of subscription
     * @param {Number} id uuid of sock.id
     * @throws 'no such id found' when there is no such specified id in this.subscribers.
     */
    removeSubscriber = function(id){
        for(let i = 0; i < this.subscribers.length; i++){
            if(this.subscribers[i] == id){
                this.subscribers.splice(i, 1);
                let client = clients.getClient(id);
                client.removeSubscription(this.sName);
                console.log(clients.getClient(id));
                return;
            }
        }

        throw 'no such id found';
    }

    /**
     * execute registered method
     * @returns {Object} result of method
     * @throws 'method does not return Object' when method does not return object
     */
    run = function(){
        let res;
        try{
            res = this.method();
        }catch(e){
            throw e;
        }

        return res;
    }

    /**
     * send same data to some clients as subscription
     * @param {WebSocket} ws 
     */
    broadCast = function(ws){
        let res = this.run();
        //console.log("subscribers");
        //console.log(this.subscribers);

        ws.clients.forEach(client => {
            if(client != undefined){
                if(this.subscribers.includes(client.id)){
                    this.sendSubscriptionResult(client, res);
                }
            }
        });
    }

    /**
     * send subscription result to client
     * @param {WebSocket.client} client 
     * @param {Object} result 
     */
    sendSubscriptionResult = function(client, result){
        let res = {
            "jsonrpc": "2.0",
            "method": this.sName,
            "result": result
        }
        client.send(JSON.stringify(res));
        logger.writeLog(sendLog, `send subscription result to client(${client.id}): ${JSON.stringify(res)}`);
    }
}

exports.Subscription = Subscription;
