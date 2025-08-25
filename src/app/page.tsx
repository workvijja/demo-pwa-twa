"use client"

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
  animate,
  AnimationSequence,
  motion as m,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  useTransform
} from "motion/react";
import type {MotionValue} from "motion/react";

const BREATH_DURATION = 4;

// const BREATH_CYCLES = {
//   inhale: {scale: 1.2, duration: BREATH_DURATION},
//   hold: {scale: 1.2, duration: BREATH_DURATION},
//   exhale: {scale: 0.8, duration: BREATH_DURATION},
//   "hold-exhale": {scale: 0.8, duration: BREATH_DURATION},
// };

const BREATH_CYCLES = ['inhale', 'hold', 'exhale', 'hold-exhale'] as const;

const SCALE_CONFIG = [1.2, 1.2, 0.8, 0.8];

const BREATH_STATES_LABEL = ['Inhale', 'Hold', 'Exhale', 'Hold'] as const;

// type BreathState = typeof BREATH_CYCLES[number];

const Countdown = ({duration, progress}: {duration: number, progress: MotionValue<number>}) => {
  const remainingSeconds = useTransform(progress, (latest) => {
    return Math.ceil(duration - latest * duration)
  })

  return (
    <m.span>{remainingSeconds}</m.span>
  )
}

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [breathStateIndex, setBreathStateIndex] = useState<number>(0);
  const progress = useMotionValue(0);
  const [elScope, animateEl] = useAnimate();

  const startBreathing = () => {
    if (isRunning) return;
    setIsRunning(true);
  };

  const stopBreathing = () => {
    if (!isRunning) return;
    setIsRunning(false);
    progress.set(0);
    animateEl(elScope.current, {scale: 1}, {duration: 0});
    setBreathStateIndex(0);
  };

  const handleAnimationComplete = () => {
    if (!isRunning) return;
    progress.set(0);
    setBreathStateIndex((prev) => (prev + 1) % BREATH_CYCLES.length);
  };

  useEffect(() => {
    if (!isRunning) return;
    const controls = animate(progress, 1, {
      duration: BREATH_DURATION,
      ease: 'linear',
      onComplete: handleAnimationComplete,
    })
    const elControls = animateEl(elScope.current, {scale: SCALE_CONFIG[breathStateIndex]}, {
      duration: BREATH_DURATION,
      ease: 'easeInOut'
    })
    return () => {
      controls.stop();
      elControls.stop();
    }
  }, [isRunning, breathStateIndex]);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8">Breathing Exercise</h1>

        <div className="relative flex justify-center items-center h-64">
          <m.div
            ref={elScope}
            className="w-48 h-48 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl"
            initial={{scale: 1}}
          >
            <div className="text-center">
              <p className="text-2xl font-bold capitalize">{BREATH_STATES_LABEL[breathStateIndex]}</p>
              <p className="text-sm mt-2">Remaining seconds: <Countdown duration={BREATH_DURATION} progress={progress}/></p>
            </div>
          </m.div>
        </div>

        <div className="space-y-4">
          {!isRunning ? (
            <Button
              onClick={startBreathing}
              className="w-full py-6 text-lg"
            >
              Start Breathing
            </Button>
          ) : (
            <Button
              onClick={stopBreathing}
              variant="destructive"
              className="w-full py-6 text-lg"
            >
              Stop
            </Button>
          )}
        </div>

        <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>Breathe in for 4 seconds</p>
          <p>Hold for 4 seconds</p>
          <p>Breathe out for 4 seconds</p>
          <p>Hold for 4 seconds</p>
        </div>
      </div>
    </main>
  );
}
