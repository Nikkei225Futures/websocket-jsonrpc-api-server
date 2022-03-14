const cl = require('./client.js');

class Clients {
    
    constructor(){
        this.clients = {};
    }

    /**
     * add client to clients list
     * @param {cl.Client} client - instance of Client
     */
    addClient = function(client){
        if(!(client instanceof cl.Client)){
            throw 'argument client should be instance of Client';
        }
        
        if(!client.hasOwnProperty('id')){
            throw 'client should have its identifier';
        }

        if(this.clients.hasOwnProperty(client.id)){
            throw `the client has already added. collision id = ${client.id}`;
        }

        this.clients[client.id] = client;

    }

    /**
     * remove client from clients list 
     * @param {cl.Client} client - instnace of Client
     */
    removeClient = function(client){
        if(!(client instanceof cl.Client)){
            throw 'argument client should be instance of Client';
        }
        
        if(!client.hasOwnProperty('id')){
            throw 'client should have its identifier';
        }

        if(!this.clients.hasOwnProperty(client.id)){
            throw `no such client exist`;
        }

        delete this.clients[client.id];

    }

    /**
     * return all clients list
     * @returns all clients list
     */
    getAllClients = function(){
        return this.clients;
    }

    /**
     * return client that has specified id in argument
     * @param {String} id - identifier of client
     * @returns {Client} - instance of Client
     */
    getClient = function(id){
        if(typeof id != "string"){
            throw 'argument id should be string';
        }

        if(this.clients.hasOwnProperty(id)){
            return this.clients[id];
        }else{
            console.log("false");
            return false;
        }
    }
}

const clients = new Clients();
exports.clients = clients;