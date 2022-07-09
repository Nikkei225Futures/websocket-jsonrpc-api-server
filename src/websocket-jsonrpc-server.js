server = require('ws').Server;

let uuid4 = require('uuid4');

const jr = require('./jsonrpc.js');
const rter = require('./router.js');
const methods = require('./methods.js');
const router = rter.router;
const cl = require('./client.js');
const subsciption = require('./subscription.js');
const logger = require('./logger.js');
const rt = require('./route.js');

//wrapper
exports.JsonRpcRequest = jr.JsonRpcRequest;
exports.Subsciption = subsciption.Subscription;
exports.Route = rt.Route;
exports.router = router;
exports.defaultMethods = methods;
exports.Client = cl;
exports.logger = logger;


const Https = require('https');
const fs = require('fs');
const HTTPSPORT = 443;

/**
 * server handler
 * @param {Websocket.Server} ws - instance of Websocket.Server
 */
function websocketHandler(ws){
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
                router.sendError(sock, null, jr.parseError, e);
                return;
            }
            
            logger.writeLog(logger.logFile, `message from ${sock.id} - ${JSON.stringify(msg)}`);

            let res;
            if (router.hasRoute(req.getMethodName())) {
                try {
                    res = router.routes[req.getMethodName()].run(req);
                } catch (e) {
                    router.sendError(sock, req.getId(), jr.internalError, e);
                    logger.writeLog(logger.errLogFile, `error occured while executing method(${req.getMethodName()}): ${e.toString()}`);
                    return;
                }

                if (!req.getIsNotification()) {
                    if(res instanceof Promise){
                        res.then(val => {
                            router.sendResult(sock, req.getId(), val);
                        })
                        .catch(err => {
                            router.sendError(sock, req.getId(), jr.internalError,err);
                        });
                    }else{
                        router.sendResult(sock, req.getId(), res);
                    }
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

/**
 * start WSS server on port 443
 * @param {String} pathCert - path of server certification
 * @param {String} pathKey - path of key
 */
function startSecureServer(pathCert, pathKey){
    logger.writeLog(logger.logFile, `start secure server`);

    const httpsServer = Https.createServer({
        key: fs.readFileSync(pathKey),
        cert: fs.readFileSync(pathCert)
    });

    const ws = new server({
        server: httpsServer
    });

    httpsServer.on('request', (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('https conn');
    });

    websocketHandler(ws);

    httpsServer.listen(HTTPSPORT);

}

/**
 * start api server
 * @param {Number} portNum
 */
function startServer(portNum) {
    logger.writeLog(logger.logFile, `start server on port: ${portNum}`);

    if (typeof portNum != "number") {
        throw 'argument portNum should be number';
    }

    ws = new server({ port: portNum });
    websocketHandler(ws);
    
}


exports.startServer = startServer;
exports.startSecureServer = startSecureServer;

