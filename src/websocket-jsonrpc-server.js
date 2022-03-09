server = require('ws').Server;

let uuid4 = require('uuid4');

const jr = require('./jsonrpc.js');
const rter = require('./router.js');
const methods = require('./methods.js');
const router = rter.router;
const cl = require('./client.js');
const subsciption = require('./subscription.js');
const logger = require('./logger.js');

//wrapper
exports.JsonRpcRequest = jr.JsonRpcRequest;
exports.router = router;
exports.defaultMethods = methods;
exports.Client = cl;
exports.Subsciption = subsciption.Subscription;
exports.logger = logger;

/**
 * start api server
 * @param {Number} portNum 
 * @returns 
 */
function startServer(portNum) {
    logger.writeLog(logger.logFile, `start server on port: ${portNum}`);

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
        logger.writeLog(logger.logFile, `new client connected id=${sock.id}`);

        sock.on("message", msg => {
            try {
                msg = JSON.parse(msg);
            } catch (e) {
                router.sendError(sock, null, jr.invalidRequest, e.toString());
                return;
            }


            let req;
            try {
                req = new jr.JsonRpcRequest(msg, sock.id);
            } catch (e) {
                console.log("error: " + e);
                router.sendError(sock, null, jr.parseError, e);
                return;
            }
            
            logger.writeLog(logger.logFile, `message from ${sock.id} - ${JSON.stringify(msg)}`);

            let res;
            if (router.hasRoute(req.getMethodName())) {
                try {
                    res = router.routes[req.getMethodName()].run(req);
                } catch (e) {
                    router.sendError(sock, req.getId(), jr.invalidRequest, e);
                    logger.writeLog(logger.errLogFile, `error occured while executing method(${req.getMethodName()}): ${e.toString()}`);
                    return;
                }

                if (!req.getIsNotification()) {
                    router.sendResult(sock, req.getId(), res);
                }

            } else {
                router.sendError(sock, req.getId(), jr.methodNotFound, "method not found");
                logger.writeLog(logger.sendLog, `send error to client(${sock.id}): method not found`);
            }

        });

        sock.on('close', () => {
            logger.writeLog(logger.logFile, `client(${sock.id}) disconnected from server`);
            clients.removeClient(clients.getClient(sock.id));
        });
    });
}
exports.startServer = startServer;

