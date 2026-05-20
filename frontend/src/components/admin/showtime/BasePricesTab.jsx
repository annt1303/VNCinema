import React from "react";
import { PlusCircle, Coins, Edit3, Trash2 } from "lucide-react";

export default function BasePricesTab({
  filteredBaseConfigs,
  filterConfigRoomType,
  setFilterConfigRoomType,
  filterConfigMovieFormat,
  setFilterConfigMovieFormat,
  ROOM_TYPES,
  MOVIE_FORMATS,
  onAddConfig,
  onEditConfig,
  onDeleteConfig,
  formatCurrency
}) {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Bảng Giá Vé Cơ Bản</h2>
            <p className="text-xs text-zinc-400 mt-1">Cấu hình ma trận giá vé gốc tự động theo định dạng phòng, phim, cuối tuần và khung giờ.</p>
          </div>
          <button
            onClick={onAddConfig}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer h-10 self-start sm:self-auto shrink-0"
          >
            <PlusCircle size={16} />
            Thêm giá gốc
          </button>
        </div>

        <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Loại phòng</label>
              <select
                value={filterConfigRoomType}
                onChange={(e) => setFilterConfigRoomType(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="">Tất cả loại phòng</option>
                {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Định dạng phim</label>
              <select
                value={filterConfigMovieFormat}
                onChange={(e) => setFilterConfigMovieFormat(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="">Tất cả định dạng</option>
                {MOVIE_FORMATS.map(f => <option key={f} value={f}>{f.replace("FORMAT_", "")}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredBaseConfigs.length === 0 ? (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-12 text-center text-zinc-500">
          <Coins className="mx-auto text-zinc-600 mb-3" size={32} />
          Không tìm thấy cấu hình giá nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Loại phòng</th>
                <th className="px-6 py-4">Định dạng phim</th>
                <th className="px-6 py-4">Thời điểm</th>
                <th className="px-6 py-4">Khung giờ</th>
                <th className="px-6 py-4">Giá vé cơ sở</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
              {filteredBaseConfigs.map((cfg) => (
                <tr key={cfg.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">{cfg.roomType}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded text-xs font-mono">
                      {cfg.movieFormat}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {cfg.isWeekend ? (
                      <span className="text-amber-400 font-medium">Cuối tuần (T7-CN)</span>
                    ) : (
                      <span className="text-zinc-500">Trong tuần (T2-T6)</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {cfg.timeSlot === "DAYTIME" ? "Ban ngày (Trước 17h)" : "Buổi tối (Từ 17h)"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-rose-500">{formatCurrency(cfg.basePrice)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEditConfig(cfg)}
                        className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteConfig(cfg.id)}
                        className="p-1.5 hover:bg-rose-950/30 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
