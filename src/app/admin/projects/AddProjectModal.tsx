"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X } from "lucide-react";

export default function AddProjectModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [live, setLive] = useState("");
  const [github, setGithub] = useState("");
  const [tech, setTech] = useState("");
  const [features, setFeatures] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImages = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    setImages((prev) => [...prev, ...files]);

    const urls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews((prev) => [...prev, ...urls]);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim())
      return showToast("Title wajib diisi");

    if (!desc.trim())
      return showToast("Description wajib diisi");

    if (!tech.trim())
      return showToast("Tech wajib diisi");

    if (!features.trim())
      return showToast("Features wajib diisi");

    if (images.length === 0)
      return showToast("Upload minimal 1 gambar");

    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const image of images) {
        const fileName = `${Date.now()}-${Math.random()}-${image.name}`;

        const { error: uploadError } =
          await supabase.storage
            .from("projects")
            .upload(fileName, image);

        if (uploadError) continue;

        const { data } = supabase.storage
          .from("projects")
          .getPublicUrl(fileName);

        uploadedUrls.push(data.publicUrl);
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            title,
            description: desc,
            live_url: live || null,
            github_url: github || null,
            technologies: tech,
            key_features: features,
            image_url: uploadedUrls[0] || null,
            image_urls: uploadedUrls,
          },
        ])
        .select()
        .single();

      if (error) {
        showToast("Gagal simpan");
        setLoading(false);
        return;
      }

      onAdd(data);

      setTitle("");
      setDesc("");
      setLive("");
      setGithub("");
      setTech("");
      setFeatures("");
      setImages([]);
      setPreviews([]);

      onClose();
    } catch {
      showToast("Terjadi error");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#1A202C]/70 backdrop-blur-md flex items-center justify-center px-3 sm:px-6 py-6">
      {toast && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm shadow-lg z-50">
          {toast}
        </div>
      )}

      <div
        className="w-full max-w-[820px] rounded-3xl overflow-hidden max-h-[92vh] flex flex-col"
        style={{ background: '#1E2738', border: '1px solid #3A4A5C' }}
      >
        {/* HEADER */}
        <div className="px-4 sm:px-6 py-4 border-b border-[#3A4A5C] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-semibold">
              Add Project
            </h2>

            <p className="text-[11px] sm:text-xs mt-1" style={{ color: 'rgba(201,169,110,0.7)' }}>
              Simple portfolio input
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
        >
          {/* TITLE + UPLOAD */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
            {/* TITLE */}
            <div>
              <label className="text-xs" style={{ color: 'rgba(201,169,110,0.7)' }}>
                Project Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full mt-2 px-4 py-3 rounded-2xl outline-none text-sm"
                style={{ background: 'rgba(26,32,44,0.8)', border: '1px solid #3A4A5C' }}
              />
            </div>

            {/* UPLOAD */}
            <div>
              <label className="text-xs block mb-2" style={{ color: 'rgba(201,169,110,0.7)' }}>
                Upload
              </label>

              <label className="h-[86px] border border-dashed border-[#3A4A5C] rounded-2xl bg-[#1E2738] hover:bg-[#151515] transition flex flex-col items-center justify-center cursor-pointer">
                <Upload
                  size={18}
                  className="mb-1 text-white/50"
                />

                <span className="text-[11px] text-white/60">
                  Upload Images
                </span>

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleImages}
                />
              </label>
            </div>
          </div>

          {/* PREVIEW */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {previews.map((img, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden border border-[#3A4A5C]"
                >
                  <img
                    src={img}
                    className="w-full h-24 object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-[#1A202C]/70 hover:bg-[#1A202C] rounded-full p-1.5"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs" style={{ color: 'rgba(201,169,110,0.7)' }}>
              Description
            </label>

            <textarea
              value={desc}
              onChange={(e) =>
                setDesc(e.target.value)
              }
              className="w-full mt-2 px-4 py-3 min-h-[110px] rounded-2xl outline-none resize-none text-sm"
              style={{ background: 'rgba(26,32,44,0.8)', border: '1px solid #3A4A5C' }}
            />
          </div>

          {/* URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="Live URL"
              value={live}
              onChange={(e) =>
                setLive(e.target.value)
              }
              className="px-4 py-3 rounded-2xl outline-none text-sm"
              style={{ background: 'rgba(26,32,44,0.8)', border: '1px solid #3A4A5C' }}
            />

            <input
              placeholder="Github URL"
              value={github}
              onChange={(e) =>
                setGithub(e.target.value)
              }
              className="px-4 py-3 rounded-2xl outline-none text-sm"
              style={{ background: 'rgba(26,32,44,0.8)', border: '1px solid #3A4A5C' }}
            />
          </div>

          {/* TECH */}
          <input
            placeholder="Technologies"
            value={tech}
            onChange={(e) =>
              setTech(e.target.value)
            }
            className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
            style={{ background: 'rgba(26,32,44,0.8)', border: '1px solid #3A4A5C' }}
          />

          {/* FEATURES */}
          <input
            placeholder="Key Features"
            value={features}
            onChange={(e) =>
              setFeatures(e.target.value)
            }
            className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
            style={{ background: 'rgba(26,32,44,0.8)', border: '1px solid #3A4A5C' }}
          />

          {/* ACTION */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-[#3A4A5C] hover:bg-[#3A4A5C]/30 transition text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition text-sm"
              style={{ background: '#C9A96E', color: '#1A202C' }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
