class Chat{
    /**
     * @constructor
     * @param {timestamp} time - instance of Date
     * @param {string} requester - requester name
     * @param {string} talk - content
     */
    constructor(time, requester, talk){
        this.time = time;
        this.requester = requester;
        this.talk = talk;
    }

    toString = function(){
        const dt = this.time;
        let tstr = `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`;
        let str = `${tstr}: ${this.requester} - ${this.talk}`;
        console.log(str);
        return str;
    }
}

exports.Chat = Chat;