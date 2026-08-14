import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre | Nova Escola Politécnica do Huambo</title>
        <meta name="description" content="Conheça a nossa missão, valores e abordagem pedagógica na Nova Escola Politécnica do Huambo." />
      </Head>

      <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
        <Header />

        <main className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Sobre</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Uma escola que prepara jovens para o futuro.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              A Nova Escola Politécnica do Huambo nasceu para oferecer uma educação de qualidade, com rigor académico, atenção ao desenvolvimento humano e uma visão clara de futuro.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Somos uma instituição comprometida com a excelência, a curiosidade, o pensamento crítico e a formação de cidadãos responsáveis, capazes de contribuir para o desenvolvimento da comunidade e do país.
            </p>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Missão', text: 'Formar jovens íntegros, preparados académica e socialmente.' },
              { title: 'Visão', text: 'Ser referência em educação de qualidade no Huambo e em Angola.' },
              { title: 'Valores', text: 'Exigência, respeito, responsabilidade, inclusão e inovação.' },
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
