import { Landmark, Sparkles, Sun, Waves, Spade, Diamond } from 'lucide-react'

// Each game carries a theme key. The key maps to a gradient and an icon so cards
// render a rich, on brand panel without relying on external image files.
export const gameThemes = {
  mayan: { Icon: Landmark, gradient: 'from-[#1d6b4a] via-[#0f2e22] to-[#0a1f17]', accent: 'text-accent' },
  fortune: { Icon: Sparkles, gradient: 'from-[#7a5a18] via-[#2a2010] to-[#120d06]', accent: 'text-primary' },
  palms: { Icon: Sun, gradient: 'from-[#8a6f24] via-[#1f3a2a] to-[#0c1a13]', accent: 'text-primary-light' },
  ocean: { Icon: Waves, gradient: 'from-[#15506b] via-[#10303f] to-[#0a1a22]', accent: 'text-[#7cc4e0]' },
  blackjack: { Icon: Spade, gradient: 'from-[#3a1230] via-[#1a0d1c] to-[#0d0710]', accent: 'text-primary' },
  baccarat: { Icon: Diamond, gradient: 'from-[#5b2a86] via-[#26133a] to-[#100a18]', accent: 'text-accent-2-light' },
}

export function getTheme(key) {
  return gameThemes[key] || gameThemes.fortune
}
