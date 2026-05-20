'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)
  const [preview, setPreview] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!images || images.length === 0) return null

  const fullscreenPreview = preview && mounted ? createPortal(
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center"
      style={{ zIndex: 99999 }}
      onClick={() => setPreview(false)}
    >
      <button
        onClick={() => setPreview(false)}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        style={{ zIndex: 100000 }}
      >
        <X size={18} color="white" />
      </button>

      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent(p => p - 1) }}
          className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white text-2xl"
        >‹</button>
      )}

      <img
        src={images[current]}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {current < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent(p => p + 1) }}
          className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white text-2xl"
        >›</button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-6 flex justify-center gap-2">
          {images.map((_: string, i: number) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
              className={`rounded-full transition-all duration-300 ${current === i ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  ) : null

  return (
    <>
      {fullscreenPreview}

      <div className="mb-5">
        <div
          className="relative w-full h-36 rounded-2xl overflow-hidden border border-white/10 cursor-zoom-in"
          onClick={() => setPreview(true)}
        >
          <img src={images[current]} className="w-full h-full object-cover hover:scale-105 transition duration-500" />

          {current > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(p => p - 1) }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition text-white text-lg"
            >‹</button>
          )}
          {current < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(p => p + 1) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition text-white text-lg"
            >›</button>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {images.map((_: string, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${current === i ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}