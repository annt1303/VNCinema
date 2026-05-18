import { ChevronLeft } from "lucide-react";

export default function MovieHero({ backdrop, title, onBack }) {
  return (
    <div className="relative h-[60vh] md:h-[70vh] w-full">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      <img src={backdrop} alt={title} className="w-full h-full object-cover animate-fade-in" />
      
      <div className="absolute top-24 left-4 z-20">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Quay lại"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
}
