"use client";

import { useTranslations } from "next-intl";

interface EditToolbarProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditToolbar({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
}: EditToolbarProps) {
  const t = useTranslations("companyProfile.actions");

  if (isEditing) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          aria-label={t("cancel")}
        >
          {t("cancel")}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          aria-label={t("save")}
        >
          {isSaving ? "..." : t("save")}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      aria-label={t("edit")}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      {t("edit")}
    </button>
  );
}
