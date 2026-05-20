import React from "react";
import { Coins, X } from "lucide-react";

export default function BasePriceConfigModal({
  isOpen,
  onClose,
  editingConfig,
  configForm,
  setConfigForm,
  onSubmit,
  ROOM_TYPES,
  MOVIE_FORMATS,
  TIME_SLOTS
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-8">
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-zinc-900/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Coins className="text-rose-500" size={18} />
            {editingConfig ? "Cập Nhật Cấu Hình Giá" : "Thêm Cấu Hình Giá Gốc"}
          </h3>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Room Type */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Loại phòng</label>
            <select
              value={configForm.roomType}
              onChange={(e) => setConfigForm(prev => ({ ...prev, roomType: e.target.value }))}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
            >
              {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Movie Format */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Định dạng phim</label>
            <select
              value={configForm.movieFormat}
              onChange={(e) => setConfigForm(prev => ({ ...prev, movieFormat: e.target.value }))}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
            >
              {MOVIE_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Weekend indicator */}
          <div className="flex items-center justify-between bg-zinc-900/40 border border-white/5 p-3.5 rounded-xl">
            <div>
              <span className="block text-sm font-semibold text-white">Áp dụng cuối tuần</span>
              <span className="block text-xs text-zinc-500">Chỉ kích hoạt vào Thứ 7 và Chủ nhật</span>
            </div>
            <input
              type="checkbox"
              checked={configForm.isWeekend}
              onChange={(e) => setConfigForm(prev => ({ ...prev, isWeekend: e.target.checked }))}
              className="rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-rose-500/50 focus:ring-offset-black w-5 h-5 cursor-pointer"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Khung giờ suất chiếu</label>
            <select
              value={configForm.timeSlot}
              onChange={(e) => setConfigForm(prev => ({ ...prev, timeSlot: e.target.value }))}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
            >
              {TIME_SLOTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Base Price input */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Giá vé gốc cơ bản *</label>
            <div className="relative">
              <input
                type="number"
                value={configForm.basePrice}
                onChange={(e) => setConfigForm(prev => ({ ...prev, basePrice: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm font-semibold text-white focus:outline-none focus:border-rose-500"
                placeholder="E.g., 80000"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">VND</span>
            </div>
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
              {editingConfig ? "Cập nhật" : "Thêm cấu hình"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
