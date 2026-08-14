import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Impph() {
  return (
    <>
      <Head>
        <title>IMPPH | Nova Escola Politécnica do Huambo</title>
        <meta name="description" content="Descubra o IMPPH e como ele fortalece a aprendizagem, a inovação e a formação profissional na Nova Escola Politécnica do Huambo." />
      </Head>

      <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
        <Header />

        <main className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">IMPPH</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Formação profissional, científica e cidadã.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              O IMPPH reforça a ligação entre escola, inovação, investigação aplicada e desenvolvimento de competências práticas, preparando os estudantes para enfrentar os desafios sociais e profissionais do futuro.
            </p>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Inovação', text: 'Aprendizagem focada na criação, resolução e pensamento crítico.' },
              { title: 'Profissionalização', text: 'Compromisso com a preparação para a vida ativa e para a carreira.' },
              { title: 'Cidadania', text: 'Formação orientada para valores, responsabilidade e participação social.' },
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
