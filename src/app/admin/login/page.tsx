"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg("Invalid email or password");
    } else {
      setSuccessMsg("Login success, redirecting...");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A202C] relative overflow-hidden flex items-center justify-center px-4">
      {/* BG GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[400px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full bottom-[-120px] right-[-100px]" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div
          className="rounded-[32px] backdrop-blur-xl p-7 sm:p-8 shadow-[0_0_60px_rgba(255,255,255,0.03)]"
          style={{ background: 'rgba(45,55,72,0.4)', border: '1px solid #3A4A5C' }}
        >
          {/* TOP */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.06] border border-[#3A4A5C] flex items-center justify-center mb-4">
              <ShieldCheck size={28} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold" style={{ color: '#F5ECD7' }}>
              Admin Login
            </h1>

            <p className="text-sm mt-2" style={{ color: 'rgba(201,169,110,0.7)' }}>
              Login to access dashboard panel
            </p>
          </div>

          {/* SUCCESS */}
          {successMsg && (
            <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {successMsg}
            </div>
          )}

          {/* ERROR */}
          {errorMsg && (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMsg}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm mb-2 block" style={{ color: 'rgba(201,169,110,0.7)' }}>
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
              />

              <input
                type="email"
                placeholder="masukan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[56px] rounded-2xl pl-12 pr-4 text-white outline-none transition"
                style={{ background: 'rgba(26,32,44,0.8)', border: '1px solid #3A4A5C' }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-sm mb-2 block" style={{ color: 'rgba(201,169,110,0.7)' }}>
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="masukan password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full h-[56px] rounded-2xl pl-12 pr-14 text-white outline-none transition"
                style={{ background: 'rgba(26,32,44,0.8)', border: '1px solid #3A4A5C' }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-[56px] rounded-2xl font-medium hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: '#C9A96E', color: '#1A202C' }}
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Signing In...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
