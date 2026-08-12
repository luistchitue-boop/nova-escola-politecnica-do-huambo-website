import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../lib/db'
import { employmentApplications } from '../../db/schema'

const lookupCodeSchema = z.string().trim().regex(/^\d{6}$/, 'O código deve conter exatamente 6 dígitos.')

const higherEducationDegrees = ['Licenciado', 'Mestre', 'Doutor']

const employmentSchema = z.object({
  fullName: z.string().trim().min(2, 'O nome completo é obrigatório.'),
  email: z.string().trim().email('Introduza um email válido.'),
  phone: z.string().trim().min(9, 'O telefone deve conter pelo menos 9 dígitos.'),
  areaOfInterest: z.string().trim().min(2, 'A área ou função pretendida é obrigatória.'),
  educationArea: z.string().trim().min(2, 'A área de educação é obrigatória.'),
  academicDegree: z.string().trim().min(2, 'O grau académico é obrigatório.'),
  higherEducationInstitution: z.string().trim().optional().default(''),
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

async function generateUniqueAccessCode() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = String(Math.floor(100000 + Math.random() * 900000))
    const existing = await db
      .select({ id: employmentApplications.id })
      .from(employmentApplications)
      .where(eq(employmentApplications.accessCode, candidate))
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
      const application = await db
        .select()
        .from(employmentApplications)
        .where(eq(employmentApplications.accessCode, parsed.data))
        .limit(1)

      if (!application[0]) {
        return res.status(404).json({ success: false, message: 'Candidatura não encontrada.' })
      }

      return res.status(200).json({ success: true, application: application[0] })
    } catch (error) {
      console.error('Employment lookup failed:', error)
      return res.status(500).json({ success: false, message: 'Não foi possível consultar a candidatura.' })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido.' })
  }

  try {
    const parsed = employmentSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Dados inválidos.',
      })
    }

    const payload = parsed.data
    const accessCode = await generateUniqueAccessCode()

    await db.insert(employmentApplications).values({
      accessCode,
      status: 'pendente',
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      areaOfInterest: payload.areaOfInterest,
      educationArea: payload.educationArea,
      academicDegree: payload.academicDegree,
      higherEducationInstitution: payload.higherEducationInstitution?.trim() || null,
      availability: payload.availability,
      experience: payload.experience,
      usefulInfo: payload.usefulInfo,
    })

    return res.status(200).json({
      success: true,
      message: 'Candidatura enviada com sucesso.',
      accessCode,
    })
  } catch (error) {
    console.error('Employment application save failed:', error)

    if (error?.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Já existe uma candidatura com este código de acesso.',
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Não foi possível guardar a candidatura.',
    })
  }
}
