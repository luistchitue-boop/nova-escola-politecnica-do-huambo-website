import { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

const heroSlides = [
  {
    title: 'Excelência académica. Formação integral.',
    description: 'A Nova Escola Politécnica do Huambo prepara líderes com pensamento crítico, valores sólidos e competências para um mundo em mudança.',
    bullets: [
      { value: '98%', label: 'Taxa de sucesso académico' },
      { value: '+50', label: 'Atividades extracurriculares' },
      { value: '20', label: 'Anos de experiência' },
    ],
    promo: 'Matrículas abertas para 2026/2027 — garanta a sua vaga.',
  },
  {
    title: 'Formação STEM e artes criativas.',
    description: 'Laboratórios modernos, projetos práticos e professores inspiradores para preparar alunos para o século XXI.',
    bullets: [
      { value: '100%', label: 'Apoio personalizado' },
      { value: '12', label: 'Clubes e oficinas' },
      { value: '5', label: 'Parcerias internacionais' },
    ],
    promo: 'Descubra o nosso currículo inovador e atividades diferenciadas.',
  },
  {
    title: 'Preparação para o futuro global.',
    description: 'Línguas, tecnologia e liderança são cada vez mais valorizadas. Cresça num ambiente seguro e exigente.',
    bullets: [
      { value: '9', label: 'Línguas oferecidas' },
      { value: '100%', label: 'Integração digital' },
      { value: '40+', label: 'Eventos de orientação' },
    ],
    promo: 'Reserve já a visita guiada e conheça a nossa comunidade académica.',
  },
]

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setHeroIndex((current) => (current + 1) % heroSlides.length), 7000)
    return () => clearInterval(interval)
  }, [])

  const prevSlide = () => setHeroIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)
  const nextSlide = () => setHeroIndex((current) => (current + 1) % heroSlides.length)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Head>
        <title>Nova Escola Politécnica do Huambo — Educação de Excelência</title>
        <meta name="description" content="Nova Escola Politécnica do Huambo — Formação integral, académica e humana." />
        <link rel="canonical" href="https://example.org/" />
        <meta property="og:title" content="Nova Escola Politécnica do Huambo — Educação de Excelência" />
        <meta property="og:description" content="Formação integral, académica e humana." />
        <meta property="og:image" content="/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nova Escola Politécnica do Huambo" />
        <meta name="twitter:description" content="Formação integral, académica e humana." />
        <meta name="twitter:image" content="/og-image.svg" />
      </Head>

      <Header />

      {/* Full-bleed hero */}
      <section className="w-full relative overflow-hidden hero text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 to-black/0 opacity-80 dark:opacity-70" />
        <div className="relative overflow-hidden bg-cover bg-center w-full" style={{ backgroundImage: "url('/hero.webp')" }}>
          <div className="bg-[linear-gradient(180deg,rgba(6,22,42,0.92),rgba(6,22,42,0.78))] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0.94),rgba(0,0,0,0.76))]">
            <div className="mx-auto max-w-6xl px-6 py-28">
              <div className="relative overflow-hidden">
                <div className="slide-wrapper flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${heroIndex * 100}%)` }}>
                  {heroSlides.map((slide, index) => (
                    <div key={index} className="min-w-full px-0 md:px-6">
                      <div className="md:flex md:items-center md:gap-10">
                        <div className="md:w-7/12 text-white">
                          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight font-heading text-white">{slide.title}</h1>
                          <p className="mt-4 text-lg max-w-2xl">{slide.description}</p>

                          <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/10 transition duration-300 ease-out hover:-translate-y-1 hover:bg-white/20 hover:shadow-2xl backdrop-blur-sm dark:bg-black/30 dark:border-white/10 dark:hover:bg-white/10">
                            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white">
                              <div className="min-w-[220px] font-medium">{slide.promo}</div>
                              <div className="flex items-center gap-2">
                                {heroSlides.map((_, dotIndex) => (
                                  <button
                                    key={dotIndex}
                                    type="button"
                                    onClick={() => setHeroIndex(dotIndex)}
                                    className={`h-2 w-2 rounded-full transition-transform duration-200 ease-out ${heroIndex === dotIndex ? 'bg-gold scale-125' : 'bg-white/40 hover:scale-125'} focus:outline-none focus:ring-2 focus:ring-gold`}
                                    aria-label={`Ir para slide ${dotIndex + 1}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3">
                            <button onClick={prevSlide} className="rounded-md border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20">Anterior</button>
                            <button onClick={nextSlide} className="rounded-md btn-gold px-5 py-3 text-sm font-medium shadow">Próximo</button>
                          </div>

                          <div className="mt-8 grid gap-6 sm:grid-cols-3 text-sm opacity-90">
                            {slide.bullets.map((bullet) => (
                              <div key={bullet.label} className="rounded-3xl border border-white/10 bg-white/10 p-4 transition duration-300 ease-out hover:-translate-y-1 hover:bg-white/20 hover:shadow-2xl">
                                <div className="text-2xl font-semibold">{bullet.value}</div>
                                <div className="text-xs">{bullet.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="mx-auto max-w-6xl px-6 py-16" role="main">
        <section id="about" className="mt-16 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Sobre a escola</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">A Nova Escola Politécnica do Huambo combina tradição pedagógica com metodologias modernas. Temos um corpo docente qualificado, instalações seguras e um programa educativo orientado para o sucesso académico e o desenvolvimento pessoal.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Valores</h3>
            <ul className="mt-4 list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>Respeito e responsabilidade</li>
              <li>Excelência académica</li>
              <li>Formação integral</li>
            </ul>
          </div>
        </section>

        <section id="courses" className="mt-16">
          <h2 className="text-2xl font-semibold">Cursos e Programas</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h4 className="font-medium">Ensino Básico</h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Programa equilibrado com foco no pensamento crítico.</p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h4 className="font-medium">Ensino Secundário</h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Preparação para o ensino superior e para a vida profissional.</p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h4 className="font-medium">Atividades Extracurriculares</h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Desporto, artes e clubes de ciências e tecnologia.</p>
            </div>
          </div>
        </section>

        <section id="admissions" className="mt-16">
          <h2 className="text-2xl font-semibold">Admissões</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">As candidaturas estão abertas. Contacte-nos para informações sobre prazos, requisitos e visitas guiadas.</p>
        </section>
        <section id="mission" className="mt-16 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-semibold">A nossa missão</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Promover o desenvolvimento integral dos alunos através de um ensino exigente, inclusivo e orientado para o futuro.</p>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Valorizamos o pensamento crítico, o trabalho em equipa e o respeito mútuo.</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm card-tilt dark:bg-gray-800 dark:border-gray-700">
              <h4 className="font-medium">Ambiente Seguro e Estimulante</h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Instalações modernas, apoio psicológico e recursos tecnológicos ao serviço do ensino.</p>
          </div>
        </section>

        <section id="testimonials" className="mt-16">
          <h2 className="text-2xl font-semibold">Depoimentos</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <blockquote className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-100">“A Nova Escola Politécnica do Huambo ajudou o meu filho a crescer academicamente e pessoalmente.”</p>
              <footer className="mt-4 text-sm text-gray-500 dark:text-gray-400">— Maria Silva, Encarregada de Educação</footer>
            </blockquote>
            <blockquote className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-100">“Ótima preparação para o ensino superior e para os desafios do século XXI.”</p>
              <footer className="mt-4 text-sm text-gray-500 dark:text-gray-400">— João Pereira, Ex-aluno</footer>
            </blockquote>
          </div>
        </section>

        <section id="contact" className="mt-16">
          <h2 className="text-2xl font-semibold">Contacto</h2>
          <p className="mt-4 text-gray-600">Telefone: +351 912 345 678 • Email: geral@escolaexemplo.pt</p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
