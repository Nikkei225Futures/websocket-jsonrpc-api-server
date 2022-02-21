const rt = require('./route.js');
const ss = require('./subscription.js');


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
        }else{
            throw 'route should be instance of Route';
        }
    }

    /**
     * add subscription to router
     * @param {ss.Subscription} subscription - instance of Subscription
     */
    addSubscription = function(subscription){
        if(subscription instanceof ss.Subscription){
            this.subscriptions[subscription.getSubscriptionName()] = subscription;
        }else{
            throw 'subscription should be instance of Subscription';
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
        console.log("hasSubscription");
        console.log(this.subscriptions);
        console.log(subscriptionName);
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
    }

}

exports.router = new Router();