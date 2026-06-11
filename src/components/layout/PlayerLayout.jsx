import { playerNav } from '@/data/navConfig'
import AppShell from './AppShell'

export default function PlayerLayout() {
  return <AppShell items={playerNav} variant="player" />
}
