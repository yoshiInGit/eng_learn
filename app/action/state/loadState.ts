export default class LoadState {
    private static instance: LoadState | null = null;
    
    isLoading:boolean = false;
    watcher : ((isLoading : boolean) => void)[] = [];    

    private constructor() {}

    // シングルトンインスタンスを取得するメソッド
    public static getState(): LoadState {
        if (!LoadState.instance) {
            LoadState.instance = new LoadState();
        }

        return LoadState.instance;
    }

    subscribe(callback: (isLoading: boolean) => void) {
        this.watcher.push(callback);
    }

    unsubscribe(callback: (isLoading: boolean) => void) {
        this.watcher = this.watcher.filter((cb) => cb !== callback);
    }

    notify() {
        this.watcher.forEach((callback) => callback(this.isLoading));
    }
}