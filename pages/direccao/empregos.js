import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'
import { and, count, desc, eq, or, sql } from 'drizzle-orm'
import { db } from '../../lib/db'
import { employmentApplications, jobOpenings } from '../../db/schema'

const PAGE_SIZE = 10

const jobOpeningSchema = z.object({
  title: z.string().trim().min(2, 'O nome do cargo é obrigatório.').max(150, 'O nome do cargo deve ter no máximo 150 caracteres.'),
  description: z.string().trim().min(20, 'A descrição deve ter pelo menos 20 caracteres.').max(2000, 'A descrição deve ter no máximo 2000 caracteres.'),
})

const defaultFormState = {
  title: '',
  description: '',
}

function buildQueryObject(routerQuery, overrides = {}) {
  const current = { ...routerQuery, ...overrides }

  Object.keys(current).forEach((key) => {
    if (current[key] === '' || current[key] === undefined || current[key] === null) {
      delete current[key]
    }
  })

  return current
}

export async function getServerSideProps({ query }) {
  const page = Math.max(Number(query.page || 1), 1)
  const selectedStatus = query.status ? String(query.status) : ''
  const selectedDegree = query.grau ? String(query.grau) : ''
  const selectedArea = query.area ? String(query.area) : ''
  const selectedRole = query.role ? String(query.role) : ''
  const search = query.q ? String(query.q).trim() : ''

  const applicationFilters = []

  if (selectedStatus) {
    applicationFilters.push(eq(employmentApplications.status, selectedStatus))
  }

  if (selectedDegree) {
    applicationFilters.push(eq(employmentApplications.academicDegree, selectedDegree))
  }

  if (selectedArea) {
    applicationFilters.push(eq(employmentApplications.educationArea, selectedArea))
  }

  if (selectedRole) {
    applicationFilters.push(eq(employmentApplications.areaOfInterest, selectedRole))
  }

  if (search) {
    const term = `%${search}%`
    applicationFilters.push(
      or(
        sql`LOWER(${employmentApplications.fullName}) LIKE LOWER(${term})`,
        sql`LOWER(${employmentApplications.email}) LIKE LOWER(${term})`,
        sql`LOWER(${employmentApplications.areaOfInterest}) LIKE LOWER(${term})`
      )
    )
  }

  const applicationWhereClause = applicationFilters.length > 0 ? and(...applicationFilters) : undefined

  const [rows, totalRowsResult, allRows, openingsRows] = await Promise.all([
    db
      .select()
      .from(employmentApplications)
      .where(applicationWhereClause)
      .orderBy(desc(employmentApplications.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ count: count() })
      .from(employmentApplications)
      .where(applicationWhereClause),
    db.select().from(employmentApplications),
    db.select().from(jobOpenings).orderBy(desc(jobOpenings.createdAt)),
  ])

  const totalCount = Number(totalRowsResult[0]?.count || 0)
  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1)
  const safePage = Math.min(page, totalPages)

  const statusOptions = [...new Set(allRows.map((row) => row.status).filter(Boolean))].sort()
  const degreeOptions = [...new Set(allRows.map((row) => row.academicDegree).filter(Boolean))].sort()
  const areaOptions = [...new Set(allRows.map((row) => row.educationArea).filter(Boolean))].sort()
  const roleOptions = [...new Set(openingsRows.map((row) => row.title).filter(Boolean))].sort()

  const serializedApplications = rows.map((row) => ({
    ...row,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
  }))

  const serializedOpenings = openingsRows.map((row) => ({
    ...row,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
  }))

  return {
    props: {
      applications: serializedApplications,
      openings: serializedOpenings,
      page: safePage,
      totalPages,
      totalCount,
      selectedStatus,
      selectedDegree,
      selectedArea,
      selectedRole,
      search,
      statusOptions,
      degreeOptions,
      areaOptions,
      roleOptions,
    },
  }
}

export default function DireccaoEmpregosPage({
  applications = [],
  openings = [],
  page,
  totalPages,
  totalCount,
  selectedStatus,
  selectedDegree,
  selectedArea,
  selectedRole,
  search,
  statusOptions,
  degreeOptions,
  areaOptions,
  roleOptions,
}) {
  const router = useRouter()
  const [form, setForm] = useState(defaultFormState)
  const [errors, setErrors] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))

    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitMessage('')

    const parsed = jobOpeningSchema.safeParse(form)

    if (!parsed.success) {
      const fieldErrors = {}
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]
        fieldErrors[fieldName] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/empregos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setErrors({ form: data.message || 'Não foi possível guardar a vaga.' })
        return
      }

      setForm(defaultFormState)
      setSubmitMessage('Vaga criada com sucesso.')
      router.replace({ pathname: '/direccao/empregos', query: router.query })
    } catch (error) {
      setErrors({ form: 'Não foi possível guardar a vaga. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFilterChange = (field, value) => {
    const nextQuery = buildQueryObject(router.query, { page: '1' })

    if (value) {
      nextQuery[field] = value
    } else {
      delete nextQuery[field]
    }

    router.push({ pathname: '/direccao/empregos', query: nextQuery })
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const query = buildQueryObject(router.query, { page: '1' })
    const nextValue = event.target.search.value.trim()

    if (nextValue) {
      query.q = nextValue
    } else {
      delete query.q
    }

    router.push({ pathname: '/direccao/empregos', query })
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <>
      <Head>
        <title>Direção — Empregos</title>
        <meta name="description" content="Criar vagas e visualizar candidaturas de emprego." />
      </Head>

      <main className="min-h-screen bg-[#f6f3eb] text-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7a5a15]">Direção</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Empregos</h1>
            </div>
            <Link href="/direccao" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Voltar ao painel
            </Link>
          </div>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Criar nova vaga</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                  Nome da vaga
                </label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#08263a]"
                  placeholder="Ex.: Professor de Matemática"
                />
                {errors.title ? <p className="mt-2 text-sm text-red-600">{errors.title}</p> : null}
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                  Descrição breve
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#08263a]"
                  placeholder="Descreva a função, requisitos e principais responsabilidades."
                />
                {errors.description ? <p className="mt-2 text-sm text-red-600">{errors.description}</p> : null}
              </div>

              {errors.form ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {errors.form}
                </div>
              ) : null}

              {submitMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  {submitMessage}
                </div>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'A guardar...' : 'Guardar vaga'}
                </button>
              </div>
            </form>
          </section>

          <section className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-900">Vagas publicadas</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Nome da vaga</th>
                    <th className="px-6 py-3 font-semibold">Descrição</th>
                    <th className="px-6 py-3 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {openings.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-slate-500">
                        Ainda não existem vagas criadas.
                      </td>
                    </tr>
                  ) : (
                    openings.map((opening) => (
                      <tr key={opening.id} className="align-top hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{opening.title}</td>
                        <td className="px-6 py-4 text-slate-600">{opening.description}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {opening.createdAt ? new Date(opening.createdAt).toLocaleDateString('pt-PT') : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-slate-900">Candidaturas</h2>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                Total: {totalCount}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Estado</span>
                <select
                  value={selectedStatus}
                  onChange={(event) => handleFilterChange('status', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#08263a]"
                >
                  <option value="">Todos</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Grau académico</span>
                <select
                  value={selectedDegree}
                  onChange={(event) => handleFilterChange('grau', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#08263a]"
                >
                  <option value="">Todos</option>
                  {degreeOptions.map((degree) => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Área de educação</span>
                <select
                  value={selectedArea}
                  onChange={(event) => handleFilterChange('area', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#08263a]"
                >
                  <option value="">Todas</option>
                  {areaOptions.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Vaga aberta</span>
                <select
                  value={selectedRole}
                  onChange={(event) => handleFilterChange('role', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#08263a]"
                >
                  <option value="">Todas</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>

              <form onSubmit={handleSearchSubmit} className="xl:col-span-2 flex items-end gap-2">
                <label className="block w-full text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Pesquisar</span>
                  <input
                    defaultValue={search}
                    name="search"
                    placeholder="Nome, email ou área"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#08263a]"
                  />
                </label>
                <button type="submit" className="rounded-xl bg-[#08263a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d3550]">
                  Filtrar
                </button>
              </form>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 font-medium">Página: {page} / {totalPages}</span>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Código</th>
                    <th className="px-4 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Telefone</th>
                    <th className="px-4 py-3 font-semibold">Área</th>
                    <th className="px-4 py-3 font-semibold">Grau</th>
                    <th className="px-4 py-3 font-semibold">Disponibilidade</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-10 text-center text-slate-500">
                        Nenhuma candidatura encontrada para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    applications.map((application) => (
                      <tr key={application.id} className="align-top hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold tracking-[0.2em] text-[#08263a]">{application.accessCode}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{application.fullName}</td>
                        <td className="px-4 py-3">{application.email}</td>
                        <td className="px-4 py-3">{application.phone}</td>
                        <td className="px-4 py-3">{application.areaOfInterest}</td>
                        <td className="px-4 py-3">{application.academicDegree}</td>
                        <td className="px-4 py-3">{application.availability === 'imediata' ? 'Imediata' : 'Ocasional'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-[#f8f4ea] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a5a15]">
                            {application.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {application.createdAt ? new Date(application.createdAt).toLocaleString('pt-PT') : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {totalPages > 1 ? (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Paginação das candidaturas">
              {page > 1 ? (
                <Link
                  href={{
                    pathname: '/direccao/empregos',
                    query: buildQueryObject(router.query, { page: String(page - 1) }),
                  }}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Anterior
                </Link>
              ) : null}

              {pageNumbers.map((pageNumber) => {
                const isCurrent = pageNumber === page

                return (
                  <Link
                    key={pageNumber}
                    href={{
                      pathname: '/direccao/empregos',
                      query: buildQueryObject(router.query, { page: String(pageNumber) }),
                    }}
                    className={[
                      'rounded-full px-3.5 py-2 text-sm font-medium transition',
                      isCurrent
                        ? 'bg-[#08263a] text-white'
                        : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
                    ].join(' ')}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {pageNumber}
                  </Link>
                )
              })}

              {page < totalPages ? (
                <Link
                  href={{
                    pathname: '/direccao/empregos',
                    query: buildQueryObject(router.query, { page: String(page + 1) }),
                  }}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Seguinte
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </main>
    </>
  )
}
