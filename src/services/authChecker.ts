import { UserRole } from "../enums/UserRole";
import type { AuthChecker } from "type-graphql";
import { ReturnContext } from "../types";

export const authChecker: AuthChecker<ReturnContext, UserRole> = (
  { context },
  requiredRoles
) => {
  if (requiredRoles.length === 0) return true;
  if (!context.isAuthenticated) {
    throw context.authenticationError;
  }
  if (!context.user) return false;

  const authorized = requiredRoles.some(
    (allowedRole) => allowedRole === context.user.role
  );
  if (authorized) return true;
  return false;
};
