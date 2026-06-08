import { useState, useEffect } from "react";

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  width: number;
  height: number;
}

export function useDeviceDetect(): DeviceState {
  const [device, setDevice] = useState<DeviceState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Standard responsive breakpoints
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      // Touch capability check
      const isTouch = 
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;

      setDevice({
        isMobile,
        isTablet,
        isDesktop,
        isTouch,
        width,
        height
      });
    };

    // Initialize values on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
}
