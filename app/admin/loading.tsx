'use client';

import { motion } from 'framer-motion';

export default function AdminLoading() {
  return (
    <div className="flex flex-col space-y-16 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-b border-white/5 pb-16">
        <div className="space-y-4 flex-1">
           <div className="h-2 w-32 bg-white/5 rounded-full" />
           <div className="h-12 w-64 bg-white/10 rounded-2xl" />
           <div className="h-4 w-96 bg-white/5 rounded-full" />
        </div>
        <div className="h-16 w-48 bg-green-500/10 rounded-[2rem] border border-green-500/20" />
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] h-[500px] relative overflow-hidden backdrop-blur-3xl">
         <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
         
         {/* Animated beam to show activity */}
         <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-12"
         />
         
         <div className="p-10 space-y-10">
            <div className="flex justify-between">
               <div className="h-4 w-32 bg-white/10 rounded-full" />
               <div className="h-4 w-64 bg-white/10 rounded-full" />
            </div>
            <div className="space-y-6">
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-white/5 rounded-xl shrink-0" />
                     <div className="flex-1 space-y-2">
                        <div className="h-3 w-48 bg-white/10 rounded-full" />
                        <div className="h-2 w-32 bg-white/5 rounded-full" />
                     </div>
                     <div className="h-6 w-24 bg-white/5 rounded-full" />
                     <div className="h-10 w-10 bg-white/5 rounded-xl" />
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
