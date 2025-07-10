"use client";

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Animation duration + delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "splash-screen fixed inset-0 z-[101] flex items-center justify-center transition-all duration-1000 ease-in-out",
        !isLoading && "hidden"
      )}
    >
      <div className="splash-screen-left transition-transform duration-1000 ease-[cubic-bezier(0.87,_0,_0.13,_1)] delay-500"></div>
      <div className="splash-screen-right transition-transform duration-1000 ease-[cubic-bezier(0.87,_0,_0.13,_1)] delay-500"></div>
      
      <Globe 
        className={cn(
          "z-10 text-primary transition-all duration-500 ease-in-out",
          isLoading ? "opacity-100 scale-100" : "opacity-0 scale-125"
        )}
        size={100} 
      />
    </div>
  );
}
