import type { StudentSettings, TimetableEntry } from './types'

const localDateKey = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const defaultSettings: StudentSettings = {
  division: 'C', group: 'I', labBatch: 'C3', yogaBatch: 'CT2', threshold: 85,
  startDate: '2026-08-01', calculationMode: 'asOfNow', simulationDate: localDateKey(),
}

export const timetable: TimetableEntry[] = [
  { id: 'mon-es', weekday: 1, startTime: '11:40', endTime: '12:35', subject: 'Environmental Science', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'mon-cp', weekday: 1, startTime: '12:35', endTime: '13:30', subject: 'Computer Programming', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'mon-ge', weekday: 1, startTime: '14:25', endTime: '15:20', subject: 'General English', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'mon-math', weekday: 1, startTime: '15:20', endTime: '16:15', subject: 'Mathematics I', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'mon-cp-c3', weekday: 1, startTime: '16:30', endTime: '18:20', subject: 'Computer Programming', type: 'Lab/tutorial', batch: 'C3', attendanceUnits: 1, attendanceBearing: true },
  { id: 'tue-math', weekday: 2, startTime: '11:40', endTime: '12:35', subject: 'Mathematics I', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'tue-ge', weekday: 2, startTime: '12:35', endTime: '13:30', subject: 'General English', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'tue-physics-c3', weekday: 2, startTime: '14:25', endTime: '16:15', subject: 'Physics', type: 'Lab/tutorial', batch: 'C3', attendanceUnits: 1, attendanceBearing: true },
  { id: 'tue-yoga-ct2', weekday: 2, startTime: '16:30', endTime: '18:20', subject: 'Yoga', type: 'Yoga', batch: 'CT2', attendanceUnits: 1, attendanceBearing: true },
  { id: 'wed-ge-c3', weekday: 3, startTime: '11:40', endTime: '13:30', subject: 'General English', type: 'Lab/tutorial', batch: 'C3', attendanceUnits: 1, attendanceBearing: true },
  { id: 'wed-es', weekday: 3, startTime: '14:25', endTime: '15:20', subject: 'Environmental Science', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'wed-physics', weekday: 3, startTime: '15:20', endTime: '16:15', subject: 'Physics', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'wed-dm', weekday: 3, startTime: '16:30', endTime: '17:25', subject: 'Disaster Management', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'thu-es-c3', weekday: 4, startTime: '11:40', endTime: '12:35', subject: 'Environmental Science', type: 'Lab/tutorial', batch: 'C3', attendanceUnits: 1, attendanceBearing: true },
  { id: 'thu-math-c3', weekday: 4, startTime: '12:35', endTime: '13:30', subject: 'Mathematics I', type: 'Lab/tutorial', batch: 'C3', attendanceUnits: 1, attendanceBearing: true },
  { id: 'thu-electrical', weekday: 4, startTime: '14:25', endTime: '15:20', subject: 'Electrical Science', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'thu-cp', weekday: 4, startTime: '15:20', endTime: '16:15', subject: 'Computer Programming', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'fri-electrical', weekday: 5, startTime: '11:40', endTime: '12:35', subject: 'Electrical Science', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'fri-physics', weekday: 5, startTime: '12:35', endTime: '13:30', subject: 'Physics', type: 'Regular lecture', attendanceUnits: 1, attendanceBearing: true },
  { id: 'fri-electrical-c3', weekday: 5, startTime: '14:25', endTime: '15:20', subject: 'Electrical Science', type: 'Lab/tutorial', batch: 'C3', attendanceUnits: 1, attendanceBearing: true },
]

export const academicCalendar = {
  teachingStart: '2026-08-03',
  teachingEnd: '2026-12-05',
  sessionalStart: '2026-10-06',
  sessionalEnd: '2026-10-09',
  diwaliStart: '2026-11-06',
  diwaliEnd: '2026-11-13',
  holidays: new Set([
    '2026-08-15',
    '2026-08-28',
    '2026-09-04',
    '2026-09-15',
    '2026-10-02',
    '2026-10-20',
    '2026-11-24',
  ]),
}

export const holidays = academicCalendar.holidays
