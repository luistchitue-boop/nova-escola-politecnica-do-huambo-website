import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function EmpregosPage() {
  return (
    <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
      <Head>
        <title>Emprego & Carreira — Secretaria</title>
        <meta name="description" content="Envie a sua candidatura para vagas abertas na Nova Escola Politécnica do Huambo." />
      </Head>

      <Header />

      <main className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] bg-[#08263a] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">Emprego & Carreira</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Partilhe a sua candidatura para as vagas abertas.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            Preencha os seus dados para que a equipa possa analisar o seu perfil e entrar em contacto quando houver oportunidades adequadas.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-slate-700">Nome completo</label>
                <input id="nome" name="nome" type="text" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email</label>
                <input id="email" name="email" type="email" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="telefone" className="block text-sm font-semibold text-slate-700">Telefone</label>
                <input id="telefone" name="telefone" type="tel" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
              </div>
              <div>
                <label htmlFor="cargo" className="block text-sm font-semibold text-slate-700">Área ou função pretendida</label>
                <input id="cargo" name="cargo" type="text" placeholder="Ex: Docente, Administrativo, Técnico" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
              </div>
            </div>

            <div>
              <label htmlFor="experiencia" className="block text-sm font-semibold text-slate-700">Experiência e competências</label>
              <textarea id="experiencia" name="experiencia" rows="4" className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
            </div>

            <button type="submit" className="rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550]">
              Enviar candidatura
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
