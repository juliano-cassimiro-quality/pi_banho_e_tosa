import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

export function generateTimeSlots ({ start, end, durationMinutes = 60 }) {
  const slots = []
  let pointer = dayjs(start)
  const limit = dayjs(end)

  while (pointer.add(durationMinutes, 'minute').diff(limit) <= 0) {
    const slotStart = pointer
    const slotEnd = pointer.add(durationMinutes, 'minute')
    slots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString()
    })
    pointer = slotEnd
  }

  return slots
}

export function filterUnavailableSlots (slots, takenIntervals = []) {
  return slots.filter(slot => {
    return !takenIntervals.some(interval => {
      const slotStart = dayjs(slot.start)
      const slotEnd = dayjs(slot.end)
      const takenStart = dayjs(interval.start)
      const takenEnd = dayjs(interval.end)
      return slotStart.isBefore(takenEnd) && slotEnd.isAfter(takenStart)
    })
  })
}
