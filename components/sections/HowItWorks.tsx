'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const steps = [
  {
    number: '01',
    title: 'Subscribe',
    description: 'Choose between a monthly or yearly plan and start your journey with a charity you believe in.',
  },
  {
    number: '02',
    title: 'Enter Scores',
    description: 'Update your last 5 Stableford scores through your personalized dashboard to remain eligible.',
  },
  {
    number: '03',
    title: 'Win & Give',
    description: 'The monthly draw uses your scores to find winners. A portion of every sub goes directly to your charity.',
  },
];

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative min-h-screen w-full flex items-center px-6 md:px-24 overflow-hidden scroll-mt-24">
      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Content */}
        <div className="flex flex-col justify-center space-y-12">
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-green-500 font-black uppercase tracking-[0.3em] text-sm mb-4">How it works</h2>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
              Simple. Fair. <br />
              <span className="text-neutral-500">Rewarding.</span>
            </h1>
          </motion.div>

          {/* Numbered Steps */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2 + i * 0.15,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="group flex gap-6 items-start"
              >
                <div className="relative flex-shrink-0">
                  <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-900 to-transparent leading-none select-none tracking-tighter transition-all duration-700 group-hover:from-green-500/30">
                    {step.number}
                  </span>
                </div>
                <div className="space-y-1 md:space-y-2 pt-2 md:pt-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-neutral-400 text-sm md:text-lg max-w-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Empty (Ball placeholder) */}
        <div className="hidden md:block pointer-events-none" aria-hidden="true" />
      </div>
    </section>
  );
}
