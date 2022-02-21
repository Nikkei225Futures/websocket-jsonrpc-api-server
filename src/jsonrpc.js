exports.parseError = -32700;
exports.invalidRequest = -32600;
exports.methodNotFound = -32601;
exports.invalidParams = -32602;
exports.internalError = -32603;

class JsonRpcRequest{

    #version;
    #methodName;
    #params;
    #requesterId;
    #isNotification;
    #id;
    
    constructor(msg, requesterId){
        if(!(msg instanceof Object)){
            throw 'unparseable message';
        }

        if(msg.hasOwnProperty('jsonrpc') == false || 
                msg.hasOwnProperty('method') == false){
            throw 'parameter is not enough';
        }
        
        if(typeof(msg.method) != "string"){
            throw 'method should be String';
        }

        if(typeof(msg.params) != "object"){
            throw 'params should be Object'
        }

        this.version = msg.jsonrpc;
        this.methodName = msg.method;
        this.params = msg.params;
        this.requesterId = requesterId;

        this.isNotification = false;
        this.id = -1;  //default value as -1


        if(msg.hasOwnProperty('id')){
            if(typeof(msg.id) == "number"){
                this.id = msg.id;
            }else{
                throw 'id should be Number';
            }
        }else{
            this.isNotification = true;
        }
    }

    /**
     * returns version of jsonrpc
     * @returns {String} - version of jsonrpc, like "2.0"
     */
    getVersion = function(){
        return this.version;
    }

    /**
     * returns method name of jsonrpc
     * @returns {String} - method name(= route name)
     */
    getMethodName = function(){
        return this.methodName;
    }

    /**
     * returns parameter of jsonrpc
     * @returns {Object} - parameter
     */
    getParams = function(){
        console.log("this.params");
        console.log(this.params);
        return this.params;
    }

    /**
     * returns the request is notification or not as boolean
     * @returns {Boolean} - the jsonrpc request if notification or not
     */
    getIsNotification = function(){
        return this.isNotification;
    }

    /**
     * returns id of person who throws jsonrpc request
     * @returns {String} - the id of person who throws jsonrpc request
     */
    getRequesterId = function(){
        return this.requesterId;
    }

    /**
     * returns id of jsonrpc request if the message is not notification
     * @returns {Number} - id of jsonrpc request
     */
    getId = function(){
        if(!this.isNotification){
            return this.id;
        }else{
            return null;
        }
    }
}


exports.JsonRpcRequest = JsonRpcRequest;
