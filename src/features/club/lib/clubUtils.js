import { buildServerFileUrl } from "../../../shared/api/fileUrl";

export function normalizeBoardMember(member) {
  return {
    position: (member?.position || "").toString(),
    name: (member?.name || "").toString(),
  };
}

export function parseExecutiveBoard(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeBoardMember).filter((member) => member.position || member.name);
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeBoardMember).filter((member) => member.position || member.name);
      }
    } catch {
      return [];
    }
  }

  return [];
}

export function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (typeof pathOrUrl === "string" && /^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return buildServerFileUrl(pathOrUrl);
}

export function normalizeClubData(data) {
  const executiveBoardValue = data?.executiveBoardJson ?? data?.executiveBoard ?? [];
  const parsedBoard = parseExecutiveBoard(executiveBoardValue);
  const bgImagePath = data?.bgImageUrl || data?.bgImagePath || data?.backgroundImage || null;

  return {
    vision: data?.vision || "",
    mission: data?.mission || "",
    description: data?.description || "",
    executiveBoardJson: JSON.stringify(parsedBoard),
    executiveBoard: parsedBoard,
    bgImageUrl: resolveImageUrl(bgImagePath),
  };
}
