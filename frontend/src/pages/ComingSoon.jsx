import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Star,
  Play,
  Bell,
  BellOff,
  ChevronRight,
  Film,
  Sparkles,
  Zap,
  Filter,
  ChevronDown,
} from "lucide-react";
import { api } from "../services/api";
import { mapDbMovieToFrontend } from "../utils/movieMapper";
import TrailerModal from "../components/common/TrailerModal";

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

// ─── Countdown display ────────────────────────────────────────────────────────
function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 rounded-xl border border-white/10" />
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 text-lg font-black text-white tabular-nums"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-zinc-900/50 border border-white/5 animate-pulse">
      <div className="aspect-[2/3] bg-white/5" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="flex gap-2 mt-3">
          <div className="h-8 bg-white/5 rounded-lg flex-1" />
          <div className="h-8 w-8 bg-white/5 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Floating particle ────────────────────────────────────────────────────────
function Particle({ style }) {
  return (
    <motion.div
      className="absolute rounded-full bg-rose-500/20 pointer-events-none"
      style={style}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: style.duration || 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: style.delay || 0,
      }}
    />
  );
}

// ─── Movie card ───────────────────────────────────────────────────────────────
function ComingSoonCard({ movie, index, onNotify, notified }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [showNoTrailer, setShowNoTrailer] = useState(false);
  const [hovered, setHovered] = useState(false);
  const countdown = useCountdown(movie.releaseDate || "2025-12-31");

  // Format release date nicely
  const formattedDate = useMemo(() => {
    if (!movie.releaseDate) return "Sắp ra mắt";
    try {
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(movie.releaseDate));
    } catch {
      return movie.releaseDate;
    }
  }, [movie.releaseDate]);

  const daysLeft = countdown.days;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (movie.trailerUrl) {
      setShowTrailer(true);
    } else {
      setShowNoTrailer(true);
      setTimeout(() => setShowNoTrailer(false), 2500);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.6), ease: "easeOut" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative rounded-2xl overflow-hidden bg-zinc-900/40 border border-white/5 hover:border-rose-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-900/20 cursor-pointer flex flex-col"
      >
        {/* Poster section */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient overlay always */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Hover overlay */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 flex flex-col justify-end p-4 z-10"
          >
            <motion.div
              animate={{ y: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Genre tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {movie.genre.slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="text-[9px] bg-rose-600/30 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded-full font-semibold"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <h3 className="text-white font-bold text-sm mb-1 leading-tight line-clamp-2">
                {movie.title}
              </h3>

              <p className="text-gray-400 text-[11px] line-clamp-2 mb-3 leading-relaxed">
                {movie.description || "Nội dung đang cập nhật..."}
              </p>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNotify(movie.id);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${notified
                      ? "bg-rose-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-gray-300"
                    }`}
                >
                  {notified ? <Bell size={12} fill="currentColor" /> : <BellOff size={12} />}
                  {notified ? "Đã nhắc" : "Nhắc tôi"}
                </button>
                <button
                  onClick={handlePlayClick}
                  className="w-9 h-9 bg-rose-600/80 hover:bg-rose-600 flex items-center justify-center rounded-lg text-white transition-colors cursor-pointer"
                  title={movie.trailerUrl ? "Xem trailer" : "Chưa có trailer"}
                >
                  <Play size={14} fill="currentColor" />
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* TOP badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
            {/* Coming Soon badge */}
            <div className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-black text-[9px] font-black px-2 py-1 rounded-full">
              <Sparkles size={9} />
              SẮP CHIẾU
            </div>

            {/* Rating badge */}
            {parseFloat(movie.rating) > 0 && (
              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-full border border-yellow-400/20">
                <Star size={10} fill="currentColor" />
                {movie.rating}
              </div>
            )}
          </div>

          {/* Days left badge – bottom of poster */}
          {daysLeft >= 0 && daysLeft <= 365 && (
            <div className="absolute bottom-3 left-3 z-20">
              <div
                className={`text-[10px] font-bold px-2 py-1 rounded-full border backdrop-blur-sm ${daysLeft === 0
                    ? "bg-rose-600/90 text-white border-rose-500/30"
                    : daysLeft <= 7
                      ? "bg-orange-600/90 text-white border-orange-500/30"
                      : "bg-black/70 text-gray-300 border-white/10"
                  }`}
              >
                {daysLeft === 0 ? "🔥 Ra mắt hôm nay!" : `${daysLeft} ngày nữa`}
              </div>
            </div>
          )}

          {/* No trailer toast */}
          <AnimatePresence>
            {showNoTrailer && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-white/10"
              >
                Chưa có trailer
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card footer */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <h3 className="text-white font-bold text-sm leading-tight line-clamp-1 group-hover:text-rose-400 transition-colors">
              {movie.title}
            </h3>
            {movie.originalTitle && (
              <p className="text-gray-500 text-[11px] italic mt-0.5 line-clamp-1">
                {movie.originalTitle}
              </p>
            )}
          </div>

          {/* Release date */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={12} className="text-rose-500 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>

          {/* Countdown */}
          {daysLeft >= 0 && daysLeft <= 365 && (
            <div className="flex items-center gap-2 justify-between">
              <CountdownUnit value={countdown.days} label="ngày" />
              <span className="text-gray-600 font-bold text-sm mb-3">:</span>
              <CountdownUnit value={countdown.hours} label="giờ" />
              <span className="text-gray-600 font-bold text-sm mb-3">:</span>
              <CountdownUnit value={countdown.minutes} label="phút" />
              <span className="text-gray-600 font-bold text-sm mb-3">:</span>
              <CountdownUnit value={countdown.seconds} label="giây" />
            </div>
          )}

          {/* Duration & director */}
          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {movie.duration}
            </span>
            {movie.director && (
              <span className="truncate">🎬 {movie.director}</span>
            )}
          </div>
        </div>
      </motion.div>

      <TrailerModal
        open={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={movie.trailerUrl}
        title={movie.title}
      />
    </>
  );
}

// ─── Featured spotlight card ──────────────────────────────────────────────────
function FeaturedCard({ movie, onNotify, notified }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const countdown = useCountdown(movie.releaseDate || "2025-12-31");

  const formattedDate = useMemo(() => {
    if (!movie.releaseDate) return "Sắp ra mắt";
    try {
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(movie.releaseDate));
    } catch {
      return movie.releaseDate;
    }
  }, [movie.releaseDate]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
      >
        {/* Backdrop */}
        <div className="relative h-[420px] md:h-[500px]">
          <img
            src={movie.backdrop || movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <Particle
              key={i}
              style={{
                width: `${4 + i * 3}px`,
                height: `${4 + i * 3}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                duration: 3 + i,
                delay: i * 0.5,
              }}
            />
          ))}

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-10">
            <div className="max-w-xl">
              {/* Badge row */}
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-lg"
                >
                  <Zap size={12} />
                  NỔI BẬT
                </motion.div>
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-400/20">
                  <Star size={11} fill="currentColor" />
                  {movie.rating}
                </div>
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-gray-300 text-xs px-3 py-1.5 rounded-full border border-white/10">
                  <Clock size={11} />
                  {movie.duration}
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                {movie.title}
              </h2>

              {movie.originalTitle && (
                <p className="text-gray-400 text-sm italic mb-3">{movie.originalTitle}</p>
              )}

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.slice(0, 4).map((g) => (
                  <span
                    key={g}
                    className="text-xs bg-white/10 text-gray-300 border border-white/10 px-2.5 py-1 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-5">
                {movie.description}
              </p>

              {/* Release & countdown */}
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar size={14} className="text-rose-500" />
                  <span>Khởi chiếu: <strong className="text-white">{formattedDate}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CountdownUnit value={countdown.days} label="ngày" />
                  <span className="text-gray-600 font-bold mb-3">:</span>
                  <CountdownUnit value={countdown.hours} label="giờ" />
                  <span className="text-gray-600 font-bold mb-3">:</span>
                  <CountdownUnit value={countdown.minutes} label="phút" />
                  <span className="text-gray-600 font-bold mb-3">:</span>
                  <CountdownUnit value={countdown.seconds} label="giây" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-rose-600/30 hover:shadow-rose-500/40 cursor-pointer"
                  >
                    <Play size={16} fill="currentColor" />
                    Xem Trailer
                  </button>
                )}
                <button
                  onClick={() => onNotify(movie.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border cursor-pointer ${notified
                      ? "bg-rose-600/20 border-rose-500/40 text-rose-400"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                    }`}
                >
                  {notified ? <Bell size={16} fill="currentColor" /> : <BellOff size={16} />}
                  {notified ? "Đã đặt nhắc nhở" : "Nhắc tôi khi ra mắt"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <TrailerModal
        open={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={movie.trailerUrl}
        title={movie.title}
      />
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { label: "Sớm nhất", value: "soonest" },
  { label: "Mới nhất", value: "newest" },
  { label: "Đánh giá cao", value: "rating" },
  { label: "Tên A-Z", value: "az" },
];

export default function ComingSoon() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifiedIds, setNotifiedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("notified_movies") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [sortBy, setSortBy] = useState("soonest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMovies = async () => {
      try {
        const data = await api.get("/api/public/movies?status=UPCOMING");
        const mapped = data.map(mapDbMovieToFrontend);
        setMovies(mapped);
      } catch (error) {
        console.error("Failed to fetch coming soon movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleNotify = (movieId) => {
    setNotifiedIds((prev) => {
      const next = new Set(prev);
      if (next.has(movieId)) {
        next.delete(movieId);
      } else {
        next.add(movieId);
      }
      localStorage.setItem("notified_movies", JSON.stringify([...next]));
      return next;
    });
  };

  const filteredMovies = useMemo(() => {
    let result = [...movies];
    if (sortBy === "soonest") {
      result.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sortBy === "rating") {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  }, [movies, sortBy]);

  const featuredMovie = useMemo(() => {
    if (filteredMovies.length === 0) return null;
    // Pick the movie with soonest release date
    const sorted = [...filteredMovies].sort(
      (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
    );
    return sorted[0];
  }, [filteredMovies]);

  const gridMovies = useMemo(
    () => filteredMovies.filter((m) => m.id !== featuredMovie?.id),
    [filteredMovies, featuredMovie]
  );

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Sắp xếp";

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* ── Ambient Hero ───────────────────────────────────────── */}
      <div ref={heroRef} className="relative overflow-hidden pt-16">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            style={{ y: heroY }}
            className="absolute -top-40 -left-60 w-[700px] h-[700px] bg-rose-600/8 rounded-full blur-[140px]"
          />
          <motion.div
            style={{ y: heroY }}
            className="absolute -top-20 right-0 w-[500px] h-[500px] bg-amber-600/6 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/[0.02] rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-rose-500/[0.03] rounded-full"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-12 md:py-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-8"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-300">Sắp chiếu</span>
          </motion.div>

          {/* Hero heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-10"
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-10 bg-gradient-to-b from-amber-400 to-rose-600 rounded-full"
              />
              <div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 block">
                  ✦ Sắp Ra Mắt
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-none">
              Phim{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-amber-500">
                  Sắp Chiếu
                </span>
                <motion.span
                  animate={{ scaleX: [1, 1.03, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                />
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Những bộ phim bom tấn sắp đổ bộ màn ảnh lớn. Đặt nhắc nhở để không bỏ lỡ ngày
              khởi chiếu và theo dõi đếm ngược từng giây!
            </p>

            {/* Stats */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 mt-6"
              >
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Film size={15} className="text-amber-500" />
                  <span>
                    <span className="text-white font-bold">{movies.length}</span> phim sắp chiếu
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Bell size={15} className="text-rose-500" />
                  <span>
                    <span className="text-white font-bold">{notifiedIds.size}</span> nhắc nhở đã đặt
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── Featured Card ── */}
          {!loading && featuredMovie && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={16} className="text-amber-500" />
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Phim nổi bật
                </span>
              </div>
              <FeaturedCard
                movie={featuredMovie}
                onNotify={handleNotify}
                notified={notifiedIds.has(featuredMovie.id)}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Controls bar ─────────────────────────────────────────── */}
      <div className="sticky top-[60px] z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="container mx-auto px-4 md:px-6 py-3 flex justify-end">
          {/* Sort dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 bg-zinc-900/60 border border-white/5 text-gray-300 hover:text-white px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer hover:border-white/20"
            >
              <Filter size={14} />
              {currentSortLabel}
              <ChevronDown
                size={14}
                className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-1.5 z-20"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${sortBy === opt.value
                            ? "bg-rose-600/15 text-rose-400"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Movie Grid ───────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Result label */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loading ? (
              <span className="animate-pulse">Đang tải phim...</span>
            ) : (
              <>
                Hiển thị{" "}
                <span className="text-white font-semibold">{filteredMovies.length}</span>{" "}
                phim sắp chiếu
              </>
            )}
          </p>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-5 border border-white/5"
            >
              <Film size={40} className="text-gray-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Không có phim</h3>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              Hiện tại không có phim sắp chiếu nào.
            </p>
          </motion.div>
        )}

        {/* Grid (excluding featured) */}
        {!loading && gridMovies.length > 0 && (
          <>
            {featuredMovie && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Tất cả phim sắp chiếu
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {gridMovies.map((movie, index) => (
                <ComingSoonCard
                  key={movie.id}
                  movie={movie}
                  index={index}
                  onNotify={handleNotify}
                  notified={notifiedIds.has(movie.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* If no featured but has movies */}
        {!loading && filteredMovies.length > 0 && !featuredMovie && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredMovies.map((movie, index) => (
              <ComingSoonCard
                key={movie.id}
                movie={movie}
                index={index}
                onNotify={handleNotify}
                notified={notifiedIds.has(movie.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
