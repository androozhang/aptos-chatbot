import React from 'react';
 
const LoadingSpinner = () => {
  return (
    <div className="flex items-center gap-2 p-2">
      <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-white rounded-full"/>
      <span className="text-gray-400 text-sm animate-pulse">Assistant is thinking...</span>
    </div>
  );
};

export default LoadingSpinner;