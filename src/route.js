const { JsonRpcRequest } = require("./jsonrpc");

class Route {

    #rName;
    #method;

    constructor(rName, method) {
        if (typeof rName != "string") {
            console.error("rName should be String");
        }
        if (!(method instanceof Function)) {
            console.error("method should be Function");
            return;
        }

        //privates
        this.rName = rName;
        this.method = method;
    }

    /**
     * getter of routeName
     * @returns route name of this rpc method
     */
    getRouteName = function () {
        return this.rName;
    }

    /**
     * execute rpc method
     * @param {JsonRpcRequest} req - instance of JsonRpcRequest
     * @returns {Object} - object of jsonrpc
     */
    run = function (req) {
        if (!(req instanceof JsonRpcRequest)) {
            throw 'argument req should be instance of JsonRpcRequest';
        }

        let res;
        try{
            res = this.method(req);
        }catch(e){
            throw e;
        }

        console.log("res");
        console.log(res);
        return res;
    }
}

exports.Route = Route;