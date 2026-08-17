import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

const heroContent = {
  eyebrow: 'Nossa identidade',
  title: 'Onde o Conhecimento Ganha Futuro',
  description: 'Há mais de 18 anos a formar gerações com excelência, inovação e compromisso.',
  stats: [],
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
        <title>Nova Escola Politécnica do Huambo | Escolas no Huambo</title>
        <meta name="description" content="Nova Escola Politécnica do Huambo é uma escola no Huambo com ensino de qualidade, formação integral e ambiente acolhedor para alunos e famílias." />
        <meta name="keywords" content="escolas no Huambo, Nova Escola Politécnica do Huambo, colégio politécnico do Huambo, melhor escola do Huambo, educação no Huambo, escola em Huambo" />
        <link rel="canonical" href="https://example.org/" />
        <meta property="og:title" content="Nova Escola Politécnica do Huambo | Escolas no Huambo" />
        <meta property="og:description" content="Escola no Huambo com formação integral, excelência académica e ambiente acolhedor para cada aluno." />
        <meta property="og:image" content="/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nova Escola Politécnica do Huambo" />
        <meta name="twitter:description" content="Escola no Huambo com formação integral, excelência académica e ambiente acolhedor para cada aluno." />
        <meta name="twitter:image" content="/og-image.svg" />
      </Head>

      <Header />

      <section className="relative isolate min-h-screen overflow-hidden bg-[#08263a] text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.webp')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,38,58,0.96)_0%,rgba(8,38,58,0.86)_48%,rgba(8,38,58,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,139,45,0.20),transparent_32%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 text-center">
            <div className="mx-auto max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white">{hero.eyebrow}</p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {hero.title}
              </h1>
              <p className="mt-6 mx-auto max-w-3xl text-xl leading-9 text-slate-100 sm:text-2xl">
                {hero.description}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="#admissions" className="rounded-full bg-[#c49b40] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0f172a]/20 transition hover:-translate-y-0.5 hover:bg-[#b98b2d]">
                  Solicitar informação
                </a>
                <a href="#about" className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                  Descobrir a nossa visão
                </a>
              </div>

              {hero.stats.length > 0 ? (
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {hero.stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                      <div className="text-2xl font-semibold text-white">{stat.value}</div>
                      <div className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

          </div>
        </div>
      </section>

      <main id="main-content" className="mx-auto max-w-6xl px-6 py-20 lg:px-8" role="main">
        <section id="about" className="relative isolate overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('/history.jpg')" }}
          />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(248,244,234,0.52))]" />

          <div className="relative z-20 grid gap-10 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">A nossa história</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                A Nova Escola Politécnica do Huambo (NEPH)
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                A Nova Escola Politécnica do Huambo (NEPH) é uma instituição privada de ensino, fundada a 25 de Fevereiro de 2008, com o propósito de contribuir para a melhoria da qualidade do ensino na cidade do Huambo.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Surgida de uma iniciativa do Grupo Gustave Eiffel de Portugal, da Escola Gustave Eiffel do Lobito e de parceiros angolanos, a instituição iniciou as suas actividades com cerca de 60 alunos e 25 colaboradores, oferecendo cursos do II Ciclo Politécnico em diversas áreas técnicas.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-[2px]">
                <h3 className="text-xl font-semibold text-slate-900">Crescimento e expansão</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Ao longo dos anos, a NEPH expandiu a sua oferta educativa, passando também a ministrar o Ensino Primário e o Ensino Geral. Em 2026, conta com mais de 1.150 alunos e 175 colaboradores, constituindo uma referência no sector privado de educação na província do Huambo.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8f4ea]/80 p-6 shadow-sm backdrop-blur-[2px]">
                <h3 className="text-xl font-semibold text-slate-900">Presença actual</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Actualmente, a Nova Escola Politécnica do Huambo é a entidade detentora do Complexo Escolar Privado do Huambo e do Instituto Médio Privado Politécnico do Huambo, disponibilizando uma formação que acompanha os alunos desde o Ensino Primário até ao II Ciclo.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="ceph" className="mt-20 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Complexo Escolar Privado do Huambo</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Aprendizagem com visão de futuro.</h2>
            </div>
          </div>

          <div id="curriculo-ceph" className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Ensino primário',
                text: 'Bases sólidas para a curiosidade, a autonomia e o desenvolvimento emocional.',
                image: '/ensino-primario.png',
              },
              {
                title: 'I ciclo',
                text: 'Preparação para estudos superiores, vida profissional e responsabilidade cívica.',
                image: '/primeiro-ciclo.png',
              },
              {
                title: 'II Ciclo',
                text: 'Desporto, artes, clubes STEM e projetos que enriquecem a experiência escolar.',
                image: '/segundo-ciclo.png',
              },
            ].map((program) => (
              <div
                key={program.title}
                className="relative isolate min-h-[260px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[#f8f4ea] p-6 shadow-sm"
                style={program.image ? {
                  backgroundImage: `url('${program.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                } : undefined}
              >
                {program.image ? (
                  <div className="absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(8,38,58,0.82),rgba(8,38,58,0.5))]" />
                ) : null}
                <div className="relative z-10 flex h-full flex-col justify-end">
                  <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{program.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-100 sm:text-[1.05rem]">{program.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="impph" className="mt-20 rounded-[2rem] border border-slate-200 bg-[#f8f4ea] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Instituto Médio Privado Politécnico do Huambo</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Programa orientado para a formação profissional, científica e cidadã.</h2>
          <div id="curriculo-impph" className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'Contabilidade',
                text: 'Formação prática e teórica para a gestão financeira, organização e acompanhamento de processos empresariais.',
                image: '/contabilidade.png',
              },
              {
                title: 'Obras de construção civil',
                text: 'Preparação para a execução, gestão e controlo de projectos de engenharia e obra civil.',
                image: '/obras_de_construcao_civil.png',
              },
              {
                title: 'Informática',
                text: 'Desenvolvimento de competências digitais, sistemas, redes e soluções tecnológicas aplicadas.',
                image: '/informatica.png',
              },
              {
                title: 'Electrónica',
                text: 'Conhecimentos essenciais em circuitos, automação, manutenção e tecnologias eletrónicas modernas.',
                image: '/electronica.png',
              },
            ].map((program) => (
              <div
                key={program.title}
                className="relative isolate min-h-[220px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[#f8f4ea] p-6 shadow-sm"
                style={program.image ? {
                  backgroundImage: `url('${program.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                } : undefined}
              >
                {program.image ? (
                  <div className="absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(8,38,58,0.82),rgba(8,38,58,0.5))]" />
                ) : null}
                <div className="relative z-10 flex h-full flex-col justify-end">
                  <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{program.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-100 sm:text-[1.05rem]">{program.text}</p>
                </div>
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

        <section id="mission" className="mt-20 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Missão, visão e valores</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Uma escola orientada para a excelência, o crescimento e o impacto positivo na comunidade.</h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8f4ea] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b98b2d]">Missão</p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                “Garantir um ensino de qualidade no Huambo, incentivando o gosto pela aprendizagem, autonomia e empenho para alcançar o sucesso.”
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8f4ea] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b98b2d]">Visão</p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                “Ser uma instituição educativa de excelência, que desenvolve o potencial de cada estudante e o prepara para ser um cidadão activo e responsável.”
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8f4ea] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b98b2d]">Valores</p>
              <ul className="mt-4 space-y-2 text-base leading-7 text-slate-700">
                <li>• Honestidade</li>
                <li>• Respeito</li>
                <li>• Dedicação</li>
                <li>• Solidariedade</li>
                <li>• Criatividade</li>
                <li>• Rigor</li>
                <li>• Inclusão</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="portais" className="mt-20 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Portais</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Acesso rápido aos serviços da escola.</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href="/secretaria" className="rounded-full bg-[#08263a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550]">Secretaria</a>
            <a href="/direccao" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#b98b2d] hover:text-[#b98b2d]">Direção</a>
            <a href="/login" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#b98b2d] hover:text-[#b98b2d]">Login</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
