export default function PromotionSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="glass-card rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Thành viên VNCinema Club</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Đăng ký thành viên ngay hôm nay để nhận ưu đãi lên đến 20% cho lần mua vé đầu tiên và tích điểm đổi quà hấp dẫn.
            </p>
            <button className="px-8 py-3 bg-white text-background hover:bg-gray-200 rounded-full font-bold transition-colors cursor-pointer">
              Đăng Ký Ngay
            </button>
          </div>
          <div className="relative z-10 w-full md:w-1/3">
            <img
              src="https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=2070&auto=format&fit=crop"
              alt="Popcorn"
              className="rounded-2xl transform rotate-3 shadow-2xl border-4 border-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
