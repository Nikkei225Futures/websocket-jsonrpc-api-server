server = require('ws').Server;
//ws = new server({port: 9888});
ws = new server({ port: 9888 });

let uuid4 = require('uuid4');
let isStarted = false;

const jr = require('./jsonrpc.js');
const rter = require('./router.js');
const methods = require('./methods.js');
const router = rter.router;
const cl = require('./client.js');
const clients = require('./clients.js').clients;
const subsciption = require('./subscription.js');

//wrapper
exports.JsonRpcRequest = jr.JsonRpcRequest;
exports.router = router;
exports.defaultMethods = methods;
exports.Client = cl;
exports.Subsciption = subsciption.Subscription;


ws.on('connection', sock => {

    sock.id = uuid4();
    let newClient = new cl.Client(sock);
    clients.addClient(newClient);
    
    sock.on("message", msg => {

        msg = JSON.parse(msg);
        console.log(msg);

        let req;
        try {
            req = new jr.JsonRpcRequest(msg, sock.id);
        } catch (e) {
            console.log("error: " + e);
            router.sendError(sock, msg.id, jr.parseError, e);
            return;
        }

        //console.log("req-method");
        //console.log(req.getMethodName());
        //console.log(req);

        let res;
        if (router.hasRoute(req.getMethodName())) {
            try {
                res = router.routes[req.getMethodName()].run(req);
            } catch (e) {
                console.log("error: " + e);
                router.sendError(sock, req.getId(), jr.invalidRequest, e);
                return;
            }

            router.sendResult(sock, req.getId(), res);

        } else {
            router.sendError(sock, req.getId(), jr.methodNotFound, "method not found");
        }

    });

    sock.on('close', () => {
        clients.removeClient(clients.getClient(sock.id));
    });
});


/**
 * start api server
 * @param {Number} portNum 
 * @returns 
 */
function startServer(portNum) {
    console.log(`startServer(${portNum})`);
    if (typeof port != "number") {
        console.error("port should be number");
        return;
    }
    ws = new server({ port: portNum });

    isStarted = true;
}

exports.ws = ws;
exports.startServer = startServer;

