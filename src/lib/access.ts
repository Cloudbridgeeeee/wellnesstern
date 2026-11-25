import type { Permission, Role } from '../config/types'

export function can(role: Role | undefined, perm: Permission) {
  return !!role && role.can.includes(perm)
}

export const PERMISSION_LABELS: Record<Permission, string> = {
  view: 'View records and dashboards',
  import: 'Import data',
  review: 'Review AI suggestions',
  edit: 'Edit records',
  manage: 'Manage team and settings',
  export: 'Export reports',
}
