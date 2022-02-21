server = require('ws').Server;
ws = new server({port: 9888});

let uuid4 = require('uuid4');
let isStarted = false;

exports.ws = ws;

const jr = require('./jsonrpc.js');
const rter = require('./router.js');
const methods = require('./methods.js');
const router = rter.router;


ws.on('connection', sock => {
    sock.id = uuid4();

    sock.on("message", msg => {

        msg = JSON.parse(msg);
        console.log(msg);

        let req;
        try{
            req = new jr.JsonRpcRequest(msg, sock.id);
        }catch(e){
            console.log("error: " + e);
            router.sendError(sock, msg.id, jr.parseError, e);
            return;
        }

        //console.log("req-method");
        //console.log(req.getMethodName());
        //console.log(req);

        let res;
        if(router.hasRoute(req.getMethodName())){
            try{
                res = router.routes[req.getMethodName()].run(req);
            }catch(e){
                console.log("error: " + e);
                router.sendError(sock, req.getId(), jr.invalidRequest, e);
                return;
            }

            router.sendResult(sock, req.getId(), res);
        }else{
            router.sendError(sock, req.getId(), jr.methodNotFound, "method not found");
        }

    });
});

/*
if(isStarted){
    ws.on('connection', sock => {
        sock.id = uuid4();

        sock.on("message", msg => {
            let req;
            try{
                req = new jr.JsonRpcRequest(msg, sock.id);
            }catch(e){
                jr.sendError(sock, msg.id, jr.parseError, "message is not parseable");
            }

            let res;
            if(router.hasRoute(req.getMethodName())){
                try{
                    res = router.routes[req.getMethodName()].run(req);
                }catch(e){
                    router.sendError(sock, req.getRequesterId(), jr.invalidRequest, e);
                }

                router.sendResult(sock, req.getRequesterId(), res);
            }

        });
    });
}
*/

/**
 * start api server
 * @param {Number} port 
 * @returns 
 */
 async function startServer(port){
    if(typeof port != "number"){
        console.error("port should be number");
        return;
    }
    server = require('ws').Server;
    ws = new server({port: port});
    isStarted = true;
}

exports.ws = ws;
exports.startServer = startServer;
