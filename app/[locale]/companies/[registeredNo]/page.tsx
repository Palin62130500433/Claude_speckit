import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CompanyProfilePageClient } from "@/components/company-profile/CompanyProfilePageClient";

interface PageProps {
  params: Promise<{ locale: string; registeredNo: string }>;
  searchParams: Promise<{ role?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, registeredNo } = await params;
  const t = await getTranslations({ locale, namespace: "companyProfile" });
  return {
    title: `${t("title")} — ${registeredNo}`,
    description: t("title"),
  };
}

export default async function CompanyProfilePage({ params, searchParams }: PageProps) {
  const { registeredNo } = await params;
  const { role } = await searchParams;

  // Production: replace with real session/auth lookup.
  // Development: use ?role=admin or ?role=standard in the URL to test both views.
  //   Defaults to "admin" when no query param is provided (so edit UI is testable immediately).
  const userRole =
    process.env.COMPANY_API_BASE_URL
      ? "standard"
      : role === "standard"
      ? "standard"
      : "admin";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <CompanyProfilePageClient
        registeredNo={registeredNo}
        userRole={userRole}
      />
    </main>
  );
}
