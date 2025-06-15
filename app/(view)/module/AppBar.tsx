'use client'

import React, { useEffect } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { ChevronLeft, CircleUser, Menu, RotateCcw } from 'lucide-react';
import { resetConversation } from '@/app/action/conversation';
import { useRouter } from "next/navigation";
import { User } from 'firebase/auth';
import AuthState from '@/app/action/state/authState';
import { AnimatePresence, motion } from 'framer-motion';


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
        { isLogin ??
          <>
          <Menu 
            className='cursor-pointer'
            onClick={() => setIsSidebarOpen(true)}/>

          <div className="w-6"></div>        
          </>
        }
        
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
              className='absolute top-0 bottom-0 left-0 w-[80%] bg-white flex flex-col px-2 py-4'
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}>

              <div className='w-full flex justify-end'>
                <ChevronLeft 
                  className='cursor-pointer'
                  onClick={()=>setIsSidebarOpen(false)}/>
              </div>

            </motion.div>
        </motion.div>}
      </AnimatePresence>
    </>
  );
};

export default AppBar;