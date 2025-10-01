export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'client';
  token?: string;
}
