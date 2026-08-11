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

export default async function handler(req, res) {
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

    await db.insert(reservationRequests).values({
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
