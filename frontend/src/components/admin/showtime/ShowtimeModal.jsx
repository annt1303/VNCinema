import React from "react";
import { Film, X } from "lucide-react";

export default function ShowtimeModal({
  isOpen,
  onClose,
  editingShowtime,
  showtimeForm,
  setShowtimeForm,
  cinemas,
  movies,
  rooms,
  suggestedPrice,
  estimatedEndTime,
  formatCurrency,
  onSubmit,
  MOVIE_FORMATS
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-zinc-900/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Film className="text-rose-500" size={18} />
            {editingShowtime ? "Cập Nhật Lịch Chiếu" : "Tạo Mới Lịch Chiếu"}
          </h3>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Select Movie */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Bộ Phim *</label>
            <select
              value={showtimeForm.movieId}
              onChange={(e) => setShowtimeForm(prev => ({ ...prev, movieId: e.target.value }))}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
              required
            >
              <option value="">Chọn phim...</option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>{m.title} ({m.duration} phút)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Select Cinema */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Cụm Rạp *</label>
              <select
                value={showtimeForm.cinemaId}
                onChange={(e) => setShowtimeForm(prev => ({ ...prev, cinemaId: e.target.value, screenRoomId: "" }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                required
              >
                <option value="">Chọn cụm rạp...</option>
                {cinemas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Select Screen Room */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Phòng Chiếu *</label>
              <select
                value={showtimeForm.screenRoomId}
                onChange={(e) => setShowtimeForm(prev => ({ ...prev, screenRoomId: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                disabled={!showtimeForm.cinemaId}
                required
              >
                <option value="">Chọn phòng...</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.roomType})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Select Movie Format */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Định dạng chiếu *</label>
              <select
                value={showtimeForm.movieFormat}
                onChange={(e) => setShowtimeForm(prev => ({ ...prev, movieFormat: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                required
              >
                {MOVIE_FORMATS.map(f => (
                  <option key={f} value={f}>{f.replace("FORMAT_", "")}</option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Giờ Bắt Đầu *</label>
              <input
                type="datetime-local"
                value={showtimeForm.startTime}
                onChange={(e) => setShowtimeForm(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                required
              />
              {estimatedEndTime && (
                <span className="text-zinc-500 text-xs mt-1 block">
                  Kết thúc dự kiến: {estimatedEndTime} (gồm 20p dọn phòng tiếp theo)
                </span>
              )}
            </div>
          </div>

          {/* Price Setup */}
          <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-zinc-400">Giá đề xuất ma trận:</span>
              <span className="text-sm font-extrabold text-emerald-400">
                {suggestedPrice ? formatCurrency(suggestedPrice) : "Chờ nhập đủ thông tin..."}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Giá vé gốc áp dụng *</label>
              <div className="relative">
                <input
                  type="number"
                  value={showtimeForm.basePrice}
                  onChange={(e) => setShowtimeForm(prev => ({ ...prev, basePrice: e.target.value }))}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm font-semibold text-white focus:outline-none focus:border-rose-500"
                  placeholder="Chọn rạp, phòng và giờ để tự động điền hoặc nhập tay..."
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">VND</span>
              </div>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="st-active"
              checked={showtimeForm.isActive}
              onChange={(e) => setShowtimeForm(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-rose-500/50 focus:ring-offset-black w-4 h-4 cursor-pointer"
            />
            <label htmlFor="st-active" className="text-sm text-zinc-300 select-none cursor-pointer">
              Mở lịch chiếu hoạt động công cộng
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm rounded-xl cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl cursor-pointer transition-colors"
            >
              {editingShowtime ? "Cập nhật" : "Tạo suất chiếu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
