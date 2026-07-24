"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Music2,
  Disc3,
  Flame,
  Radio,
  Play,
  Pause,
  ListMusic,
} from "lucide-react";
import { DeezerPlayerCore, Track } from "./DeezerPlayerCore";

export default function MusicApp() {
  const [query, setQuery] = useState("Daft Punk");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"tracks" | "albums">("tracks");

  // Fetch desde Deezer API vía CORS Proxy libre
  const searchDeezer = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);

    try {
      const targetUrl = `https://api.deezer.com/search?q=${encodeURIComponent(
        searchTerm
      )}`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

      const res = await fetch(proxyUrl);
      const data = await res.json();

      if (data && data.data) {
        setTracks(data.data);
      }
    } catch (err) {
      console.error("Error fetching Deezer tracks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchDeezer("Daft Punk");
  }, [searchDeezer]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchDeezer(query);
  };

  const handleNextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
  };

  // Agrupar por álbumes
  const albumMap = new Map();
  tracks.forEach((track) => {
    if (!albumMap.has(track.album.title)) {
      albumMap.set(track.album.title, {
        title: track.album.title,
        cover: track.album.cover_xl || track.album.cover_medium,
        artist: track.artist.name,
        track: track,
      });
    }
  });
  const albums = Array.from(albumMap.values());

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* TOP HEADER / SEARCH BAR */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl font-bold shadow-lg shadow-emerald-500/20">
            <Radio size={20} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-wide text-white">
              Music Player (DEEZER ENGINE)
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              30s HD previews & Instant Search
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-slate-800/90 border border-slate-700/60 rounded-xl px-3 py-1.5 w-full sm:w-72 focus-within:border-emerald-500 transition"
        >
          <Search size={15} className="text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search artist, song, album..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none"
          />
        </form>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* QUICK GENRE CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["Punk", "Rock", "Argentinian rock", "Blues", "Lofi", "Reggaeton"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  searchDeezer(tag);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  query === tag
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* TABS */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`flex items-center gap-1.5 text-xs font-bold pb-1 transition cursor-pointer ${
              activeTab === "tracks"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Music2 size={14} /> Songs ({tracks.length})
          </button>
          <button
            onClick={() => setActiveTab("albums")}
            className={`flex items-center gap-1.5 text-xs font-bold pb-1 transition cursor-pointer ${
              activeTab === "albums"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Disc3 size={14} /> Albums ({albums.length})
          </button>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Searching Deezer database...</span>
          </div>
        ) : activeTab === "tracks" ? (
          /* SONGS LIST */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tracks.map((track) => {
              const isSelected = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => setCurrentTrack(track)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "bg-slate-800/90 border-emerald-500/80 shadow-md"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative shrink-0">
                      <img
                        src={track.album.cover_medium}
                        alt={track.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center text-white">
                        <Play size={16} fill="white" />
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <h3
                        className={`text-xs font-bold truncate ${
                          isSelected ? "text-emerald-400" : "text-white"
                        }`}
                      >
                        {track.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {track.artist.name}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="text-emerald-400 pr-2">
                      <ListMusic size={16} className="animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* ALBUMS GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentTrack(album.track)}
                className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl hover:bg-slate-800/60 transition cursor-pointer group flex flex-col gap-2"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="bg-emerald-500 p-3 rounded-full text-slate-950 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition">
                      <Play size={18} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate">
                    {album.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {album.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FIXED FOOTER PLAYER */}
      <DeezerPlayerCore
        currentTrack={currentTrack}
        playlist={tracks}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        onSelectTrack={(t) => setCurrentTrack(t)}
      />
    </div>
  );
}