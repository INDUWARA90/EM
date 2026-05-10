import { format } from "date-fns";

const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_ONLY_REGEX = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

const toSafeNumber = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const parseAppDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const dateOnlyMatch = trimmed.match(DATE_ONLY_REGEX);

    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      return new Date(toSafeNumber(year), toSafeNumber(month) - 1, toSafeNumber(day));
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const parseAppDateTime = (dateValue, timeValue) => {
  const date = parseAppDate(dateValue);
  if (!date) return null;

  if (!timeValue || typeof timeValue !== "string") {
    return date;
  }

  const timeMatch = timeValue.trim().match(TIME_ONLY_REGEX);
  if (!timeMatch) return date;

  const [, hour, minute, second] = timeMatch;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    toSafeNumber(hour),
    toSafeNumber(minute),
    toSafeNumber(second || "0")
  );
};

export const formatAppDate = (value, pattern = "MMM dd, yyyy", fallback = "N/A") => {
  const date = parseAppDate(value);
  if (!date) return fallback;

  try {
    return format(date, pattern);
  } catch {
    return fallback;
  }
};

export const formatAppDateTime = (
  value,
  pattern = "MMM dd, yyyy HH:mm",
  fallback = "N/A"
) => {
  const date = parseAppDate(value);
  if (!date) return fallback;

  try {
    return format(date, pattern);
  } catch {
    return fallback;
  }
};

export const formatAppTime = (timeValue, fallback = "--:--") => {
  if (!timeValue || typeof timeValue !== "string") return fallback;

  const timeMatch = timeValue.trim().match(TIME_ONLY_REGEX);
  if (!timeMatch) return fallback;

  const [, hour, minute] = timeMatch;
  return `${hour}:${minute}`;
};
