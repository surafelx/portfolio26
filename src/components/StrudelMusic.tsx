'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';

interface StrudelMusicProps {
  code: string;
  title?: string;
}

export const StrudelMusic = ({ code, title }: StrudelMusicProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Load Strudel scripts dynamically
    const loadStrudel = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Load Strudel from CDN
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@strudel/web@0.9.0/dist/index.js';
          script.onload = () => {
            console.log('Strudel loaded successfully');
          };
          script.onerror = () => {
            console.error('Failed to load Strudel');
          };
          document.head.appendChild(script);
        } catch (error) {
          console.error('Error loading Strudel:', error);
        }
      }
    };

    loadStrudel();
  }, []);

  const playMusic = () => {
    if (typeof window !== 'undefined' && (window as any).strudel) {
      try {
        // Stop any existing pattern
        if (isPlayingRef.current && (window as any).strudel.currentPattern) {
          (window as any).strudel.currentPattern.stop();
        }

        // Evaluate and play the Strudel code
        const pattern = (window as any).strudel.evaluate(code);
        pattern.play();
        (window as any).strudel.currentPattern = pattern;
        isPlayingRef.current = true;
      } catch (error) {
        console.error('Error playing Strudel music:', error);
      }
    }
  };

  const stopMusic = () => {
    if (typeof window !== 'undefined' && (window as any).strudel) {
      try {
        if ((window as any).strudel.currentPattern) {
          (window as any).strudel.currentPattern.stop();
          isPlayingRef.current = false;
        }
      } catch (error) {
        console.error('Error stopping Strudel music:', error);
      }
    }
  };

  return (
    <div className="terminal-border bg-secondary/30 p-4 mb-6">
      {title && (
        <h3 className="text-lg font-medium mb-3 text-primary">{title}</h3>
      )}

      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={playMusic}
            size="sm"
            className="flex items-center gap-2"
          >
            <Play size={14} />
            Play
          </Button>
          <Button
            onClick={stopMusic}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Square size={14} />
            Stop
          </Button>
        </div>

        <pre className="bg-secondary p-3 rounded text-sm overflow-x-auto font-mono">
          <code>{code}</code>
        </pre>
      </div>

      <div ref={containerRef} className="mt-4 min-h-[100px] bg-secondary/50 rounded p-2">
        {/* Strudel will render audio controls here */}
      </div>
    </div>
  );
};