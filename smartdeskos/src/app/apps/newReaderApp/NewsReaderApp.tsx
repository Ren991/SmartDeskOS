"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Newspaper,
  RefreshCw,
  ExternalLink,
  Search,
  Flame,
  Globe,
  TrendingUp,
  Trophy,
  Tv,
  Clock,
} from "lucide-react";

interface Article {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  source: string;
}

// Feeds RSS en Inglés clasificados por sección
const CATEGORY_FEEDS: Record<string, { label: string; icon: any; feedUrl: string; source: string }> = {
  breaking: {
    label: "Primicias (Breaking)",
    icon: Flame,
    feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
    source: "BBC World News",
  },
  news: {
    label: "Actualidad (Top News)",
    icon: Globe,
    feedUrl: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    source: "NY Times",
  },
  economy: {
    label: "Economía (Economy)",
    icon: TrendingUp,
    feedUrl: "https://search.cnbc.com/rs/search/combinedrenderer/view.xml?partnerId=2000&keywords=economy&target=all",
    source: "CNBC Finance",
  },
  sports: {
    label: "Deportes (Sports)",
    icon: Trophy,
    feedUrl: "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/sport/rss.xml",
    source: "BBC Sport",
  },
  entertainment: {
    label: "Espectáculos (Entertainment)",
    icon: Tv,
    feedUrl: "https://www.eonline.com/syndication/feeds/rssfeed.xml",
    source: "E! Online",
  },
};

export default function NewsReaderApp() {
  const [activeCategory, setActiveCategory] = useState<string>("breaking");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRssFeed = useCallback(async (catKey: string) => {
    setLoading(true);
    const feedConfig = CATEGORY_FEEDS[catKey];
    if (!feedConfig) return;

    try {
      // Conversión de RSS XML a JSON
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
          feedConfig.feedUrl
        )}`
      );
      const data = await res.json();

      if (data.status === "ok" && data.items) {
        const parsedArticles: Article[] = data.items.map((item: any) => {
          // Intenta obtener la imagen del thumbnail, enclosure o del HTML
          let image = item.thumbnail || item.enclosure?.link || "";
          if (!image && item.description) {
            const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) image = imgMatch[1];
          }

          // Limpia las etiquetas HTML de las descripciones
          const cleanDesc = item.description
            ? item.description.replace(/<[^>]+>/g, "").trim()
            : "No description available.";

          return {
            title: item.title,
            description: cleanDesc,
            link: item.link,
            pubDate: item.pubDate,
            thumbnail:
              image ||
              "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
            source: feedConfig.source,
          };
        });

        setArticles(parsedArticles);
      }
    } catch (err) {
      console.error("Error fetching RSS feed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRssFeed(activeCategory);
  }, [activeCategory, fetchRssFeed]);

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* CINTA DE TITULARES / TICKER */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-4 text-xs font-mono shrink-0 overflow-x-auto scrollbar-none">
        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold px-2.5 py-0.5 rounded text-[10px] shrink-0 flex items-center gap-1 uppercase tracking-wider">
          <Flame size={12} className="animate-pulse" /> LIVE FEED
        </span>
        <div className="flex items-center gap-6 text-slate-300 whitespace-nowrap">
          {articles.slice(0, 4).map((a, i) => (
            <span key={i} className="truncate max-w-sm hover:text-white transition">
              • {a.title}
            </span>
          ))}
        </div>
      </div>

      {/* HEADER & BUSCADOR */}
      <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-rose-500/20 border border-rose-500/40 text-rose-400 p-2 rounded-xl">
            <Newspaper size={20} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide uppercase">
              World News Network
            </h1>
            <p className="text-[10px] text-slate-400">English Feeds • Live RSS Stream</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 w-full sm:w-56 focus-within:border-rose-500 transition">
            <Search size={14} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Filter headlines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none"
            />
          </div>

          <button
            onClick={() => fetchRssFeed(activeCategory)}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition cursor-pointer disabled:opacity-50"
            title="Refresh News"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-rose-400" : ""} />
          </button>
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN (SECCIONES) */}
      <div className="px-4 pt-3 flex items-center gap-2 border-b border-slate-800 shrink-0 overflow-x-auto scrollbar-none">
        {Object.entries(CATEGORY_FEEDS).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold transition cursor-pointer shrink-0 border-b-2 ${
                activeCategory === key
                  ? "border-rose-500 text-rose-400 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Icon size={14} /> {config.label}
            </button>
          );
        })}
      </div>

      {/* GRID DE NOTICIAS */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
            <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Fetching latest articles...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs font-mono">
            No headlines found matching "{search}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article, index) => (
              <div
                key={index}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden flex flex-col justify-between group transition hover:shadow-xl"
              >
                <div>
                  {/* IMAGEN DE CABECERA */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        // Fallback por si falla la carga de la imagen
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-800">
                      {article.source}
                    </span>
                  </div>

                  {/* CONTENIDO */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <Clock size={11} />
                      <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-sm font-bold text-white group-hover:text-rose-400 transition line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </div>

                {/* BOTÓN VER NOTICIA */}
                <div className="p-4 pt-0">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition cursor-pointer"
                  >
                    <span>Read full story</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}