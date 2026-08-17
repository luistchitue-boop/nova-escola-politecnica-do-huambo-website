import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

const programs = [
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
    title: 'II ciclo',
    text: 'Desporto, artes, clubes STEM e projetos que enriquecem a experiência escolar.',
    image: '/segundo-ciclo.png',
  },
]

export default function Ceph() {
  return (
    <>
      <Head>
        <title>CEPH | Nova Escola Politécnica do Huambo</title>
        <meta name="description" content="Conheça o CEPH e a formação de qualidade oferecida pela Nova Escola Politécnica do Huambo." />
      </Head>

      <div className="flex min-h-screen flex-col bg-[#f6f3eb] text-slate-800">
        <Header />

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">CEPH</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Formação com base sólida e visão de futuro.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              O CEPH integra a formação académica, a capacidade de pesquisa e a preparação para o mundo profissional, com foco em competências fundamentais para a vida e para a cidadania.
            </p>
          </section>

          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Aprendizagem com visão de futuro.</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {programs.map((program) => (
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
        </main>

        <Footer />
      </div>
    </>
  )
}
