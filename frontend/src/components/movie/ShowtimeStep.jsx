import { Calendar, MapPin, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function ShowtimeStep({
  dates,
  selectedDate,
  setSelectedDate,
  showtimes,
  selectedShowtime,
  setSelectedShowtime,
  onNext
}) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      {/* Date Selection */}
      <div>
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-primary" /> Chọn ngày
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {dates.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(idx)}
              className={cn(
                "shrink-0 w-24 py-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer",
                selectedDate === idx 
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" 
                  : "bg-secondary border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20"
              )}
            >
              <span className="text-xs font-medium mb-1">{item.dayName}</span>
              <span className="text-lg font-bold">{item.dateString}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Showtime Selection */}
      <div>
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-primary" /> CineVN Trần Duy Hưng
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {showtimes.map((st) => (
            <button
              key={st.id}
              disabled={!st.available}
              onClick={() => setSelectedShowtime(st.id)}
              className={cn(
                "py-3 rounded-xl font-medium transition-all border cursor-pointer",
                !st.available ? "bg-white/5 text-gray-600 border-transparent cursor-not-allowed" :
                selectedShowtime === st.id ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" :
                "bg-secondary text-gray-300 border-white/10 hover:border-white/30 hover:bg-white/5"
              )}
            >
              {st.time}
            </button>
          ))}
        </div>
      </div>

      {/* Next Action */}
      <div className="flex justify-end pt-4">
        <button
          disabled={!selectedShowtime}
          onClick={onNext}
          className={cn(
            "px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all cursor-pointer",
            selectedShowtime 
              ? "bg-white text-background hover:bg-gray-200" 
              : "bg-white/10 text-gray-500 cursor-not-allowed"
          )}
        >
          Tiếp tục <ChevronLeft size={20} className="rotate-180" />
        </button>
      </div>
    </motion.div>
  );
}
