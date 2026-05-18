import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, Loader2, Clapperboard } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-radial from-slate-900 via-zinc-950 to-black px-4 py-12 overflow-hidden">
      {/* Cinematic Background Lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-lg shadow-rose-600/30 mb-4"
          >
            <Clapperboard className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">CineVN</h2>
          <p className="text-zinc-400 text-sm mt-1">Trải nghiệm điện ảnh đỉnh cao trong tầm tay</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />

          <h3 className="text-xl font-bold text-white mb-6 text-center">Đăng nhập tài khoản</h3>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl p-3 mb-4 flex items-center justify-center font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-rose-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-600 focus:ring-1 focus:ring-rose-500/30 transition-all duration-300 outline-none text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-rose-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-600 focus:ring-1 focus:ring-rose-500/30 transition-all duration-300 outline-none text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-zinc-400 cursor-pointer">
                <input type="checkbox" className="mr-2 accent-rose-500 rounded border-zinc-800 bg-zinc-950/80" />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-rose-400 hover:text-rose-300 font-medium transition-colors">Quên mật khẩu?</a>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center border-t border-zinc-800 pt-6 text-sm text-zinc-500">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-rose-400 hover:text-rose-300 font-bold transition-colors">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
