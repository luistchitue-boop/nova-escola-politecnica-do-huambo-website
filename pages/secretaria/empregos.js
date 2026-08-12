import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const higherEducationDegrees = ['Licenciado', 'Mestre', 'Doutor']

const educationAreas = [
  'Educação básica',
  'Informática',
  'Ciências',
  'Matemática',
  'Gestão',
  'Letras',
  'Artes',
  'Saúde',
  'Tecnologias educativas',
  'Direito',
  'Economia',
  'Psicologia',
  'Educação Física',
  'História',
  'Geografia',
  'Outra área',
]

const employmentSchema = z.object({
  fullName: z.string().trim().min(2, 'O nome completo é obrigatório.'),
  email: z.string().trim().email('Introduza um email válido.'),
  phone: z.string().trim().min(9, 'O telefone deve conter pelo menos 9 dígitos.'),
  areaOfInterest: z.string().trim().min(2, 'A área ou função pretendida é obrigatória.'),
  educationArea: z.string().trim().min(2, 'A área de educação é obrigatória.'),
  academicDegree: z.string().trim().min(2, 'O grau académico é obrigatório.'),
  higherEducationInstitution: z.string().trim().optional(),
  availability: z.enum(['imediata', 'ocasional'], {
    message: 'Selecione uma disponibilidade válida.',
  }),
  experience: z.string().trim().min(10, 'Descreva pelo menos 10 caracteres sobre a sua experiência.'),
  usefulInfo: z.string().trim().min(10, 'Adicione informação útil para o departamento de RH.'),
}).superRefine((data, ctx) => {
  if (higherEducationDegrees.includes(data.academicDegree)) {
    const institution = data.higherEducationInstitution?.trim() || ''

    if (!institution) {
      ctx.addIssue({
        path: ['higherEducationInstitution'],
        code: 'custom',
        message: 'A instituição de ensino superior é obrigatória para este grau académico.',
      })
    }
  }
})

export default function EmpregosPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    areaOfInterest: '',
    educationArea: '',
    academicDegree: '',
    higherEducationInstitution: '',
    availability: '',
    experience: '',
    usefulInfo: '',
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    const nextForm = { ...form, [name]: value }
    setForm(nextForm)

    if (name === 'academicDegree') {
      setErrors((current) => {
        const next = { ...current }
        delete next.higherEducationInstitution
        return next
      })
    }

    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted('')

    const result = employmentSchema.safeParse(form)

    if (!result.success) {
      const nextErrors = result.error.issues.reduce((accumulator, issue) => {
        const fieldName = issue.path[0]
        if (fieldName) accumulator[fieldName] = issue.message
        return accumulator
      }, {})
      setErrors(nextErrors)
      setIsConfirmOpen(false)
      return
    }

    setErrors({})
    setIsConfirmOpen(true)
  }

  const handleConfirmSave = async () => {
    setIsSubmitting(true)
    setSubmitted('')

    try {
      const response = await fetch('/api/emprego', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setErrors({
          submit: data.message || 'Não foi possível enviar a candidatura.',
        })
        setIsConfirmOpen(false)
        return
      }

      setForm({
        fullName: '',
        email: '',
        phone: '',
        areaOfInterest: '',
        educationArea: '',
        academicDegree: '',
        higherEducationInstitution: '',
        availability: '',
        experience: '',
        usefulInfo: '',
      })
      setErrors({})
      setSubmitted('Candidatura enviada com sucesso. A equipa de RH irá analisar os seus dados.')
      setIsConfirmOpen(false)
    } catch (error) {
      setErrors({ submit: 'Ocorreu um erro ao enviar a candidatura. Tente novamente.' })
      setIsConfirmOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-slate-800">
      <Head>
        <title>Emprego & Carreira — Secretaria</title>
        <meta name="description" content="Envie a sua candidatura para vagas abertas na Nova Escola Politécnica do Huambo." />
      </Head>

      <Header />

      <main className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        {isConfirmOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
            <div className="w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-900">Confirmar candidatura</h2>
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="text-2xl font-medium text-slate-500 transition hover:text-slate-700"
                  aria-label="Fechar confirmação"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-700">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                  <p className="font-semibold text-red-800">Atenção</p>
                  <p className="mt-1">Depois de guardar a candidatura, não será possível alterar qualquer informação. Verifique todos os dados antes de continuar.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Nome completo</p>
                  <p className="mt-1">{form.fullName}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Email</p>
                  <p className="mt-1">{form.email}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Telefone</p>
                  <p className="mt-1">{form.phone}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Área / função</p>
                  <p className="mt-1">{form.areaOfInterest}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Área de educação</p>
                  <p className="mt-1">{form.educationArea}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Grau académico</p>
                  <p className="mt-1">{form.academicDegree}</p>
                </div>
                {form.higherEducationInstitution ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Instituição de ensino superior</p>
                    <p className="mt-1">{form.higherEducationInstitution}</p>
                  </div>
                ) : null}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Disponibilidade</p>
                  <p className="mt-1">{form.availability === 'imediata' ? 'Imediata' : form.availability === 'ocasional' ? 'Ocasional' : '-'}</p>
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
                  {isSubmitting ? 'A guardar...' : 'Guardar candidatura'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-[2rem] bg-[#08263a] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f2d79d]">Emprego & Carreira</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Partilhe a sua candidatura para as vagas abertas.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            Preencha os seus dados para que a equipa possa analisar o seu perfil e entrar em contacto quando houver oportunidades adequadas.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700">Nome completo</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                />
                {errors.fullName ? <p className="mt-2 text-sm font-medium text-red-600">{errors.fullName}</p> : null}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                />
                {errors.email ? <p className="mt-2 text-sm font-medium text-red-600">{errors.email}</p> : null}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Telefone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                />
                {errors.phone ? <p className="mt-2 text-sm font-medium text-red-600">{errors.phone}</p> : null}
              </div>

              <div>
                <label htmlFor="areaOfInterest" className="block text-sm font-semibold text-slate-700">Área ou função pretendida</label>
                <input
                  id="areaOfInterest"
                  name="areaOfInterest"
                  type="text"
                  placeholder="Ex: Docente, Administrativo, Técnico"
                  value={form.areaOfInterest}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${errors.areaOfInterest ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                />
                {errors.areaOfInterest ? <p className="mt-2 text-sm font-medium text-red-600">{errors.areaOfInterest}</p> : null}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="educationArea" className="block text-sm font-semibold text-slate-700">Área de educação</label>
                <select
                  id="educationArea"
                  name="educationArea"
                  value={form.educationArea}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:border-[#b98b2d] ${errors.educationArea ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                >
                  <option value="">Selecione a área de educação</option>
                  {educationAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {errors.educationArea ? <p className="mt-2 text-sm font-medium text-red-600">{errors.educationArea}</p> : null}
              </div>

              <div>
                <label htmlFor="academicDegree" className="block text-sm font-semibold text-slate-700">Grau académico</label>
                <select
                  id="academicDegree"
                  name="academicDegree"
                  value={form.academicDegree}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:border-[#b98b2d] ${errors.academicDegree ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Técnico médio">Técnico médio</option>
                  <option value="Licenciado">Licenciado</option>
                  <option value="Mestre">Mestre</option>
                  <option value="Doutor">Doutor</option>
                  <option value="outros">outros</option>
                </select>
                {errors.academicDegree ? <p className="mt-2 text-sm font-medium text-red-600">{errors.academicDegree}</p> : null}
              </div>
            </div>

            {higherEducationDegrees.includes(form.academicDegree) ? (
              <div>
                <label htmlFor="higherEducationInstitution" className="block text-sm font-semibold text-slate-700">Instituição de Ensino Superior</label>
                <input
                  id="higherEducationInstitution"
                  name="higherEducationInstitution"
                  type="text"
                  placeholder="Ex: Universidade Agostinho Neto"
                  value={form.higherEducationInstitution}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${errors.higherEducationInstitution ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                />
                {errors.higherEducationInstitution ? (
                  <p className="mt-2 text-sm font-medium text-red-600">{errors.higherEducationInstitution}</p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-semibold text-slate-700">Disponibilidade</label>
              <div className="mt-3 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="availability"
                    value="imediata"
                    checked={form.availability === 'imediata'}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#08263a]"
                  />
                  Imediata
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="availability"
                    value="ocasional"
                    checked={form.availability === 'ocasional'}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#08263a]"
                  />
                  Ocasional
                </label>
              </div>
              {errors.availability ? <p className="mt-2 text-sm font-medium text-red-600">{errors.availability}</p> : null}
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-semibold text-slate-700">Experiência e competências</label>
              <textarea
                id="experience"
                name="experience"
                rows="4"
                value={form.experience}
                onChange={handleChange}
                className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${errors.experience ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
              />
              {errors.experience ? <p className="mt-2 text-sm font-medium text-red-600">{errors.experience}</p> : null}
            </div>

            <div>
              <label htmlFor="usefulInfo" className="block text-sm font-semibold text-slate-700">Informação útil para o departamento de RH</label>
              <textarea
                id="usefulInfo"
                name="usefulInfo"
                rows="4"
                placeholder="Ex: disponibilidade, disponibilidade para deslocações, idiomas, disponibilidade horária, certificações, interesses relevantes."
                value={form.usefulInfo}
                onChange={handleChange}
                className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:border-[#b98b2d] ${errors.usefulInfo ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
              />
              {errors.usefulInfo ? <p className="mt-2 text-sm font-medium text-red-600">{errors.usefulInfo}</p> : null}
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {submitted}
              </div>
            ) : null}

            {errors.submit ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errors.submit}
              </div>
            ) : null}

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
