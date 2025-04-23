import React, { useCallback } from 'react';

 interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  title?: string;
  message: string;
 }

 const ConfirmDialog: React.FC<Props> = ({ isOpen, onClose, onOk, title = '確認', message }) => {
  const handleOk = useCallback(() => {
   onOk();
   onClose();
  }, [onOk, onClose]);

  const handleCancel = useCallback(() => {
   onClose();
  }, [onClose]);

  if (!isOpen) {
   return null;
  }

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
     <h2 className="text-lg font-semibold mb-4">{title}</h2>
     <p className="mb-4">{message}</p>
     <div className="flex justify-end">
      <button
       className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 cursor-pointer"
       onClick={handleCancel}
      >
       キャンセル
      </button>
      <button 
       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
       onClick={handleOk}
      >
       OK
      </button>
     </div>
    </div>
   </div>
  );
 };

 export default ConfirmDialog;