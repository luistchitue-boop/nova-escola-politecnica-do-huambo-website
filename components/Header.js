import { useState, useEffect } from 'react'
import Image from 'next/image'
import Logo from '../logo.png'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle('dark', stored === 'dark')
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem('theme', next) } catch (e) {}
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <Image src={Logo} alt="Nova Escola Politécnica do Huambo" width={56} height={56} className="h-12 w-12 object-contain" />
            <span className="leading-tight text-slate-900 dark:text-white">
              <span className="block text-base font-black uppercase tracking-[0.16em] text-[#08263a] dark:text-white">
                Nova Escola
              </span>
              <span className="mt-1 block bg-gradient-to-r from-[#b98b2d] via-[#d4a94f] to-[#08263a] bg-clip-text text-xs font-semibold uppercase tracking-[0.3em] text-transparent dark:from-[#f2d79d] dark:via-[#c49b40] dark:to-[#ffffff]">
                Politécnica do Huambo
              </span>
            </span>
          </a>
        </div>

        <nav aria-label="Main Navigation" className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex dark:text-slate-200">
          <a href="#about" className="transition hover:text-[#b98b2d]">Sobre</a>
          <a href="#courses" className="transition hover:text-[#b98b2d]">Programas</a>
          <a href="#admissions" className="transition hover:text-[#b98b2d]">Admissões</a>
          <a href="#mission" className="transition hover:text-[#b98b2d]">Missão</a>
          <div className="ml-2 flex items-center gap-3">
            <a href="/secretaria" className="rounded-full bg-[#08263a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d3550]">Secretaria</a>
            <button onClick={toggleTheme} aria-label="Alternar tema" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {theme === 'dark' ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.02 0l.707-.707M6.343 6.343l-.707-.707"/></svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z"/></svg>
              )}
            </button>
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <button onClick={toggleTheme} aria-label="Alternar tema" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">
            {theme === 'dark' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.02 0l.707-.707M6.343 6.343l-.707-.707"/></svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z"/></svg>
            )}
          </button>
          <a href="/secretaria" className="rounded-full bg-[#08263a] px-3 py-2 text-sm font-semibold text-white">Secretaria</a>
        </div>
      </div>

      <div className={`md:hidden ${open ? 'block' : 'hidden'}`} role="navigation" aria-label="Mobile Navigation">
        <div className="mx-auto max-w-6xl px-6 pb-4 lg:px-8">
          <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <a onClick={() => setOpen(false)} href="#about" className="block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">Sobre</a>
            <a onClick={() => setOpen(false)} href="#courses" className="mt-1 block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">Programas</a>
            <a onClick={() => setOpen(false)} href="#admissions" className="mt-1 block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">Admissões</a>
            <a onClick={() => setOpen(false)} href="#mission" className="mt-1 block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">Missão</a>
          </div>
        </div>
      </div>
    </header>
  )
}
