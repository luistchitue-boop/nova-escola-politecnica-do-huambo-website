import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const registrationSchema = z.object({
  inscricao: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: 'O número de inscrição deve conter exatamente 6 inteiros.' })
    .min(6, { message: 'O número de inscrição deve conter exatamente 6 inteiros.' })
    .max(6, { message: 'O número de inscrição deve conter exatamente 6 inteiros.' }),
})

export default function WhatsAppPage() {
  const [form, setForm] = useState({ inscricao: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const value = form.inscricao.trim()
    const result = registrationSchema.safeParse({ inscricao: value })

    if (!result.success) {
      const nextFieldErrors = result.error.issues.reduce((accumulator, issue) => {
        const fieldName = issue.path[0]
        if (fieldName) accumulator[fieldName] = issue.message
        return accumulator
      }, {})

      setFieldErrors(nextFieldErrors)
      setError('')
      setIsModalOpen(false)
      return
    }

    setFieldErrors({})
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/whatsapp-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enrollmentNumber: value }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Não foi possível encontrar o grupo de WhatsApp.')
        setIsModalOpen(false)
        return
      }

      setWhatsappLink(data.whatsappLink)
      setIsModalOpen(true)
    } catch (requestError) {
      setError('Não foi possível contactar o servidor. Tente novamente.')
      setIsModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
      <Head>
        <title>WhatsApp — Secretaria</title>
        <meta name="description" content="Aceda aos grupos informativos da secretaria por WhatsApp." />
      </Head>

      <Header />

      <main className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        {isModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-900">Acesso confirmado</h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-lg font-medium text-slate-500 transition hover:text-slate-700"
                  aria-label="Fechar modal"
                >
                  ×
                </button>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                O seu acesso foi validado. Pode entrar no grupo de WhatsApp da turma do aluno clicando no link abaixo.
              </p>

              <a
                href={whatsappLink || 'https://chat.whatsapp.com/3jKQX7rZk5S1w9uQh4mB2F'}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe5d]"
              >
                Entrar no grupo do WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : null}

        <div className="rounded-[2rem] bg-[#08263a] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">WhatsApp</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Aceda aos grupos informativos da secretaria.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            Introduza o número de inscrição do aluno para receber as informações mais relevantes no WhatsApp.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="inscricao" className="block text-sm font-semibold text-slate-700">
                Número de inscrição do aluno
              </label>
              <input
                id="inscricao"
                name="inscricao"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={form.inscricao}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/\D/g, '').slice(0, 6)
                  setForm({ inscricao: nextValue })
                  if (fieldErrors.inscricao) {
                    setFieldErrors((current) => {
                      const next = { ...current }
                      delete next.inscricao
                      return next
                    })
                  }
                  if (error) {
                    setError('')
                  }
                }}
                placeholder="Ex: 202601"
                aria-invalid={Boolean(fieldErrors.inscricao || error)}
                aria-describedby={fieldErrors.inscricao || error ? 'inscricao-error' : undefined}
                className={`mt-3 w-full rounded-2xl border px-4 py-3 text-slate-800 outline-none ring-0 focus:border-[#b98b2d] ${
                  fieldErrors.inscricao || error ? 'border-red-400 bg-red-50' : 'border-slate-300'
                }`}
              />
              {fieldErrors.inscricao || error ? (
                <p id="inscricao-error" className="mt-2 text-sm font-medium text-red-600">
                  {fieldErrors.inscricao || error}
                </p>
              ) : null}
            </div>

            <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550] disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'A verificar...' : 'Continuar para o WhatsApp'}
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
