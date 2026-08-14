import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Curriculo() {
  return (
    <>
      <Head>
        <title>Currículo | Nova Escola Politécnica do Huambo</title>
        <meta name="description" content="Saiba mais sobre o currículo da Nova Escola Politécnica do Huambo e a formação que prepara alunos para os desafios do futuro." />
      </Head>

      <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
        <Header />

        <main className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">Currículo</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Um currículo pensado para o desenvolvimento completo do aluno.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              O currículo da nossa escola combina conhecimento académico, desenvolvimento de competências sociais e emocionais, pensamento crítico e contexto real para preparar cada aluno para desafios concretos.
            </p>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Académico', text: 'Ensino estruturado, rigoroso e orientado para a aprendizagem profunda.' },
              { title: 'Humano', text: 'Atenção ao bem-estar, à convivência e ao respeito pelos valores.' },
              { title: 'Prático', text: 'Atividades que conectam teoria e realidade, ciência e sociedade.' },
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
