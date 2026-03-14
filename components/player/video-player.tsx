"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SPEEDS = [0.5, 1, 1.25, 1.5, 2] as const;

type VideoPlayerProps = {
  src: string;
  duration: number;
  initialPositionSeconds?: number;
  onPositionChange?: (seconds: number) => void;
  onComplete?: () => void;
  className?: string;
};

export function VideoPlayer({
  src,
  duration,
  initialPositionSeconds = 0,
  onPositionChange,
  onComplete,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [completedFired, setCompletedFired] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const video = videoRef.current;

  const savePosition = useCallback(
    (seconds: number) => {
      onPositionChange?.(seconds);
    },
    [onPositionChange],
  );

  const debouncedSave = useCallback(
    (seconds: number) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => savePosition(seconds), 800);
    },
    [savePosition],
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!video) return;
    video.currentTime = Math.min(initialPositionSeconds, duration);
    setCurrentTime(video.currentTime);
  }, [video, initialPositionSeconds, duration]);

  useEffect(() => {
    if (!video) return;
    video.playbackRate = speed;
  }, [video, speed]);

  useEffect(() => {
    if (!video) return;
    video.volume = muted ? 0 : volume;
  }, [video, volume, muted]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    setCurrentTime(t);
    debouncedSave(Math.floor(t));

    if (duration > 0 && t >= duration * 0.75 && !completedFired) {
      setCompletedFired(true);
      onComplete?.();
    }
  };

  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const cycleSpeed = () => {
    const i = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
    const next = SPEEDS[(i + 1) % SPEEDS.length];
    setSpeed(next);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const p = Number(e.target.value);
    v.currentTime = p;
    setCurrentTime(p);
    savePosition(Math.floor(p));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full"
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
        playsInline
      />

      <div className="bg-neutral-900/95 px-3 py-2">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={1}
          value={currentTime}
          onChange={handleSeek}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-sky-500"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <span className="text-xs text-white/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={cycleSpeed}
              className="rounded-lg px-2 py-1.5 text-xs font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              {speed}x
            </button>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setMuted(Number(e.target.value) === 0);
              }}
              className="w-16 accent-sky-500"
            />
            <button
              type="button"
              onClick={toggleFullscreen}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
