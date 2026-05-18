import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { movies, showtimes, formatCurrency } from "../data/mockData";
import { cn } from "../utils/cn";

// Modular Components
import MovieHero from "../components/movie/MovieHero";
import MovieInfo from "../components/movie/MovieInfo";
import ShowtimeStep from "../components/movie/ShowtimeStep";
import SeatStep from "../components/movie/SeatStep";
import CheckoutStep from "../components/movie/CheckoutStep";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1); // 1: Info & Showtime, 2: Seat Selection, 3: Checkout

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    const foundMovie = movies.find(m => m.id === parseInt(id));
    if (foundMovie) setMovie(foundMovie);
  }, [id]);

  if (!movie) return <div className="min-h-screen flex items-center justify-center text-white">Đang tải...</div>;

  // Generate some upcoming dates
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d,
      dayName: i === 0 ? "Hôm nay" : i === 1 ? "Ngày mai" : d.toLocaleDateString("vi-VN", { weekday: "short" }),
      dateString: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
    };
  });

  const handleSeatSelect = (seat) => {
    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.find((s) => s.id === seat.id);
      if (isAlreadySelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        if (prev.length >= 8) {
          alert("Bạn chỉ có thể chọn tối đa 8 ghế");
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <MovieHero 
        backdrop={movie.backdrop} 
        title={movie.title} 
        onBack={() => navigate(-1)} 
      />

      <div className="container mx-auto px-4 md:px-6 relative z-20 -mt-32 md:-mt-48">
        {/* Info Section */}
        <MovieInfo movie={movie} />

        {/* Booking Section */}
        <div className="mt-16">
          {/* Booking Step Tabs */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-8">
            <button 
              onClick={() => setStep(1)}
              className={cn("text-lg font-semibold transition-colors relative cursor-pointer", step === 1 ? "text-primary" : "text-gray-500 hover:text-white")}
            >
              1. Chọn suất chiếu
              {step === 1 && <motion.div layoutId="tab-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <span className="text-gray-700">/</span>
            <button 
              disabled={step < 2}
              onClick={() => setStep(2)}
              className={cn("text-lg font-semibold transition-colors relative cursor-pointer", step === 2 ? "text-primary" : step > 2 ? "text-white" : "text-gray-700")}
            >
              2. Chọn ghế
              {step === 2 && <motion.div layoutId="tab-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <span className="text-gray-700">/</span>
            <button 
              disabled={step < 3}
              onClick={() => setStep(3)}
              className={cn("text-lg font-semibold transition-colors relative cursor-pointer", step === 3 ? "text-primary" : "text-gray-700")}
            >
              3. Thanh toán
              {step === 3 && <motion.div layoutId="tab-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>

          {/* Stepper Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <ShowtimeStep
                dates={dates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                showtimes={showtimes}
                selectedShowtime={selectedShowtime}
                setSelectedShowtime={setSelectedShowtime}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <SeatStep
                selectedSeats={selectedSeats}
                handleSeatSelect={handleSeatSelect}
                totalPrice={totalPrice}
                formatCurrency={formatCurrency}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <CheckoutStep
                movie={movie}
                selectedShowtime={selectedShowtime}
                showtimes={showtimes}
                selectedDate={selectedDate}
                dates={dates}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
                formatCurrency={formatCurrency}
                onHome={() => navigate("/")}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

