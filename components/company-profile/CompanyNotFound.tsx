import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";

export function CompanyNotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-800">{t("title")}</h1>
      <p className="max-w-md text-gray-600">{t("description")}</p>
      <Link
        href={`/${locale}`}
        className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {t("backLink")}
      </Link>
    </div>
  );
}
