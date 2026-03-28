/** Only this account may change user roles in admin user management. */
export const SUPER_ADMIN_EMAIL = "muhammadtaha2723@gmail.com"

export function isSuperAdminEmail(email: string | undefined | null): boolean {
  return email?.trim().toLowerCase() === SUPER_ADMIN_EMAIL
}
