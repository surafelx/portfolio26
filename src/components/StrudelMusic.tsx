'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Volume2 } from 'lucide-react';

interface StrudelMusicProps {
  code: string;
  title?: string;
}

export const StrudelMusic = ({ code, title }: StrudelMusicProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(false);
  const [isStrudelLoaded, setIsStrudelLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load Strudel scripts dynamically
    const loadStrudel = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Load Strudel from CDN with all dependencies
          const scripts = [
            'https://cdn.jsdelivr.net/npm/@strudel/web@0.9.0/dist/index.js'
          ];

          for (const src of scripts) {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
              console.log('Strudel script loaded:', src);
              if (src.includes('index.js')) {
                setIsStrudelLoaded(true);
              }
            };
            script.onerror = (e) => {
              console.error('Failed to load Strudel script:', src, e);
            };
            document.head.appendChild(script);
          }
        } catch (error) {
          console.error('Error loading Strudel:', error);
        }
      }
    };

    loadStrudel();
  }, []);

  const initializeAudio = async () => {
    if (typeof window !== 'undefined') {
      try {
        // Initialize audio context if needed
        if ((window as any).AudioContext || (window as any).webkitAudioContext) {
          const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
          const audioContext = new AudioContext();

          // Resume audio context (required by browser security)
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }

          // Initialize Strudel if available
          if ((window as any).strudel && (window as any).strudel.init) {
            await (window as any).strudel.init();
          }
        }
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    }
  };

  const playMusic = async () => {
    if (typeof window !== 'undefined') {
      try {
        // Initialize audio first
        await initializeAudio();

        console.log('Attempting to play Strudel code:', code);
        console.log('Strudel available:', !!(window as any).strudel);

        if ((window as any).strudel) {
          // Stop any existing pattern
          if (isPlayingRef.current && (window as any).strudel.currentPattern) {
            (window as any).strudel.currentPattern.stop();
          }

          try {
            // Try different ways to evaluate Strudel code
            let pattern;
            if ((window as any).strudel.evaluate) {
              pattern = (window as any).strudel.evaluate(code);
            } else if ((window as any).strudel) {
              // Try direct evaluation
              pattern = eval(`(${code})`);
            }

            console.log('Pattern created:', pattern);

            if (pattern && typeof pattern.play === 'function') {
              pattern.play();
              (window as any).strudel.currentPattern = pattern;
              isPlayingRef.current = true;
              setIsPlaying(true);
              console.log('Music started playing');
            } else {
              console.error('Pattern does not have play method:', pattern);
              // Fallback: try basic Web Audio API
              playFallbackTone();
            }
          } catch (evalError) {
            console.error('Error evaluating Strudel code:', evalError);
            // Fallback: try basic Web Audio API
            playFallbackTone();
          }
        } else {
          console.error('Strudel not available, trying fallback');
          playFallbackTone();
        }
      } catch (error) {
        console.error('Error playing music:', error);
        playFallbackTone();
      }
    }
  };

  const playFallbackTone = () => {
    try {
      const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        setIsPlaying(false);
      }, 1000);

      setIsPlaying(true);
      console.log('Playing fallback tone');
    } catch (error) {
      console.error('Fallback tone failed:', error);
    }
  };

  const stopMusic = () => {
    if (typeof window !== 'undefined' && (window as any).strudel) {
      try {
        if ((window as any).strudel.currentPattern) {
          (window as any).strudel.currentPattern.stop();
          isPlayingRef.current = false;
          setIsPlaying(false);
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
        <div className="flex gap-2 items-center">
          <Button
            onClick={playMusic}
            size="sm"
            disabled={!isStrudelLoaded}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Volume2 size={14} /> : <Play size={14} />}
            {isPlaying ? 'Playing' : 'Play'}
          </Button>
          <Button
            onClick={stopMusic}
            size="sm"
            variant="outline"
            disabled={!isPlaying}
            className="flex items-center gap-2"
          >
            <Square size={14} />
            Stop
          </Button>
          {!isStrudelLoaded && (
            <span className="text-xs text-muted-foreground">Loading Strudel...</span>
          )}
        </div>

        <pre className="bg-secondary p-3 rounded text-sm overflow-x-auto font-mono">
          <code>{code}</code>
        </pre>

        {isPlaying && (
          <div className="text-xs text-primary flex items-center gap-2">
            <Volume2 size={12} />
            {isStrudelLoaded ? 'Strudel music playing!' : 'Fallback tone playing!'}
            {!isStrudelLoaded && ' (Strudel not loaded - using basic tone)'}
          </div>
        )}
      </div>

      <div ref={containerRef} className="mt-4 min-h-[100px] bg-secondary/50 rounded p-2">
        {/* Strudel will render audio controls here */}
        {isStrudelLoaded && (
          <div className="text-xs text-muted-foreground">
            Strudel loaded successfully. Click Play to start the music!
          </div>
        )}
      </div>
    </div>
  );
};