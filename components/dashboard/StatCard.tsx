'use client';

// Reusable metric component for the user dashboard displaying numeric representations clearly
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCardSkeleton() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-neutral-800 rounded" />
        <div className="h-9 w-9 bg-neutral-800 rounded-lg" />
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div className="h-8 w-16 bg-neutral-800 rounded" />
        <div className="h-6 w-12 bg-neutral-800 rounded" />
      </div>
    </div>
  );
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm hover:border-neutral-700 transition-colors flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
        {icon && <div className="text-neutral-500 bg-neutral-950 p-2 rounded-lg">{icon}</div>}
      </div>
      
      <div className="flex items-end justify-between mt-auto">
        <div className="text-3xl font-bold text-white tracking-tight leading-none">{value}</div>
        
        {trend && (
           <div className={`text-sm font-medium ${trend.positive ? 'text-green-400' : 'text-neutral-400'} flex items-center bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800`}>
             {trend.positive ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
               </svg>
             ) : null}
             {trend.value}
           </div>
        )}
      </div>
    </div>
  );
}
