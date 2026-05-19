'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useTranslation } from 'react-i18next'

type Experience = {
  id: number
  company: string
  role: string
  role_es?: string
  period: string
  description: string
  description_es?: string
  tags: string[]
  current: boolean
}

export default function Experience() {
  const { t, i18n } = useTranslation()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const fetchExperience = async () => {
      const { data } = await supabase.from('experience').select('*').order('created_at', { ascending: false })
      setExperiences(data || [])
      setLoading(false)
    }
    fetchExperience()
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section id="experience" style={{ padding: isMobile ? '60px 20px 40px' : '80px 60px 60px 120px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: false }} style={{ marginBottom: 48 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.2em', display: 'block', marginBottom: 10 }}>
          {t('experience.label')}
        </span>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {t('experience.title')}
        </h2>
      </motion.div>

      {/* TIMELINE */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '1px', background: 'var(--border)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {experiences.map((exp, i) => (
              <motion.div key={exp.id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: false }} style={{ paddingLeft: 32, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -5, top: 6, width: 11, height: 11, borderRadius: '50%', background: exp.current ? 'var(--text-secondary)' : 'var(--border)', border: '2px solid var(--bg-primary)' }} />
                <div style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{exp.company}</h3>
                        {exp.current && (
                          <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 999, background: 'rgba(201,169,110,0.15)', color: 'var(--text-secondary)', border: '1px solid rgba(201,169,110,0.3)', letterSpacing: '0.1em' }}>
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{i18n.language === 'es' && exp.role_es ? exp.role_es : exp.role}</p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.05em' }}>{exp.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 14 }}>{i18n.language === 'es' && exp.description_es ? exp.description_es : exp.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {exp.tags.map((tag, ti) => (
                      <span key={ti} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}