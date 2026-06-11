import { adminNavGroups } from '@/data/navConfig'
import AppShell from './AppShell'

export default function AdminLayout() {
  return <AppShell groups={adminNavGroups} variant="admin" />
}
