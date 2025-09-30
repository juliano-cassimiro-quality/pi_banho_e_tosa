export function sendNotification ({ type, recipient, message }) {
  const timestamp = new Date().toISOString()
  console.log(`[NOTIFICATION] [${timestamp}] [${type}] -> ${recipient}: ${message}`)
}

export const NotificationType = Object.freeze({
  CONFIRMATION: 'CONFIRMATION',
  REMINDER: 'REMINDER',
  CANCELLATION: 'CANCELLATION',
  RESCHEDULE: 'RESCHEDULE',
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY'
})
