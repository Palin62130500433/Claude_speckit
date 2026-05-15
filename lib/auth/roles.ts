import type { UserRole } from "@/lib/types/company";

export function isAdmin(role: UserRole | undefined | null): boolean {
  return role === "admin";
}

export function getRoleFromSession(session: unknown): UserRole {
  if (
    session &&
    typeof session === "object" &&
    "role" in session &&
    (session.role === "admin" || session.role === "standard")
  ) {
    return session.role as UserRole;
  }
  return "standard";
}
