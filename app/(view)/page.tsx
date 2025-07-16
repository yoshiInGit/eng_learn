'use client'

import ContentWrapper from "./module/ContentWrapper";
import AppBar from "./module/AppBar";
import MessageBox from "./module/MessageBox";
import ViewMessage from "../model/ViewMessage";
import InputBox from "./module/InputBox";
import { useEffect, useRef, useState } from "react";
import { askSituation } from "../action/conversation";
import MessagesState from "../action/state/messageState";

export default function Home() {
  // 初期化
  const startFlag = useRef(true);
  useEffect(()=>{
    if(startFlag.current){
      askSituation()
      startFlag.current = false;
    }
  },[])

  // メッセージの状態を管理する
  const [messages, setMessages] = useState<ViewMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // メッセージの状態が変化したときのコールバック関数
    const handleMessagesChange = (messages: ViewMessage[]) => {
      setMessages([...messages]);
      
      // スクロールを最新のメッセージに合わせて自動スクロール
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // メッセージの状態を監視する
    MessagesState.getState().subscribe(handleMessagesChange);

    // クリーンアップ関数
    return () => {
      MessagesState.getState().unsubscribe(handleMessagesChange);
    };
  }, []);



  return (
    <ContentWrapper>
      <AppBar />

      {/* メッセージ一覧 */}
      <div className="flex flex-col relative w-full flex-grow">
          <div ref={scrollRef} className="absolute w-full h-full overflow-y-scroll py-4 px-2 flex flex-col gap-8">
            
              {messages.map((message, index) => (
                <MessageBox key={index} message={message} />
              ))}

            <div key={messages.length} className="block w-full">
              <div className="w-full h-[60vh]"></div>
            </div>
          </div>
        </div>

      {/* 入力ボックス */}
      <InputBox/>

    </ContentWrapper>
  );
}
