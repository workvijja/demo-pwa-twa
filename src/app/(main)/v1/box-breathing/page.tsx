'use client';

import { useState, useEffect, useRef } from 'react';

export default function BoxBreathing() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('breathe in');
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(4); // 4 seconds per phase
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const progressRef = useRef<number>(0);

  const phases = [
    { name: 'breathe in', duration: 4 },
    { name: 'hold', duration: 4 },
    { name: 'breathe out', duration: 4 },
    { name: 'hold', duration: 4 },
  ];

  const startBreathing = () => {
    if (isActive) {
      // Stop the animation
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsActive(false);
      return;
    }

    setIsActive(true);
    setPhase(phases[0].name);
    setCount(0);
    startTimeRef.current = Date.now();
    progressRef.current = 0;

    const startCycle = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000; // in seconds
      const totalCycleTime = phases.reduce((sum, p) => sum + p.duration, 0);
      const cycleTime = elapsed % totalCycleTime;

      let timeElapsed = 0;
      let currentPhase = phases[0];
      
      for (const p of phases) {
        if (cycleTime < timeElapsed + p.duration) {
          currentPhase = p;
          break;
        }
        timeElapsed += p.duration;
      }

      setPhase(currentPhase.name);
      setTime(Math.ceil(currentPhase.duration - (cycleTime - timeElapsed)));
      setCount(Math.floor(elapsed / totalCycleTime));
      
      // Update progress for animation
      progressRef.current = ((cycleTime - timeElapsed) / currentPhase.duration) * 100;
      
      // Continue the animation
      animationRef.current = requestAnimationFrame(startCycle);
    };

    animationRef.current = requestAnimationFrame(startCycle);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Calculate circle size based on phase
  const getCircleSize = () => {
    if (phase === 'breathe in') {
      return 100 + (100 - progressRef.current) * 2;
    } else if (phase === 'breathe out') {
      return 100 + progressRef.current * 2;
    }
    return 100;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Box Breathing</h1>
      
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        <div 
          className="absolute rounded-full bg-blue-500 transition-all duration-300 ease-in-out flex items-center justify-center text-white"
          style={{
            width: `${getCircleSize()}%`,
            height: `${getCircleSize()}%`,
            maxWidth: '300px',
            maxHeight: '300px',
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-semibold capitalize">{phase}</div>
            <div className="text-6xl font-bold">{time}</div>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-lg mb-2">Cycle: {count + 1}</p>
        <p className="text-gray-600">
          Follow the animation: Breathe in (4s) → Hold (4s) → Breathe out (4s) → Hold (4s)
        </p>
      </div>

      <button
        onClick={startBreathing}
        className={`px-8 py-3 rounded-full text-white font-semibold transition-colors ${
          isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isActive ? 'Stop' : 'Start'}
      </button>

      <div className="mt-8 p-4 bg-white rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-semibold mb-2">What is Box Breathing?</h2>
        <p className="text-gray-700">
          Box breathing is a simple but powerful technique for reducing stress and improving focus. 
          It involves breathing in for 4 seconds, holding for 4 seconds, breathing out for 4 seconds, 
          and holding again for 4 seconds. This pattern forms a "box" shape when visualized.
        </p>
      </div>
    </div>
  );
}
