import { movies } from "../data/mockData";
import HeroSection from "../components/home/HeroSection";
import NowShowingSection from "../components/home/NowShowingSection";
import PromotionSection from "../components/home/PromotionSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection movies={movies} />
      <NowShowingSection movies={movies} />
      <PromotionSection />
    </div>
  );
}

