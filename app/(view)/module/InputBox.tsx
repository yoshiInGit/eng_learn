'use client'

import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Send, SendHorizontal } from "lucide-react";
import LoadState from "@/app/action/state/loadState";
import { sendMessage } from "@/app/action/conversation";


const InputBox = () => {

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const textAreaVal = useRef(""); // textareaの値を保持するためのref

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const handleLoadingChange = (loading: boolean) => {
            setIsLoading(loading);
        }
        
        LoadState.getState().subscribe(handleLoadingChange);
        return () => {
            LoadState.getState().unsubscribe(handleLoadingChange);
        };
    },[])

    // 送信ボタンの有効化・無効化
    const sendableClass = "bg-blue-500 hover:bg-blue-600 cursor-pointer";
    const anSendableClass = "bg-gray-300 cursor-not-allowed";
    const [buttonClass, setButtonClass] = useState(sendableClass);
    useEffect(() => {

        if(isLoading){
            setButtonClass(anSendableClass); // ローディング中は無効化
        }else{
            setButtonClass(sendableClass); // ローディング中でないときは有効化
        }
    }
    , [isLoading]);    


    // 送信ボタンが押されたときの処理
    const onSendButtonClick = () => {
        if (textAreaVal.current.trim() === "") return; // 空のときは何もしない
        

        sendMessage({message : textAreaVal.current.trim()}); // メッセージを送信する処理を呼び出す
        if (textAreaRef.current) {
            textAreaRef.current.value = ""; // テキストエリアを空にする
        }
    }

    return(
        <div className="width-full absolute bottom-0 left-0 right-0 px-2 py-4 flex flex-col items-center gap-2">
            {isLoading && <LoadingSpinner size="md" />}
            <div className="w-full bg-white border border-gray-300 rounded-lg shadow-md p-2">
                <textarea ref={textAreaRef} rows={3} className="w-full focus:outline-none resize-none"
                    onChange={
                        (e) => {
                            textAreaVal.current = e.target.value;
                        }
                    }>
                    </textarea>

                <div className="w-full flex justify-end">
                    <button className={` text-white py-1 pl-1 pr-1 flex items-center justify-center w-12 rounded-lg shadow-md transition duration-200 ${buttonClass}`}>
                        <SendHorizontal 
                            onClick={onSendButtonClick}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InputBox;