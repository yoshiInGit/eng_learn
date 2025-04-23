class ViewMessage {
    type : "user" | "assistant";
    message : string;
    subMessage : string | null;

    constructor({type, message, subMessage} : {type : "user" | "assistant", message : string, subMessage : string | null}) {
        this.type = type;
        this.message = message;
        this.subMessage = subMessage;
    }

}

export default ViewMessage;