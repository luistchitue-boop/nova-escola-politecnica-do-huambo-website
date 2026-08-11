import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function WhatsAppPage() {
  return (
    <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
      <Head>
        <title>WhatsApp — Secretaria</title>
        <meta name="description" content="Aceda aos grupos informativos da secretaria por WhatsApp." />
      </Head>

      <Header />

      <main className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] bg-[#08263a] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">WhatsApp</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Aceda aos grupos informativos da secretaria.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            Introduza o número de inscrição do aluno para receber as informações mais relevantes no WhatsApp.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-6">
            <div>
              <label htmlFor="inscricao" className="block text-sm font-semibold text-slate-700">
                Número de inscrição do aluno
              </label>
              <input
                id="inscricao"
                name="inscricao"
                type="text"
                placeholder="Ex: 2026001"
                className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-800 outline-none ring-0 focus:border-[#b98b2d]"
              />
            </div>

            <button type="submit" className="rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550]">
              Continuar para o WhatsApp
            </button>
          </form>

          <div className="mt-6">
            <Link href="/secretaria" className="text-sm font-semibold text-[#08263a] underline decoration-[#f2d79d] decoration-2 underline-offset-4">
              Voltar à secretaria
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
