import ViewMessage from "../../model/ViewMessage";

export default class MessagesState {
    private static instance: MessagesState | null = null;
    
    messages: ViewMessage[] = [];
    watcher : ((messages: ViewMessage[]) => void)[] = [];    

    private constructor() {}

    // シングルトンインスタンスを取得するメソッド
    public static getState(): MessagesState {
        if (!MessagesState.instance) {
            MessagesState.instance = new MessagesState();
        }

        return MessagesState.instance;
    }

    subscribe(callback: (messages: ViewMessage[]) => void) {
        this.watcher.push(callback);
    }

    unsubscribe(callback: (messages: ViewMessage[]) => void) {
        this.watcher = this.watcher.filter((cb) => cb !== callback);
    }   

    notify() {
        this.watcher.forEach((callback) => callback(this.messages));
    }
}