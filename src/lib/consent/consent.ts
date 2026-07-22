import { siteConfig } from "@/config/siteConfig";

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  version: string;
  categories: ConsentCategories;
  timestamp: string;
};

export const defaultConsentCategories: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function serializeConsent(record: ConsentRecord) {
  return encodeURIComponent(JSON.stringify(record));
}

export function parseConsent(value: string | null | undefined): ConsentRecord | null {
  if (!value) return null;

  try {
    const decoded = JSON.parse(decodeURIComponent(value)) as Partial<ConsentRecord>;
    if (
      decoded.version === siteConfig.consentVersion &&
      decoded.categories?.necessary === true &&
      typeof decoded.categories.analytics === "boolean" &&
      typeof decoded.categories.marketing === "boolean" &&
      typeof decoded.timestamp === "string"
    ) {
      return decoded as ConsentRecord;
    }
  } catch {
    return null;
  }

  return null;
}

export function createConsentRecord(categories: Partial<ConsentCategories>): ConsentRecord {
  return {
    version: siteConfig.consentVersion,
    categories: {
      necessary: true,
      analytics: Boolean(categories.analytics),
      marketing: Boolean(categories.marketing),
    },
    timestamp: new Date().toISOString(),
  };
}

export function readCookie(cookieString: string, name = siteConfig.consentCookieName) {
  const pair = cookieString
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return pair ? pair.slice(name.length + 1) : null;
}

export function writeConsentCookie(record: ConsentRecord) {
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${siteConfig.consentCookieName}=${serializeConsent(
    record,
  )}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}
