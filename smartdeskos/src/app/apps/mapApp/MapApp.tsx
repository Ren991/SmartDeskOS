"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Car,
  Bike,
  Footprints,
  Navigation,
  MapPin,
  Clock,
  Route as RouteIcon,
  Sun,
  Moon,
} from "lucide-react";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

type TravelMode = "driving" | "bike" | "foot";

export default function MapApp() {
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");

  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);

  const [originSuggestions, setOriginSuggestions] = useState<SearchResult[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<SearchResult[]>([]);

  const [activeSearch, setActiveSearch] = useState<"origin" | "dest" | null>(null);

  const [travelMode, setTravelMode] = useState<TravelMode>("driving");
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);

  const [loadingRoute, setLoadingRoute] = useState(false);

  // ☀️/🌙 Map Theme State (Default: Light Mode)
  const [isDarkMode, setIsDarkMode] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // Tile Layer URLs (CartoDB Light / Dark Matter)
  const LIGHT_TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const DARK_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current!).setView([-32.9468, -60.6393], 12);

      // Default Tile Layer (Light)
      const initialTileLayer = L.tileLayer(LIGHT_TILE_URL, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = initialTileLayer;
      mapInstanceRef.current = map;
      routeLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Map Theme (Light <-> Dark)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    import("leaflet").then((L) => {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);

      const newTileUrl = isDarkMode ? DARK_TILE_URL : LIGHT_TILE_URL;
      const newTileLayer = L.tileLayer(newTileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = newTileLayer;
    });
  }, [isDarkMode]);

  // Autocomplete Origin Search
  useEffect(() => {
    if (originText.trim().length < 3 || activeSearch !== "origin") {
      setOriginSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            originText
          )}&limit=4`
        );
        const data = await res.json();
        setOriginSuggestions(data);
      } catch (e) {
        console.error(e);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [originText, activeSearch]);

  // Autocomplete Destination Search
  useEffect(() => {
    if (destinationText.trim().length < 3 || activeSearch !== "dest") {
      setDestSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            destinationText
          )}&limit=4`
        );
        const data = await res.json();
        setDestSuggestions(data);
      } catch (e) {
        console.error(e);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [destinationText, activeSearch]);

  // Fetch Route from OSRM Routing Engine
  const calculateRoute = async () => {
    if (!originCoords || !destinationCoords) return;

    setLoadingRoute(true);
    try {
      const profile = travelMode === "bike" ? "biking" : travelMode === "foot" ? "foot" : "driving";
      const url = `https://router.project-osrm.org/route/v1/${profile}/${originCoords[1]},${originCoords[0]};${destinationCoords[1]},${destinationCoords[0]}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        setRouteGeometry(coords);

        const distKm = (route.distance / 1000).toFixed(1);
        const minutes = Math.round(route.duration / 60);
        let timeStr = `${minutes} min`;
        if (minutes >= 60) {
          const hrs = Math.floor(minutes / 60);
          const mins = minutes % 60;
          timeStr = `${hrs} h ${mins} min`;
        }

        setRouteInfo({ distance: `${distKm} km`, duration: timeStr });
      }
    } catch (err) {
      console.error("Error calculating route", err);
    } finally {
      setLoadingRoute(false);
    }
  };

  useEffect(() => {
    if (originCoords && destinationCoords) {
      calculateRoute();
    }
  }, [travelMode, originCoords, destinationCoords]);

  // Render Markers and Polyline Route on Leaflet Map
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      routeLayerRef.current.clearLayers();
      markersLayerRef.current.clearLayers();

      const bounds: [number, number][] = [];

      if (originCoords) {
        const originMarker = L.circleMarker(originCoords, {
          radius: 8,
          fillColor: "#10b981", // Emerald
          color: "#ffffff",
          weight: 2,
          fillOpacity: 1,
        }).bindPopup("<b>Origin</b>");
        markersLayerRef.current.addLayer(originMarker);
        bounds.push(originCoords);
      }

      if (destinationCoords) {
        const destMarker = L.circleMarker(destinationCoords, {
          radius: 8,
          fillColor: "#f43f5e", // Rose
          color: "#ffffff",
          weight: 2,
          fillOpacity: 1,
        }).bindPopup("<b>Destination</b>");
        markersLayerRef.current.addLayer(destMarker);
        bounds.push(destinationCoords);
      }

      if (routeGeometry.length > 0) {
        const polyline = L.polyline(routeGeometry, {
          color: "#2563eb", // Bright Blue
          weight: 5,
          opacity: 0.85,
        });
        routeLayerRef.current.addLayer(polyline);
      }

      if (bounds.length > 0) {
        if (bounds.length === 1) {
          mapInstanceRef.current.setView(bounds[0], 13);
        } else {
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    });
  }, [routeGeometry, originCoords, destinationCoords]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-zinc-950 text-white font-sans overflow-hidden">
      {/* Left Sidebar: Controls & Search */}
      <div className="w-full md:w-80 bg-zinc-900 border-r border-white/10 p-4 flex flex-col gap-4 z-10 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <RouteIcon className="text-blue-400" size={22} />
          <h2 className="font-bold text-base tracking-tight">Maps & Directions 🗺️</h2>
        </div>

        {/* Travel Mode Selector */}
        <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setTravelMode("driving")}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs transition-all ${
              travelMode === "driving"
                ? "bg-blue-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Car"
          >
            <Car size={16} />
            <span className="text-[10px] mt-1 font-medium">Car</span>
          </button>

          <button
            onClick={() => setTravelMode("driving")}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs transition-all ${
              travelMode === "driving"
                ? "bg-blue-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Motorcycle"
          >
            <span className="text-sm">🏍️</span>
            <span className="text-[10px] mt-1 font-medium">Moto</span>
          </button>

          <button
            onClick={() => setTravelMode("bike")}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs transition-all ${
              travelMode === "bike"
                ? "bg-blue-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Bicycle"
          >
            <Bike size={16} />
            <span className="text-[10px] mt-1 font-medium">Bicycle</span>
          </button>

          <button
            onClick={() => setTravelMode("foot")}
            className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs transition-all ${
              travelMode === "foot"
                ? "bg-blue-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Walking"
          >
            <Footprints size={16} />
            <span className="text-[10px] mt-1 font-medium">Walking</span>
          </button>
        </div>

        {/* Search Inputs */}
        <div className="flex flex-col gap-3 relative">
          {/* Origin Input */}
          <div className="relative">
            <label className="text-[10px] text-zinc-400 uppercase font-semibold mb-1 block">
              Origin 🟢
            </label>
            <div className="flex items-center bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 focus-within:border-blue-500">
              <MapPin size={14} className="text-emerald-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search origin (e.g. New York)..."
                value={originText}
                onChange={(e) => {
                  setOriginText(e.target.value);
                  setActiveSearch("origin");
                }}
                className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
              />
            </div>

            {activeSearch === "origin" && originSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-40 overflow-y-auto">
                {originSuggestions.map((item) => (
                  <button
                    key={item.place_id}
                    onClick={() => {
                      setOriginCoords([parseFloat(item.lat), parseFloat(item.lon)]);
                      setOriginText(item.display_name.split(",")[0]);
                      setActiveSearch(null);
                    }}
                    className="w-full text-left px-3 py-2 text-[11px] text-zinc-300 hover:bg-white/10 truncate border-b border-white/5 last:border-none"
                  >
                    {item.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination Input */}
          <div className="relative">
            <label className="text-[10px] text-zinc-400 uppercase font-semibold mb-1 block">
              Destination 🔴
            </label>
            <div className="flex items-center bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 focus-within:border-blue-500">
              <Navigation size={14} className="text-rose-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search destination (e.g. Boston)..."
                value={destinationText}
                onChange={(e) => {
                  setDestinationText(e.target.value);
                  setActiveSearch("dest");
                }}
                className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
              />
            </div>

            {activeSearch === "dest" && destSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-40 overflow-y-auto">
                {destSuggestions.map((item) => (
                  <button
                    key={item.place_id}
                    onClick={() => {
                      setDestinationCoords([
                        parseFloat(item.lat),
                        parseFloat(item.lon),
                      ]);
                      setDestinationText(item.display_name.split(",")[0]);
                      setActiveSearch(null);
                    }}
                    className="w-full text-left px-3 py-2 text-[11px] text-zinc-300 hover:bg-white/10 truncate border-b border-white/5 last:border-none"
                  >
                    {item.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Route Info */}
        {loadingRoute && (
          <div className="text-center py-4 text-xs text-zinc-400 animate-pulse">
            Calculating best route 🚀...
          </div>
        )}

        {routeInfo && !loadingRoute && (
          <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-around">
            <div className="text-center">
              <span className="text-[10px] text-zinc-400 block uppercase">Estimated Time</span>
              <span className="text-sm font-bold text-blue-400 flex items-center gap-1 justify-center">
                <Clock size={12} /> {routeInfo.duration}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="text-[10px] text-zinc-400 block uppercase">Distance</span>
              <span className="text-sm font-bold text-zinc-200">
                {routeInfo.distance}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map Canvas */}
      <div className="flex-1 h-full bg-zinc-100 relative">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* 🚀 TOP RIGHT: Light / Dark Mode Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-4 right-4 z-[500] bg-zinc-900/90 hover:bg-zinc-900 text-white backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 shadow-xl flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Toggle Light/Dark Map Theme"
        >
          {isDarkMode ? (
            <>
              <Sun size={15} className="text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={15} className="text-blue-400" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Floating Credit Badge */}
        <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-zinc-400 z-10">
          SmartDesk Maps 📍 OpenStreetMap & OSRM
        </div>
      </div>
    </div>
  );
}