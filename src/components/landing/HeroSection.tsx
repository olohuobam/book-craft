'use client'

import { useRef, useEffect, useState, Suspense } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import { useAuthModal } from '@/context/AuthModalContext'
import dynamic from 'next/dynamic'

// Dynamically import Three.js scene (heavy)
const BookScene3D = dynamic(() => import('./BookScene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-40 h-56 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 animate-pulse" />
    </div>
  ),
})

const SOCIAL_PROOF_AVATARS = ['A', 'K', 'M', 'R', 'J']

export default function HeroSection() {
  const { t } = useLanguage()
  const { requestAuthModal } = useAuthModal()
  const isMobile = useIsMobile(1024)
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 120])
  const opacityText = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    if (isMobile) return
    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      mouseX.set((e.clientX / innerWidth - 0.5) * 30)
      mouseY.set((e.clientY / innerHeight - 0.5) * 20)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [isMobile, mouseX, mouseY])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-[#050508]">

      {/* Deep space background */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Stars */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 15%, rgba(255,255,255,0.1) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 60%, rgba(255,255,255,0.12) 0%, transparent 100%),
            radial-gradient(1px 1px at 85% 45%, rgba(255,255,255,0.08) 0%, transparent 100%),
            radial-gradient(1px 1px at 10% 75%, rgba(255,255,255,0.1) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 85%, rgba(255,255,255,0.07) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 35% 20%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 92% 70%, rgba(255,255,255,0.12) 0%, transparent 100%)`
        }} />
        {/* Ambient glow left */}
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        {/* Ambient glow right */}
        <div className="absolute -right-40 top-1/3 w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-[100px]" />
        {/* Center warm glow */}
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-blue-500/5 blur-[100px]" />
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Main layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-screen pt-24 pb-16">

        {/* LEFT: Text content */}
        <motion.div style={{ y: yText, opacity: opacityText }} className="flex flex-col items-start">

          {/* Overline badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-blue-300 font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{t('landingOverline')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-white"
          >
            {t('landingHeadline1')}{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400">
                {t('landingHeadline2')}
              </span>
              {/* Underline glow */}
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 rounded-full opacity-60 blur-[1px]" />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed"
          >
            {t('landingSubheadline')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 mb-10 w-full sm:w-auto"
          >
            <button
              onClick={requestAuthModal}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)' }}
            >
              {/* Shimmer */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              {t('landingStartFree')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#book-types" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium text-white/70 border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/25 hover:text-white hover:bg-white/10 transition-all duration-300">
              {t('seeExamples')}
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {SOCIAL_PROOF_AVATARS.map((letter, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050508] flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${200 + i * 30}, 70%, 45%)` }}>
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-white/50 text-xs ml-1">4.9</span>
              </div>
              <p className="text-white/40 text-xs mt-0.5">12,000+ books created this week</p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: 3D Book Scene */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[500px] lg:h-[640px] flex items-center justify-center"
          style={isMobile ? {} : { x: springX, y: springY }}
        >
          {/* Glow behind scene */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-blue-500/10 blur-[80px]" />
          </div>
          <div className="w-full h-full">
            <BookScene3D />
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/25 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  )
}
