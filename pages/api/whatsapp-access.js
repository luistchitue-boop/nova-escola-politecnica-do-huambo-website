import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { db } from '../../lib/db'
import { eq } from 'drizzle-orm'
import { classAccessLogs } from '../../db/schema'

const availableClasses = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'turmas.json'), 'utf8')
)

const schema = z.object({
  className: z
    .string()
    .trim()
    .min(1, 'Selecione uma turma.')
    .refine((value) => availableClasses.includes(value), {
      message: 'A turma selecionada não está disponível.',
    }),
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

    const className = parsed.data.className

    const result = await db
      .select({
        className: classAccessLogs.className,
        whatsappLink: classAccessLogs.whatsappLink,
        googleClassroom: classAccessLogs.googleClassroom,
      })
      .from(classAccessLogs)
      .where(eq(classAccessLogs.className, className))
      .limit(1)

    const match = result[0]

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Ainda não existe um canal configurado para esta turma.',
      })
    }

    return res.status(200).json({
      success: true,
      className: match.className,
      whatsappLink: match.whatsappLink,
      googleClassroom: match.googleClassroom,
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
