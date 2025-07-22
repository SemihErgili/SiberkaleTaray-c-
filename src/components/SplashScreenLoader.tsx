'use client';

import dynamic from 'next/dynamic';

const SplashScreen = dynamic(
  () => import('@/components/ui/splash-screen').then((mod) => mod.SplashScreen),
  { ssr: false }
);

export function SplashScreenLoader() {
  return <SplashScreen />;
}
