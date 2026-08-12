import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

const accessCodeSchema = z.string().trim().regex(/^\d{6}$/, 'O código deve conter exatamente 6 dígitos.')

export default function ConsultarCandidaturaPage() {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [application, setApplication] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setApplication(null)

    const parsed = accessCodeSchema.safeParse(accessCode)

    if (!parsed.success) {
      const nextFieldErrors = parsed.error.issues.reduce((accumulator, issue) => {
        const fieldName = issue.path[0] || 'accessCode'
        accumulator[fieldName] = issue.message
        return accumulator
      }, {})

      setFieldErrors(nextFieldErrors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/emprego?accessCode=${encodeURIComponent(parsed.data)}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Não foi possível consultar a candidatura.')
        return
      }

      setApplication(data.application)
    } catch (requestError) {
      setError('Não foi possível consultar a candidatura. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
      <Head>
        <title>Consultar candidatura — Secretaria</title>
        <meta name="description" content="Consulte o estado da sua candidatura com o código de acesso recebido após a submissão." />
      </Head>

      <Header />

      <main className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] bg-[#08263a] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">Candidaturas</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Consulte o estado da sua candidatura.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            Introduza o código de acesso que recebeu após submeter a candidatura para acompanhar o processo.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="accessCode" className="block text-sm font-semibold text-slate-700">Código de acesso</label>
              <input
                id="accessCode"
                name="accessCode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={accessCode}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/\D/g, '').slice(0, 6)
                  setAccessCode(nextValue)
                  if (fieldErrors.accessCode) {
                    setFieldErrors((current) => {
                      const next = { ...current }
                      delete next.accessCode
                      return next
                    })
                  }
                  if (error) setError('')
                }}
                placeholder="123456"
                aria-invalid={Boolean(fieldErrors.accessCode || error)}
                aria-describedby={fieldErrors.accessCode || error ? 'accessCode-error' : undefined}
                className={`mt-3 w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:border-[#b98b2d] ${
                  fieldErrors.accessCode || error ? 'border-red-400 bg-red-50' : 'border-slate-300'
                }`}
              />
              {fieldErrors.accessCode || error ? (
                <p id="accessCode-error" className="mt-2 text-sm font-medium text-red-600">
                  {fieldErrors.accessCode || error}
                </p>
              ) : null}
            </div>

            <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550] disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'A consultar...' : 'Consultar candidatura'}
            </button>
          </form>

          {application ? (
            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Estado da candidatura</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-900">Código</p>
                  <p className="mt-1 font-bold tracking-[0.25em] text-red-700">{application.accessCode}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-900">Estado</p>
                  <p className="mt-1 text-slate-700">{application.status === 'pendente' ? 'Pendente' : application.status}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-900">Nome completo</p>
                  <p className="mt-1 text-slate-700">{application.fullName}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-900">Área / função</p>
                  <p className="mt-1 text-slate-700">{application.areaOfInterest}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-900">Grau académico</p>
                  <p className="mt-1 text-slate-700">{application.academicDegree}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-900">Disponibilidade</p>
                  <p className="mt-1 text-slate-700">{application.availability === 'imediata' ? 'Imediata' : 'Ocasional'}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <Link href="/secretaria/empregos" className="text-sm font-semibold text-[#08263a] underline decoration-[#f2d79d] decoration-2 underline-offset-4">
              Voltar para a candidatura
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
