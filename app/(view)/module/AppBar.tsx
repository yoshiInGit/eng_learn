'use client'

import React, { useEffect } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { ChevronLeft, CircleUser, Ellipsis, LogOut, Menu, RotateCcw, Save } from 'lucide-react';
import { resetConversation } from '@/app/action/conversation';
import { useRouter } from "next/navigation";
import { signOut, User } from 'firebase/auth';
import AuthState from '@/app/action/state/authState';
import { AnimatePresence, motion } from 'framer-motion';
import { auth } from '@/app/lib/firebase';


const AppBar: React.FC = () => {
  const router = useRouter()

  const [isConfirmResetDialogOpen, setIsConfirmResetDialogOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false);

  useEffect(() => {
    const handleAuthStateChange = (user: User | null) => {
      if(user){
        // ユーザーがログインした
        setIsLogin(true);
      }else{
        // ユーザーがログアウトした
        setIsLogin(false);
      }
    }

    AuthState.getState().subscribe(handleAuthStateChange);

    return () => {
      AuthState.getState().unsubscribe(handleAuthStateChange);
    }
  }, []);

  const handleLogout = () => {
    // ログアウト処理を実行
    signOut(auth);
    router.push('/login'); // ログアウト後にログインページへリダイレクト
  } 

  // サイドバーのアニメーション設定
  const sidebarVariants = {
    hidden: { x: '-100%' }, // 隠れている状態 (左に完全にオフセット)
    visible: {
      x: '0%', // 表示されている状態 (元の位置)
      transition: {
        duration: 0.1, // 減衰 (揺れの収まり具合)
      },
    },
    exit: {
      x: '-100%', // 閉じる時のアニメーション (左にスライドアウト)
      transition: {
        duration: 0.1, // 減衰 (揺れの収まり具合)
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };


  return (
    <>
    <div className="relative top-0 left-0 w-full bg-white text-shadow-gray-700 p-4 shadow-md z-10 flex items-center">
        { isLogin === true ?
          <>
          <Menu 
            className='cursor-pointer'
            onClick={() => setIsSidebarOpen(true)}/>

          <div className="w-6"></div>        
          </>
        : null }
        
        <h1 className="text-xl font-bold">英会話AI</h1>
        <div className="flex-grow"></div>

        {/* ログインしていなければログインページへのリンクを表示 */}
        { isLogin === false ?
          <CircleUser className='cursor-pointer'
          onClick={
            () => router.push('/login')
        }/> : null}

        <div className="w-6"></div>
        <RotateCcw className='cursor-pointer'
            onClick={
                () => setIsConfirmResetDialogOpen(true)
            }/>
    </div>

    <ConfirmDialog 
      isOpen={isConfirmResetDialogOpen} 
      onClose={function (): void {
          setIsConfirmResetDialogOpen(false);
        } } 
      onOk={function (): void {
          resetConversation();
          setIsConfirmResetDialogOpen(false);
        } } 
      title={'会話をリセット'}
      message={'会話をリセットしますか？'}
    />

      {/* サイドバー */}
      <AnimatePresence>
        {isSidebarOpen &&
          <motion.div 
            className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-20'
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsSidebarOpen(false)}>
            <motion.div 
              className='absolute top-0 bottom-0 left-0 w-[80%] bg-white flex flex-col py-4'
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}>

              <div className='w-full flex justify-end px-2'>
                <ChevronLeft 
                  className='cursor-pointer'
                  onClick={()=>setIsSidebarOpen(false)}/>
              </div>

              <div
                onClick={handleLogout} 
                className='w-full flex justify-start gap-2 p-2 hover:bg-gray-100 cursor-pointer px-4'>
                  <LogOut />
                  <h2 className='text-lg text-gray-700 font-bold'>ログアウト</h2>
              </div>

              <div className='h-16'/>

              {/* DIvider */}
              <div className='w-full h-[1px] bg-gray-200 my-2'></div>

              <div
                onClick={() => {}}
                className='w-full flex justify-start gap-2 p-2 hover:bg-gray-100 cursor-pointer px-4'>
                  <Save />
                  <h2 className='text-lg text-gray-700 font-bold'>状況を保存する</h2>
              </div>

              <div className='h-8'/>
              <div className='w-full flex justify-start '>
                <h2 className='text-sm text-gray-700 font-bold px-4'>保存した状況</h2>
              </div>

              <div
                onClick={() => {}}
                className='w-full flex justify-start gap-2 p-4 hover:bg-gray-100 cursor-pointer px-4'>
                  <h2 className=' text-gray-700 font-bold'>空港の保安検査</h2>
                  <div className='flex-grow'></div>
                  <Ellipsis />
              </div>


            </motion.div>
        </motion.div>}
      </AnimatePresence>
    </>
  );
};

export default AppBar;