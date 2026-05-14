'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

import AnimatedBackground from '@/components/AnimatedBackground'
import Navbar from '@/components/ui/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import PortfolioShowcase from '@/components/sections/PortfolioShowcase'
import ContactSection from '@/components/sections/contact/ContactSection'
import WelcomeScreen from '@/components/WelcomeScreen'
import Experience from '@/components/sections/Experience'

import { hasPlayedIntro, setIntroPlayed } from '@/lib/introState'

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [showApp, setShowApp] = useState(true)

useEffect(() => {
  const currentHash = window.location.hash
  const pathname = window.location.pathname

  if (currentHash === '#portfolio') {
    setShowWelcome(false)
    setShowApp(true)
    return
  }

  const navEntries = performance.getEntriesByType('navigation')
  const navigationType =
    navEntries.length > 0
      ? (navEntries[0] as PerformanceNavigationTiming).type
      : null

  const isReload = navigationType === 'reload'

  if (isReload && pathname === '/') {
    sessionStorage.removeItem('introPlayed')
    sessionStorage.removeItem('heroPlayed')
    if (window.location.hash) history.replaceState(null, '', '/')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (!hasPlayedIntro()) {
    setShowWelcome(true)
    setShowApp(true)
    const timer = setTimeout(() => {
      setShowWelcome(false)
      setShowApp(true)
      setIntroPlayed()
    }, 3200)
    return () => clearTimeout(timer)
  } else {
    setShowWelcome(false)
    setShowApp(true)
  }
}, [])

// Contador de visitas — useEffect separado
useEffect(() => {
  const countVisit = async () => {
    const { data } = await supabase
      .from('visits')
      .select('*')
      .single()

    if (data) {
      await supabase
        .from('visits')
        .update({ count: data.count + 1 })
        .eq('id', data.id)
    }

    // Log de la visita con referrer
    await supabase
      .from('visit_logs')
      .insert({ referrer: document.referrer || 'direct' })
  }
  countVisit()
}, [])


  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navbar />
        <Hero showApp={showApp} />
        <About />
        <Experience />
        <PortfolioShowcase />
        <ContactSection />
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            // exit={{ y: '-100%' }}
            // onAnimationStart={(definition) => {
            //   if (definition === 'exit') {
            //     setShowApp(true)
            //   }
            // }}
            // transition={{
            //   duration: 1.2,
            //   ease: [0.76, 0, 0.24, 1],
            // }}

            exit={{ y: '-100%', opacity: 0.8 }}
            onAnimationStart={(definition) => {
              if (definition === 'exit') {
                setShowApp(true)
              }
            }}
            transition={{
              duration: 1.4,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
            }}
          >
            <WelcomeScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}