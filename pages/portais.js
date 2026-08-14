import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Portais() {
  return (
    <>
      <Head>
        <title>Portais | Nova Escola Politécnica do Huambo</title>
        <meta name="description" content="Aceda aos portais e serviços da Nova Escola Politécnica do Huambo para informação, gestão e recursos da comunidade escolar." />
      </Head>

      <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
        <Header />

        <main className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Portais</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Recursos, informação e acesso rápido ao serviço escolar.</h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/secretaria" className="rounded-full bg-[#08263a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550]">Secretaria</a>
              <a href="/direccao" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#b98b2d] hover:text-[#b98b2d]">Direção</a>
              <a href="/login" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#b98b2d] hover:text-[#b98b2d]">Login</a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
