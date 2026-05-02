import { API_SERVER_URL } from "./client";

export const buildServerFileUrl = (filePath) => {
  if (!filePath) return null;

  const cleanPath = filePath.replace(/^\.\.\//, "");
  const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  return `${API_SERVER_URL}${normalizedPath}`;
};
