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

        if(talk.length > 140){
            throw 'length of string must be under 140';
        }else if(talk.length == 0){
            throw 'input something...';
        }

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