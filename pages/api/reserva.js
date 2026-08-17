import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { db } from '../../lib/db'
import { reservationRequests } from '../../db/schema'

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

const gradeAgeMap = {
  1: 6,
  2: 7,
  3: 8,
  4: 9,
  5: 10,
  6: 11,
  7: 12,
  8: 13,
  9: 14,
  10: 15,
  11: 16,
  12: 17,
  13: 18,
}

const getFirstAdmissionYear = (admissionYear = '') => {
  const match = String(admissionYear).trim().match(/\d{4}/)

  if (!match) {
    return null
  }

  return Number(match[0])
}

const getGradeAge = (grade = '') => {
  const match = String(grade).trim().match(/(\d+)\s*ª/)

  if (!match) {
    return null
  }

  const classNumber = Number(match[1])
  return gradeAgeMap[classNumber] ?? null
}

const getAgeForAdmissionYear = (dateOfBirth = '', admissionYear = '') => {
  if (!isValidBirthDate(dateOfBirth)) {
    return null
  }

  const firstAdmissionYear = getFirstAdmissionYear(admissionYear)

  if (!Number.isInteger(firstAdmissionYear)) {
    return null
  }

  const yearOfBirth = Number(dateOfBirth.split('/')[2])
  return firstAdmissionYear - yearOfBirth
}

const reservationSchema = z.object({
  parentName: z.string().trim().min(2, 'O nome do responsável é obrigatório.'),
  phone: z.string().trim().regex(/^\d{9}$/, 'O telefone deve conter exatamente 9 dígitos.'),
  parentName2: z.string().trim().min(2, 'O nome do responsável 2 é obrigatório.'),
  phone2: z.string().trim().regex(/^\d{9}$/, 'O telefone 2 deve conter exatamente 9 dígitos.'),
  studentName: z.string().trim().min(2, 'O nome do estudante é obrigatório.'),
  dateOfBirth: z
    .string()
    .trim()
    .refine(isValidBirthDate, 'A data de nascimento deve ser uma data válida no formato dd/mm/yyyy.'),
  admissionYear: z.string().trim().min(1, 'O ano de ingresso é obrigatório.'),
  intendedGrade: z.string().trim().min(1, 'A classe pretendida é obrigatória.'),
  hasSpecialNeeds: z.enum(['sim', 'nao'], {
    error: 'Selecione uma opção válida: sim ou não.',
  }),
  observations: z.string().trim().optional().default(''),
}).superRefine((data, ctx) => {
  const expectedAge = getGradeAge(data.intendedGrade)
  const actualAge = getAgeForAdmissionYear(data.dateOfBirth, data.admissionYear)

  if (expectedAge && actualAge !== null && actualAge !== expectedAge) {
    ctx.addIssue({
      path: ['dateOfBirth'],
      code: 'custom',
      message: `A idade do estudante (${actualAge} anos) não corresponde à classe pretendida (${data.intendedGrade}).`,
    })

    ctx.addIssue({
      path: ['intendedGrade'],
      code: 'custom',
      message: 'A classe pretendida não corresponde à idade do estudante.',
    })
  }
})

const lookupCodeSchema = z.string().trim().regex(/^\d{6}$/, 'O código deve conter exatamente 6 dígitos.')

async function generateUniqueAccessCode() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = String(Math.floor(100000 + Math.random() * 900000))
    const existing = await db
      .select({ id: reservationRequests.id })
      .from(reservationRequests)
      .where(eq(reservationRequests.accessCode, candidate))
      .limit(1)

    if (existing.length === 0) {
      return candidate
    }
  }

  throw new Error('Failed to generate unique access code.')
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const accessCode = String(req.query.accessCode || '')
    const parsed = lookupCodeSchema.safeParse(accessCode)

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'O código deve conter exatamente 6 dígitos.' })
    }

    try {
      const reservation = await db
        .select()
        .from(reservationRequests)
        .where(eq(reservationRequests.accessCode, parsed.data))
        .limit(1)

      if (!reservation[0]) {
        return res.status(404).json({ success: false, message: 'Pedido de reserva não encontrado.' })
      }

      return res.status(200).json({ success: true, reservation: reservation[0] })
    } catch (error) {
      console.error('Reservation lookup failed:', error)
      return res.status(500).json({ success: false, message: 'Não foi possível consultar a reserva.' })
    }
  }

  if (req.method === 'DELETE') {
    const accessCode = req.body?.accessCode || ''
    const parsed = lookupCodeSchema.safeParse(accessCode)

    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'O código deve conter exatamente 6 dígitos.' })
    }

    try {
      const deleted = await db
        .delete(reservationRequests)
        .where(eq(reservationRequests.accessCode, parsed.data))

      if (!deleted.rowCount || deleted.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Pedido de reserva não encontrado.' })
      }

      return res.status(200).json({ success: true, message: 'Pedido de reserva cancelado com sucesso.' })
    } catch (error) {
      console.error('Reservation cancel failed:', error)
      return res.status(500).json({ success: false, message: 'Não foi possível cancelar a reserva.' })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido.' })
  }

  try {
    const parsed = reservationSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0].message,
      })
    }

    const payload = parsed.data

    const existing = await db
      .select()
      .from(reservationRequests)
      .where(
        and(
          eq(reservationRequests.parentName, payload.parentName.trim()),
          eq(reservationRequests.studentName, payload.studentName.trim()),
          eq(reservationRequests.dateOfBirth, payload.dateOfBirth)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Já existe um pedido de reserva para este estudante.',
      })
    }

    const accessCode = await generateUniqueAccessCode()

    await db.insert(reservationRequests).values({
      accessCode,
      status: 'pendente',
      parentName: payload.parentName,
      phone: payload.phone,
      parentName2: payload.parentName2,
      phone2: payload.phone2,
      studentName: payload.studentName,
      dateOfBirth: payload.dateOfBirth,
      admissionYear: payload.admissionYear,
      intendedGrade: payload.intendedGrade,
      hasSpecialNeeds: payload.hasSpecialNeeds,
      observations: payload.observations || null,
    })

    return res.status(200).json({
      success: true,
      message: 'Pedido de reserva enviado com sucesso.',
      accessCode,
    })
  } catch (error) {
    console.error('Reservation creation failed:', error)

    if (error?.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Já existe um pedido de reserva para este estudante.',
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Ocorreu um erro ao guardar a reserva.',
    })
  }
}
