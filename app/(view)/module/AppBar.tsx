'use client'

import React from 'react';
import ConfirmDialog from './ConfirmDialog';
import { RotateCcw } from 'lucide-react';
import { resetConversation } from '@/app/action/conversation';


const AppBar: React.FC = () => {
  const [isConfirmResetDialogOpen, setIsConfirmResetDialogOpen] = React.useState(false);

  return (
    <>
    <div className="relative top-0 left-0 w-full bg-white text-shadow-gray-700 p-4 shadow-md z-10 flex items-center">
        <h1 className="text-xl font-bold">英会話AI</h1>
        <div className="flex-grow"></div>
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