import React from 'react';
import { motion } from 'motion/react';
import IndianFlagWave from './IndianFlagWave';

export default function Welcome({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
      {/* Background aurora effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-950/40 rounded-full blur-[80px] animate-vibe-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-blue-950/30 rounded-full blur-[60px] animate-vibe-slow" style={{ animationDelay: '-6s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center px-6"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-300 to-emerald-300 tracking-tight mb-6">
          Welcome Vevon
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 font-sans max-w-lg mx-auto leading-relaxed">
          Experience the next generation of AI-driven creative workflows, powered by advanced reasoning and real-time intelligence.
        </p>
        
        <button 
          onClick={onEnter}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-sans font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 mb-8"
        >
          Begin Journey
        </button>

        <div className="mt-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <p className="text-sm text-slate-300 font-mono">
            🌍 FIFA 2026 Wave Incoming
          </p>
          <IndianFlagWave />
        </div>
      </motion.div>
    </div>
  );
}
