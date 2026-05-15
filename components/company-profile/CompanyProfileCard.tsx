"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CompanyProfile } from "@/lib/types/company";
import { CompanyProfileEditRequestSchema, type CompanyProfileEditRequest } from "@/lib/schemas/company";
import { isAdmin } from "@/lib/auth/roles";
import { calcYearInBusiness } from "@/lib/utils/date";
import { CompanyField } from "./CompanyField";
import { StatusBadge } from "./StatusBadge";
import { EditToolbar } from "./EditToolbar";

interface CompanyProfileCardProps {
  company: CompanyProfile;
  userRole?: string;
  onSave?: (data: CompanyProfileEditRequest) => Promise<void>;
}

export function CompanyProfileCard({
  company,
  userRole,
  onSave,
}: CompanyProfileCardProps) {
  const t = useTranslations("companyProfile");
  const locale = useLocale();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const adminUser = isAdmin(userRole as "admin" | "standard");
  const statusOptions = (
    ["ACTIVE", "DISSOLVED", "STRUCK_OFF", "SUSPENDED", "UNKNOWN"] as const
  ).map((s) => ({ value: s, label: t(`status.${s}`) }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyProfileEditRequest>({
    resolver: zodResolver(CompanyProfileEditRequestSchema),
    defaultValues: {
      setSymbol: company.setSymbol ?? null,
      tradeName: company.tradeName,
      registrationType: company.registrationType,
      companyStatus: company.companyStatus,
      registeredCapitalBaht: company.registeredCapitalBaht ?? null,
      majorShareholderNationality: company.majorShareholderNationality ?? null,
      registrationDate: company.registrationDate,
      businessAddress: company.businessAddress ?? null,
      telephone: company.telephone ?? null,
    },
  });

  function handleEdit() {
    setSaveError(null);
    setIsEditing(true);
  }

  function handleCancel() {
    reset();
    setSaveError(null);
    setIsEditing(false);
  }

  async function handleSave() {
    await handleSubmit(async (data) => {
      setIsSaving(true);
      setSaveError(null);
      try {
        await onSave?.(data);
        setIsEditing(false);
      } catch {
        setSaveError(t("errors.saveFailed"));
      } finally {
        setIsSaving(false);
      }
    })();
  }

  const yearInBusiness = calcYearInBusiness(company.registrationDate, locale);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{t("title")}</h2>
        {adminUser && (
          <EditToolbar
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>

      {saveError && (
        <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
          {saveError}
        </div>
      )}

      <dl className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-[auto_1fr]">
        {/* Registered No — always read-only */}
        <CompanyField
          label={t("fields.registeredNo")}
          value={company.registeredNo}
          isReadOnly
        />

        <CompanyField
          label={t("fields.setSymbol")}
          value={company.setSymbol}
          editMode={isEditing}
          registration={register("setSymbol")}
          error={errors.setSymbol}
        />

        <CompanyField
          label={t("fields.tradeName")}
          value={company.tradeName}
          editMode={isEditing}
          registration={register("tradeName")}
          error={errors.tradeName}
        />

        <CompanyField
          label={t("fields.registrationType")}
          value={company.registrationType}
          editMode={isEditing}
          registration={register("registrationType")}
          error={errors.registrationType}
        />

        {/* Company Status */}
        <dt className="text-sm font-medium text-gray-500 py-3 px-4">
          {t("fields.companyStatus")}
        </dt>
        <dd className="py-3 px-4">
          {isEditing ? (
            <select
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.companyStatus ? "border-red-500" : "border-gray-300"
              }`}
              {...register("companyStatus")}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <StatusBadge status={company.companyStatus} />
          )}
          {errors.companyStatus && (
            <p className="mt-1 text-xs text-red-600">
              {errors.companyStatus.message}
            </p>
          )}
        </dd>

        <CompanyField
          label={t("fields.registeredCapitalBaht")}
          value={company.registeredCapitalBaht}
          editMode={isEditing}
          inputType="text"
          registration={register("registeredCapitalBaht", {
            setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
          })}
          error={errors.registeredCapitalBaht}
        />

        <CompanyField
          label={t("fields.majorShareholderNationality")}
          value={company.majorShareholderNationality}
          editMode={isEditing}
          registration={register("majorShareholderNationality")}
          error={errors.majorShareholderNationality}
        />

        {/* Year in Business — always derived, never editable */}
        <CompanyField
          label={t("fields.yearInBusiness")}
          value={`${yearInBusiness} ${t("values.yearInBusinessUnit")}`}
          isReadOnly
        />

        <CompanyField
          label={t("fields.registrationDate")}
          value={company.registrationDate}
          isDate={!isEditing}
          isReadOnly={isEditing}
          editMode={isEditing}
          registration={register("registrationDate")}
          error={errors.registrationDate}
        />

        <CompanyField
          label={t("fields.businessAddress")}
          value={company.businessAddress}
          editMode={isEditing}
          inputType="textarea"
          registration={register("businessAddress")}
          error={errors.businessAddress}
        />

        <CompanyField
          label={t("fields.telephone")}
          value={company.telephone}
          editMode={isEditing}
          registration={register("telephone")}
          error={errors.telephone}
        />
      </dl>
    </div>
  );
}
