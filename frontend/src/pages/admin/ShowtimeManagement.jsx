import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Coins, 
  Info, 
  DollarSign
} from "lucide-react";
import { api } from "../../services/api";
import ShowtimesTab from "../../components/admin/showtime/ShowtimesTab";
import BasePricesTab from "../../components/admin/showtime/BasePricesTab";
import SurchargesTab from "../../components/admin/showtime/SurchargesTab";
import ShowtimeModal from "../../components/admin/showtime/ShowtimeModal";
import BasePriceConfigModal from "../../components/admin/showtime/BasePriceConfigModal";

const MOVIE_FORMATS = ["FORMAT_2D", "FORMAT_3D", "FORMAT_IMAX", "FORMAT_4DX"];
const ROOM_TYPES = ["STANDARD", "IMAX", "GOLD_CLASS", "DELUXE"];
const TIME_SLOTS = [
  { value: "DAYTIME", label: "Ban ngày (Trước 17h)" },
  { value: "EVENING", label: "Buổi tối (Từ 17h)" }
];

export default function ShowtimeManagement() {
  const [activeTab, setActiveTab] = useState("showtimes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Data list states
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [baseConfigs, setBaseConfigs] = useState([]);
  const [surcharges, setSurcharges] = useState([]);

  // Filter states
  const [filterCinemaId, setFilterCinemaId] = useState("");
  const [filterRoomId, setFilterRoomId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterConfigRoomType, setFilterConfigRoomType] = useState("");
  const [filterConfigMovieFormat, setFilterConfigMovieFormat] = useState("");

  // Showtime Modal State
  const [showtimeModalOpen, setShowtimeModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [showtimeForm, setShowtimeForm] = useState({
    movieId: "",
    cinemaId: "",
    screenRoomId: "",
    movieFormat: "FORMAT_2D",
    startTime: "",
    basePrice: "",
    isActive: true
  });
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [estimatedEndTime, setEstimatedEndTime] = useState("");

  // BasePriceConfig Modal State
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [configForm, setConfigForm] = useState({
    roomType: "STANDARD",
    movieFormat: "FORMAT_2D",
    isWeekend: false,
    timeSlot: "DAYTIME",
    basePrice: ""
  });

  // Surcharge Inline Edit State
  const [editingSurchargeId, setEditingSurchargeId] = useState(null);
  const [editingSurchargeValue, setEditingSurchargeValue] = useState("");

  // Fetch initial collections
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch rooms when cinema changes in showtime modal
  useEffect(() => {
    if (showtimeForm.cinemaId) {
      fetchRoomsForCinema(showtimeForm.cinemaId);
    } else {
      setRooms([]);
    }
  }, [showtimeForm.cinemaId]);

  // Trigger price calculation when dynamic parameters change in showtime form
  useEffect(() => {
    if (showtimeForm.screenRoomId && showtimeForm.movieFormat && showtimeForm.startTime) {
      calculateSuggestedPrice();
    }
  }, [showtimeForm.screenRoomId, showtimeForm.movieFormat, showtimeForm.startTime]);

  // Calculate estimated end time on form changes
  useEffect(() => {
    if (showtimeForm.movieId && showtimeForm.startTime) {
      const movie = movies.find(m => m.id.toString() === showtimeForm.movieId.toString());
      if (movie) {
        const start = new Date(showtimeForm.startTime);
        const end = new Date(start.getTime() + movie.duration * 60000);
        setEstimatedEndTime(end.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
      }
    } else {
      setEstimatedEndTime("");
    }
  }, [showtimeForm.movieId, showtimeForm.startTime]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [moviesData, cinemasData, configsData, surchargesData] = await Promise.all([
        api.get("/api/admin/movies"),
        api.get("/api/admin/cinemas"),
        api.get("/api/admin/pricing/base-price-configs"),
        api.get("/api/admin/pricing/seat-type-prices")
      ]);
      setMovies(moviesData);
      setCinemas(cinemasData);
      setBaseConfigs(configsData);
      setSurcharges(surchargesData);

      // Pre-select first cinema for filtering if available
      if (cinemasData.length > 0) {
        setFilterCinemaId(cinemasData[0].id.toString());
        fetchFilterRooms(cinemasData[0].id.toString());
      }
      
      // Default filter date to today
      const todayStr = new Date().toISOString().split("T")[0];
      setFilterDate(todayStr);

      await fetchShowtimes();
    } catch (err) {
      setError("Không thể đồng bộ dữ liệu ban đầu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const data = await api.get("/api/admin/showtimes");
      setShowtimes(data);
    } catch (err) {
      setError("Không thể tải danh sách lịch chiếu: " + err.message);
    }
  };

  const fetchRoomsForCinema = async (cinemaId) => {
    try {
      const data = await api.get(`/api/admin/rooms/cinema/${cinemaId}`);
      setRooms(data);
    } catch (err) {
      setError("Không thể tải phòng chiếu: " + err.message);
    }
  };

  const [filterRooms, setFilterRooms] = useState([]);
  const fetchFilterRooms = async (cinemaId) => {
    try {
      const data = await api.get(`/api/admin/rooms/cinema/${cinemaId}`);
      setFilterRooms(data);
      setFilterRoomId(""); // reset selection
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowAlert = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMsg(msg);
      setError("");
    } else {
      setError(msg);
      setSuccessMsg("");
    }
    setTimeout(() => {
      setSuccessMsg("");
      setError("");
    }, 4500);
  };

  const calculateSuggestedPrice = async () => {
    const selectedRoom = rooms.find(r => r.id.toString() === showtimeForm.screenRoomId.toString());
    if (!selectedRoom) return;

    try {
      // ISO Format: YYYY-MM-DDTHH:mm:ss
      // HTML input date returns YYYY-MM-DDTHH:mm, we append :00
      const startTimeIso = showtimeForm.startTime.length === 16 ? `${showtimeForm.startTime}:00` : showtimeForm.startTime;
      const price = await api.get(
        `/api/admin/showtimes/calculate-price?roomType=${selectedRoom.roomType}&movieFormat=${showtimeForm.movieFormat}&startTime=${startTimeIso}`
      );
      setSuggestedPrice(price);
      // Pre-fill the price input if it's empty or matching previous suggestion
      if (!showtimeForm.basePrice || showtimeForm.basePrice === suggestedPrice?.toString()) {
        setShowtimeForm(prev => ({ ...prev, basePrice: price }));
      }
    } catch (err) {
      console.error("Lỗi tính toán giá gợi ý:", err);
    }
  };

  // =========================================================================
  // Showtime Actions
  // =========================================================================
  const handleShowtimeSubmit = async (e) => {
    e.preventDefault();
    if (!showtimeForm.movieId || !showtimeForm.screenRoomId || !showtimeForm.startTime || !showtimeForm.basePrice) {
      handleShowAlert("Vui lòng điền đầy đủ các thông tin bắt buộc!", false);
      return;
    }

    const payload = {
      movieId: parseInt(showtimeForm.movieId),
      screenRoomId: parseInt(showtimeForm.screenRoomId),
      startTime: showtimeForm.startTime.length === 16 ? `${showtimeForm.startTime}:00` : showtimeForm.startTime,
      movieFormat: showtimeForm.movieFormat,
      basePrice: parseFloat(showtimeForm.basePrice),
      isActive: showtimeForm.isActive
    };

    try {
      if (editingShowtime) {
        await api.put(`/api/admin/showtimes/${editingShowtime.id}`, payload);
        handleShowAlert("Cập nhật lịch chiếu thành công!");
      } else {
        await api.post("/api/admin/showtimes", payload);
        handleShowAlert("Tạo lịch chiếu mới thành công!");
      }
      setShowtimeModalOpen(false);
      setEditingShowtime(null);
      setSuggestedPrice(null);
      fetchShowtimes();
    } catch (err) {
      handleShowAlert("Không thể lưu lịch chiếu: " + err.message, false);
    }
  };

  const handleEditShowtime = (st) => {
    setEditingShowtime(st);
    // Find cinema from screenRoom
    setShowtimeForm({
      movieId: st.movieId.toString(),
      cinemaId: st.cinemaId.toString(),
      screenRoomId: st.screenRoomId.toString(),
      movieFormat: st.movieFormat,
      startTime: st.startTime.substring(0, 16), // YYYY-MM-DDTHH:mm
      basePrice: st.basePrice.toString(),
      isActive: st.isActive
    });
    setShowtimeModalOpen(true);
  };

  const handleDeleteShowtime = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch chiếu này?")) return;
    try {
      await api.delete(`/api/admin/showtimes/${id}`);
      handleShowAlert("Hủy lịch chiếu thành công!");
      fetchShowtimes();
    } catch (err) {
      handleShowAlert("Không thể xóa lịch chiếu: " + err.message, false);
    }
  };

  // =========================================================================
  // Base Price Config Actions
  // =========================================================================
  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    if (!configForm.basePrice) {
      handleShowAlert("Vui lòng nhập giá vé cơ bản!", false);
      return;
    }

    const payload = {
      ...configForm,
      basePrice: parseFloat(configForm.basePrice)
    };

    try {
      if (editingConfig) {
        await api.put(`/api/admin/pricing/base-price-configs/${editingConfig.id}`, payload);
        handleShowAlert("Cập nhật cấu hình giá thành công!");
      } else {
        await api.post("/api/admin/pricing/base-price-configs", payload);
        handleShowAlert("Thêm cấu hình giá thành công!");
      }
      setConfigModalOpen(false);
      setEditingConfig(null);
      // Fetch fresh configs
      const configsData = await api.get("/api/admin/pricing/base-price-configs");
      setBaseConfigs(configsData);
    } catch (err) {
      handleShowAlert("Lỗi cấu hình giá: " + err.message, false);
    }
  };

  const handleEditConfig = (cfg) => {
    setEditingConfig(cfg);
    setConfigForm({
      roomType: cfg.roomType,
      movieFormat: cfg.movieFormat,
      isWeekend: cfg.isWeekend,
      timeSlot: cfg.timeSlot,
      basePrice: cfg.basePrice.toString()
    });
    setConfigModalOpen(true);
  };

  const handleDeleteConfig = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cấu hình giá này?")) return;
    try {
      await api.delete(`/api/admin/pricing/base-price-configs/${id}`);
      handleShowAlert("Xóa cấu hình giá thành công!");
      const configsData = await api.get("/api/admin/pricing/base-price-configs");
      setBaseConfigs(configsData);
    } catch (err) {
      handleShowAlert(err.message, false);
    }
  };

  // =========================================================================
  // Surcharge Inline Actions
  // =========================================================================
  const startEditingSurcharge = (item) => {
    setEditingSurchargeId(item.id);
    setEditingSurchargeValue(item.surcharge.toString());
  };

  const saveSurcharge = async (id, seatType) => {
    if (isNaN(parseFloat(editingSurchargeValue)) || parseFloat(editingSurchargeValue) < 0) {
      handleShowAlert("Giá trị phụ thu không hợp lệ!", false);
      return;
    }

    try {
      await api.put(`/api/admin/pricing/seat-type-prices/${id}`, {
        seatType: seatType,
        surcharge: parseFloat(editingSurchargeValue)
      });
      handleShowAlert("Cập nhật phụ thu ghế thành công!");
      setEditingSurchargeId(null);
      // Refetch surcharges
      const surchargesData = await api.get("/api/admin/pricing/seat-type-prices");
      setSurcharges(surchargesData);
    } catch (err) {
      handleShowAlert("Không thể cập nhật phụ thu: " + err.message, false);
    }
  };

  // Helper formatting values
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    const dateFormatted = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    const timeFormatted = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    return `${timeFormatted} ${dateFormatted}`;
  };

  // Filtering showtimes for display
  const filteredShowtimes = showtimes.filter(st => {
    if (filterCinemaId && st.cinemaId?.toString() !== filterCinemaId.toString()) return false;
    if (filterRoomId && st.screenRoomId?.toString() !== filterRoomId.toString()) return false;
    if (filterDate) {
      const showtimeDay = st.startTime.substring(0, 10);
      if (showtimeDay !== filterDate) return false;
    }
    return true;
  });

  // Filtering base configs for display
  const filteredBaseConfigs = baseConfigs.filter(cfg => {
    if (filterConfigRoomType && cfg.roomType !== filterConfigRoomType) return false;
    if (filterConfigMovieFormat && cfg.movieFormat !== filterConfigMovieFormat) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Calendar className="text-rose-500" size={32} />
            Quản lý Lịch chiếu & Cấu hình Giá vé
          </h1>
          <p className="text-zinc-400 mt-1">
            Lập lịch biểu chiếu phim và thiết lập hệ thống định giá vé động tự động theo rạp, khung giờ và loại ghế.
          </p>
        </div>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <Info size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <Info size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab("showtimes")}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "showtimes"
              ? "border-rose-600 text-white"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Clock size={18} />
          Lịch chiếu suất chiếu
        </button>
        <button
          onClick={() => setActiveTab("basePrices")}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "basePrices"
              ? "border-rose-600 text-white"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Coins size={18} />
          Ma trận Giá gốc
        </button>
        <button
          onClick={() => setActiveTab("surcharges")}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "surcharges"
              ? "border-rose-600 text-white"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <DollarSign size={18} />
          Phụ thu Loại ghế
        </button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
          <span className="ml-3 text-zinc-400">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* TAB CONTENT: SHOWTIMES LIST */}
      {!loading && activeTab === "showtimes" && (
        <ShowtimesTab
          filteredShowtimes={filteredShowtimes}
          filterCinemaId={filterCinemaId}
          setFilterCinemaId={setFilterCinemaId}
          filterRoomId={filterRoomId}
          setFilterRoomId={setFilterRoomId}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          cinemas={cinemas}
          filterRooms={filterRooms}
          fetchFilterRooms={fetchFilterRooms}
          onAddShowtime={() => {
            setEditingShowtime(null);
            setShowtimeForm({
              movieId: "",
              cinemaId: cinemas.length > 0 ? cinemas[0].id.toString() : "",
              screenRoomId: "",
              movieFormat: "FORMAT_2D",
              startTime: "",
              basePrice: "",
              isActive: true
            });
            setSuggestedPrice(null);
            setShowtimeModalOpen(true);
          }}
          onEditShowtime={handleEditShowtime}
          onDeleteShowtime={handleDeleteShowtime}
          formatCurrency={formatCurrency}
        />
      )}

      {/* TAB CONTENT: BASE PRICE CONFIGS */}
      {!loading && activeTab === "basePrices" && (
        <BasePricesTab
          filteredBaseConfigs={filteredBaseConfigs}
          filterConfigRoomType={filterConfigRoomType}
          setFilterConfigRoomType={setFilterConfigRoomType}
          filterConfigMovieFormat={filterConfigMovieFormat}
          setFilterConfigMovieFormat={setFilterConfigMovieFormat}
          ROOM_TYPES={ROOM_TYPES}
          MOVIE_FORMATS={MOVIE_FORMATS}
          onAddConfig={() => {
            setEditingConfig(null);
            setConfigForm({
              roomType: "STANDARD",
              movieFormat: "FORMAT_2D",
              isWeekend: false,
              timeSlot: "DAYTIME",
              basePrice: ""
            });
            setConfigModalOpen(true);
          }}
          onEditConfig={handleEditConfig}
          onDeleteConfig={handleDeleteConfig}
          formatCurrency={formatCurrency}
        />
      )}

      {/* TAB CONTENT: SEAT SURCHARGES */}
      {!loading && activeTab === "surcharges" && (
        <SurchargesTab
          surcharges={surcharges}
          editingSurchargeId={editingSurchargeId}
          editingSurchargeValue={editingSurchargeValue}
          setEditingSurchargeValue={setEditingSurchargeValue}
          setEditingSurchargeId={setEditingSurchargeId}
          startEditingSurcharge={startEditingSurcharge}
          saveSurcharge={saveSurcharge}
          formatCurrency={formatCurrency}
        />
      )}

      {/* SHOWTIME MODAL */}
      <ShowtimeModal
        isOpen={showtimeModalOpen}
        onClose={() => setShowtimeModalOpen(false)}
        editingShowtime={editingShowtime}
        showtimeForm={showtimeForm}
        setShowtimeForm={setShowtimeForm}
        cinemas={cinemas}
        movies={movies}
        rooms={rooms}
        suggestedPrice={suggestedPrice}
        estimatedEndTime={estimatedEndTime}
        formatCurrency={formatCurrency}
        onSubmit={handleShowtimeSubmit}
        MOVIE_FORMATS={MOVIE_FORMATS}
      />

      {/* BASE PRICE CONFIG MODAL */}
      <BasePriceConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        editingConfig={editingConfig}
        configForm={configForm}
        setConfigForm={setConfigForm}
        onSubmit={handleConfigSubmit}
        ROOM_TYPES={ROOM_TYPES}
        MOVIE_FORMATS={MOVIE_FORMATS}
        TIME_SLOTS={TIME_SLOTS}
      />
    </div>
  );
}
