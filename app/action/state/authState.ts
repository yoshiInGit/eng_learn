import { User } from "firebase/auth";

export default class AuthState {
    private static instance: AuthState | null = null;
    
    user : User | null = null;

    watcher : ((user: User | null) => void)[] = [];    

    private constructor() {}

    // シングルトンインスタンスを取得するメソッド
    public static getState(): AuthState {
        if (!AuthState.instance) {
            AuthState.instance = new AuthState();
        }

        return AuthState.instance;
    }

    subscribe(callback: (user: User | null) => void) {
        this.watcher.push(callback);
    }

    unsubscribe(callback: (user: User | null) => void) {
        this.watcher = this.watcher.filter((cb) => cb !== callback);
    }

    notify() {
        this.watcher.forEach((callback) => callback(this.user));
    }
}