export function formatRegistrationDate(
  isoDate: string,
  locale: string
): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;

  if (locale === "th") {
    return new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function calcYearInBusiness(
  isoDate: string,
  locale: string
): number {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 0;

  if (locale === "th") {
    const thaiYear = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
      year: "numeric",
    }).format(new Date());
    const regThaiYear = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
      year: "numeric",
    }).format(date);
    return parseInt(thaiYear) - parseInt(regThaiYear);
  }

  return new Date().getFullYear() - date.getFullYear();
}
