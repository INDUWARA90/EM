export const normalizeRole = (role) => {
  if (typeof role !== "string") return "";
  const cleaned = role.trim().toUpperCase();
  if (!cleaned) return "";
  return cleaned.startsWith("ROLE_") ? cleaned : `ROLE_${cleaned}`;
};

export const hasRole = (roles, expectedRole) => {
  if (!Array.isArray(roles)) return false;
  const normalizedExpected = normalizeRole(expectedRole);
  if (!normalizedExpected) return false;
  return roles.some((role) => normalizeRole(role) === normalizedExpected);
};
