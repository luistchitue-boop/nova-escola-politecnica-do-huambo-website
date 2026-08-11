require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function seed() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

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

    await client.query('COMMIT')
    console.log('Seed data inserted successfully.')
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
