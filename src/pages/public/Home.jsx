import Hero from '@/components/home/Hero'
import BalancePreview from '@/components/home/BalancePreview'
import FeaturedGames from '@/components/home/FeaturedGames'
import BookingBonus from '@/components/home/BookingBonus'
import HowItWorks from '@/components/home/HowItWorks'
import LeaderboardPreview from '@/components/home/LeaderboardPreview'
import VipAtmosphere from '@/components/home/VipAtmosphere'
import ClubCta from '@/components/home/ClubCta'

export default function Home() {
  return (
    <>
      <Hero />
      <BalancePreview />
      <FeaturedGames />
      <BookingBonus />
      <HowItWorks />
      <LeaderboardPreview />
      <VipAtmosphere />
      <ClubCta />
    </>
  )
}
