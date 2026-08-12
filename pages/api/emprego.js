import { z } from 'zod'
import { db } from '../../lib/db'
import { employmentApplications } from '../../db/schema'

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

export default async function handler(req, res) {
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

    await db.insert(employmentApplications).values({
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
    })
  } catch (error) {
    console.error('Employment application save failed:', error)
    return res.status(500).json({
      success: false,
      message: 'Não foi possível guardar a candidatura.',
    })
  }
}
