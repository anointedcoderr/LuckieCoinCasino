import { useState, useEffect } from 'react'
import {
  Settings2,
  Coins,
  ToggleRight,
  Wrench,
  Banknote,
  Palette,
  Save,
  AlertTriangle,
} from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Switch from '@/components/ui/Switch'
import Badge from '@/components/ui/Badge'
import AdminPageHeader from '@/components/ui/AdminPageHeader'

// Sectioned card shell so every settings group reads as its own premium panel.
function SettingsCard({ icon: Icon, title, blurb, children }) {
  return (
    <section className="glass-dark rounded-3xl border border-white/10 p-6 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
          {blurb && <p className="mt-0.5 text-sm text-muted">{blurb}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

const featureLabels = {
  slots: 'Resort Slots',
  poker: 'Poker Room',
  blackjack: 'Blackjack Tables',
  baccarat: 'Baccarat Salon',
  leaderboard: 'Leaderboard',
  promotions: 'Promotions',
}

export default function AdminSettings() {
  const data = useData()
  const { push } = useToast()
  const { settings, cashoutRules } = data

  const [general, setGeneral] = useState(settings.general)
  const [currency, setCurrency] = useState(settings.currency)
  const [rules, setRules] = useState(cashoutRules)

  // Keep local edit state aligned if the store re-seeds during the session.
  useEffect(() => setGeneral(settings.general), [settings.general])
  useEffect(() => setCurrency(settings.currency), [settings.currency])
  useEffect(() => setRules(cashoutRules), [cashoutRules])

  const setG = (k) => (e) => setGeneral((s) => ({ ...s, [k]: e.target.value }))
  const setC = (k) => (e) => setCurrency((s) => ({ ...s, [k]: e.target.value }))
  const setR = (k) => (e) => setRules((s) => ({ ...s, [k]: e.target.value }))

  const saveGeneral = () => {
    data.updateSettings('general', {
      siteName: general.siteName,
      tagline: general.tagline,
      contactEmail: general.contactEmail,
    })
    push({ tone: 'success', title: 'General settings saved', message: 'The resort profile has been updated.' })
  }

  const saveCurrency = () => {
    data.updateSettings('currency', {
      name: currency.name,
      symbol: currency.symbol,
      decimals: Number(currency.decimals) || 0,
    })
    push({ tone: 'success', title: 'Currency settings saved', message: `${currency.name} display preferences updated.` })
  }

  const saveRules = () => {
    data.updateCashoutRules({
      minLC: Number(rules.minLC) || 0,
      maxLC: Number(rules.maxLC) || 0,
      cooldownHours: Number(rules.cooldownHours) || 0,
      dailyLimitLC: Number(rules.dailyLimitLC) || 0,
      feePct: Number(rules.feePct) || 0,
    })
    push({ tone: 'success', title: 'Cashout rules saved', message: 'New limits and fees apply to the next request.' })
  }

  const handleToggleFeature = (key) => {
    const next = !settings.features[key]
    data.toggleFeature(key)
    push({
      tone: next ? 'success' : 'info',
      title: `${featureLabels[key] || key} ${next ? 'enabled' : 'paused'}`,
      message: next
        ? `${featureLabels[key] || key} is now live on the floor.`
        : `${featureLabels[key] || key} is hidden from guests.`,
    })
  }

  const handleMaintenance = (on) => {
    data.setMaintenance(on)
    push({
      tone: on ? 'warn' : 'success',
      title: on ? 'Maintenance mode on' : 'Maintenance mode off',
      message: on ? 'Guests will see the lounge closed notice.' : 'The resort floor is open to guests again.',
    })
  }

  const branding = settings.branding
  const swatches = [
    { key: 'primary', label: 'Champagne Gold', value: branding.primary },
    { key: 'accent', label: 'Emerald', value: branding.accent },
    { key: 'accent2', label: 'Royal Purple', value: branding.accent2 },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader description="Tune the resort profile, currency, floor features, and cashout rules. Changes apply across the member experience right away." />

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard icon={Settings2} title="General" blurb="How the resort presents itself to members and partners.">
          <div className="space-y-4">
            <Field label="Site name" name="siteName" value={general.siteName} onChange={setG('siteName')} />
            <Field label="Tagline" name="tagline" value={general.tagline} onChange={setG('tagline')} />
            <Field label="Contact email" name="contactEmail" type="email" value={general.contactEmail} onChange={setG('contactEmail')} />
            <div className="flex justify-end">
              <Button icon={Save} onClick={saveGeneral}>Save general</Button>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={Coins} title="Currency" blurb="The name and format used wherever LuckieCoin is shown.">
          <div className="space-y-4">
            <Field label="Currency name" name="name" value={currency.name} onChange={setC('name')} />
            <Field label="Symbol" name="symbol" value={currency.symbol} onChange={setC('symbol')} hint="Shown beside amounts across the floor." />
            <Field label="Decimal places" name="decimals" type="number" value={currency.decimals} onChange={setC('decimals')} />
            <div className="flex justify-end">
              <Button icon={Save} onClick={saveCurrency}>Save currency</Button>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard icon={ToggleRight} title="Features" blurb="Open or pause sections of the resort floor for all guests.">
          <ul className="divide-y divide-white/10">
            {Object.keys(settings.features).map((key) => (
              <li key={key} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{featureLabels[key] || key}</p>
                  <p className="text-xs text-muted">{settings.features[key] ? 'Live for members' : 'Paused and hidden'}</p>
                </div>
                <Switch
                  checked={settings.features[key]}
                  onChange={() => handleToggleFeature(key)}
                  label={`Toggle ${featureLabels[key] || key}`}
                />
              </li>
            ))}
          </ul>
        </SettingsCard>

        <SettingsCard icon={Wrench} title="Maintenance mode" blurb="Temporarily close the floor while the team works behind the scenes.">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Resort floor status</p>
              <p className="text-xs text-muted">{settings.maintenanceMode ? 'Closed for maintenance' : 'Open to guests'}</p>
            </div>
            <Switch checked={settings.maintenanceMode} onChange={handleMaintenance} label="Toggle maintenance mode" />
          </div>
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-warn/30 bg-warn/10 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" strokeWidth={2.3} />
            <p className="text-xs leading-relaxed text-warn">
              While maintenance mode is on, members see a closed lounge notice and cannot reach the games. Turn it off to welcome guests back.
            </p>
          </div>
        </SettingsCard>

        <SettingsCard icon={Banknote} title="Cashout rules" blurb="Limits, cooldown, and fees that govern every cashout request.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Minimum LC" name="minLC" type="number" value={rules.minLC} onChange={setR('minLC')} />
            <Field label="Maximum LC" name="maxLC" type="number" value={rules.maxLC} onChange={setR('maxLC')} />
            <Field label="Cooldown hours" name="cooldownHours" type="number" value={rules.cooldownHours} onChange={setR('cooldownHours')} />
            <Field label="Daily limit LC" name="dailyLimitLC" type="number" value={rules.dailyLimitLC} onChange={setR('dailyLimitLC')} />
            <Field label="Fee percent" name="feePct" type="number" value={rules.feePct} onChange={setR('feePct')} hint="Applied at payout." />
          </div>
          <div className="mt-4 flex justify-end">
            <Button icon={Save} onClick={saveRules}>Save cashout rules</Button>
          </div>
        </SettingsCard>

        <SettingsCard icon={Palette} title="Branding" blurb="The signature resort palette used across the member experience.">
          <ul className="space-y-3">
            {swatches.map((s) => (
              <li key={s.key} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface-2/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-9 w-9 rounded-xl border border-white/15 shadow-card"
                    style={{ backgroundColor: s.value }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">{s.label}</p>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted">{s.value}</p>
                  </div>
                </div>
                <Badge tone="neutral">{s.key}</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            Palette values are curated by the brand team and shown here for reference.
          </p>
        </SettingsCard>
      </div>
    </div>
  )
}
