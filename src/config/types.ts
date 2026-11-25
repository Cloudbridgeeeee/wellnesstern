/**
 * The shape of a site's content and design. Every page, the workspace demo and the
 * generated metadata read from one `Business` object in `business.ts`.
 */

export type IconName =
  | 'scan' | 'layers' | 'history' | 'trend' | 'dashboard' | 'file' | 'calendar' | 'clock' | 'search'
  | 'link' | 'chart' | 'flask' | 'compare' | 'zap' | 'gauge' | 'users' | 'map' | 'route' | 'building'
  | 'home' | 'camera' | 'shield' | 'lock' | 'eye' | 'check' | 'list' | 'box' | 'truck' | 'leaf'
  | 'coffee' | 'factory' | 'wrench' | 'droplet' | 'thermometer' | 'snow' | 'video' | 'captions'
  | 'languages' | 'scale' | 'briefcase' | 'receipt' | 'wallet' | 'store' | 'cart' | 'package'
  | 'undo' | 'tag' | 'sparkles' | 'message' | 'heart' | 'accessibility' | 'book' | 'clipboard'
  | 'bus' | 'film' | 'utensils' | 'bolt' | 'plug' | 'hospital' | 'stethoscope' | 'flame' | 'hammer'
  | 'ticket' | 'bell' | 'filter' | 'database' | 'cloud' | 'cpu' | 'key' | 'server' | 'workflow'
  | 'target' | 'globe' | 'settings' | 'alert' | 'star' | 'grid' | 'shirt' | 'wheat' | 'sun'

export type HeroVisual =
  | 'vision' // image grid with detection boxes
  | 'document' // a document with fields being extracted
  | 'forecast' // a line chart drawing a forecast band
  | 'sensor' // live streaming readings with an anomaly
  | 'network' // nodes and routes
  | 'inventory' // stacked bars / allocation
  | 'captions' // waveform with captions
  | 'redaction' // text being redacted
  | 'feedback' // themes clustering from comments
  | 'ledger' // budget vs actual
  | 'compare' // two versions with changes highlighted

export interface Theme {
  mode: 'dark' | 'light'
  /** Page background */
  canvas: string
  /** Card / panel background */
  surface: string
  /** Raised element background (inputs, chips, nested panels) */
  raised: string
  /** Body text */
  ink: string
  /** Secondary text */
  soft: string
  /** Tertiary text / captions */
  faint: string
  /** Hairlines (hex, used with alpha) */
  line: string
  accent: string
  accent2: string
  accent3: string
  /** Text colour that sits on the accent */
  onAccent: string
  good: string
  warn: string
  bad: string
  display: string
  sans: string
  mono: string
  /** Google Fonts css2 query, e.g. "family=Sora:wght@300..700&family=Manrope:wght@400..700" */
  fonts: string
  displayWeight: number
  displayTracking: string
  radius: 'sharp' | 'soft' | 'round'
  motif: 'grid' | 'dots' | 'contours' | 'beams' | 'rings' | 'waves' | 'diagonal' | 'hex'
  hero: 'split' | 'centered' | 'editorial' | 'bento'
  nav: 'pill' | 'bar' | 'minimal'
  card: 'glass' | 'outline' | 'solid'
  logo: 'tile' | 'drop' | 'ring' | 'stack' | 'spark' | 'arch' | 'wave' | 'hex' | 'leaf' | 'bolt' | 'frame' | 'knot'
  /** Home page section order. Keys of HomeSection. */
  order: HomeSection[]
}

export type HomeSection =
  | 'problem' | 'solution' | 'features' | 'workflow' | 'visual' | 'aws' | 'safeguards'
  | 'customers' | 'mvp' | 'pricing' | 'roadmap' | 'team' | 'faq'

export interface Person {
  name: string
  role: string
  bio: string
  focus: string[]
  location: string
  /** First line of a quote shown on the team card */
  quote?: string
}

export interface Feature {
  icon: IconName
  title: string
  body: string
  bullets: string[]
  status: 'In the demo' | 'Pilot' | 'Roadmap'
}

export interface Step {
  title: string
  body: string
  detail: string
}

export interface Customer {
  id: string
  icon: IconName
  title: string
  pain: string
  outcome: string
  bullets: string[]
}

export interface AwsService {
  name: string
  icon: IconName
  role: string
  detail: string
}

export interface Tier {
  name: string
  monthly: number | null
  blurb: string
  features: string[]
  highlight?: boolean
  cta?: string
}

export interface Status {
  id: string
  label: string
  tone: 'good' | 'warn' | 'bad' | 'info' | 'muted'
}

export interface Metric {
  key: string
  label: string
  unit: string
  min: number
  max: number
  decimals: number
  /** When true, higher values are better (used for colouring and flags) */
  higherIsBetter: boolean
  /** Values beyond this (in the "bad" direction) are flagged */
  threshold: number
}

export type Permission = 'view' | 'import' | 'review' | 'edit' | 'manage' | 'export'

export interface Role {
  id: string
  label: string
  description: string
  can: Permission[]
}

export interface WorkspaceConfig {
  /** Shown in the workspace header, e.g. "Inspection workspace" */
  title: string
  /** The fictional demo customer */
  org: string
  orgPlace: string
  entity: {
    singular: string
    plural: string
    idPrefix: string
    names: string[]
    categoryLabel: string
    categories: string[]
    locationLabel: string
    locations: string[]
    ownerLabel: string
    statuses: Status[]
    /** Short label for the date column, e.g. "Inspected" */
    dateLabel: string
  }
  metrics: Metric[]
  findings: {
    /** Label for AI outputs, e.g. "Defect classification" */
    label: string
    types: string[]
    /** Evidence templates. {name} {category} {location} {metric} {value} {type} are filled in */
    evidence: string[]
    /** What a reviewer does, e.g. "Confirm classification" */
    action: string
  }
  series: {
    label: string
    unit: string
    base: number
    trend: number
    season: number
    noise: number
    /** Period label, e.g. "Week" */
    period: string
    forecastLabel: string
  }
  breakdownLabel: string
  importSample: {
    fileName: string
    sourceLabel: string
    rows: number
    pipeline: { service: string; label: string }[]
  }
  roles: Role[]
  people: string[]
  assistant: {
    name: string
    suggestions: string[]
    /** Phrases that trigger a refusal and the reason given */
    refuse: { match: string[]; reason: string }[]
  }
  report: { title: string; sections: string[] }
}

export interface Business {
  slug: string
  name: string
  domain: string
  email: string
  tagline: string
  industries: string[]
  description: string
  /** Optional sector note shown on the home page and in the footer */
  sectorNote?: string
  theme: Theme
  founders: Person[]
  hero: {
    eyebrow: string
    /** Wrap the emphasised words in *asterisks* */
    headline: string
    sub: string
    primary: string
    secondary: string
    visual: HeroVisual
    /** Labels used inside the animated hero visual */
    labels: string[]
    chips: string[]
  }
  marquee: string[]
  stats: { value: number; suffix?: string; prefix?: string; label: string; note: string }[]
  problem: { eyebrow: string; heading: string; intro: string; points: { icon: IconName; title: string; body: string }[] }
  solution: { heading: string; body: string; before: string[]; after: string[] }
  features: Feature[]
  steps: Step[]
  customers: Customer[]
  aws: { intro: string; services: AwsService[]; flow: string[]; principles: { title: string; body: string }[] }
  safeguards: { icon: IconName; title: string; body: string }[]
  mvp: { heading: string; body: string; includes: string[]; later: string[] }
  pricing: { unit: string; model: string; note: string; tiers: Tier[] }
  roadmap: { phase: string; title: string; items: string[] }[]
  faq: { q: string; a: string }[]
  story: { heading: string; paragraphs: string[]; principles: { title: string; body: string }[] }
  workspace: WorkspaceConfig
}
