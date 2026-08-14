import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Ceph() {
  return (
    <>
      <Head>
        <title>CEPH | Nova Escola Politécnica do Huambo</title>
        <meta name="description" content="Conheça o CEPH e a formação de qualidade oferecida pela Nova Escola Politécnica do Huambo." />
      </Head>

      <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
        <Header />

        <main className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">CEPH</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Formação com base sólida e visão de futuro.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              O CEPH integra a formação académica, a capacidade de pesquisa e a preparação para o mundo profissional, com foco em competências fundamentais para a vida e para a cidadania.
            </p>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Rigor académico', text: 'Métodos de ensino que estimulam a aprendizagem profunda e a autonomia.' },
              { title: 'Competências práticas', text: 'Projetos e atividades que aproximam os alunos da realidade profissional.' },
              { title: 'Crescimento integral', text: 'Desenvolvimento de conhecimentos, atitudes, valores e responsabilidade.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
