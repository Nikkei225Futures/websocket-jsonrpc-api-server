const rt = require('./route.js');
const ss = require('./subscription.js');
const logger = require('./logger.js');
const logFile = logger.logFile;
const errLogFile = logger.errLogFile;
const sendLog = logger.sendLog;

const EventEmitter = require('events');

const Route = rt.Route;
const Subscription = ss.Subscription;

class Router{
    constructor(){
        this.routes = {};
        this.subscriptions = {};
    }

    /**
     * add route to router
     * @param {rt.Route} route - instance of Route
     */
    addRoute = function(route){
        if(route instanceof rt.Route){
            this.routes[route.getRouteName()] = route;
            logger.writeLog(logFile, `add route to router: ${route.getRouteName()}`);
        }else{
            throw 'argument route should be instance of Route';
        }
    }

    /**
     * bind routeName and its method + register to router
     * @param {string} rName - name of route
     * @param {function} method - method of route
     */
    bindRoute = function(rName, method){
        let newRoute = new Route(rName, method);
        this.addRoute(newRoute);
    }

    /**
     * delete route from router
     * @param {String} rName - name of route
     * @returns 
     */
    unbindRoute = function(rName){
        if(this.hasRoute(rName)){
            delete this.routes[rName];
            logger.writeLog(logFile, `unbindRoute: route(${rName}) is deleted from router`);
        }else{
            logger.writeLog(errLogFile, `unbindRoute route(${rName} is not found.)`);
            return false;
        }
    }

    /**
     * add subscription to router
     * @param {ss.Subscription} subscription - instance of Subscription
     */
    addSubscription = function(subscription){
        if(subscription instanceof ss.Subscription){
            this.subscriptions[subscription.getSubscriptionName()] = subscription;
            logger.writeLog(logFile, `add subscription to router: ${subscription.getSubscriptionName()}`);
        }else{
            throw 'argument subscription should be instance of Subscription';
        }
    }

    /**
     * bind subscription to router
     * broadcast result by interval
     * @param {string} sName 
     * @param {function} method 
     * @param {Number} interval - interval to execute method
     */
    bindSubscriptionByInterval = function(sName, method, interval){
        let newSubscription = new Subscription(sName, method);
        this.addSubscription(newSubscription);
        setInterval(() => {
            newSubscription.broadCastResult();
        }, interval);
    }

    /**
     * bind subscription to router
     * broadcast result by event('result', or 'notice'(with arg))
     * @param {String} sName 
     * @param {Function} method 
     * @param {EventEmitter} eventEmitter 
     */
    bindSubscriptionByEvent = function(sName, method, eventEmitter){
        let newSubscription = new Subscription(sName, method);
        this.addSubscription(newSubscription);
        newSubscription.registerEventEmitter(eventEmitter);
        
        eventEmitter.on('result', () => {
            newSubscription.broadCastResult();
        });

        eventEmitter.on('notice', (arg) => {
            newSubscription.broadCastNotice(arg);
        });

    }

    /**
     * delete specified subscription from router
     * @param {String} sName - name of subscription
     * @returns {Boolean} - if success, true. if fail, false.
     */
    unbindSubscription = function(sName){
        if(this.hasSubscription(sName)){

            const targetSubscription = this.subscriptions[sName];
            logger.writeLog(logFile, `unbindSubscription: subscription(${sName}) is deleted from router`);

            targetSubscription.destroy();
            delete this.subscriptions[sName];

            return true;
        }else{
            logger.writeLog(errLogFile, `unbindSubscription: subscription(${sName} is not found.)`);
            return false;
        }
    }

    /**
     * judge the API has route that named routeName
     * @param {String} routeName name of route
     * @returns {Boolean} if this.routes has routeName, return true, else false
     */
    hasRoute = function(routeName){
        if(typeof(routeName) != "string"){
            throw 'routeName should be String';
        }
        return routeName in this.routes;
    }

    /**
     * judge the API has subscription that named subscriptionName
     * @param {String} subscriptionName name of subscription
     * @returns if this.subscriptions has subscriptionName, return true, else false
     */
    hasSubscription = function(subscriptionName){
        if(typeof(subscriptionName) != "string"){
            throw 'subscriptionName should be String';
        }
        return subscriptionName in this.subscriptions;
    }

    /**
     * send result(success) of request
     * @param {WebSocket.sock} sock - destination sock
     * @param {Number} id - id of jsonrpc request
     * @param {Object} result - result of method
     */
    sendResult = function (sock, id, result) {
        let res = {
            "jsonrpc": "2.0",
            "id": id,
            "result": result
        };

        sock.send(JSON.stringify(res));
        logger.writeLog(sendLog, `send response to client(${sock.id}): ${JSON.stringify(res)}`);
    }

    /**
     * send error response of request 
     * @param {WebSocket.sock} sock - destination sock
     * @param {Number} id - id of jssonrpc request
     * @param {Number} code - error code
     * @param {String} errMsg - error message
     */
    sendError = function (sock, id, code, errMsg) {
        let res = {
            "jsonrpc": "2.0",
            "id": id,
            "error": {
                "code": code,
                "message": errMsg
            }
        };

        sock.send(JSON.stringify(res));
        logger.writeLog(sendLog, `send error response to client(${sock.id}): ${JSON.stringify(res)}`);
    }

}

exports.router = new Router();