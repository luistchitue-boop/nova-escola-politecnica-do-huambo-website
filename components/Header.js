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
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-gray-900 dark:border-gray-800 transition-colors duration-200">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <a href="/" className="flex items-center gap-3">
            <Image src={Logo} alt="Nova Escola Politécnica do Huambo" width={56} height={56} className="h-12 w-12 object-contain" />
            <span className="text-base font-semibold leading-tight dark:text-white">
              <span className="block">Nova Escola Politécnica</span>
              <span className="block text-xs font-normal">do Huambo</span>
            </span>
          </a>

        </div>

        <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-6 text-sm text-gray-700 dark:text-gray-200">
          <a href="#about" className="hover:underline">Sobre</a>
          <a href="#courses" className="hover:underline">Programas</a>
          <a href="#admissions" className="hover:underline">Admissões</a>
          <a href="#mission" className="hover:underline">Missão</a>
          <div className="ml-2 flex items-center gap-3">
            <a href="#apply" className="rounded-md btn-gold px-4 py-2 text-sm font-medium shadow">Admissões</a>
            <button onClick={toggleTheme} aria-label="Alternar tema" className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {theme === 'dark' ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.02 0l.707-.707M6.343 6.343l-.707-.707"/></svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z"/></svg>
              )}
            </button>
          </div>
        </nav>

        <div className="flex gap-2 md:hidden items-center">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <button onClick={toggleTheme} aria-label="Alternar tema" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200">
            {theme === 'dark' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.02 0l.707-.707M6.343 6.343l-.707-.707"/></svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z"/></svg>
            )}
          </button>
          <a href="#apply" className="ml-2 inline-flex items-center justify-center rounded-md btn-gold px-3 py-2 text-sm font-medium shadow md:hidden">Admissões</a>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${open ? 'block' : 'hidden'}`} role="navigation" aria-label="Mobile Navigation">
        <div className="mx-auto max-w-6xl px-6 pb-4">
          <div className="rounded-md border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <a onClick={() => setOpen(false)} href="#about" className="block px-2 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">Sobre</a>
            <a onClick={() => setOpen(false)} href="#courses" className="mt-1 block px-2 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">Cursos</a>
            <a onClick={() => setOpen(false)} href="#admissions" className="mt-1 block px-2 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">Admissões</a>
            <a onClick={() => setOpen(false)} href="#contact" className="mt-1 block px-2 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">Contacto</a>
          </div>
        </div>
      </div>
    </header>
  )
}
