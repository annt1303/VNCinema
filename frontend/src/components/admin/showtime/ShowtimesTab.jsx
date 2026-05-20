import React from "react";
import { Calendar, Plus, Trash2, Edit3, Clock } from "lucide-react";

export default function ShowtimesTab({
  filteredShowtimes,
  filterCinemaId,
  setFilterCinemaId,
  filterRoomId,
  setFilterRoomId,
  filterDate,
  setFilterDate,
  cinemas,
  filterRooms,
  fetchFilterRooms,
  onAddShowtime,
  onEditShowtime,
  onDeleteShowtime,
  formatCurrency
}) {
  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Cụm rạp</label>
            <select
              value={filterCinemaId}
              onChange={(e) => {
                setFilterCinemaId(e.target.value);
                fetchFilterRooms(e.target.value);
              }}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
            >
              <option value="">Tất cả cụm rạp</option>
              {cinemas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Phòng chiếu</label>
            <select
              value={filterRoomId}
              onChange={(e) => setFilterRoomId(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              disabled={!filterCinemaId}
            >
              <option value="">Tất cả phòng chiếu</option>
              {filterRooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.roomType})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Ngày chiếu</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <button
          onClick={onAddShowtime}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer h-10 w-full md:w-auto justify-center"
        >
          <Plus size={16} />
          Thêm lịch chiếu
        </button>
      </div>

      {/* Showtimes Table/Grid */}
      {filteredShowtimes.length === 0 ? (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-12 text-center text-zinc-500">
          <Calendar className="mx-auto text-zinc-600 mb-3" size={32} />
          Không có suất chiếu nào được lên lịch cho các bộ lọc này.
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Phim</th>
                  <th className="px-6 py-4">Phòng / Rạp</th>
                  <th className="px-6 py-4">Định dạng</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Giá gốc</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                {filteredShowtimes.map((st) => (
                  <tr key={st.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white max-w-[240px] truncate">
                      {st.movieTitle}
                    </td>
                    <td className="px-6 py-4">
                      <span className="block font-medium text-white">{st.screenRoomName}</span>
                      <span className="block text-xs text-zinc-500">{st.cinemaName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-rose-600/10 border border-rose-500/20 text-rose-500 font-bold px-2 py-0.5 rounded text-xs">
                        {st.movieFormat.replace("FORMAT_", "")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="block font-medium text-white">{st.startTime.substring(11, 16)} - {st.endTime.substring(11, 16)}</span>
                      <span className="block text-xs text-zinc-500">{st.startTime.substring(0, 10)}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {formatCurrency(st.basePrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        st.isActive 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}>
                        {st.isActive ? "Hoạt động" : "Hủy chiếu"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEditShowtime(st)}
                          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Sửa lịch chiếu"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteShowtime(st.id)}
                          className="p-1.5 hover:bg-rose-950/30 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Hủy/Xóa suất chiếu"
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
        </div>
      )}
    </div>
  );
}
