'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronDown, ChevronUp,
  ExternalLink, GitBranch, Sparkles, Code2, Layers, Box,
} from 'lucide-react'
import usePortfolio from '@/hooks/usePortfolio'
import PortfolioCard from './PortfolioCard'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function PortfolioShowcase() {
  const { projects, certificates, techStacks, loading } = usePortfolio()

  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('projects')
  const [showAllProjects, setShowAllProjects] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      setActiveTab(e.detail)
    }
    window.addEventListener('setPortfolioTab', handler)

    // Also check sessionStorage on mount
    const savedTab = sessionStorage.getItem('portfolioTab')
    if (savedTab) {
      setActiveTab(savedTab)
      sessionStorage.removeItem('portfolioTab')
    }

    return () => window.removeEventListener('setPortfolioTab', handler)
  }, [])

  const displayedProjects = showAllProjects ? projects : projects.slice(0, 3)

  return (
    <>
      {/* PROJECT MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#0f0f0f] p-6 md:p-8"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X size={16} />
              </button>

              {selectedProject.image_url && (
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 mb-5">
                  <img src={selectedProject.image_url} className="w-full h-full object-cover" />
                </div>
              )}

              <h2 className="text-2xl font-bold mb-1">{selectedProject.title}</h2>
              <div className="w-12 h-[2px] rounded-full bg-gradient-to-r from-white/40 to-white/5 mb-4" />

              <p className="text-[13px] text-white/60 leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <Code2 size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {Array.isArray(selectedProject.technologies)
                        ? selectedProject.technologies.length
                        : (selectedProject.technologies || '').split(',').filter(Boolean).length}
                    </p>
                    <p className="text-[10px] text-white/40">Technologies</p>
                  </div>
                </div>
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <Layers size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {Array.isArray(selectedProject.key_features)
                        ? selectedProject.key_features.length
                        : (selectedProject.key_features || '').split(',').filter(Boolean).length}
                    </p>
                    <p className="text-[10px] text-white/40">Key Features</p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 size={13} className="text-white/60" />
                  <p className="text-[13px] font-semibold">Technologies</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(selectedProject.technologies)
                    ? selectedProject.technologies
                    : (selectedProject.technologies || '').split(',').filter(Boolean)
                  ).map((t: string, i: number) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] text-white/70">
                      <Box size={10} className="text-white/40" />
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={13} className="text-white/60" />
                  <p className="text-[13px] font-semibold">Key Features</p>
                </div>
                <ul className="space-y-2">
                  {(Array.isArray(selectedProject.key_features)
                    ? selectedProject.key_features
                    : (selectedProject.key_features || '').split(',').filter(Boolean)
                  ).map((f: string, i: number) => (
                    <li key={i} className="flex gap-2 text-[12px] text-white/60">
                      <span className="text-white/30">•</span>
                      {f.trim()}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                {selectedProject.live_url ? (
                  <a href={selectedProject.live_url} target="_blank"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition text-[13px]">
                    <ExternalLink size={13} /> Live Demo
                  </a>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/30 text-[13px]">
                    <ExternalLink size={13} /> No Link
                  </div>
                )}
                {selectedProject.github_url ? (
                  <a href={selectedProject.github_url} target="_blank"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition text-[13px]">
                    <GitBranch size={13} /> GitHub
                  </a>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/30 text-[13px]">
                    <GitBranch size={13} /> No Link
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CERTIFICATE MODAL */}
      <AnimatePresence>

        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0f0f0f] p-6 md:p-8"
            >
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X size={16} />
              </button>

              <div className="w-full rounded-2xl overflow-hidden border border-white/10 mb-5">
                <img src={selectedCertificate.image_url} className="w-full object-contain" />
              </div>

              <h2 className="text-xl font-bold mb-1">{selectedCertificate.title}</h2>
              <div className="w-10 h-[2px] rounded-full bg-gradient-to-r from-white/40 to-white/5 mb-3" />

              {selectedCertificate.issuer && (
                <p className="text-[12px] text-white/50 mb-1">
                  Issued by <span className="text-white/70">{selectedCertificate.issuer}</span>
                </p>
              )}

              {selectedCertificate.date_issued && (
                <p className="text-[12px] text-white/40 mb-4">{selectedCertificate.date_issued}</p>
              )}

              {selectedCertificate.description && (
                <p className="text-[13px] text-white/60 leading-relaxed mb-5">
                  {selectedCertificate.description}
                </p>
              )}

              {selectedCertificate.credential_url && (
                
                 <a href={selectedCertificate.credential_url}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition text-[13px] w-fit"
                    >
                  <ExternalLink size={13} /> View Credential
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="portfolio"
        className="w-full max-w-[1450px] mx-auto px-8 md:px-12 lg:px-20 pt-24 pb-24 text-white"
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Portfolio Showcase</h1>
          <p className="text-white/55 max-w-xl mx-auto text-sm md:text-base">
            Explore my journey through projects, certifications, and technical expertise.
          </p>
        </motion.div>

        {/* TABS */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-3xl rounded-full border border-white/10 bg-white/5 p-2 flex gap-2 backdrop-blur-xl">
            {['projects', 'certificates', 'techstack'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  if (tab !== 'projects') setShowAllProjects(false)
                }}
                className={`flex-1 rounded-full py-3 text-sm transition-all duration-300 ${
                  activeTab === tab ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {tab === 'projects' ? 'Projects' : tab === 'certificates' ? 'Certificates' : 'Tech Stack'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45 }}
          >
            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.75, ease: smoothEase } }}
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1"
                >
                  <AnimatePresence mode="popLayout">
                    {!loading && displayedProjects.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{ duration: 0.55, delay: i * 0.04, ease: smoothEase }}
                      >
                        <PortfolioCard
                          index={i}
                          title={item.title}
                          description={item.description}
                          image={item.image_url}
                          live_url={item.live_url}
                          id={item.id}
                          onDetails={() => setSelectedProject(item)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {!loading && projects.length > 3 && (
                  <motion.div layout transition={{ duration: 0.6, ease: smoothEase }} className="flex justify-center">
                    <motion.button
                      layout
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowAllProjects(!showAllProjects)}
                      className="px-6 py-3 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl text-sm text-white/75 hover:text-white transition flex items-center gap-2"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={showAllProjects ? 'less' : 'more'}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-center gap-2"
                        >
                          {showAllProjects ? <><ChevronUp size={16} /> See Less</> : <><ChevronDown size={16} /> See More</>}
                        </motion.div>
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            )}

            {/* CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1">
                {!loading && certificates.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 25, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedCertificate(item)}
                    className="group cursor-pointer rounded-[26px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                  >
                    <div className="rounded-2xl overflow-hidden border border-white/10 h-56">
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-center text-white/90">
                      {item.title}
                    </h3>
                  </motion.div>
                ))}
              </div>
            )}

            {/* TECH STACK */}
            {activeTab === 'techstack' && (
              <div className="min-h-[360px] flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-5xl w-full">
                  {!loading && techStacks?.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.04 }}
                      whileHover={{ y: -5, scale: 1.04 }}
                      className="group rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl flex flex-col items-center justify-center gap-3 h-[125px] w-[125px] mx-auto"
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-[70px] h-[70px] rounded-full bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
                        {item.logo_url ? (
                          <img src={item.logo_url} alt={item.name} className="relative z-10 w-[56px] h-[56px] object-contain" />
                        ) : (
                          <div className="relative z-10 w-[56px] h-[56px] rounded-2xl bg-white/10" />
                        )}
                      </div>
                      <p className="text-[11px] text-white/80 text-center leading-tight px-2 line-clamp-1">{item.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  )
}