"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCompany, useUpdateCompany } from "@/lib/api/companies";
import { CompanyProfileCard } from "./CompanyProfileCard";
import { CompanyNotFound } from "./CompanyNotFound";
import type { CompanyProfileEditRequest } from "@/lib/schemas/company";

interface CompanyProfilePageClientProps {
  registeredNo: string;
  userRole?: string;
}

export function CompanyProfilePageClient({
  registeredNo,
  userRole,
}: CompanyProfilePageClientProps) {
  const t = useTranslations("companyProfile");
  const { data: company, isLoading, error } = useCompany(registeredNo);
  const updateMutation = useUpdateCompany(registeredNo);

  // Unsaved-changes navigation guard (edit mode tracked in CompanyProfileCard via isDirty)
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    // The guard is only meaningful in edit mode; CompanyProfileCard manages its own edit state.
    // Attach here as a fallback for browser-level navigation.
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  async function handleSave(data: CompanyProfileEditRequest) {
    await updateMutation.mutateAsync(data);
  }

  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-gray-200" />
        ))}
      </div>
    );
  }

  if (error?.message === "not_found") {
    return <CompanyNotFound />;
  }

  if (error || !company) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">{t("errors.loadFailed")}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 rounded-md border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
        >
          {t("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <CompanyProfileCard
      company={company}
      userRole={userRole}
      onSave={handleSave}
    />
  );
}
