export const getUserRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || payload.Role || "user";
  } catch (e) {
    console.error("Failed to parse token", e);
    return null;
  }
};
