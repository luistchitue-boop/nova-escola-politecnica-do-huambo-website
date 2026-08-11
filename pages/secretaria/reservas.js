import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function ReservasPage() {
  return (
    <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
      <Head>
        <title>Reservas — Secretaria</title>
        <meta name="description" content="Reserva de vaga para futuros anos letivos na Nova Escola Politécnica do Huambo." />
      </Head>

      <Header />

      <main className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] bg-[#08263a] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">Reservas</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Reserve a vaga do seu filho para futuros anos letivos.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            Preencha os detalhes abaixo para que a secretaria possa entrar em contacto e informar sobre as próximas disponibilidades.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="nome-pai" className="block text-sm font-semibold text-slate-700">Nome do responsável</label>
                <input id="nome-pai" name="nome-pai" type="text" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
              </div>
              <div>
                <label htmlFor="telefone" className="block text-sm font-semibold text-slate-700">Telefone</label>
                <input id="telefone" name="telefone" type="tel" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="nome-filho" className="block text-sm font-semibold text-slate-700">Nome da criança</label>
                <input id="nome-filho" name="nome-filho" type="text" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
              </div>
              <div>
                <label htmlFor="ano" className="block text-sm font-semibold text-slate-700">Ano de ingresso pretendido</label>
                <input id="ano" name="ano" type="text" placeholder="Ex: 2027/2028" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
              </div>
            </div>

            <div>
              <label htmlFor="observacoes" className="block text-sm font-semibold text-slate-700">Observações</label>
              <textarea id="observacoes" name="observacoes" rows="4" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
            </div>

            <button type="submit" className="rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550]">
              Enviar pedido de reserva
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
