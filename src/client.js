class Client {
    
    constructor(socket){
        if(typeof(socket) != "object"){
            throw 'socket should be instance of Ws.Socket';
        }
        
        this.id = socket.id;

        this.subscriptions  = [];

    }

    /**
     * add subscriptions to client
     * @param {String} subscriptionName - name of subscription(= Subscription.sName)
     */
    addSubscription = function(subscriptionName){
        if(typeof(subscriptionName) != "string"){
            throw 'argument subscriptionName should be string';
        }

        this.subscriptions.push(subscriptionName);

    }

    /**
     * remove subscriptions to client
     * @param {String} subscriptionName - name of subscription(= Subscription.sName)
     */
    removeSubscription = function(subscriptionName){
        if(typeof(subscriptionName) != "string"){
            throw 'argument subscriptionName should be string';
        }

        for(let i = 0; i < this.subscriptions.length; i++){
            if(this.subscriptions[i] == subscriptionName){
                this.subscriptions.splice(i, 1);
                return;
            }
        }
        throw 'no such subscription found';
    }

    
    /**
     * remove all subscriptions that are registered
     */
     removeAllSubscriptions = function(){
        this.subscriptions = [];    
    }

    /**
     * get subscriptions that client currently using
     * @returns array of subsciptions that clients is subscripting currently
     */
    getSubscriptions = function(){
        return this.subscriptions;
    }

}

exports.Client = Client;