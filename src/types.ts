export const subjects = [
  'Environmental Science',
  'Computer Programming',
  'General English',
  'Mathematics I',
  'Electrical Science',
  'Physics',
  'Yoga',
  'Disaster Management',
] as const

export type Subject = typeof subjects[number]
export type EntryType = 'Regular lecture' | 'Lab/tutorial' | 'Yoga' | 'Library'
export type CalculationMode = 'asOfNow' | 'endOfToday'
export type Page = 'Dashboard' | 'Attendance' | 'Bunk Planner' | 'Calendar' | 'Timetable' | 'Settings' | 'Sources & Rules'

export interface TimetableEntry {
  id: string
  weekday: number
  startTime: string
  endTime: string
  subject: string
  attendanceCategoryId?: string
  type: EntryType
  batch?: string
  attendanceUnits: number
  attendanceBearing: boolean
}

export interface ClassOccurrence extends TimetableEntry {
  date: string
  attendanceCategoryId: string
}

export interface StudentSettings {
  division: string
  group: string
  labBatch: string
  yogaBatch: string
  threshold: number
  startDate: string
  calculationMode: CalculationMode
  simulationDate: string
}

export interface AttendanceTotals {
  attendanceCategoryId: string
  categoryLabel: string
  subject: Subject
  categoryType: EntryType
  held: number
  attended: number
  absent: number
  percentage: number | null
  safeSkips: number | null
  recoveryClasses: number | null
}
