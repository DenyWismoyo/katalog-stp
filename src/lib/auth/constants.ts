import { UserRole } from '@/types'

export interface SessionData {
  uid: string
  email: string
  name: string
  role: UserRole
}

export const SESSION_COOKIE_NAME = 'stp_session'

// Akun Demo Resmi Solo Technopark untuk evaluasi & testing
export const DEMO_ACCOUNTS: Record<string, { pass: string; role: UserRole; name: string }> = {
  'admin@solotechpark.id': {
    pass: 'AdminSTP2026!',
    role: 'admin',
    name: 'Administrator Solo Technopark',
  },
  'operator@solotechpark.id': {
    pass: 'OperatorSTP2026!',
    role: 'operator',
    name: 'Operator Layanan Bisnis STP',
  },
  'mitra@industri.id': {
    pass: 'MitraSTP2026!',
    role: 'user',
    name: 'Perwakilan Industri / Mitra Inovasi',
  },
}
