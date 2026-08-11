const { pgTable, serial, varchar, text, integer, timestamp, uniqueIndex } = require('drizzle-orm/pg-core')

exports.students = pgTable('students', {
  id: serial('id').primaryKey(),
  enrollmentNumber: varchar('enrollment_number', { length: 20 }).notNull().unique(),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  classId: integer('class_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

exports.classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  whatsappLink: text('whatsapp_link').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

exports.classAccessLogs = pgTable('class_access_logs', {
  id: serial('id').primaryKey(),
  enrollmentNumber: varchar('enrollment_number', { length: 20 }).notNull(),
  className: varchar('class_name', { length: 100 }).notNull(),
  whatsappLink: text('whatsapp_link').notNull(),
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
})
