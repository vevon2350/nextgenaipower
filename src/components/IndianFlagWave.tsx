import React from 'react';

export default function IndianFlagWave() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-flag-wave flex flex-col w-32 h-20 rounded-md overflow-hidden shadow-lg border border-slate-700/50">
        <div className="h-1/3 bg-orange-500"></div>
        <div className="h-1/3 bg-white flex justify-center items-center">
            <div className="w-4 h-4 rounded-full border border-blue-800 flex items-center justify-center">
                <div className="w-[1px] h-full bg-blue-800 absolute rotate-0"></div>
                <div className="w-[1px] h-full bg-blue-800 absolute rotate-45"></div>
                <div className="w-[1px] h-full bg-blue-800 absolute rotate-90"></div>
                <div className="w-[1px] h-full bg-blue-800 absolute rotate-[135deg]"></div>
            </div>
        </div>
        <div className="h-1/3 bg-green-600"></div>
      </div>
    </div>
  );
}
