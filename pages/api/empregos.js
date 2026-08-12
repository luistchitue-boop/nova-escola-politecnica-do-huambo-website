import { z } from 'zod'
import { db } from '../../lib/db'
import { jobOpenings } from '../../db/schema'

const jobOpeningSchema = z.object({
  title: z.string().trim().min(2, 'O nome do cargo é obrigatório.').max(150, 'O nome do cargo deve ter no máximo 150 caracteres.'),
  description: z.string().trim().min(20, 'A descrição deve ter pelo menos 20 caracteres.').max(2000, 'A descrição deve ter no máximo 2000 caracteres.'),
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido.' })
  }

  const parsed = jobOpeningSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Dados inválidos.',
    })
  }

  try {
    await db.insert(jobOpenings).values({
      title: parsed.data.title,
      description: parsed.data.description,
    })

    return res.status(200).json({ success: true, message: 'Vaga criada com sucesso.' })
  } catch (error) {
    console.error('Job opening creation failed:', error)
    return res.status(500).json({ success: false, message: 'Não foi possível guardar a vaga.' })
  }
}
