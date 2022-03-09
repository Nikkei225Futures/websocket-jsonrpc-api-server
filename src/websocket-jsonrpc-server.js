server = require('ws').Server;

let uuid4 = require('uuid4');
let isStarted = false;

const jr = require('./jsonrpc.js');
const rter = require('./router.js');
const methods = require('./methods.js');
const router = rter.router;
const cl = require('./client.js');
const subsciption = require('./subscription.js');

//wrapper
exports.JsonRpcRequest = jr.JsonRpcRequest;
exports.router = router;
exports.defaultMethods = methods;
exports.Client = cl;
exports.Subsciption = subsciption.Subscription;

/**
 * start api server
 * @param {Number} portNum 
 * @returns 
 */
function startServer(portNum) {
    console.log(`startServer(${portNum})`);
    if (typeof portNum != "number") {
        console.error("port number should be number");
        return;
    }

    ws = new server({ port: portNum });
    exports.ws = ws;

    const clients = require('./clients.js').clients;

    ws.on('connection', sock => {

        sock.id = uuid4();
        let newClient = new cl.Client(sock);
        clients.addClient(newClient);

        sock.on("message", msg => {
            try {
                msg = JSON.parse(msg);
            } catch (e) {
                router.sendError(sock, null, jr.invalidRequest, e.toString());
                return;
            }

            console.log(msg);

            let req;
            try {
                req = new jr.JsonRpcRequest(msg, sock.id);
            } catch (e) {
                console.log("error: " + e);
                router.sendError(sock, null, jr.parseError, e);
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

                if (!req.getIsNotification()) {
                    router.sendResult(sock, req.getId(), res);
                }

            } else {
                router.sendError(sock, req.getId(), jr.methodNotFound, "method not found");
            }

        });

        sock.on('close', () => {
            clients.removeClient(clients.getClient(sock.id));
        });
    });
}
exports.startServer = startServer;

