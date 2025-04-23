type phaseStateType = "ASK_SITUATION" | "CONVERSATION";

export default class phaseState {
    private static instance: phaseState | null = null;
    
    watcher : ((messages: phaseStateType) => void)[] = [];    
    
    phase: phaseStateType = "ASK_SITUATION";

    private constructor() {}

    // シングルトンインスタンスを取得するメソッド
    public static getState(): phaseState {
        if (!phaseState.instance) {
            phaseState.instance = new phaseState();
        }

        return phaseState.instance;
    }

    subscribe(callback: (messages: phaseStateType) => void) {
        this.watcher.push(callback);
    }

    unsubscribe(callback: (messages: phaseStateType) => void) {
        this.watcher = this.watcher.filter((cb) => cb !== callback);
    }   

    notify() {
        this.watcher.forEach((callback) => callback(this.phase));
    }
}