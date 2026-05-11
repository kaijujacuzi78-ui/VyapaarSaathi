export const usernameToEmail = (identifier: string) => `${identifier.toLowerCase()}@vyapaarsaathi.local`;

export const normalizeIdentifier = (value: string) => {
  const identifier = value.trim();
  if (identifier.includes("@")) {
    return { email: identifier.toLowerCase(), username: null };
  }
  return { email: usernameToEmail(identifier), username: identifier };
};

export const getAuthMessage = (message: string, fallback: string) => {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already exists") || lower.includes("user already")) {
    return "Account already exists";
  }
  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return fallback;
  }
  if (lower.includes("not found") || lower.includes("does not exist")) {
    return "Account not found";
  }
  return message || fallback;
};
