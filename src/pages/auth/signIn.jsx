import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import t1 from "../../assets/t1.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

// const BrandIcons = () => (
//   <div className="flex items-center gap-6 opacity-40">
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
//       <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/>
//     </svg>
//     <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10c0-1.5-.4-3-1-4.3C19.5 9.3 17 11 14 11c-2.2 0-4-1.8-4-4 0-2 1.3-3.7 3-4.5C12.7 2.2 12.3 2 12 2z"/>
//     </svg>
//     <svg width="20" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,20 2,20"/></svg>
//     <svg width="18" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//     </svg>
//     <svg width="16" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>
//   </div>
// );

import { authService } from "../../api/authService";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");
    try {
      const response = await authService.signIn(data);
      console.log("Sign in success:", response);
      // For professional approach, store token if needed, or just redirect
      if (response.success) {
        // Store token in cookies for frontend route protection
        const token = response.data?.token;
        if (token) {
          document.cookie = `token=${token}; path=/; max-age=${2 * 24 * 60 * 60}; samesite=strict`;
        }
        navigate("/dashboard");
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-300";
  const inputNormal = "border-gray-200 bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100";
  const inputError = "border-red-300 bg-red-50";

  return (
    <div className="min-h-screen flex bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* LEFT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex w-[44%] relative bg-gradient-to-br from-[#e6f4f4] via-[#edf7f7] to-[#dff0f0] flex-col items-center justify-between py-16 px-12 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center flex-1 justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-[28px] font-bold text-gray-900 mb-2 leading-tight"
          >
            Manage your testing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-sm text-gray-500 font-normal max-w-[220px] leading-relaxed"
          >
            More effectively with optimized workflows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 w-full max-w-[340px]"
          >
            <img
              src={t1}
              alt="Dashboard illustration"
              className="w-full h-auto object-contain drop-shadow-2xl rounded-2xl"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="relative z-10"
        >
          {/* <BrandIcons /> */}
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[400px]">
          {/* Header */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
              Sign in to your account
            </h1>
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-emerald-600 font-semibold hover:underline">
                Get started
              </Link>
            </p>
          </motion.div>

          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg"
            >
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">Email address</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                })}
                placeholder="you@example.com"
                className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </motion.div>

            {/* Password */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-gray-600 font-medium">Password</label>
                <Link to="/forgot" className="text-xs text-emerald-600 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className={`relative border rounded-lg transition-all focus-within:ring-2 focus-within:ring-gray-100 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus-within:border-gray-400"
                }`}>
                <input
                  type={showPwd ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  placeholder="6+ characters"
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </motion.div>

            {/* Submit */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="pt-1">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.005 }}
                whileTap={{ scale: loading ? 1 : 0.995 }}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Signing in...
                    </motion.span>
                  ) : (
                    <motion.span key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Sign in
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* Terms */}
            <motion.p custom={4} variants={fadeUp} initial="hidden" animate="visible" className="text-xs text-gray-400 text-center">
              By signing in, I agree to{" "}
              <Link to="/terms" className="text-gray-700 font-semibold underline">Terms of service</Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-gray-700 font-semibold underline">Privacy policy</Link>.
            </motion.p>
          </form>
          {/* 
          Divider
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium tracking-widest">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </motion.div>

          Social icons
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="flex justify-center gap-5">
            {[
              {
                label: "Google",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ),
              },
              {
                label: "GitHub",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#24292e">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                ),
              },
              {
                label: "X",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                  </svg>
                ),
              },
            ].map(({ label, icon }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md flex items-center justify-center transition-all"
                aria-label={label}
              >
                {icon}
              </motion.button>
            ))}
          </motion.div> */}
        </div>
      </div>
    </div>
  );
}