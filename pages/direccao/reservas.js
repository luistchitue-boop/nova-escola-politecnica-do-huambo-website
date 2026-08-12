import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '../../lib/db'
import { reservationRequests } from '../../db/schema'

const PAGE_SIZE = 10

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
  const selectedGrade = query.grade ? String(query.grade) : ''
  const selectedYear = query.anoLectivo ? String(query.anoLectivo) : ''

  const filters = []

  if (selectedGrade) {
    filters.push(eq(reservationRequests.intendedGrade, selectedGrade))
  }

  if (selectedYear) {
    filters.push(eq(reservationRequests.admissionYear, selectedYear))
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined

  const [rows, totalRowsResult] = await Promise.all([
    db
      .select()
      .from(reservationRequests)
      .where(whereClause)
      .orderBy(desc(reservationRequests.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ count: count() })
      .from(reservationRequests)
      .where(whereClause),
  ])

  const totalCount = Number(totalRowsResult[0]?.count || 0)
  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1)
  const safePage = Math.min(page, totalPages)

  const allRows = await db.select().from(reservationRequests)
  const gradeOptions = [...new Set(allRows.map((row) => row.intendedGrade).filter(Boolean))].sort()
  const anoLectivoOptions = [...new Set(allRows.map((row) => row.admissionYear).filter(Boolean))].sort((a, b) => b.localeCompare(a))

  const serializedReservations = rows.map((reservation) => ({
    ...reservation,
    createdAt: reservation.createdAt ? new Date(reservation.createdAt).toISOString() : null,
  }))

  return {
    props: {
      reservations: serializedReservations,
      page: safePage,
      totalPages,
      totalCount,
      selectedGrade,
      selectedYear,
      gradeOptions,
      anoLectivoOptions,
    },
  }
}

export default function DireccaoReservasPage({
  reservations,
  page,
  totalPages,
  totalCount,
  selectedGrade,
  selectedYear,
  gradeOptions,
  anoLectivoOptions,
}) {
  const router = useRouter()

  const handleFilterChange = (field, value) => {
    const nextQuery = buildQueryObject(router.query, { page: '1' })

    if (value) {
      nextQuery[field] = value
    } else {
      delete nextQuery[field]
    }

    router.push({ pathname: '/direccao/reservas', query: nextQuery })
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <>
      <Head>
        <title>Direção — Reservas</title>
        <meta name="description" content="Lista de reservas e filtros por classe e ano letivo." />
      </Head>

      <main className="min-h-screen bg-[#f6f3eb] text-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7a5a15]">Direção</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Reservas</h1>
            </div>
            <Link href="/direccao" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Voltar ao painel
            </Link>
          </div>

          <section className="mt-2 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Classe</span>
                <select
                  value={selectedGrade}
                  onChange={(event) => handleFilterChange('grade', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#08263a]"
                >
                  <option value="">Todas as classes</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Ano letivo</span>
                <select
                  value={selectedYear}
                  onChange={(event) => handleFilterChange('anoLectivo', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#08263a]"
                >
                  <option value="">Todos os anos</option>
                  {anoLectivoOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </label>

              <div className="flex items-end">
                <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Total</span>
                  <span className="mt-1 block text-lg font-semibold text-slate-900">{totalCount}</span>
                </div>
              </div>

              <div className="flex items-end">
                <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Página</span>
                  <span className="mt-1 block text-lg font-semibold text-slate-900">{page} / {totalPages}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Responsável</th>
                    <th className="px-4 py-3 font-semibold">Estudante</th>
                    <th className="px-4 py-3 font-semibold">Data de nascimento</th>
                    <th className="px-4 py-3 font-semibold">Classe</th>
                    <th className="px-4 py-3 font-semibold">Ano letivo</th>
                    <th className="px-4 py-3 font-semibold">Telefone</th>
                    <th className="px-4 py-3 font-semibold">Código</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-10 text-center text-slate-500">
                        Nenhuma reserva encontrada para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    reservations.map((reservation) => (
                      <tr key={reservation.id} className="align-top hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{reservation.parentName}</td>
                        <td className="px-4 py-3">{reservation.studentName}</td>
                        <td className="px-4 py-3">{reservation.dateOfBirth || '—'}</td>
                        <td className="px-4 py-3">{reservation.intendedGrade}</td>
                        <td className="px-4 py-3">{reservation.admissionYear}</td>
                        <td className="px-4 py-3">{reservation.phone}</td>
                        <td className="px-4 py-3 font-semibold tracking-[0.2em] text-[#08263a]">{reservation.accessCode}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-[#f8f4ea] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a5a15]">
                            {reservation.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString('pt-PT') : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {totalPages > 1 ? (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Paginação das reservas">
              {page > 1 ? (
                <Link
                  href={{
                    pathname: '/direccao/reservas',
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
                      pathname: '/direccao/reservas',
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
                    pathname: '/direccao/reservas',
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
