import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const formatPhoneValue = (value = '') => {
  const digits = value.replace(/\D/g, '').slice(0, 9)

  if (digits.length <= 3) {
    return digits
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}

const formatDateValue = (value = '') => {
  const digits = value.replace(/\D/g, '').slice(0, 8)

  if (digits.length <= 2) {
    return digits
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

const isValidBirthDate = (value = '') => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return false
  }

  const [dayString, monthString, yearString] = value.split('/')
  const day = Number(dayString)
  const month = Number(monthString)
  const year = Number(yearString)

  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    return false
  }

  if (month < 1 || month > 12) {
    return false
  }

  const parsedDate = new Date(year, month - 1, day)

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return parsedDate <= today
}

const reservationSchema = z.object({
  parentName: z.string().trim().min(2, { message: 'O nome do responsável é obrigatório.' }),
  phone: z
    .string()
    .trim()
    .regex(/^\d{9}$/, { message: 'O telefone deve conter exatamente 9 dígitos.' }),
  studentName: z.string().trim().min(2, { message: 'O nome do estudante é obrigatório.' }),
  dateOfBirth: z
    .string()
    .trim()
    .refine(isValidBirthDate, {
      message: 'A data de nascimento deve ser uma data válida no formato dd/mm/yyyy.',
    }),
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [reservationCode, setReservationCode] = useState('')
  const [lookupCode, setLookupCode] = useState('')
  const [lookupError, setLookupError] = useState('')
  const [lookupReservation, setLookupReservation] = useState(null)
  const [isLookupSubmitting, setIsLookupSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleSubmit = (event) => {
    event.preventDefault()
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
      return
    }

    setFieldErrors({})
    setIsConfirmOpen(true)
  }

  const handleConfirmSave = async () => {
    setIsSubmitting(true)
    setError('')
    setSuccess('')

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
          setIsConfirmOpen(false)
          return
        }

        setError(data.message || 'Não foi possível enviar a reserva.')
        setIsConfirmOpen(false)
        return
      }

      const generatedCode = data.accessCode || '000000'
      setReservationCode(generatedCode)
      setSuccess(`Pedido de reserva enviado com sucesso. Guarde o seu código de acesso: ${generatedCode}. A secretaria entrará em contacto brevemente.`)
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
      setIsConfirmOpen(false)
    } catch (submitError) {
      setError('Ocorreu um erro ao enviar o pedido. Tente novamente.')
      setIsConfirmOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLookup = async (event) => {
    event.preventDefault()
    setLookupError('')
    setLookupReservation(null)

    const parsed = z.string().trim().regex(/^\d{6}$/, 'O código deve conter exatamente 6 dígitos.').safeParse(lookupCode)

    if (!parsed.success) {
      setLookupError(parsed.error.issues[0].message)
      return
    }

    setIsLookupSubmitting(true)

    try {
      const response = await fetch(`/api/reserva?accessCode=${encodeURIComponent(parsed.data)}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        setLookupError(data.message || 'Não foi possível consultar a reserva.')
        return
      }

      setLookupReservation(data.reservation)
    } catch (lookupErrorResponse) {
      setLookupError('Não foi possível consultar a reserva. Tente novamente.')
    } finally {
      setIsLookupSubmitting(false)
    }
  }

  const handleCancelReservation = async () => {
    if (!lookupCode) {
      setLookupError('Introduza o código de acesso para cancelar a reserva.')
      return
    }

    setIsDeleting(true)
    setLookupError('')

    try {
      const response = await fetch('/api/reserva', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode: lookupCode }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setLookupError(data.message || 'Não foi possível cancelar a reserva.')
        return
      }

      setLookupReservation((current) => ({ ...current, status: 'cancelada' }))
      setLookupError('')
    } catch (cancelError) {
      setLookupError('Não foi possível cancelar a reserva. Tente novamente.')
    } finally {
      setIsDeleting(false)
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
        {isConfirmOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
            <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-900">Confirmar pedido de reserva</h2>
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="text-2xl font-medium text-slate-500 transition hover:text-slate-700"
                  aria-label="Fechar confirmação"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 grid gap-4 text-sm text-slate-700 md:grid-cols-2">
                <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                  <p className="font-semibold text-red-800">Atenção</p>
                  <p className="mt-1">Depois de guardar a reserva, não será possível alterar qualquer informação. Verifique todos os dados antes de continuar.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Responsável</p>
                  <p className="mt-1">{form.parentName}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Telefone</p>
                  <p className="mt-1">{formatPhoneValue(form.phone)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Estudante</p>
                  <p className="mt-1">{form.studentName}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Data de nascimento</p>
                  <p className="mt-1">{form.dateOfBirth || '-'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Ano e classe</p>
                  <p className="mt-1">{form.admissionYear} · {form.intendedGrade || '-'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Necessidade especial</p>
                  <p className="mt-1">{form.hasSpecialNeeds === 'sim' ? 'Sim' : form.hasSpecialNeeds === 'nao' ? 'Não' : '-'}</p>
                </div>
                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Observações</p>
                  <p className="mt-1 whitespace-pre-wrap">{form.observations || 'Sem observações.'}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Voltar para corrigir
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={isSubmitting}
                  className="rounded-full bg-[#08263a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'A guardar...' : 'Guardar pedido'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-[2rem] bg-[#08263a] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">Reservas</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Reserve a vaga do seu filho para futuros anos letivos.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            Preencha os detalhes abaixo para que a secretaria possa entrar em contacto e informar sobre as próximas disponibilidades.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Consultar ou cancelar a minha reserva</h2>
          <p className="mt-2 text-sm text-slate-600">
            Introduza o código de acesso de 6 dígitos que recebeu após guardar a reserva.
          </p>

          <form className="mt-5 space-y-4" onSubmit={handleLookup} noValidate>
            <div>
              <label htmlFor="lookupCode" className="block text-sm font-semibold text-slate-700">Código de acesso</label>
              <input
                id="lookupCode"
                name="lookupCode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={lookupCode}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/\D/g, '').slice(0, 6)
                  setLookupCode(nextValue)
                  if (lookupError) setLookupError('')
                }}
                placeholder="123456"
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-[#b98b2d]"
              />
              {lookupError ? (
                <p className="mt-2 text-sm font-medium text-red-600">{lookupError}</p>
              ) : null}
            </div>

            <button type="submit" disabled={isLookupSubmitting} className="rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550] disabled:cursor-not-allowed disabled:opacity-70">
              {isLookupSubmitting ? 'A consultar...' : 'Consultar reserva'}
            </button>
          </form>

          {lookupReservation ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Estado da reserva</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-900">Código:</span> {lookupReservation.accessCode}</p>
                <p><span className="font-semibold text-slate-900">Estado:</span> {lookupReservation.status === 'cancelada' ? 'Cancelada' : 'Pendente'}</p>
                <p><span className="font-semibold text-slate-900">Estudante:</span> {lookupReservation.studentName}</p>
                <p><span className="font-semibold text-slate-900">Classe:</span> {lookupReservation.intendedGrade}</p>
              </div>

              <button
                type="button"
                onClick={handleCancelReservation}
                disabled={isDeleting || lookupReservation.status === 'cancelada'}
                className="mt-5 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'A cancelar...' : lookupReservation.status === 'cancelada' ? 'Reserva cancelada' : 'Cancelar reserva'}
              </button>
            </div>
          ) : null}
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
                  value={formatPhoneValue(form.phone)}
                  placeholder="9xx xxx xxx"
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
                  type="text"
                  inputMode="numeric"
                  value={formatDateValue(form.dateOfBirth)}
                  placeholder="dd/mm/yyyy"
                  onChange={(event) => {
                    const nextValue = event.target.value.replace(/\D/g, '').slice(0, 8)
                    const formatted = formatDateValue(nextValue)
                    setForm((current) => ({ ...current, dateOfBirth: formatted }))

                    if (fieldErrors.dateOfBirth) {
                      setFieldErrors((current) => {
                        const next = { ...current }
                        delete next.dateOfBirth
                        return next
                      })
                    }

                    if (error) setError('')
                    if (success) setSuccess('')
                  }}
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

            {reservationCode ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <p className="font-bold uppercase tracking-[0.12em]">Código de acesso obrigatório</p>
                <p className="mt-2">Guarde este código em local seguro. Sem ele, não será possível consultar ou cancelar a sua reserva.</p>
                <p className="mt-3 text-lg font-bold tracking-[0.25em]">{reservationCode}</p>
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
