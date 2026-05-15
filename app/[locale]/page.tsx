import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-gray-600">{t("backLink")}</p>
    </main>
  );
}
