import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { db } from '../../lib/db'
import { reservationRequests } from '../../db/schema'

const reservationSchema = z.object({
  parentName: z.string().trim().min(2, 'O nome do responsável é obrigatório.'),
  phone: z.string().trim().regex(/^\d{9}$/, 'O telefone deve conter exatamente 9 dígitos.'),
  studentName: z.string().trim().min(2, 'O nome do estudante é obrigatório.'),
  dateOfBirth: z
    .string()
    .trim()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'A data de nascimento deve estar no formato dd/mm/yyyy.'),
  admissionYear: z.string().trim().min(1, 'O ano de ingresso é obrigatório.'),
  intendedGrade: z.string().trim().min(1, 'A classe pretendida é obrigatória.'),
  hasSpecialNeeds: z.enum(['sim', 'nao'], {
    error: 'Selecione uma opção válida: sim ou não.',
  }),
  observations: z.string().trim().optional().default(''),
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
