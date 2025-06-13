'use client'

import React from 'react';
import ConfirmDialog from './ConfirmDialog';
import { CircleUser, RotateCcw } from 'lucide-react';
import { resetConversation } from '@/app/action/conversation';
import { useRouter } from "next/navigation";


const AppBar: React.FC = () => {
  const router = useRouter()

  const [isConfirmResetDialogOpen, setIsConfirmResetDialogOpen] = React.useState(false);

  return (
    <>
    <div className="relative top-0 left-0 w-full bg-white text-shadow-gray-700 p-4 shadow-md z-10 flex items-center">
        <h1 className="text-xl font-bold">英会話AI</h1>
        <div className="flex-grow"></div>

        <CircleUser className='cursor-pointer'
          onClick={
            () => router.push('/login')
          }/>
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
    </>
  );
};

export default AppBar;