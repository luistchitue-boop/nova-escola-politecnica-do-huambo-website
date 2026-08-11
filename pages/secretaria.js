import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

const services = [
  {
    title: 'Atendimento ao aluno',
    description: 'Consultas de horário, faltas, declarações e acompanhamento escolar.',
  },
  {
    title: 'Suporte aos pais',
    description: 'Informação sobre pagamentos, matrículas, reuniões e comunicação com a escola.',
  },
  {
    title: 'Serviços administrativos',
    description: 'Pedido de documentos, certificados e respostas rápidas a questões do dia a dia.',
  },
]

export default function SecretariaPage() {
  return (
    <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
      <Head>
        <title>Secretaria — Nova Escola Politécnica do Huambo</title>
        <meta name="description" content="Serviços de secretaria para alunos, pais e famílias da Nova Escola Politécnica do Huambo." />
      </Head>

      <Header />

      <main className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] bg-[#08263a] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">Secretaria</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">A sua porta de entrada aos serviços da escola.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            Aqui, alunos e famílias encontram um espaço simples para pedir informações, marcar contactos e resolver questões administrativas com rapidez e confiança.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Como podemos ajudar?</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            A secretaria disponibiliza apoio para matrículas, documentos, comunicações escolares, dúvidas sobre calendário e acompanhamento de processos administrativos.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="mailto:geral@escolahuambo.ao" className="rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550]">
              Contactar secretaria
            </a>
            <Link href="/" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Voltar à página inicial
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
