const { pgTable, serial, varchar, text, integer, timestamp, uniqueIndex } = require('drizzle-orm/pg-core')

exports.classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  whatsappLink: text('whatsapp_link').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

exports.students = pgTable('students', {
  id: serial('id').primaryKey(),
  enrollmentNumber: varchar('enrollment_number', { length: 20 }).notNull().unique(),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  classId: integer('class_id').notNull().references(() => exports.classes.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

exports.classAccessLogs = pgTable('class_access_logs', {
  id: serial('id').primaryKey(),
  enrollmentNumber: varchar('enrollment_number', { length: 20 }).notNull(),
  className: varchar('class_name', { length: 100 }).notNull(),
  whatsappLink: text('whatsapp_link').notNull(),
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
})

exports.reservationRequests = pgTable(
  'reservation_requests',
  {
    id: serial('id').primaryKey(),
    parentName: varchar('parent_name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),
    studentName: varchar('student_name', { length: 255 }).notNull(),
    dateOfBirth: varchar('date_of_birth', { length: 20 }).notNull(),
    intendedGrade: varchar('intended_grade', { length: 120 }).notNull(),
    admissionYear: varchar('admission_year', { length: 20 }).notNull(),
    hasSpecialNeeds: varchar('has_special_needs', { length: 10 }).notNull(),
    observations: text('observations'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    reservationUnique: uniqueIndex('reservation_requests_unique_idx').on(
      table.parentName,
      table.studentName,
      table.dateOfBirth
    ),
  })
)
