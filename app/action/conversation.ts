import axios from "axios";
import { sleep } from "../helper/time";
import ViewMessage from "../model/ViewMessage";
import LoadState from "./state/loadState";
import MessagesState from "./state/messageState";
import phaseState from "./state/phaseState";

export const askSituation = async () => {
    // 会話の状況設定を行う
    LoadState.getState().isLoading = true;
    LoadState.getState().notify();
    
    await sleep(700);

    MessagesState.getState().messages.push(
        new ViewMessage({
            type: "assistant",
            message: "こんにちは。わたしは英会話AIのGiggloです！\nどんな状況の会話をしますか？\n入力してね！（日本語でOK）",
            subMessage: null,
        })
    );

    LoadState.getState().isLoading = false;
    LoadState.getState().notify();

    MessagesState.getState().notify();
}

export const sendMessage = async ({message}:{message: string}) => {
    // SITUATIONの状態でメッセージを送信した場合、会話の状況を設定する
    const onAskSituation = async () => {
        MessageHistory.getInstance().setSituation(message); // 状況を設定

        MessagesState.getState().messages.push(
            new ViewMessage({
                type: "user",
                message: message,
                subMessage: null,
            })
        );
        MessagesState.getState().notify();
    
        LoadState.getState().isLoading = true;
        LoadState.getState().notify();

        await sleep(300);

        LoadState.getState().isLoading = false;
        LoadState.getState().notify();

        MessagesState.getState().messages.push(
            new ViewMessage({
                type: "assistant",
                message: "その状況での会話を始めるね！",
                subMessage: null,
            })
        );
        MessagesState.getState().notify();

        LoadState.getState().isLoading = true;
        LoadState.getState().notify();

        
        try {
            const response = await axios.post("/api/getFirstTalk", {
                situation: message,
                conversation: "",
            });

            MessagesState.getState().messages.push(
                new ViewMessage({
                    type: "assistant",
                    message: response.data.message,
                    subMessage: null,
                })
            );
            MessagesState.getState().notify();

            // MessageHistoryにメッセージを追加
            MessageHistory.getInstance().addAssistantMessage(response.data.message);

        } catch (error) {
            console.error("Error:", error);
            //TODO エラー処理
        }

        LoadState.getState().isLoading = false;
        LoadState.getState().notify();

        phaseState.getState().phase = "CONVERSATION";
        phaseState.getState().notify();

    }

    // CONVERSATIONの状態でメッセージを送信した場合、会話を続ける
    const onConversation = async () => {
        // ユーザーのメッセージを画面に追加
        MessagesState.getState().messages.push(
            new ViewMessage({
                type: "user",
                message: message,
                subMessage: null,
            })
        );
        MessagesState.getState().notify();

        LoadState.getState().isLoading = true;
        LoadState.getState().notify();

        //APIに必要な情報を整理
        const situation = MessageHistory.getInstance().getSituation(); // 会話の状況
        const messageHistory = MessageHistory.getInstance().getHistoryAsString(); // 会話の履歴

        
        try{
            const response = await axios.post("/api/getResponse", {
                situation:      situation,
                messageHistory: messageHistory,
                userMessage:    message,
            });

            const userMessage = MessagesState.getState().messages.pop(); // ユーザーメッセージを添削込みの状態にする
            MessagesState.getState().messages.push(
                new ViewMessage({
                    type: "user",
                    message: userMessage?.message ?? "",
                    subMessage: response.data.correction,
                })
            );

            MessagesState.getState().messages.push(
                new ViewMessage({
                    type: "assistant",
                    message: response.data.message,
                    subMessage: null,
                })
            );
            MessagesState.getState().notify();

            // MessageHistoryにメッセージを追加
            MessageHistory.getInstance().addUserMessage(message); // ユーザーメッセージを追加
            MessageHistory.getInstance().addAssistantMessage(response.data.message); // 会話履歴に追加

        }catch(error){
            console.error("Error:", error);
            //TODO エラー処理
        }

        LoadState.getState().isLoading = false;
        LoadState.getState().notify();
    }


    switch (phaseState.getState().phase) {
        case "ASK_SITUATION":
            await onAskSituation();
            break;
        case "CONVERSATION":
            await onConversation();
            break;
    }

    console.log("messageHistory", MessageHistory.getInstance().getHistoryAsString());

}


export const resetConversation = async () => {
    MessageHistory.getInstance().clearAll(); // メッセージ履歴をクリア

    // 会話のリセットを行う    
    MessagesState.getState().messages = [];
    MessagesState.getState().notify();

    phaseState.getState().phase = "ASK_SITUATION";
    phaseState.getState().notify();

    LoadState.getState().isLoading = true;
    LoadState.getState().notify();

    await askSituation();

    LoadState.getState().isLoading = false;
    LoadState.getState().notify();
}

// メッセージの履歴
type Message ={
    type: "user" | "assistant";
    message: string;
}

export class MessageHistory {
    private static instance: MessageHistory | null = null;
    private situation: string = "";
    private history: Message[] = [];

    private constructor() {
        // private constructorで外部からのインスタンス化を防止
    }

    static getInstance(): MessageHistory {
        if (!MessageHistory.instance) {
            MessageHistory.instance = new MessageHistory();
        }
        return MessageHistory.instance;
    }

    setSituation(situation: string) {
        this.situation = situation; 
    }

    getSituation(): string {
        return this.situation;
    }

    addAssistantMessage(message: string) {
        this.history.push({
            type: "assistant",
            message: message,
        });
    }

    addUserMessage(message: string) {
        this.history.push({
            type: "user",
            message: message,
        });
    }

    getHistoryAsString(): string {
        return this.history
            .map((msg) => `${msg.type}: ${msg.message}`)
            .join("\n");
    }

    clearAll() {
        this.situation = "";
        this.history = [];
    }
}