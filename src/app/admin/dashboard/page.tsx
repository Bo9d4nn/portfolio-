"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import { Eye, Users, MessageSquare, Layers, RefreshCcw, TrendingUp, Globe } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState({
    projects: 0, certificates: 0, comments: 0, pinned: 0, visits: 0,
  });
  const [recentComments, setRecentComments] = useState<any[]>([]);
  const [visitLogs, setVisitLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace("/admin/login"); return; }
    setAuthorized(true);
    fetchDashboard();
  };

  const fetchDashboard = async () => {
    try {
      const [projectsRes, certificatesRes, commentsRes, pinnedRes, recentCommentsRes, visitsRes, logsRes] =
        await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("certificates").select("*", { count: "exact", head: true }),
          supabase.from("comments").select("*", { count: "exact", head: true }),
          supabase.from("comments").select("*", { count: "exact", head: true }).eq("is_pinned", true),
          supabase.from("comments").select("*").order("created_at", { ascending: false }).limit(20),
          supabase.from("visits").select("count").single(),
          supabase.from("visit_logs").select("*").order("visited_at", { ascending: false }).limit(50),
        ]);

      setStats({
        projects: projectsRes.count || 0,
        certificates: certificatesRes.count || 0,
        comments: commentsRes.count || 0,
        pinned: pinnedRes.count || 0,
        visits: visitsRes.data?.count || 0,
      });
      setRecentComments(recentCommentsRes.data || []);
      setVisitLogs(logsRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
    setLoading(false);
  };

  const getReferrerLabel = (ref: string) => {
    if (!ref || ref === 'direct') return { label: 'Direct', color: '#C9A96E' };
    if (ref.includes('linkedin')) return { label: 'LinkedIn', color: '#0A66C2' };
    if (ref.includes('github')) return { label: 'GitHub', color: '#E8D5B0' };
    if (ref.includes('google')) return { label: 'Google', color: '#4285F4' };
    if (ref.includes('twitter') || ref.includes('x.com')) return { label: 'Twitter/X', color: '#1DA1F2' };
    try {
      return { label: new URL(ref).hostname, color: 'rgba(232,213,176,0.5)' };
    } catch {
      return { label: ref.slice(0, 30), color: 'rgba(232,213,176,0.5)' };
    }
  };

  const cards = [
    { icon: Eye, title: "Total Projects", value: stats.projects },
    { icon: Users, title: "Certificates", value: stats.certificates },
    { icon: MessageSquare, title: "Comments", value: stats.comments },
    { icon: Layers, title: "Pinned", value: stats.pinned },
    { icon: TrendingUp, title: "Total Visits", value: stats.visits },
  ];

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A202C', color: '#F5ECD7' }}>
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#1A202C', color: '#F5ECD7' }}>
      <Sidebar />
      <main className="lg:ml-[250px] pt-[95px] lg:pt-6 min-h-screen px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-[1400px] mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#F5ECD7' }}>Dashboard</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(201,169,110,0.7)' }}>Welcome back, Admin</p>
            </div>
            <button onClick={fetchDashboard}
              className="h-11 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm group transition-all duration-300"
              style={{ border: '1px solid #3A4A5C', background: 'rgba(201,169,110,0.06)', color: '#E8D5B0' }}>
              <RefreshCcw size={14} className="group-hover:rotate-180 transition duration-500" />
              Refresh
            </button>
          </div>

          {/* TOP CARDS */}
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="group rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-1"
                  style={{ border: '1px solid #3A4A5C', background: 'rgba(45,55,72,0.6)' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs mb-2" style={{ color: 'rgba(201,169,110,0.7)' }}>{card.title}</p>
                      <h2 className="text-[24px] sm:text-[26px] font-bold leading-none" style={{ color: '#F5ECD7' }}>
                        {loading ? "..." : card.value}
                      </h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid #3A4A5C', color: '#C9A96E' }}>
                      <Icon size={15} />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(58,74,92,0.5)' }}>
                    <p className="text-[10px]" style={{ color: 'rgba(201,169,110,0.4)' }}>Database synced</p>
                    <TrendingUp size={12} style={{ color: 'rgba(201,169,110,0.4)' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

            {/* RECENT COMMENTS */}
            <div className="xl:col-span-2 rounded-2xl p-5 sm:p-6"
              style={{ border: '1px solid #3A4A5C', background: 'rgba(45,55,72,0.4)' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-medium" style={{ color: '#F5ECD7' }}>Recent Comments</h2>
                  <p className="text-xs mt-1" style={{ color: 'rgba(201,169,110,0.5)' }}>Latest user activity</p>
                </div>
                <span className="text-xs" style={{ color: 'rgba(201,169,110,0.5)' }}>Live DB</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                {loading ? (
                  <div className="text-sm" style={{ color: 'rgba(232,213,176,0.3)' }}>Loading...</div>
                ) : recentComments.length === 0 ? (
                  <div className="text-sm" style={{ color: 'rgba(232,213,176,0.3)' }}>No comments yet</div>
                ) : recentComments.map((comment, i) => (
                  <div key={i} className="rounded-xl px-4 py-4"
                    style={{ border: '1px solid #3A4A5C', background: 'rgba(45,55,72,0.4)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0"
                          style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
                          {comment.name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[13px] font-medium truncate" style={{ color: '#F5ECD7' }}>{comment.name}</p>
                            <span className="text-[10px]" style={{ color: 'rgba(201,169,110,0.4)' }}>
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[12px] mt-1 line-clamp-2 leading-relaxed" style={{ color: 'rgba(232,213,176,0.5)' }}>
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                      <div className="text-[11px] shrink-0" style={{ color: 'rgba(201,169,110,0.6)' }}>
                        ❤️ {comment.likes || 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDE PANEL */}
            <div className="space-y-4">
              {[
                { title: "Projects", desc: `${stats.projects} total projects` },
                { title: "Certificates", desc: `${stats.certificates} certificates` },
                { title: "Comments", desc: `${stats.comments} comments` },
                { title: "Pinned", desc: `${stats.pinned} highlighted` },
                { title: "Visits", desc: `${stats.visits} total visits` },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                  style={{ border: '1px solid #3A4A5C', background: 'rgba(45,55,72,0.4)' }}>
                  <p className="text-sm font-medium" style={{ color: '#F5ECD7' }}>{item.title}</p>
                  <p className="text-xs mt-2" style={{ color: 'rgba(201,169,110,0.6)' }}>
                    {loading ? "Loading..." : item.desc}
                  </p>
                  <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(58,74,92,0.5)' }}>
                    <span className="text-[11px]" style={{ color: 'rgba(201,169,110,0.4)' }}>Synced</span>
                    <span className="text-[11px]" style={{ color: '#C9A96E' }}>Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VISIT LOGS */}
          <div className="rounded-2xl p-5 sm:p-6"
            style={{ border: '1px solid #3A4A5C', background: 'rgba(45,55,72,0.4)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-medium flex items-center gap-2" style={{ color: '#F5ECD7' }}>
                  <Globe size={16} style={{ color: '#C9A96E' }} />
                  Visit Logs
                </h2>
                <p className="text-xs mt-1" style={{ color: 'rgba(201,169,110,0.5)' }}>
                  Last {visitLogs.length} visits with referrer source
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(201,169,110,0.1)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.2)' }}>
                {stats.visits} total
              </span>
            </div>

            {loading ? (
              <div className="text-sm" style={{ color: 'rgba(232,213,176,0.3)' }}>Loading logs...</div>
            ) : visitLogs.length === 0 ? (
              <div className="text-sm" style={{ color: 'rgba(232,213,176,0.3)' }}>No visits recorded yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(58,74,92,0.5)' }}>
                      <th className="text-left pb-3 text-xs font-medium" style={{ color: 'rgba(201,169,110,0.6)' }}>#</th>
                      <th className="text-left pb-3 text-xs font-medium" style={{ color: 'rgba(201,169,110,0.6)' }}>Source</th>
                      <th className="text-left pb-3 text-xs font-medium" style={{ color: 'rgba(201,169,110,0.6)' }}>Referrer</th>
                      <th className="text-left pb-3 text-xs font-medium" style={{ color: 'rgba(201,169,110,0.6)' }}>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitLogs.map((log, i) => {
                      const { label, color } = getReferrerLabel(log.referrer);
                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid rgba(58,74,92,0.2)' }}>
                          <td className="py-3 text-xs" style={{ color: 'rgba(201,169,110,0.4)' }}>
                            {visitLogs.length - i}
                          </td>
                          <td className="py-3">
                            <span className="text-xs px-2 py-1 rounded-md font-medium"
                              style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                              {label}
                            </span>
                          </td>
                          <td className="py-3 text-xs max-w-[300px] truncate" style={{ color: 'rgba(232,213,176,0.4)' }}>
                            {log.referrer || 'direct'}
                          </td>
                          <td className="py-3 text-xs" style={{ color: 'rgba(201,169,110,0.5)', fontFamily: 'monospace' }}>
                            {new Date(log.visited_at).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}