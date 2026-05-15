"use client";

import { useTranslations } from "next-intl";
import { formatRegistrationDate } from "@/lib/utils/date";
import { useLocale } from "next-intl";
import type { FieldError } from "react-hook-form";

interface CompanyFieldProps {
  label: string;
  value: string | number | null | undefined;
  fieldName?: string;
  isDate?: boolean;
  isReadOnly?: boolean;

  // Edit mode props
  editMode?: boolean;
  inputType?: "text" | "textarea" | "select";
  selectOptions?: { value: string; label: string }[];
  registration?: object;
  error?: FieldError;
}

export function CompanyField({
  label,
  value,
  isDate = false,
  isReadOnly = false,
  editMode = false,
  inputType = "text",
  selectOptions,
  registration,
  error,
}: CompanyFieldProps) {
  const t = useTranslations("companyProfile");
  const locale = useLocale();

  function displayValue(): string {
    if (value === null || value === undefined || value === "") {
      return t("values.notAvailable");
    }
    if (isDate && typeof value === "string") {
      return formatRegistrationDate(value, locale);
    }
    return String(value);
  }

  if (editMode && !isReadOnly) {
    return (
      <div className="contents">
        <dt className="text-sm font-medium text-gray-500 py-3 px-4">{label}</dt>
        <dd className="py-2 px-4">
          {inputType === "textarea" ? (
            <textarea
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
              {...(registration as object)}
            />
          ) : inputType === "select" ? (
            <select
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              {...(registration as object)}
            >
              {selectOptions?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              {...(registration as object)}
            />
          )}
          {error && (
            <p className="mt-1 text-xs text-red-600">
              {error.message === "required"
                ? t("validation.required")
                : error.message}
            </p>
          )}
        </dd>
      </div>
    );
  }

  return (
    <div className="contents">
      <dt className="text-sm font-medium text-gray-500 py-3 px-4">{label}</dt>
      <dd className={`py-3 px-4 text-sm ${value === null || value === undefined || value === "" ? "text-gray-400 italic" : "text-gray-900"}`}>
        {isDate && typeof value === "string" && value
          ? formatRegistrationDate(value, locale)
          : displayValue()}
      </dd>
    </div>
  );
}
