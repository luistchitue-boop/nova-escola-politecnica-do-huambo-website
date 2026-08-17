import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

const programs = [
  {
    title: 'Informática',
    text: 'Desenvolvimento de competências digitais, sistemas, redes e soluções tecnológicas aplicadas.',
    image: '/informatica.png',
  },
  {
    title: 'Construção civil',
    text: 'Preparação para a execução, gestão e controlo de projectos de engenharia e obra civil.',
    image: '/obras_de_construcao_civil.png',
  },
  {
    title: 'Electrónica',
    text: 'Conhecimentos essenciais em circuitos, automação, manutenção e tecnologias eletrónicas modernas.',
    image: '/electronica.png',
  },
  {
    title: 'Contabilidade',
    text: 'Formação prática e teórica para a gestão financeira, organização e acompanhamento de processos empresariais.',
    image: '/contabilidade.png',
  },
]

export default function Impph() {
  return (
    <>
      <Head>
        <title>IMPPH | Nova Escola Politécnica do Huambo</title>
        <meta name="description" content="Descubra o IMPPH e como ele fortalece a aprendizagem, a inovação e a formação profissional na Nova Escola Politécnica do Huambo." />
      </Head>

      <div className="flex min-h-screen flex-col bg-[#f6f3eb] text-slate-800">
        <Header />

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Instituto Médio Privado Politécnico do Huambo</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Formação profissional, científica e cidadã.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              O IMPPH reforça a ligação entre escola, inovação, investigação aplicada e desenvolvimento de competências práticas, preparando os estudantes para enfrentar os desafios sociais e profissionais do futuro.
            </p>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            {programs.map((program) => (
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
                  <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{program.title}</h2>
                  <p className="mt-4 text-base leading-7 text-slate-100 sm:text-[1.05rem]">{program.text}</p>
                </div>
              </div>
            ))}
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
