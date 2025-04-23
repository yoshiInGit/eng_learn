import React from 'react';

 interface Props {
  size?: 'sm' | 'md' | 'lg';
 }

 const LoadingSpinner: React.FC<Props> = ({ size = 'md' }) => {
  const getSizeClass = () => {
  switch (size) {
  case 'sm':
  return 'w-4 h-4';
  case 'md':
  return 'w-6 h-6';
  case 'lg':
  return 'w-8 h-8';
  default:
  return 'w-6 h-6';
  }
  };

  return (
  <div className={`animate-spin rounded-full border-t-2 border-gray-600 border-solid  ${getSizeClass()}`}></div>
  );
 };

 export default LoadingSpinner;
