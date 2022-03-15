const clients = require('./clients.js').clients;

const logger = require('./logger.js');
const sendLog = logger.sendLog;

const EventEmitter = require('events');

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
            throw 'argument sName should be string';
        }

        if(!(method instanceof Function)){
            throw 'argument method should be Function';
        }

        this.sName = "subscription." + sName;
        this.subscribers = [];
        this.method = method;
        this.eventEmitter = undefined;
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
        if(typeof(id) != "string"){
            throw 'argument id should be string';
        }

        if(this.subscribers.includes(id)){
            throw `${id} has been already registered.`
        }
        
        this.subscribers[this.subscribers.length] = id;

        let client = clients.getClient(id);
        client.addSubscription(this.sName);
    }

    /**
     * disable this subscription, used when unbindSubscription
     */
    destroy = function(){
        
        for(let i = 0; i < this.subscribers.length; i++){
            let client = clients.getClient(this.subscribers[i]);
            client.removeSubscription(this.sName);
        }

        this.run = () => {};
        this.broadCast = () => {};
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
     * send subscription result to client
     */
    broadCastResult = function(){
        let res = this.run();
        this.broadCast(res);
    }

    /**
     * send some notice fo client
     * @param {string} str 
     */
    broadCastNotice = function(str){
        if(typeof(str) != "string"){
            throw 'argument of broadCastNotice should be string';
        }
        const notice = {"notice": str};
        this.broadCast(notice);
    }

    /**
     * send message to client
     * @param {any} content - content to send
     */
    broadCast = function(content){
        for(let i = 0; i < this.subscribers.length; i++){
            const client = clients.getClient(this.subscribers[i]);
            //if client exists
            if(client != false){
                this.sendSubscriptionResult(client.sock, content);
            }
        }
    }

    /**
     * register event emitter to this subscrition
     * @param {EventEmitter} emitter - should be instance of EventEmitter
     */
    registerEventEmitter = function(emitter){
        if(emitter instanceof EventEmitter){
            this.eventEmitter = emitter;
        }else{
            throw 'argument emitter should be instance of EventEmitter';
        }
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
