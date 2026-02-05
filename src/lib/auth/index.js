export { auth, signIn, signOut, handlers } from './config'
export { auth as getServerSession } from './config'
export { authEdgeConfig } from './auth.edge'

export const ROLES = {
  OWNER: 'OWNER',
  TENANT: 'TENANT',
  TRADER: 'TRADER',
  ADMIN: 'ADMIN',
}

export function getDashboardPath(role) {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin'
    case ROLES.OWNER:
      return '/owner'
    case ROLES.TRADER:
      return '/trader'
    case ROLES.TENANT:
      return '/tenant'
    default:
      return '/'
  }
}

export function hasRole(userRole, requiredRoles) {
  if (!userRole) return false
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  return roles.includes(userRole)
}
