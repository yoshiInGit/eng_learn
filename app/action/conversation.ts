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
        
        try{
            const response = await axios.post("/api/getResponse", {
                situation: MessagesState.getState().messages[0].message,
                conversation: message,
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

}


export const resetConversation = async () => {
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