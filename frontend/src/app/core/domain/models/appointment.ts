export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  ownerName: string;
  service: string;
  scheduledAt: string;
  status: 'scheduled' | 'in_progress' | 'done' | 'cancelled';
}
