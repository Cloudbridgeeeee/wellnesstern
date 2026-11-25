import {
  Accessibility, Bell, Bolt, BookOpen, Box, Briefcase, Building2, Bus, Calendar, Camera, Captions, ChartColumn,
  CircleCheck, ClipboardList, Clock, Cloud, Coffee, Cpu, Database, Droplet, Eye, Factory, FileText, Film, Filter,
  Flame, FlaskConical, Gauge, GitCompare, Globe, Grid3x3, Hammer, Heart, History, Hospital, House, KeyRound,
  Languages, Layers, LayoutDashboard, Leaf, Link2, List, Lock, Map, MessageSquare, Package, Plug, Receipt, Route,
  Scale, ScanLine, Search, Server, Settings, Shirt, ShieldCheck, ShoppingCart, Snowflake, Sparkles, Star,
  Stethoscope, Store, Sun, Tag, Target, Thermometer, Ticket, TrendingUp, TriangleAlert, Truck, Undo2, Users,
  UtensilsCrossed, Video, Wallet, Wheat, Workflow, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react'
import type { IconName } from '../config/types'

const MAP: Record<IconName, LucideIcon> = {
  scan: ScanLine, layers: Layers, history: History, trend: TrendingUp, dashboard: LayoutDashboard, file: FileText,
  calendar: Calendar, clock: Clock, search: Search, link: Link2, chart: ChartColumn, flask: FlaskConical,
  compare: GitCompare, zap: Zap, gauge: Gauge, users: Users, map: Map, route: Route, building: Building2,
  home: House, camera: Camera, shield: ShieldCheck, lock: Lock, eye: Eye, check: CircleCheck, list: List, box: Box,
  truck: Truck, leaf: Leaf, coffee: Coffee, factory: Factory, wrench: Wrench, droplet: Droplet,
  thermometer: Thermometer, snow: Snowflake, video: Video, captions: Captions, languages: Languages, scale: Scale,
  briefcase: Briefcase, receipt: Receipt, wallet: Wallet, store: Store, cart: ShoppingCart, package: Package,
  undo: Undo2, tag: Tag, sparkles: Sparkles, message: MessageSquare, heart: Heart, accessibility: Accessibility,
  book: BookOpen, clipboard: ClipboardList, bus: Bus, film: Film, utensils: UtensilsCrossed, bolt: Bolt, plug: Plug,
  hospital: Hospital, stethoscope: Stethoscope, flame: Flame, hammer: Hammer, ticket: Ticket, bell: Bell,
  filter: Filter, database: Database, cloud: Cloud, cpu: Cpu, key: KeyRound, server: Server, workflow: Workflow,
  target: Target, globe: Globe, settings: Settings, alert: TriangleAlert, star: Star, grid: Grid3x3, shirt: Shirt,
  wheat: Wheat, sun: Sun,
}

export function Icon({ name, className, strokeWidth = 1.75 }: { name: IconName; className?: string; strokeWidth?: number }) {
  const C = MAP[name] ?? Sparkles
  return <C className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}
