"use client";
import { useEffect } from "react";

export const MouseTracker = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Update CSS custom properties for mouse position
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);

      // Create subtle parallax effect by adjusting background positions
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      // Apply subtle movement to background elements
      document.documentElement.style.setProperty('--bg-offset-x', `${deltaX * 20}px`);
      document.documentElement.style.setProperty('--bg-offset-y', `${deltaY * 20}px`);
    };

    const handleMouseLeave = () => {
      // Reset to default positions when mouse leaves
      document.documentElement.style.setProperty('--mouse-x', '50%');
      document.documentElement.style.setProperty('--mouse-y', '50%');
      document.documentElement.style.setProperty('--bg-offset-x', '0px');
      document.documentElement.style.setProperty('--bg-offset-y', '0px');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return null; // This component doesn't render anything
};