"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Globe,
  Sun,
  Moon,
  Building2,
  Search,
  X,
  Compass,
} from "lucide-react";

// --- DATA INTERFACE ---
interface CountryData {
  id: string;
  name: string;
  capital: string;
  continent: string;
  flag: string;
  lat: number;
  lng: number;
  timezone: string;
}

// 🌐 STATIC LOCAL DATABASE
const STATIC_COUNTRIES_DATABASE: CountryData[] = [
  // --- SOUTH AMERICA ---
  { id: "ar", name: "Argentina", capital: "Buenos Aires", continent: "Americas", flag: "🇦🇷", lat: -34.6037, lng: -58.3816, timezone: "America/Argentina/Buenos_Aires" },
  { id: "br", name: "Brazil", capital: "Brasilia", continent: "Americas", flag: "🇧🇷", lat: -15.7975, lng: -47.8919, timezone: "America/Sao_Paulo" },
  { id: "cl", name: "Chile", capital: "Santiago", continent: "Americas", flag: "🇨🇱", lat: -33.4489, lng: -70.6693, timezone: "America/Santiago" },
  { id: "co", name: "Colombia", capital: "Bogota", continent: "Americas", flag: "🇨🇴", lat: 4.711, lng: -74.0721, timezone: "America/Bogota" },
  { id: "pe", name: "Peru", capital: "Lima", continent: "Americas", flag: "🇵🇪", lat: -12.0464, lng: -77.0428, timezone: "America/Lima" },
  { id: "uy", name: "Uruguay", capital: "Montevideo", continent: "Americas", flag: "🇺🇾", lat: -34.9011, lng: -56.1645, timezone: "America/Montevideo" },
  { id: "py", name: "Paraguay", capital: "Asuncion", continent: "Americas", flag: "🇵🇾", lat: -25.2637, lng: -57.5759, timezone: "America/Asuncion" },
  { id: "bo", name: "Bolivia", capital: "La Paz", continent: "Americas", flag: "🇧🇴", lat: -16.4897, lng: -68.1193, timezone: "America/La_Paz" },
  { id: "ec", name: "Ecuador", capital: "Quito", continent: "Americas", flag: "🇪🇨", lat: -0.1807, lng: -78.4678, timezone: "America/Guayaquil" },
  { id: "ve", name: "Venezuela", capital: "Caracas", continent: "Americas", flag: "🇻🇪", lat: 10.4806, lng: -66.9036, timezone: "America/Caracas" },

  // --- NORTH & CENTRAL AMERICA ---
  { id: "us", name: "United States", capital: "Washington D.C.", continent: "Americas", flag: "🇺🇸", lat: 38.9072, lng: -77.0369, timezone: "America/New_York" },
  { id: "mx", name: "Mexico", capital: "Mexico City", continent: "Americas", flag: "🇲🇽", lat: 19.4326, lng: -99.1332, timezone: "America/Mexico_City" },
  { id: "ca", name: "Canada", capital: "Ottawa", continent: "Americas", flag: "🇨🇦", lat: 45.4215, lng: -75.6972, timezone: "America/Toronto" },
  { id: "cr", name: "Costa Rica", capital: "San Jose", continent: "Americas", flag: "🇨🇷", lat: 9.9281, lng: -84.0907, timezone: "America/Costa_Rica" },
  { id: "pa", name: "Panama", capital: "Panama City", continent: "Americas", flag: "🇵🇦", lat: 8.9824, lng: -79.5199, timezone: "America/Panama" },
  { id: "do", name: "Dominican Rep.", capital: "Santo Domingo", continent: "Americas", flag: "🇩🇴", lat: 18.4861, lng: -69.9312, timezone: "America/Santo_Domingo" },
  { id: "cu", name: "Cuba", capital: "Havana", continent: "Americas", flag: "🇨🇺", lat: 23.1136, lng: -82.3666, timezone: "America/Havana" },

  // --- EUROPE ---
  { id: "gb", name: "United Kingdom", capital: "London", continent: "Europe", flag: "🇬🇧", lat: 51.5074, lng: -0.1278, timezone: "Europe/London" },
  { id: "es", name: "Spain", capital: "Madrid", continent: "Europe", flag: "🇪🇸", lat: 40.4168, lng: -3.7038, timezone: "Europe/Madrid" },
  { id: "fr", name: "France", capital: "Paris", continent: "Europe", flag: "🇫🇷", lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris" },
  { id: "de", name: "Germany", capital: "Berlin", continent: "Europe", flag: "🇩🇪", lat: 52.52, lng: 13.405, timezone: "Europe/Berlin" },
  { id: "it", name: "Italy", capital: "Rome", continent: "Europe", flag: "🇮🇹", lat: 41.9028, lng: 12.4964, timezone: "Europe/Rome" },
  { id: "pt", name: "Portugal", capital: "Lisbon", continent: "Europe", flag: "🇵🇹", lat: 38.7223, lng: -9.1393, timezone: "Europe/Lisbon" },
  { id: "nl", name: "Netherlands", capital: "Amsterdam", continent: "Europe", flag: "🇳🇱", lat: 52.3676, lng: 4.9041, timezone: "Europe/Amsterdam" },
  { id: "ch", name: "Switzerland", capital: "Bern", continent: "Europe", flag: "🇨🇭", lat: 46.948, lng: 7.4474, timezone: "Europe/Zurich" },
  { id: "ru", name: "Russia", capital: "Moscow", continent: "Europe", flag: "🇷🇺", lat: 55.7558, lng: 37.6173, timezone: "Europe/Moscow" },
  { id: "gr", name: "Greece", capital: "Athens", continent: "Europe", flag: "🇬🇷", lat: 37.9838, lng: 23.7275, timezone: "Europe/Athens" },
  { id: "se", name: "Sweden", capital: "Stockholm", continent: "Europe", flag: "🇸🇪", lat: 59.3293, lng: 18.0686, timezone: "Europe/Stockholm" },

  // --- ASIA ---
  { id: "jp", name: "Japan", capital: "Tokyo", continent: "Asia", flag: "🇯🇵", lat: 35.6762, lng: 139.6503, timezone: "Asia/Tokyo" },
  { id: "cn", name: "China", capital: "Beijing", continent: "Asia", flag: "🇨🇳", lat: 39.9042, lng: 116.4074, timezone: "Asia/Shanghai" },
  { id: "in", name: "India", capital: "New Delhi", continent: "Asia", flag: "🇮🇳", lat: 28.6139, lng: 77.209, timezone: "Asia/Kolkata" },
  { id: "kr", name: "South Korea", capital: "Seoul", continent: "Asia", flag: "🇰🇷", lat: 37.5665, lng: 126.978, timezone: "Asia/Seoul" },
  { id: "ae", name: "United Arab Emirates", capital: "Abu Dhabi", continent: "Asia", flag: "🇦🇪", lat: 24.4539, lng: 54.3773, timezone: "Asia/Dubai" },
  { id: "sg", name: "Singapore", capital: "Singapore", continent: "Asia", flag: "🇸🇬", lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore" },
  { id: "th", name: "Thailand", capital: "Bangkok", continent: "Asia", flag: "🇹🇭", lat: 13.7563, lng: 100.5018, timezone: "Asia/Bangkok" },
  { id: "il", name: "Israel", capital: "Jerusalem", continent: "Asia", flag: "🇮🇱", lat: 31.7683, lng: 35.2137, timezone: "Asia/Jerusalem" },
  { id: "id", name: "Indonesia", capital: "Jakarta", continent: "Asia", flag: "🇮🇩", lat: -6.2088, lng: 106.8456, timezone: "Asia/Jakarta" },

  // --- AFRICA ---
  { id: "eg", name: "Egypt", capital: "Cairo", continent: "Africa", flag: "🇪🇬", lat: 30.0444, lng: 31.2357, timezone: "Africa/Cairo" },
  { id: "za", name: "South Africa", capital: "Pretoria", continent: "Africa", flag: "🇿🇦", lat: -25.7479, lng: 28.2293, timezone: "Africa/Johannesburg" },
  { id: "ng", name: "Nigeria", capital: "Abuja", continent: "Africa", flag: "🇳🇬", lat: 9.0765, lng: 7.3986, timezone: "Africa/Lagos" },
  { id: "ma", name: "Morocco", capital: "Rabat", continent: "Africa", flag: "🇲🇦", lat: 34.0209, lng: -6.8416, timezone: "Africa/Casablanca" },
  { id: "ke", name: "Kenya", capital: "Nairobi", continent: "Africa", flag: "🇰🇪", lat: -1.2921, lng: 36.8219, timezone: "Africa/Nairobi" },

  // --- OCEANIA ---
  { id: "au", name: "Australia", capital: "Canberra", continent: "Oceania", flag: "🇦🇺", lat: -35.2809, lng: 149.13, timezone: "Australia/Sydney" },
  { id: "nz", name: "New Zealand", capital: "Wellington", continent: "Oceania", flag: "🇳🇿", lat: -41.2865, lng: 174.7762, timezone: "Pacific/Auckland" },
  { id: "fj", name: "Fiji", capital: "Suva", continent: "Oceania", flag: "🇫🇯", lat: -18.1248, lng: 178.4501, timezone: "Pacific/Fiji" },
];

// --- LEAFLET MAP COMPONENT ---
function LeafletMapCore({
  countries,
  selectedIds,
  activeId,
  time,
  onSelectCountry,
  onDeselect,
}: {
  countries: CountryData[];
  selectedIds: string[];
  activeId: string | null;
  time: Date;
  onSelectCountry: (c: CountryData) => void;
  onDeselect: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);

  const onDeselectRef = useRef(onDeselect);
  useEffect(() => {
    onDeselectRef.current = onDeselect;
  }, [onDeselect]);

  useEffect(() => {
    let isMounted = true;
    import("leaflet").then((leaflet) => {
      if (!isMounted) return;
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      setL(leaflet.default || leaflet);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Map Initialization
  useEffect(() => {
    if (!L || !containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: true,
      closePopupOnClick: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    map.on("click", () => {
      if (onDeselectRef.current) {
        onDeselectRef.current();
      }
    });

    mapRef.current = map;
    markersGroupRef.current = L.layerGroup().addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [L]);

  // Render Map Markers (HH:MM without seconds)
  useEffect(() => {
    if (!L || !mapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    countries.forEach((country) => {
      const isSelected = selectedIds.includes(country.id);
      const isActive = activeId === country.id;

      let currentTime = "--:--";
      try {
        currentTime = new Intl.DateTimeFormat("en-US", {
          timeZone: country.timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(time);
      } catch {
        currentTime = "--:--";
      }

      let pinColor = "#94a3b8"; 
      if (isActive) pinColor = "#10b981"; 
      else if (isSelected) pinColor = "#3b82f6"; 

      const size = isActive ? 18 : isSelected ? 14 : 10;

      const customIcon = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
            ${
              isActive
                ? `<div style="position: absolute; width: 28px; height: 28px; background: ${pinColor}; border-radius: 50%; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : ""
            }
            <div style="width: ${size}px; height: ${size}px; background: ${pinColor}; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); z-index: 10;"></div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([country.lat, country.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; text-align: center; min-width: 110px;">
          <div style="font-size: 18px; margin-bottom: 2px;">${country.flag}</div>
          <div style="font-size: 12px; font-weight: 800; color: #0f172a;">${country.name}</div>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">${country.capital}</div>
          <div style="font-family: 'VT323', monospace; font-size: 22px; font-weight: bold; background: #0f172a; color: #38bdf8; border-radius: 6px; padding: 2px 8px;">
            ${currentTime}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        autoClose: true,
        closeOnClick: true,
        offset: [0, -8],
      });

      marker.on("click", (e: any) => {
        L.DomEvent.stopPropagation(e);
        onSelectCountry(country);
        mapRef.current?.flyTo([country.lat, country.lng], 4, { duration: 1 });
      });

      markersGroupRef.current.addLayer(marker);

      if (isActive) {
        marker.openPopup();
      }
    });
  }, [L, countries, selectedIds, activeId, time, onSelectCountry]);

  useEffect(() => {
    if (!mapRef.current || !activeId) return;
    const target = countries.find((c) => c.id === activeId);
    if (target) {
      mapRef.current.flyTo([target.lat, target.lng], 4, { duration: 1.2 });
    }
  }, [activeId, countries]);

  return <div ref={containerRef} className="w-full h-full z-0" />;
}

// --- MAIN COMPONENT ---
export default function WorldClockApp() {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [time, setTime] = useState<Date | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(["ar", "us", "gb", "jp"]);
  const [activeId, setActiveId] = useState<string | null>("ar");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);

  const handleDeselect = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleSelectCountry = useCallback((c: CountryData) => {
    setActiveId(c.id);
  }, []);

  // Update clock every 10 seconds (prevents unnecessary re-renders)
  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  // Static Load & Fallback
  useEffect(() => {
    setCountries(STATIC_COUNTRIES_DATABASE);

    async function fetchCountriesFallback() {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,cca2,region,latlng,timezones,flag,capitalInfo"
        );
        if (!res.ok) return;
        const data = await res.json();

        const formatted: CountryData[] = data
          .filter(
            (c: any) =>
              c.latlng &&
              c.latlng.length === 2 &&
              c.capital &&
              c.capital.length > 0
          )
          .map((c: any) => ({
            id: c.cca2.toLowerCase(),
            name: c.name.common,
            capital: c.capital[0],
            continent: c.region || "Other",
            flag: c.flag || "🌐",
            lat: c.capitalInfo?.latlng?.[0] ?? c.latlng[0],
            lng: c.capitalInfo?.latlng?.[1] ?? c.latlng[1],
            timezone: c.timezones?.[0] || "UTC",
          }))
          .sort((a: CountryData, b: CountryData) =>
            a.name.localeCompare(b.name)
          );

        if (formatted.length > 0) {
          setCountries(formatted);
        }
      } catch {
        // Keeps static dataset fallback
      }
    }

    fetchCountriesFallback();
  }, []);

  // Formats time in HH:MM (NO SECONDS)
  const formatDigitalTime = (date: Date, timeZone: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    } catch {
      return "--:--";
    }
  };

  const getDayNightInfo = (date: Date, timeZone: string) => {
    try {
      const hourStr = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        hour12: false,
      }).format(date);
      const hour = parseInt(hourStr, 10);
      return { isDay: hour >= 6 && hour < 19 };
    } catch {
      return { isDay: true };
    }
  };

  const getTimeDifference = (date: Date, timeZone: string) => {
    try {
      const localDate = new Date(date.toLocaleString("en-US"));
      const targetDate = new Date(date.toLocaleString("en-US", { timeZone }));
      const diffHours = Math.round(
        (targetDate.getTime() - localDate.getTime()) / (1000 * 60 * 60)
      );
      if (diffHours === 0) return "Same time";
      return diffHours > 0 ? `+${diffHours}h` : `${diffHours}h`;
    } catch {
      return "";
    }
  };

  const addCountry = (countryId: string) => {
    if (selectedIds.length < 6 && !selectedIds.includes(countryId)) {
      setSelectedIds([...selectedIds, countryId]);
      setActiveId(countryId);
      setShowModal(false);
      setSearchQuery("");
    }
  };

  const removeCountry = (countryId: string) => {
    if (selectedIds.length > 1) {
      const updated = selectedIds.filter((id) => id !== countryId);
      setSelectedIds(updated);
      if (activeId === countryId) {
        setActiveId(updated[0]);
      }
    }
  };

  const filteredModalCountries = useMemo(() => {
    return countries.filter(
      (c) =>
        (selectedContinent === "ALL" || c.continent === selectedContinent) &&
        (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.capital.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [countries, selectedContinent, searchQuery]);

  if (!time) return null;

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 text-slate-800 font-sans overflow-y-auto select-none p-4 md:p-6 gap-6 relative">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");
        .font-casio {
          font-family: "VT323", monospace;
          letter-spacing: 2px;
        }
        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-md">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              EXECUTIVE WORLD CLOCK PRO
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Interactive world map database & timezone tracker
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={selectedIds.length >= 6}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md ${
            selectedIds.length >= 6
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95 cursor-pointer"
          }`}
        >
          <Plus size={16} />
          <span>Add Clock ({selectedIds.length}/6)</span>
        </button>
      </div>

      {/* DIGITAL CLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedIds.map((id) => {
          const country = countries.find((c) => c.id === id);
          if (!country) return null;

          const digitalTime = formatDigitalTime(time, country.timezone);
          const { isDay } = getDayNightInfo(time, country.timezone);
          const diffText = getTimeDifference(time, country.timezone);
          const isActive = activeId === country.id;

          return (
            <div
              key={country.id}
              onClick={() => setActiveId(country.id)}
              className={`relative bg-white border-2 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all cursor-pointer group overflow-hidden ${
                isActive
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-300/80 hover:border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight uppercase tracking-wider">
                      {country.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Cap: {country.capital}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {isDay ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      <Sun size={12} /> DAY
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      <Moon size={12} /> NIGHT
                    </span>
                  )}

                  {selectedIds.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCountry(country.id);
                      }}
                      className="text-slate-400 hover:text-red-500 transition-all p-1"
                      title="Remove clock"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* CASIO LCD DISPLAY (HH:MM) */}
              <div className="bg-[#e3e8e1] border-2 border-slate-400/60 rounded-xl p-3 shadow-inner text-center relative overflow-hidden my-2">
                <div className="text-slate-900/10 text-6xl font-casio select-none absolute inset-0 flex items-center justify-center pointer-events-none">
                  88:88
                </div>
                <div className="text-slate-900 text-6xl font-casio tracking-widest relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
                  {digitalTime}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mt-2 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Time Difference:
                </span>
                <span className="bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded font-mono">
                  {diffText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAP */}
      <div className="bg-white border-2 border-slate-300/80 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="text-slate-800" size={20} />
            <h2 className="font-bold text-slate-900 text-sm tracking-wide uppercase">
              Interactive World Map
            </h2>
          </div>
        </div>

        <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
          <LeafletMapCore
            countries={countries}
            selectedIds={selectedIds}
            activeId={activeId}
            time={time}
            onSelectCountry={handleSelectCountry}
            onDeselect={handleDeselect}
          />
        </div>
      </div>

      {/* SEARCH MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Compass className="text-slate-800" size={20} />
                <h3 className="font-bold text-slate-900 text-sm">
                  Explore Countries ({filteredModalCountries.length})
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-white flex flex-col gap-3">
              <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 focus-within:border-slate-800">
                <Search size={16} className="text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search country or capital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {["ALL", "Americas", "Europe", "Asia", "Africa", "Oceania"].map(
                  (region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedContinent(region)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        selectedContinent === region
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {region === "ALL" ? "All" : region}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredModalCountries.map((country) => {
                const isSelected = selectedIds.includes(country.id);
                return (
                  <button
                    key={country.id}
                    onClick={() => addCountry(country.id)}
                    disabled={isSelected}
                    className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"
                        : "bg-white border-slate-200 hover:border-slate-800 hover:shadow-md cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-xl shrink-0">{country.flag}</span>
                      <div className="truncate">
                        <span className="font-bold text-xs text-slate-900 block truncate">
                          {country.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium truncate block">
                          {country.capital} • {country.continent}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}