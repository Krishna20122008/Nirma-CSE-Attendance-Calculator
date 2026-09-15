import { academicCalendar, holidays, timetable } from './data'
import { subjects, type AttendanceTotals, type ClassOccurrence, type EntryType, type StudentSettings } from './types'

const isoDate = (date: Date) => {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`
}
const parseDate = (value: string) => { const [year, month, day] = value.split('-').map(Number); return new Date(year, month - 1, day) }
const minutes = (time: string) => { const [hours, mins] = time.split(':').map(Number); return hours * 60 + mins }
const between = (value: string, start: string, end: string) => value >= start && value <= end

export function calendarExclusionReason(date: string) {
  if (date < academicCalendar.teachingStart) return 'Before teaching start'
  if (date > academicCalendar.teachingEnd) return 'After teaching end'
  if (holidays.has(date)) return 'Academic holiday'
  if (between(date, academicCalendar.sessionalStart, academicCalendar.sessionalEnd)) return 'Sessional examination'
  if (between(date, academicCalendar.diwaliStart, academicCalendar.diwaliEnd)) return 'Diwali vacation'
  return null
}
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export function attendanceCategoryId(entry: typeof timetable[number]) {
  if (entry.attendanceCategoryId) return entry.attendanceCategoryId
  if (entry.type === 'Yoga') return 'yoga'
  if (entry.type === 'Library') return 'library'
  return `${slug(entry.subject)}-${entry.type === 'Regular lecture' ? 'lecture' : 'lab'}`
}

export function categoryLabel(entry: typeof timetable[number]) {
  if (entry.type === 'Regular lecture') return `${entry.subject} Lecture`
  if (entry.type === 'Lab/tutorial') return `${entry.subject} Lab`
  return entry.subject
}

export function isEligible(entry: typeof timetable[number], settings: StudentSettings) {
  if (entry.type === 'Lab/tutorial') return entry.batch === settings.labBatch
  if (entry.type === 'Yoga') return entry.batch === settings.yogaBatch
  return true
}

export function generateOccurrences(settings: StudentSettings, endDate: string, applyCalendar = true): ClassOccurrence[] {
  const start = parseDate(settings.startDate)
  const requestedEnd = parseDate(endDate)
  const end = new Date(Math.min(requestedEnd.getTime(), parseDate(academicCalendar.teachingEnd).getTime()))
  const occurrences: ClassOccurrence[] = []
  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateKey = isoDate(date)
    if (applyCalendar && calendarExclusionReason(dateKey)) continue
    for (const entry of timetable) {
      if (entry.weekday === date.getDay() && isEligible(entry, settings)) occurrences.push({ ...entry, date: dateKey, id: `${dateKey}-${entry.id}`, attendanceCategoryId: attendanceCategoryId(entry) })
    }
  }
  return occurrences
}

export function categoryAudit(settings: StudentSettings, endDate: string) {
  const normal = generateOccurrences(settings, endDate, false).filter((item) => item.attendanceBearing)
  const counted = generateOccurrences(settings, endDate, true).filter((item) => item.attendanceBearing && isCompleted(item, settings))
  const categories = timetable.filter((entry) => entry.attendanceBearing && isEligible(entry, settings)).filter((entry, index, entries) => entries.findIndex((candidate) => attendanceCategoryId(candidate) === attendanceCategoryId(entry)) === index)
  return categories.map((category) => {
    const categoryId = attendanceCategoryId(category)
    const normalEntries = normal.filter((item) => item.attendanceCategoryId === categoryId)
    const countedEntries = counted.filter((item) => item.attendanceCategoryId === categoryId)
    const excludedEntries = normalEntries.filter((item) => calendarExclusionReason(item.date))
    return {
      categoryId,
      label: categoryLabel(category),
      normalUnits: normalEntries.length,
      excludedUnits: excludedEntries.length,
      finalUnits: countedEntries.length,
      countedEntries,
      excludedEntries: excludedEntries.map((item) => ({ ...item, reason: calendarExclusionReason(item.date) })),
    }
  })
}

export function isCompleted(occurrence: ClassOccurrence, settings: StudentSettings) {
  if (occurrence.date < settings.simulationDate) return true
  if (occurrence.date > settings.simulationDate) return false
  return settings.calculationMode === 'endOfToday' || minutes(occurrence.endTime) <= new Date().getHours() * 60 + new Date().getMinutes()
}

export function calculateTotals(settings: StudentSettings, bunked: Set<string>): AttendanceTotals[] {
  const occurrences = generateOccurrences(settings, settings.simulationDate).filter((occurrence) => occurrence.attendanceBearing && isCompleted(occurrence, settings))
  const categories = timetable.filter((entry) => entry.attendanceBearing && isEligible(entry, settings)).filter((entry, index, entries) => entries.findIndex((candidate) => attendanceCategoryId(candidate) === attendanceCategoryId(entry)) === index)
  return categories.map((category) => {
    const categoryOccurrences = occurrences.filter((occurrence) => occurrence.attendanceCategoryId === attendanceCategoryId(category))
    const held = categoryOccurrences.length
    const absent = categoryOccurrences.reduce((sum, occurrence) => sum + (bunked.has(occurrence.id) ? 1 : 0), 0)
    const attended = held - absent
    const percentage = held ? (attended / held) * 100 : null
    const requirement = settings.threshold / 100
    const safeSkips = held ? Math.max(0, Math.floor(attended / requirement - held + Number.EPSILON)) : null
    const recoveryClasses = held && percentage !== null && percentage < settings.threshold
      ? Math.ceil((requirement * held - attended) / (1 - requirement))
      : 0
    return { attendanceCategoryId: attendanceCategoryId(category), categoryLabel: categoryLabel(category), subject: category.subject as typeof subjects[number], categoryType: category.type as EntryType, held, attended, absent, percentage, safeSkips, recoveryClasses }
  })
}

export function attendanceAfter(total: AttendanceTotals, missedOccurrences: number, threshold: number) {
  const attended = total.attended - missedOccurrences
  return { attended, percentage: total.held ? (attended / total.held) * 100 : null, below: total.held > 0 && attended / total.held * 100 < threshold }
}

export function formatDate(date: string) { return parseDate(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
export function dayName(day: number) { return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day] }
