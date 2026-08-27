require('dotenv').config()
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

function parseClassAccessCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').trim()

  if (!content) {
    return []
  }

  const rows = content.split(/\r?\n/).filter(Boolean)
  const header = rows.shift().split(',').map((value) => value.trim().toLowerCase())

  const classIndex = header.indexOf('class_name')
  const whatsappIndex = header.indexOf('whatsapp_link')
  const googleIndex = header.indexOf('google_classroom')

  return rows
    .map((row) => {
      const values = row.split(',').map((value) => value.trim().replace(/^"|"$/g, ''))
      const className = values[classIndex]
      const whatsappLink = values[whatsappIndex]

      if (!className || !whatsappLink) {
        return null
      }

      return {
        class_name: className,
        whatsapp_link: whatsappLink,
        google_classroom: googleIndex >= 0 && values[googleIndex] ? values[googleIndex] : null,
      }
    })
    .filter(Boolean)
}

async function seed() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const existingAdmin = await client.query('SELECT id FROM admin_users LIMIT 1')
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const configuredAdminPassword = process.env.ADMIN_PASSWORD || ''

    if (configuredAdminEmail && configuredAdminPassword) {
      const adminPasswordHash = await bcrypt.hash(configuredAdminPassword, 10)

      await client.query(
        `INSERT INTO admin_users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name,
           password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role`,
        ['Direção', configuredAdminEmail, adminPasswordHash, 'admin']
      )

      console.log('Admin account ready:', configuredAdminEmail)
    } else if (existingAdmin.rows.length === 0) {
      const defaultAdminEmail = 'direccao@escola.ao'
      const defaultAdminPassword = 'admin123'
      const defaultAdminPasswordHash = await bcrypt.hash(defaultAdminPassword, 10)

      await client.query(
        `INSERT INTO admin_users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)`,
        ['Direção', defaultAdminEmail, defaultAdminPasswordHash, 'admin']
      )

      console.log('Default admin seed created:', defaultAdminEmail)
    } else {
      console.log('Existing admin user found in database. Skipping automatic admin seeding.')
    }

    const csvRows = parseClassAccessCsv(path.join(process.cwd(), 'whatsapp_links.csv'))

    if (csvRows.length > 0) {
      for (const row of csvRows) {
        await client.query(
          `INSERT INTO class_access_logs (class_name, whatsapp_link, google_classroom)
           VALUES ($1, $2, $3)
           ON CONFLICT (class_name) DO UPDATE SET
             whatsapp_link = EXCLUDED.whatsapp_link,
             google_classroom = EXCLUDED.google_classroom`,
          [row.class_name, row.whatsapp_link, row.google_classroom]
        )
      }

      console.log(`Seeded ${csvRows.length} class access links from whatsapp_links.csv`)
    }

    const classes = [
      { name: '7A', whatsapp_link: 'https://chat.whatsapp.com/7AClassDemoGroup' },
      { name: '8B', whatsapp_link: 'https://chat.whatsapp.com/8BClassDemoGroup' },
      { name: '10C', whatsapp_link: 'https://chat.whatsapp.com/10CClassDemoGroup' },
    ]

    const insertedClasses = []

    for (const klass of classes) {
      const existing = await client.query(
        'SELECT id FROM classes WHERE name = $1',
        [klass.name]
      )

      if (existing.rows.length > 0) {
        insertedClasses.push({ ...klass, id: existing.rows[0].id })
        continue
      }

      const result = await client.query(
        `INSERT INTO classes (name, whatsapp_link)
         VALUES ($1, $2)
         RETURNING id, name, whatsapp_link`,
        [klass.name, klass.whatsapp_link]
      )

      insertedClasses.push(result.rows[0])
    }

    const classMap = Object.fromEntries(insertedClasses.map((klass) => [klass.name, klass.id]))

    const students = [
      { enrollment_number: '202601', student_name: 'Maria Silva', class_id: classMap['7A'] },
      { enrollment_number: '202602', student_name: 'João Pereira', class_id: classMap['8B'] },
      { enrollment_number: '202603', student_name: 'Ana Costa', class_id: classMap['10C'] },
      { enrollment_number: '202604', student_name: 'Miguel Santos', class_id: classMap['7A'] },
    ]

    for (const student of students) {
      const existing = await client.query(
        'SELECT id FROM students WHERE enrollment_number = $1',
        [student.enrollment_number]
      )

      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO students (enrollment_number, student_name, class_id)
           VALUES ($1, $2, $3)`,
          [student.enrollment_number, student.student_name, student.class_id]
        )
      }
    }

    const adminSummaryEmail = configuredAdminEmail || 'direccao@escola.ao'

    await client.query('COMMIT')
    console.log('Seed data inserted successfully.')
    console.log('Admin account ready:', adminSummaryEmail)
    console.log('Sample enrollment numbers: 202601, 202602, 202603, 202604')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Seeding failed:', error)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
