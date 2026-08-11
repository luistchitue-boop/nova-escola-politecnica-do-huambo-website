import { z } from 'zod'
import { db } from '../../lib/db'
import { eq, sql } from 'drizzle-orm'
import { students, classes, classAccessLogs } from '../../db/schema'

const schema = z.object({
  enrollmentNumber: z.string().trim().regex(/^\d{6}$/, 'O número de inscrição deve conter exatamente 6 inteiros.'),
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido.' })
  }

  try {
    const parsed = schema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0].message,
      })
    }

    const enrollmentNumber = parsed.data.enrollmentNumber

    const result = await db
      .select({
        studentName: students.studentName,
        className: classes.name,
        whatsappLink: classes.whatsappLink,
      })
      .from(students)
      .innerJoin(classes, eq(classes.id, students.classId))
      .where(eq(students.enrollmentNumber, enrollmentNumber))
      .limit(1)

    const match = result[0]

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Número de inscrição não encontrado.',
      })
    }

    await db.insert(classAccessLogs).values({
      enrollmentNumber,
      className: match.className,
      whatsappLink: match.whatsappLink,
    })

    return res.status(200).json({
      success: true,
      className: match.className,
      whatsappLink: match.whatsappLink,
      message: 'Acesso ao grupo confirmado.',
    })
  } catch (error) {
    console.error('WhatsApp access lookup failed:', error)
    return res.status(500).json({
      success: false,
      message: 'Ocorreu um erro ao procurar o grupo de WhatsApp.',
    })
  }
}
