"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import Swal from "sweetalert2";

type Experience = {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  current: boolean;
};

const empty: Omit<Experience, "id"> = {
  company: "",
  role: "",
  period: "",
  description: "",
  tags: [],
  current: false,
};

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(empty);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("experience")
      .select("*")
      .order("created_at", { ascending: false });
    setExperiences(data || []);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setTagsInput("");
    setModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      description: exp.description,
      tags: exp.tags,
      current: exp.current,
    });
    setTagsInput(exp.tags.join(", "));
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.company || !form.role || !form.period || !form.description) return;
    setSaving(true);

    const payload = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (editing) {
      await supabase.from("experience").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("experience").insert(payload);
    }

    await fetchExperiences();
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Experience?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#0f0f0f",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#27272a",
    });

    if (!result.isConfirmed) return;

    await supabase.from("experience").delete().eq("id", id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />

      <main className="lg:ml-[250px] min-h-screen px-4 sm:px-6 lg:px-8 pt-[90px] lg:pt-8 pb-8">
        <div className="max-w-[1100px] mx-auto">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Experience</h1>
              <p className="text-sm text-white/40 mt-1">Manage your work history</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-white text-black hover:scale-[1.02] transition w-full sm:w-auto justify-center"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </div>

          {/* LIST */}
          {loading ? (
            <div className="text-white/40 text-sm">Loading...</div>
          ) : experiences.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-20 flex items-center justify-center text-white/35 text-sm">
              No experience entries yet
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {experiences.map((exp) => (
                <div key={exp.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 transition">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h2 className="text-base font-bold">{exp.company}</h2>
                        {exp.current && (
                          <span className="text-[9px] px-2 py-[3px] rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                            CURRENT
                          </span>
                        )}
                        <span className="text-xs text-white/30 font-mono">{exp.period}</span>
                      </div>
                      <p className="text-sm text-white/50 mb-2">{exp.role}</p>
                      <p className="text-sm text-white/40 leading-relaxed mb-3">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag, i) => (
                          <span key={i}
                            className="text-[11px] px-2 py-1 rounded-md border border-white/10 text-white/40 bg-white/[0.03]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEdit(exp)}
                        className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-white/60 hover:text-white">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(exp.id)}
                        className="w-9 h-9 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition text-red-300">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-[24px] p-6 md:p-8 max-h-[90vh] overflow-y-auto bg-[#111] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
              <X size={15} />
            </button>

            <h2 className="text-lg font-bold mb-6">
              {editing ? "Edit Experience" : "Add Experience"}
            </h2>

            <div className="flex flex-col gap-4">
              {[
                { label: "Company", key: "company", placeholder: "AllCloud" },
                { label: "Role", key: "role", placeholder: "Junior Software Developer" },
                { label: "Period", key: "period", placeholder: "Oct 2025 — Present" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-white/50 mb-1.5 block">{label}</label>
                  <input
                    value={(form as any)[key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none bg-black/20 border border-white/10 focus:border-white/30 transition"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your role and responsibilities..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none bg-black/20 border border-white/10 focus:border-white/30 transition"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Tags (comma separated)</label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="C#, ASP.NET, React"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none bg-black/20 border border-white/10 focus:border-white/30 transition"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="current"
                  checked={form.current}
                  onChange={(e) => setForm((prev) => ({ ...prev, current: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="current" className="text-sm text-white/60">
                  Current position
                </label>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 bg-white text-black hover:opacity-90 transition disabled:opacity-50"
              >
                <Save size={15} />
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Experience"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}