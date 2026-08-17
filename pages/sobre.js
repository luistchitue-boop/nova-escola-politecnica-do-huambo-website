import { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

const galleryImages = [
  '/history/481155952_122138384810399123_7451127255158366070_n.jpg',
  '/history/481182523_122138384786399123_5983141325239954109_n.jpg',
  '/history/481206720_122138383880399123_6437077675329513207_n.jpg',
  '/history/481253293_122138384768399123_897455592029065684_n.jpg',
  '/history/481266736_122138384774399123_4766671439820355600_n.jpg',
  '/history/481662814_122138385002399123_8323179285674009198_n.jpg',
  '/history/481701536_122138384174399123_2056282051846452442_n.jpg',
  '/history/481778454_122138383844399123_8822610061105883745_n.jpg',
  '/history/481778628_122138385056399123_2966901830782529102_n.jpg',
  '/history/482304621_122138383814399123_184536098642793247_n.jpg',
]

const courseList = [
  'Técnico Médio de Obras de Construção Civil;',
  'Técnico Médio de Informática;',
  'Técnico Médio de Gestão de Sistemas Informáticos;',
  'Técnico Médio de Electricidade;',
  'Técnico Médio de Contabilidade e Gestão.',
]

const storyParagraphs = [
  'A Nova Escola Politécnica do Huambo (NEPH) é uma instituição privada de ensino, que foi inaugurada em 2008, a 25 de Fevereiro, em memória de Fernando Augusto Branco Marcelino (25/02/1931-20/10/1992), Engenheiro Agrónomo, professor e pai dos promotores da escola.',
  'A Nova Escola Politécnica do Huambo surgiu de um projecto da Escola Gustave Eiffel do Lobito, do Grupo Gustave Eiffel de Portugal e de outros sócios angolanos, principalmente da família Marcelino, com o objectivo de contribuir para a melhoria da qualidade do ensino na cidade do Huambo.',
  'A escola funciona nas instalações do ex-Seminário Menor do Espírito Santo, situadas na Rua Vicente Ferreira, Cidade Baixa. No ano de 2007, realizaram-se obras intensivas de renovação e adaptação das instalações, que se encontravam até essa data abandonadas e degradadas.',
  'A escola abriu em 2008 com o II Ciclo Politécnico, em regime regular e pós-laboral, com os seguintes cursos:',
  'Nessa altura, realizaram-se também alguns cursos intensivos de Informática, Secretariado e Língua Inglesa.',
  'Em 2009, surgiu a necessidade de abrir o ensino primário, com o objectivo de acompanhar os alunos desde os primeiros anos de escolaridade.',
  'Por falta de sustentabilidade, em 2011 a Escola deixou de oferecer o ensino pós-laboral. Em 2012, fechou o curso técnico de Gestão de Sistemas Informáticos e em 2013 o curso de Energia e Instalações Eléctricas.',
  'Começou as suas actividades pedagógicas com aproximadamente 60 alunos e 25 trabalhadores, hoje, em 2026, a escola tem mais de 1150 alunos e conta com uma equipa de 175 colaboradores.',
  'Actualmente, a Nova Escola Politécnica é a entidade detentora do Complexo Escolar Privado do Huambo e do Instituto Médio Privado Politécnico do Huambo.',
  'No CEPH, desenvolvem-se actividades lectivas do Ensino Geral, especificamente do Ensino Primário, do I Ciclo e do II Ciclo.',
  'No II Ciclo, são administrados os cursos de Ciências Físicas Biológicas e Ciências Económico-Jurídicas.'
]

export default function Sobre() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % galleryImages.length)
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  const showImages = galleryImages.slice(activeIndex, activeIndex + 3)
  if (showImages.length < 3) {
    showImages.push(...galleryImages.slice(0, 3 - showImages.length))
  }

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1))
  }

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % galleryImages.length)
  }

  return (
    <>
      <Head>
        <title>Sobre | Nova Escola Politécnica do Huambo</title>
        <meta
          name="description"
          content="Conheça a história da Nova Escola Politécnica do Huambo, a sua fundação, evolução e identidade educativa."
        />
      </Head>

      <div className="flex min-h-screen flex-col bg-[#f6f3eb] text-slate-800">
        <Header />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="relative p-3">
              <div className="overflow-hidden rounded-[1.5rem]">
                <div className="grid gap-3 md:grid-cols-3">
                  {showImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.25rem]">
                      <img
                        src={image}
                        alt={`Fotografia histórica da NEPH ${index + 1}`}
                        className="h-64 w-full object-cover transition duration-500 hover:scale-105 md:h-80"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Imagem anterior"
                  onClick={goToPrevious}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  ‹
                </button>
                <div className="flex gap-2">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-dot`}
                      type="button"
                      aria-label={`Ir para a imagem ${index + 1}`}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        index === activeIndex ? 'bg-[#b98b2d]' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Próxima imagem"
                  onClick={goToNext}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  ›
                </button>
              </div>

              <p className="mt-4 text-center text-sm italic text-slate-500 sm:text-base">
                Fotografias tiradas no dia da inauguração, a 25 de Fevereiro de 2008.
              </p>
            </div>

            <article className="px-5 pb-10 pt-7 sm:px-8 lg:px-12 lg:pb-14 lg:pt-10">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b2d]">História</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-5xl">
                A história da Nova Escola Politécnica do Huambo
              </h1>

              <div className="mt-8 space-y-6 text-base leading-8 text-slate-700 sm:text-lg">
                {storyParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 20)}-${index}`}>
                    {paragraph}
                  </p>
                ))}

                <ul className="space-y-2 pl-6 text-base leading-8 text-slate-700 sm:text-lg">
                  {courseList.map((course) => (
                    <li key={course} className="list-disc">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
