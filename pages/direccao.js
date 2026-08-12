import Head from 'next/head'
import Link from 'next/link'
import { getSession, signOut, useSession } from 'next-auth/react'

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session || !session.user || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default function DireccaoDashboard() {
  const { data: session } = useSession()
  const adminLinks = [
    {
      title: 'Reservas',
      href: '/direccao/reservas',
      description: 'Consultar, filtrar e acompanhar as reservas de vagas e o estado das solicitações.',
    },
    {
      title: 'Empregos',
      href: '/direccao/empregos',
      description: 'Adicionar novas candidaturas, ver todos os candidatos e aplicar filtros por estado, grau e área.',
    },
  ]

  return (
    <>
      <Head>
        <title>Direção — Painel administrativo</title>
        <meta name="description" content="Painel administrativo para reservas e candidaturas de emprego da escola." />
      </Head>

      <main className="min-h-screen bg-[#f6f3eb] text-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="rounded-[2rem] bg-[#08263a] p-10 text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">Direção</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Painel administrativo</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              Aceda rapidamente às áreas de reservas e candidaturas de emprego com filtros, gestão e acompanhamento do estado de cada pedido.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/" className="inline-flex items-center rounded-full bg-[#f2d79d] px-5 py-2.5 text-sm font-semibold text-[#08263a] shadow-sm transition hover:bg-[#f5dfae] focus:outline-none focus:ring-2 focus:ring-[#f2d79d] focus:ring-offset-2 focus:ring-offset-[#08263a]">
              Voltar para a página inicial
            </Link>

            {session ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="inline-flex items-center rounded-full bg-[#f2d79d] px-5 py-2.5 text-sm font-semibold text-[#08263a] shadow-sm transition hover:bg-[#f5dfae] focus:outline-none focus:ring-2 focus:ring-[#f2d79d] focus:ring-offset-2 focus:ring-offset-[#08263a]"
              >
                Sair
              </button>
            ) : null}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {adminLinks.map((section) => (
              <div key={section.title} className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7a5a15]">Administração</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{section.description}</p>
                <Link href={section.href} className="mt-6 inline-flex w-fit rounded-full bg-[#08263a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d3550]">
                  Aceder
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
