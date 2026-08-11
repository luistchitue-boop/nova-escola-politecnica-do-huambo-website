import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const reservationSchema = z.object({
  parentName: z.string().trim().min(2, { message: 'O nome do responsável é obrigatório.' }),
  phone: z
    .string()
    .trim()
    .regex(/^\d{9}$/, { message: 'O telefone deve conter exatamente 9 dígitos.' }),
  studentName: z.string().trim().min(2, { message: 'O nome do estudante é obrigatório.' }),
  dateOfBirth: z.string().trim().min(1, { message: 'A data de nascimento é obrigatória.' }),
  admissionYear: z.string().trim().min(1, { message: 'O ano de ingresso é obrigatório.' }),
  intendedGrade: z.string().trim().min(1, { message: 'A classe pretendida é obrigatória.' }),
  hasSpecialNeeds: z.enum(['sim', 'nao'], {
    message: 'Selecione uma opção válida: sim ou não.',
  }),
  observations: z.string().trim().optional().default(''),
})

const gradeOptions = [
  '1ª classe',
  '2ª classe',
  '3ª classe',
  '4ª classe',
  '5ª classe',
  '6ª classe',
  '7ª classe',
  '8ª classe',
  '9ª classe',
  '10ª Ciências físicas e biológicas',
  '10ª Informática',
  '10ª Contabilidade e gestão',
  '10ª Obras de construção civil',
  '10ª Electrónica e telecomunicações',
  '10ª Ciências económicas e jurídicas',
  '11ª Ciências físicas e biológicas',
  '11ª Informática',
  '11ª Contabilidade e gestão',
  '11ª Obras de construção civil',
  '11ª Electrónica e telecomunicações',
  '11ª Ciências económicas e jurídicas',
  '12ª Ciências físicas e biológicas',
  '12ª Informática',
  '12ª Contabilidade e gestão',
  '12ª Obras de construção civil',
  '12ª Electrónica e telecomunicações',
  '12ª Ciências económicas e jurídicas',
  '13ª Informática',
  '13ª Contabilidade e gestão',
  '13ª Obras de construção civil',
  '13ª Electrónica e telecomunicações',
]

export default function ReservasPage() {
  const [form, setForm] = useState({
    parentName: '',
    phone: '',
    studentName: '',
    dateOfBirth: '',
    admissionYear: '',
    intendedGrade: '',
    hasSpecialNeeds: '',
    observations: '',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))

    if (fieldErrors[name]) {
      setFieldErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
    }

    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    const validationResult = reservationSchema.safeParse(form)

    if (!validationResult.success) {
      const nextFieldErrors = validationResult.error.issues.reduce((accumulator, issue) => {
        const fieldName = issue.path[0]
        if (fieldName) {
          accumulator[fieldName] = issue.message
        }
        return accumulator
      }, {})

      setFieldErrors(nextFieldErrors)
      setIsSubmitting(false)
      return
    }

    setFieldErrors({})

    try {
      const response = await fetch('/api/reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        if (response.status === 409) {
          setError('Já existe um pedido de reserva para este estudante.')
          return
        }

        setError(data.message || 'Não foi possível enviar a reserva.')
        return
      }

      setSuccess('Pedido de reserva enviado com sucesso. A secretaria entrará em contacto brevemente.')
      setForm({
        parentName: '',
        phone: '',
        studentName: '',
        dateOfBirth: '',
        admissionYear: '',
        intendedGrade: '',
        hasSpecialNeeds: '',
        observations: '',
      })
    } catch (submitError) {
      setError('Ocorreu um erro ao enviar o pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            Aviso: registos duplicados para o mesmo estudante podem resultar em desqualificação do pedido de reserva.
          </div>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="parentName" className="block text-sm font-semibold text-slate-700">Nome do responsável</label>
                <input
                  id="parentName"
                  name="parentName"
                  type="text"
                  value={form.parentName}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.parentName)}
                  aria-describedby={fieldErrors.parentName ? 'parentName-error' : undefined}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${
                    fieldErrors.parentName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {fieldErrors.parentName ? (
                  <p id="parentName-error" className="mt-2 text-sm font-medium text-red-600">
                    {fieldErrors.parentName}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Telefone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={9}
                  value={form.phone}
                  onChange={(event) => {
                    const nextValue = event.target.value.replace(/\D/g, '').slice(0, 9)
                    setForm((current) => ({ ...current, phone: nextValue }))

                    if (fieldErrors.phone) {
                      setFieldErrors((current) => {
                        const next = { ...current }
                        delete next.phone
                        return next
                      })
                    }

                    if (error) setError('')
                    if (success) setSuccess('')
                  }}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${
                    fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {fieldErrors.phone ? (
                  <p id="phone-error" className="mt-2 text-sm font-medium text-red-600">
                    {fieldErrors.phone}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="studentName" className="block text-sm font-semibold text-slate-700">Nome do estudante</label>
                <input
                  id="studentName"
                  name="studentName"
                  type="text"
                  value={form.studentName}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.studentName)}
                  aria-describedby={fieldErrors.studentName ? 'studentName-error' : undefined}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${
                    fieldErrors.studentName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {fieldErrors.studentName ? (
                  <p id="studentName-error" className="mt-2 text-sm font-medium text-red-600">
                    {fieldErrors.studentName}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-slate-700">Data de nascimento</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.dateOfBirth)}
                  aria-describedby={fieldErrors.dateOfBirth ? 'dateOfBirth-error' : undefined}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${
                    fieldErrors.dateOfBirth ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {fieldErrors.dateOfBirth ? (
                  <p id="dateOfBirth-error" className="mt-2 text-sm font-medium text-red-600">
                    {fieldErrors.dateOfBirth}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="admissionYear" className="block text-sm font-semibold text-slate-700">Ano de ingresso pretendido</label>
                <input
                  id="admissionYear"
                  name="admissionYear"
                  type="text"
                  placeholder="Ex: 2027/2028"
                  value={form.admissionYear}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.admissionYear)}
                  aria-describedby={fieldErrors.admissionYear ? 'admissionYear-error' : undefined}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${
                    fieldErrors.admissionYear ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {fieldErrors.admissionYear ? (
                  <p id="admissionYear-error" className="mt-2 text-sm font-medium text-red-600">
                    {fieldErrors.admissionYear}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="intendedGrade" className="block text-sm font-semibold text-slate-700">Classe pretendida</label>
                <select
                  id="intendedGrade"
                  name="intendedGrade"
                  value={form.intendedGrade}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.intendedGrade)}
                  aria-describedby={fieldErrors.intendedGrade ? 'intendedGrade-error' : undefined}
                  className={`mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#b98b2d] ${
                    fieldErrors.intendedGrade ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                >
                  <option value="">Selecione a classe</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
                {fieldErrors.intendedGrade ? (
                  <p id="intendedGrade-error" className="mt-2 text-sm font-medium text-red-600">
                    {fieldErrors.intendedGrade}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">O estudante tem alguma necessidade especial? (autismo, etc.)</label>
              <div className="mt-3 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="radio" name="hasSpecialNeeds" value="sim" checked={form.hasSpecialNeeds === 'sim'} onChange={handleChange} className="h-4 w-4 accent-[#08263a]" />
                  Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="radio" name="hasSpecialNeeds" value="nao" checked={form.hasSpecialNeeds === 'nao'} onChange={handleChange} className="h-4 w-4 accent-[#08263a]" />
                  Não
                </label>
              </div>
              {fieldErrors.hasSpecialNeeds ? (
                <p id="hasSpecialNeeds-error" className="mt-2 text-sm font-medium text-red-600">
                  {fieldErrors.hasSpecialNeeds}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="observations" className="block text-sm font-semibold text-slate-700">Observações</label>
              <textarea id="observations" name="observations" rows="4" value={form.observations} onChange={handleChange} className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-[#b98b2d]" />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {success}
              </div>
            ) : null}

            <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550] disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'A enviar...' : 'Enviar pedido de reserva'}
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
