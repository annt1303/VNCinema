import React from "react";
import { Check, X } from "lucide-react";

export default function SurchargesTab({
  surcharges,
  editingSurchargeId,
  editingSurchargeValue,
  setEditingSurchargeValue,
  setEditingSurchargeId,
  startEditingSurcharge,
  saveSurcharge,
  formatCurrency
}) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl">
        <h2 className="text-xl font-bold text-white">Phụ thu Phân loại Ghế</h2>
        <p className="text-xs text-zinc-400 mt-1">Phụ thu cộng thêm vào giá vé gốc của suất chiếu dựa theo loại ghế ngồi vật lý.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {surcharges.map((item) => (
          <div 
            key={item.id} 
            className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between transition-all hover:border-white/10"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${
                  item.seatType === "COUPLE" ? "bg-rose-500" : item.seatType === "VIP" ? "bg-amber-500" : "bg-zinc-500"
                }`} />
                <h3 className="font-extrabold text-white text-lg">{item.seatType}</h3>
              </div>
              <p className="text-zinc-500 text-xs mt-1">
                {item.seatType === "NORMAL" && "Ghế ngồi tiêu chuẩn, không phụ thu thêm."}
                {item.seatType === "VIP" && "Ghế VIP ở vị trí trung tâm, có góc nhìn tốt nhất."}
                {item.seatType === "COUPLE" && "Ghế đôi dành cho các cặp đôi tại hàng ghế cuối phòng chiếu."}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {editingSurchargeId === item.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editingSurchargeValue}
                    onChange={(e) => setEditingSurchargeValue(e.target.value)}
                    className="bg-zinc-950 border border-white/15 rounded-xl px-4 py-2 w-32 text-right font-semibold text-white focus:outline-none focus:border-rose-500"
                    placeholder="Số tiền"
                  />
                  <button
                    onClick={() => saveSurcharge(item.id, item.seatType)}
                    className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingSurchargeId(null)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-extrabold text-white text-xl">
                    + {formatCurrency(item.surcharge)}
                  </span>
                  {item.seatType !== "NORMAL" && (
                    <button
                      onClick={() => startEditingSurcharge(item)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition-all"
                    >
                      Thay đổi
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
