import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CompanyProfile } from "@/lib/types/company";
import type { CompanyProfileEditRequest } from "@/lib/schemas/company";

export const companyKeys = {
  all: ["companies"] as const,
  detail: (registeredNo: string) => ["companies", registeredNo] as const,
};

async function fetchCompany(registeredNo: string): Promise<CompanyProfile> {
  const res = await fetch(`/api/companies/${registeredNo}`, {
    cache: "no-store",
  });

  if (res.status === 404) throw new Error("not_found");
  if (!res.ok) throw new Error("load_failed");

  return res.json();
}

async function updateCompany(
  registeredNo: string,
  data: CompanyProfileEditRequest
): Promise<CompanyProfile> {
  const res = await fetch(`/api/companies/${registeredNo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("save_failed");
  return res.json();
}

export function useCompany(registeredNo: string) {
  return useQuery({
    queryKey: companyKeys.detail(registeredNo),
    queryFn: () => fetchCompany(registeredNo),
    staleTime: 0,
    retry: false,
  });
}

export function useUpdateCompany(registeredNo: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyProfileEditRequest) =>
      updateCompany(registeredNo, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(companyKeys.detail(registeredNo), updated);
    },
  });
}
