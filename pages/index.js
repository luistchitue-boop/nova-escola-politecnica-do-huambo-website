import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

const heroContent = {
  eyebrow: 'Nossa identidade',
  title: 'Educação internacional com rigor, cuidado e propósito.',
  description: 'A Nova Escola Politécnica do Huambo prepara alunos para prosperarem como cidadãos confiantes, pensadores críticos e líderes éticos.',
  stats: [
    { value: '98%', label: 'sucesso académico' },
    { value: '+50', label: 'atividades extracurriculares' },
    { value: '20+', label: 'anos de experiência' },
  ],
  highlights: [
    'Currículo sólido com foco em pensamento crítico e resolução de problemas.',
    'Ambiente estimulante, seguro e acolhedor para cada etapa do percurso.',
    'Parcerias e projetos que conectam aprendizagem, tecnologia e impacto.',
  ],
  cta: 'Descubra as oportunidades de aprendizagem que esperam por si.',
}

export default function Home() {
  const hero = heroContent

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-slate-800 transition-colors duration-200">
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

      <section className="relative isolate overflow-hidden bg-[#08263a] text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.webp')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,38,58,0.96)_0%,rgba(8,38,58,0.86)_48%,rgba(8,38,58,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,139,45,0.20),transparent_32%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white">{hero.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">{hero.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#admissions" className="rounded-full bg-[#c49b40] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0f172a]/20 transition hover:-translate-y-0.5 hover:bg-[#b98b2d]">
                  Solicitar informação
                </a>
                <a href="#about" className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                  Descobrir a nossa visão
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {hero.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                    <div className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">Por que escolher a Nova Escola</div>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-200">
                {hero.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#f2d79d]" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-[1.5rem] bg-[#f8f4ea] p-6 text-slate-800">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Próximo passo</p>
                <p className="mt-2 text-lg font-semibold">{hero.cta}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="mx-auto max-w-6xl px-6 py-20 lg:px-8" role="main">
        <section id="about" className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">A nossa essência</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Uma escola que une excelência académica, cuidado humano e visão internacional.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              A Nova Escola Politécnica do Huambo oferece um ambiente de aprendizagem exigente, acolhedor e atual, preparado para formar alunos com espírito crítico, autonomia e responsabilidade social.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Excellence', text: 'Currículo forte, rigor académico e acompanhamento contínuo.' },
              { title: 'Inovação', text: 'Metodologias ativas, tecnologia e projetos com impacto real.' },
              { title: 'Cuidado', text: 'Bem-estar, orientação e atenção individual em cada etapa.' },
              { title: 'Comunidade', text: 'Uma cultura escolar inclusiva e orientada para a pertença.' },
            ].map((value) => (
              <div key={value.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="courses" className="mt-20 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Programas e percursos</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Aprendizagem com visão de futuro.</h2>
            </div>
            <a href="#admissions" className="text-sm font-semibold text-[#08263a] underline decoration-[#f2d79d] decoration-2 underline-offset-4">
              Explore as opções disponíveis
            </a>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Ensino Básico',
                text: 'Bases sólidas para a curiosidade, a autonomia e o desenvolvimento emocional.',
              },
              {
                title: 'Ensino Secundário',
                text: 'Preparação para estudos superiores, vida profissional e responsabilidade cívica.',
              },
              {
                title: 'Atividades extracurriculares',
                text: 'Desporto, artes, clubes STEM e projetos que enriquecem a experiência escolar.',
              },
            ].map((program) => (
              <div key={program.title} className="rounded-[1.5rem] border border-slate-200 bg-[#f8f4ea] p-6">
                <h3 className="text-xl font-semibold text-slate-900">{program.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{program.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="admissions" className="mt-20 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-[#08263a] p-8 text-white sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">Admissões</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Matrículas abertas para o próximo ano letivo.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-200">
              O processo de candidatura é simples e acompanhado pela nossa equipa, com informação clara sobre prazos, requisitos e visitas guiadas.
            </p>
            <a href="#contact" className="mt-8 inline-flex rounded-full bg-[#c49b40] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b98b2d]">
              Contacte a nossa equipa
            </a>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <ul className="space-y-4 text-sm leading-7 text-slate-600">
              <li className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#b98b2d]" /><span>Visitas guiadas presenciais e orientadas ao calendário escolar.</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#b98b2d]" /><span>Acompanhamento personalizado para famílias e candidatos.</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#b98b2d]" /><span>Informação clara sobre documentos, requisitos e próximos passos.</span></li>
            </ul>
          </div>
        </section>

        <section id="mission" className="mt-20 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">A nossa missão</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Formar jovens preparados para o futuro sem perder a essência humana.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Promovemos o desenvolvimento integral dos alunos através de ensino exigente, inclusivo e orientado para a excelência, com foco em valores, responsabilidade e bem-estar.
            </p>
          </div>

          <div className="grid gap-6">
            <blockquote className="rounded-[2rem] border border-slate-200 bg-[#f8f4ea] p-8">
              <p className="text-lg leading-8 text-slate-700">“A Nova Escola Politécnica do Huambo ajudou o meu filho a crescer academicamente e pessoalmente, com confiança e sentido de pertença.”</p>
              <footer className="mt-5 text-sm font-semibold text-slate-500">— Maria Silva, Encarregada de Educação</footer>
            </blockquote>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-3xl font-semibold text-[#08263a]">+1,000</div>
                <div className="mt-2 text-sm text-slate-600">alunos formados ao longo das nossas gerações</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-3xl font-semibold text-[#08263a]">100%</div>
                <div className="mt-2 text-sm text-slate-600">dedicação a um ambiente seguro e acolhedor</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
