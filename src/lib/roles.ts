export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

type SessionWithRole =
  | {
      user?: {
        role?: string | null;
      } | null;
    }
  | null
  | undefined;

export function isAdmin(session: SessionWithRole): boolean {
  return session?.user?.role === ROLES.ADMIN;
}

export function isRole(value: unknown): value is Role {
  return Object.values(ROLES).includes(value as Role);
}
