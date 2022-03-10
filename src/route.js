const { JsonRpcRequest } = require("./jsonrpc");

class Route {

    #rName;
    #method;

    constructor(rName, method) {
        if (typeof rName != "string") {
            throw 'argument rName should be string';
        }
        if (!(method instanceof Function)) {
            throw 'argument method should be Function';
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

        return res;
    }
}

exports.Route = Route;