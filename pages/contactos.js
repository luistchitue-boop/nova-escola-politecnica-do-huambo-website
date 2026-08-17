import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Contactos() {
  return (
    <>
      <Head>
        <title>Contactos | Nova Escola Politécnica do Huambo</title>
        <meta name="description" content="Contacte a Nova Escola Politécnica do Huambo para saber mais sobre matrículas, informação e apoio às famílias." />
      </Head>

      <div className="flex min-h-screen flex-col bg-[#f6f3eb] text-slate-800">
        <Header />

        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-20 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Contactos</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Estamos disponíveis para apoiar a sua família.</h1>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8f4ea] p-6">
                <h2 className="text-xl font-semibold text-slate-900">Telefone</h2>
                <p className="mt-3 text-slate-700">+244 931 841 595</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8f4ea] p-6">
                <h2 className="text-xl font-semibold text-slate-900">Email</h2>
                <p className="mt-3 text-slate-700">apoio@neph.ao</p>
              </div>
            </div>
            <p className="mt-8 text-lg leading-8 text-slate-600">
              Para informações sobre matrículas, visitas, calendário escolar e apoio ao aluno, pode entrar em contacto connosco e a nossa equipa estará disponível para o ajudar.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
