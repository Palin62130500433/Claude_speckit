import { NextRequest, NextResponse } from "next/server";
import {
  CompanyProfileSchema,
  CompanyProfileEditRequestSchema,
} from "@/lib/schemas/company";
import { getMockCompany, updateMockCompany } from "@/lib/mock/companies";

const EXTERNAL_API_BASE = process.env.COMPANY_API_BASE_URL ?? "";
const IS_MOCK = !EXTERNAL_API_BASE;

function getAuthToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  return auth?.startsWith("Bearer ") ? auth.slice(7) : null;
}

async function getSessionRole(token: string): Promise<string> {
  // Replace with real session/auth lookup in production.
  void token;
  return "standard";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ registeredNo: string }> }
) {
  const { registeredNo } = await params;

  // ── Development mock ──────────────────────────────────────────────────────
  if (IS_MOCK) {
    const company = getMockCompany(registeredNo);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(company);
  }

  // ── Production: proxy to external API ────────────────────────────────────
  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE}/companies/${registeredNo}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );

    if (response.status === 404) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    if (!response.ok) {
      return NextResponse.json(
        { error: "Data source unavailable" },
        { status: 503 }
      );
    }

    const parsed = CompanyProfileSchema.safeParse(await response.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data source unavailable" },
        { status: 503 }
      );
    }
    return NextResponse.json(parsed.data);
  } catch {
    return NextResponse.json(
      { error: "Data source unavailable" },
      { status: 503 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ registeredNo: string }> }
) {
  const { registeredNo } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = CompanyProfileEditRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fields[issue.path.join(".")] = issue.message;
    }
    return NextResponse.json({ error: "Validation failed", fields }, { status: 400 });
  }

  // ── Development mock ──────────────────────────────────────────────────────
  if (IS_MOCK) {
    const updated = updateMockCompany(registeredNo, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  }

  // ── Production: proxy to external API ────────────────────────────────────
  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getSessionRole(token);
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const response = await fetch(
      `${EXTERNAL_API_BASE}/companies/${registeredNo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data),
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    if (!response.ok) {
      return NextResponse.json(
        { error: "Data source unavailable" },
        { status: 503 }
      );
    }
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(
      { error: "Data source unavailable" },
      { status: 503 }
    );
  }
}
