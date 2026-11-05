import { NextRequest, NextResponse } from "next/server";

const recentSubmissions = new Map<string, number>();

interface EnquiryPayload {
  name?: string;
  phone?: string;
  countryCode?: string;
  email?: string;
  message?: string;
  context?: string;
  preferredContact?: string;
  marketingConsent?: boolean;
  viewingDate?: string;
  viewingTimeGst?: string;
  viewingMode?: string;
  propertyRef?: string;
  propertyTitle?: string;
  community?: string;
  developer?: string;
  agentSlug?: string;
  pageUrl?: string;
  language?: string;
  attribution?: Record<string, string>;
  qualification?: {
    budgetRange?: string;
    timeline?: string;
    financing?: string;
    residency?: string;
  };
  // Honeypot field
  companyWebsite?: string;
}

function assignLeadOwner(payload: EnquiryPayload) {
  if (payload.agentSlug === "issaadi-chahrazed" || payload.language === "fr") {
    return {
      primaryAgent: "Issaadi Chahrazed",
      primaryRole: "Senior Sales Consultant (BRN 61049)",
      backupAgent: "Mohammad Haseeb (Founder & CEO)",
      routingReason: "Assigned to Senior Off-Plan & Waterfront Specialist",
    };
  }
  if (payload.agentSlug === "fareed-chahrazed" || payload.context === "renting-out" || payload.community?.toLowerCase().includes("marina")) {
    return {
      primaryAgent: "Fareed Choudhary",
      primaryRole: "Leasing & Coastal Specialist (BRN 64105)",
      backupAgent: "Talha Shabbir (Property Consultant)",
      routingReason: "Assigned to Leasing & Dubai Marina Desk",
    };
  }
  if (payload.agentSlug === "talha-shabbir" || payload.community?.toLowerCase().includes("hills") || payload.community?.toLowerCase().includes("jvc")) {
    return {
      primaryAgent: "Talha Shabbir",
      primaryRole: "Villa & Townhouse Consultant (BRN 62918)",
      backupAgent: "Issaadi Chahrazed (Senior Sales Consultant)",
      routingReason: "Assigned to Green Communities & Townhouse Desk",
    };
  }
  return {
    primaryAgent: "Mohammad Haseeb",
    primaryRole: "Founder & CEO · Principal Advisory (BRN 58412)",
    backupAgent: "Issaadi Chahrazed (Senior Sales Consultant)",
    routingReason: "Assigned to SWK Principal Advisory Desk",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EnquiryPayload;

    // 1. Honeypot check (§17)
    if (body.companyWebsite && body.companyWebsite.trim().length > 0) {
      return NextResponse.json(
        { ok: true, enquiryId: "SWK-FILTERED", status: "accepted" },
        { status: 200 }
      );
    }

    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim();

    if (name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }
    if (phone.replace(/[^\d+]/g, "").length < 7) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid international phone or WhatsApp number." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 2. Duplicate submission protection within 45s window (§17)
    const dedupeKey = `${email.toLowerCase()}|${phone.replace(/\D/g, "")}|${body.context || "general"}`;
    const now = Date.now();
    const lastTime = recentSubmissions.get(dedupeKey);
    if (lastTime && now - lastTime < 45_000 && !body.qualification) {
      return NextResponse.json(
        {
          ok: true,
          duplicate: true,
          enquiryId: `SWK-ENQ-${String(lastTime).slice(-6)}`,
          message: "Your enquiry has already been logged. Our specialist is reviewing it now.",
        },
        { status: 200 }
      );
    }
    recentSubmissions.set(dedupeKey, now);

    // 3. Lead Routing & Assignment (§28)
    const routing = assignLeadOwner(body);
    const enquiryId = `SWK-ENQ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const submittedAtGst = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Dubai",
    }).format(new Date());

    // 4. Structured CRM & Audit Log Record (§18, §25, §26)
    const leadRecord = {
      enquiryId,
      submittedAtIso: new Date().toISOString(),
      submittedAtGst: `${submittedAtGst} GST (Asia/Dubai)`,
      status: body.qualification ? "Qualified" : "New",
      context: body.context || "general",
      contact: {
        name,
        phone: `${body.countryCode || "+971"} ${phone}`,
        email,
        preferredContact: body.preferredContact || "WhatsApp",
      },
      propertyContext: {
        propertyRef: body.propertyRef || "N/A",
        propertyTitle: body.propertyTitle || "General Advisory",
        community: body.community || "Dubai",
        developer: body.developer || "All",
      },
      viewingSlot: body.viewingDate
        ? {
            date: body.viewingDate,
            timeGst: body.viewingTimeGst || "11:00 GST",
            mode: body.viewingMode || "In-Person Viewing (Dubai)",
          }
        : null,
      qualification: body.qualification || null,
      consent: {
        enquiryProcessing: true,
        marketingOptIn: Boolean(body.marketingConsent),
        privacyPolicyVersion: "UAE-PDPL-2026.11",
      },
      attribution: body.attribution || {},
      pageUrl: body.pageUrl || "",
      language: body.language || "en",
      routing,
    };

    return NextResponse.json(
      {
        ok: true,
        enquiryId,
        submittedAtGst: leadRecord.submittedAtGst,
        routing,
        leadRecord,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "We could not process your request right now. Please message us on WhatsApp at +971 56 433 0448.",
      },
      { status: 500 }
    );
  }
}
