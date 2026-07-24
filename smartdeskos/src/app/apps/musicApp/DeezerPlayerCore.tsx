"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Disc,
} from "lucide-react";

export interface Track {
  id: number;
  title: string;
  artist: { name: string };
  album: { title: string; cover_medium: string; cover_xl: string };
  preview: string;
  duration: number;
}

interface DeezerPlayerCoreProps {
  currentTrack: Track | null;
  playlist: Track[];
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSelectTrack: (track: Track) => void;
}

export function DeezerPlayerCore({
  currentTrack,
  playlist,
  onNextTrack,
  onPrevTrack,
  onSelectTrack,
}: DeezerPlayerCoreProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Previews de Deezer duran 30s
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Cargar pista cuando cambia
  useEffect(() => {
    if (!audioRef.current) return;

    if (currentTrack?.preview) {
      audioRef.current.src = currentTrack.preview;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 select-none shrink-0">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNextTrack}
      />

      {/* TRACK INFO */}
      <div className="flex items-center gap-3 w-full sm:w-1/4">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.album.cover_medium}
              alt={currentTrack.title}
              className={`w-12 h-12 rounded-lg object-cover shadow-md ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
            />
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                {currentTrack.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {currentTrack.artist.name}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600">
              <Disc size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">No track selected</p>
              <p className="text-[10px] text-slate-600">Search & play music</p>
            </div>
          </div>
        )}
      </div>

      {/* PLAYER CONTROLS & TIMELINE */}
      <div className="flex flex-col items-center gap-1.5 w-full sm:w-2/4 max-w-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onPrevTrack}
            disabled={!currentTrack}
            className="text-slate-400 hover:text-white transition disabled:opacity-30 cursor-pointer"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={togglePlay}
            disabled={!currentTrack}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2.5 rounded-full transition shadow-lg hover:scale-105 active:scale-95 disabled:opacity-30 cursor-pointer"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>

          <button
            onClick={onNextTrack}
            disabled={!currentTrack}
            className="text-slate-400 hover:text-white transition disabled:opacity-30 cursor-pointer"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* TIME BAR */}
        <div className="flex items-center gap-2 w-full text-[10px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 30}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            disabled={!currentTrack}
            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer disabled:cursor-not-allowed"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* VOLUME CONTROL */}
      <div className="hidden sm:flex items-center justify-end gap-2 w-1/4">
        <button onClick={toggleMute} className="text-slate-400 hover:text-white transition cursor-pointer">
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
}