import { useTranslations } from "next-intl";
import type { CompanyStatus } from "@/lib/types/company";

const statusColors: Record<CompanyStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  DISSOLVED: "bg-gray-100 text-gray-700",
  STRUCK_OFF: "bg-red-100 text-red-700",
  SUSPENDED: "bg-yellow-100 text-yellow-800",
  UNKNOWN: "bg-gray-100 text-gray-500",
};

const dotColors: Record<CompanyStatus, string> = {
  ACTIVE: "bg-green-500",
  DISSOLVED: "bg-gray-400",
  STRUCK_OFF: "bg-red-500",
  SUSPENDED: "bg-yellow-500",
  UNKNOWN: "bg-gray-400",
};

interface StatusBadgeProps {
  status: CompanyStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("companyProfile.status");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`}
        aria-hidden="true"
      />
      {t(status)}
    </span>
  );
}
