import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function NowShowingSection({ movies }) {
  return (
    <section className="py-20 relative z-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
              Phim Đang Chiếu
            </h2>
            <p className="text-gray-400">Danh sách phim bom tấn đang làm mưa làm gió tại rạp.</p>
          </div>
          <Link to="/all-movies" className="text-primary hover:text-white transition-colors font-medium flex items-center gap-1 group">
            Xem tất cả <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {movies && movies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
