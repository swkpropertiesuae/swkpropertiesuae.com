export interface GuideSection {
  id: string;
  heading: string;
  summary: string;
  body: string;
  bullets: string[];
  callout?: string;
}

export interface GuideTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface RealEstateGuide {
  slug: "buying" | "renting" | "selling" | "investing";
  badge: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  directAnswer: string;
  lastUpdated: string;
  updatedAt: string;
  reviewedBy: string;
  readTime: string;
  keyTakeaways: string[];
  sections: GuideSection[];
  comparisonTable: GuideTable;
  faqs: { q: string; a: string }[];
}

type RawGuide = Omit<RealEstateGuide, "eyebrow" | "updatedAt" | "keyTakeaways" | "sections"> & {
  sections: Omit<GuideSection, "body">[];
};

const RAW_GUIDES: Record<RealEstateGuide["slug"], RawGuide> = {
  buying: {
    slug: "buying",
    badge: "SWK Buyer's Handbook · Dubai & UAE",
    title: "Complete Guide to Buying Property in Dubai (Ready & Off-Plan)",
    subtitle: "Step-by-step RERA & Dubai Land Department (DLD) process, upfront acquisition costs, Form F / SPA rules, and mortgage vs cash timelines.",
    directAnswer:
      "Both UAE residents and non-resident foreign nationals can purchase 100% freehold property in designated Dubai zones. On top of the agreed purchase price, buyers should budget approximately 6% to 7.5% in upfront transaction costs—primarily the 4% Dubai Land Department (DLD) transfer/Oqood fee, DLD Trustee fee (AED 2,100–4,200), Title Deed issuance (AED 580), and 2% brokerage commission (+5% VAT) on secondary resales.",
    lastUpdated: "2026-11-01",
    reviewedBy: "Mohammad Haseeb · Founder & CEO (RERA ORN 51517)",
    readTime: "7 min read",
    sections: [
      {
        id: "mandate-and-budget",
        heading: "1. Define Objective, Freehold Zone & Total Cost Envelope",
        summary:
          "Decide whether you are acquiring for personal occupation, long-term rental yield, or milestone capital appreciation, and confirm whether you are purchasing in cash or with UAE mortgage finance.",
        bullets: [
          "Non-residents can purchase freehold properties in designated zones including Downtown Dubai, Dubai Marina, Palm Jumeirah, Business Bay, Dubai Hills Estate, JVC, and Dubai Creek Harbour.",
          "Mortgage buyers must obtain bank pre-approval before signing RERA Form F (MOU) to avoid forfeiting the 10% security deposit cheque.",
          "Factor annual RERA Mollak service charges (typically AED 4–7/sq ft for villas/townhouses and AED 14–32/sq ft for apartments) into your holding budget.",
        ],
        callout: "Always request the official DLD Title Deed or Oqood certificate and Trakheesi listing permit before placing any deposit.",
      },
      {
        id: "off-plan-vs-secondary",
        heading: "2. Choosing Between Off-Plan and Ready Secondary Market",
        summary:
          "Off-plan purchases are booked directly with the developer via a Sales & Purchase Agreement (SPA) and a DLD RERA Escrow Account, whereas ready secondary purchases use RERA Form F (Contract F) via the Dubai REST app.",
        bullets: [
          "Off-plan: Typically 10%–20% down payment + 4% DLD Oqood registration fee, followed by construction-linked or milestone payments into a project-specific RERA escrow bank account.",
          "Ready Secondary: Buyer and seller sign RERA Form F electronically; buyer lodges a 10% security deposit cheque held by the brokerage trust/trustee until transfer.",
          "Developer NOC: For ready properties, the seller applies for a Developer No Objection Certificate (AED 500–5,000) confirming all service charges are settled.",
        ],
      },
      {
        id: "dld-trustee-transfer",
        heading: "3. Valuation, NOC & DLD Registration Trustee Transfer",
        summary:
          "Once the Developer NOC is issued (and bank final offer letter is signed if financed), buyer, seller, and licensed RERA broker meet at an authorised DLD Registration Trustee office.",
        bullets: [
          "Settlement is executed via UAE Central Bank Manager's Cheques (or DLD e-Payment / escrow settlement).",
          "The new Title Deed (for ready homes) or Oqood registration (for off-plan) is issued digitally on the same day with a verifiable QR code.",
          "Properties valued at AED 2,000,000 or above qualify the title holder to apply for the 10-year UAE Golden Visa subject to DLD and ICP rules.",
        ],
      },
    ],
    comparisonTable: {
      caption: "Typical Upfront Buyer Costs in Dubai (Indicative)",
      headers: ["Fee Item", "Ready Secondary Purchase", "Off-Plan Developer Purchase", "Paid To"],
      rows: [
        ["DLD Transfer / Oqood Fee", "4% of purchase price + AED 580 admin", "4% of purchase price + AED 1,000–5,000 Oqood admin", "Dubai Land Department (DLD)"],
        ["DLD Registration Trustee Fee", "AED 4,200 (incl. VAT) if price ≥ AED 500,000", "Not applicable on direct developer SPA", "DLD Trustee Office"],
        ["Agency Brokerage Fee", "Typically 2% of purchase price + 5% VAT", "0% buyer commission on most primary launches", "RERA Licensed Brokerage"],
        ["Mortgage Registration (if financed)", "0.25% of loan amount + AED 290", "0.25% of loan amount + AED 290 (if mortgaged)", "Dubai Land Department"],
        ["Bank Valuation & Arrangement", "AED 2,500–3,500 valuation + 0%–1% bank fee", "N/A during construction payment plan", "Lending Bank"],
      ],
    },
    faqs: [
      {
        q: "Can a non-resident buy property in Dubai remotely?",
        a: "Yes. Both off-plan SPAs and secondary market transfers can be completed remotely using digital verification via the Dubai REST app or a notarised Power of Attorney (POA) attested for use in the UAE.",
      },
      {
        q: "How do I verify that a Dubai property listing is genuine?",
        a: "Check the listing's DLD Trakheesi Permit Number and scan the Madmoun QR code or verify the brokerage's RERA ORN (SWK Properties ORN: 51517) on dubailand.gov.ae.",
      },
    ],
  },
  renting: {
    slug: "renting",
    badge: "SWK Tenant & Leasing Guide · Dubai",
    title: "Complete Guide to Renting Property in Dubai (Ejari, Cheques & Tenant Rights)",
    subtitle: "How residential and executive leases work in Dubai—from RERA Unified Tenancy Contracts and Ejari to DEWA, chiller, and the RERA Rental Index.",
    directAnswer:
      "Residential leases in Dubai are governed by RERA and must be registered in the official Ejari system. Tenants typically pay annual rent in 1 to 4 post-dated cheques, provide a refundable security deposit (5% unfurnished or 10% furnished), pay a 5% agency commission (+5% VAT), and activate DEWA utilities (AED 2,000 refundable deposit for apartments or AED 4,000 for villas).",
    lastUpdated: "2026-11-01",
    reviewedBy: "Fareed Choudhary · Leasing Specialist (RERA ORN 51517)",
    readTime: "6 min read",
    sections: [
      {
        id: "documents-and-cheques",
        heading: "1. Required Documents & Rental Payment Structure",
        summary:
          "To sign an annual residential lease and register Ejari, tenants need valid UAE residency documentation and a UAE bank chequebook (or approved corporate/manager's transfer).",
        bullets: [
          "Documents required: Passport copy, UAE Residence Visa, Emirates ID, and landlord's Title Deed + passport copy.",
          "Rent payment: Negotiated between 1 cheque (often commands the strongest rental rate) and 2, 4, or 6 cheques.",
          "Security deposit: 5% of annual rent for unfurnished properties or 10% for furnished properties, held by the landlord and refundable at checkout.",
        ],
      },
      {
        id: "ejari-dewa-chiller",
        heading: "2. Ejari Registration, DEWA, Chiller & Move-In Permit",
        summary:
          "Once the RERA Unified Tenancy Contract is signed by both parties, Ejari registration automatically triggers your DEWA water and electricity account.",
        bullets: [
          "Ejari registration: Completed online via Dubai REST (~AED 175) or at an Ejari typing centre (~AED 220).",
          "DEWA security deposit: AED 2,000 for apartments or AED 4,000 for villas (refundable upon move-out) plus AED 130 activation fee.",
          "District cooling (Chiller): Confirm before signing whether the building is 'Chiller-Free' (covered by landlord's service charges) or billed separately via Empower/Emicool/Tabreed.",
          "Dubai Municipality Housing Fee: 5% of annual rent, billed automatically in 12 monthly instalments on your DEWA bill.",
        ],
      },
      {
        id: "renewals-and-rera-index",
        heading: "3. Lease Renewals, 90-Day Notice & RERA Smart Rental Index",
        summary:
          "Dubai tenancy law protects both tenants and landlords with clear notice rules and regulated renewal caps.",
        bullets: [
          "Any change to rent or contract terms at renewal requires at least 90 days' written notice prior to lease expiry.",
          "Permissible rent increases at renewal are benchmarked strictly against the official DLD / RERA Smart Rental Index.",
          "Maintenance responsibility: Typically, minor wear-and-tear under AED 500–1,000 is borne by the tenant, while major MEP/structural repairs are borne by the landlord (check the addendum).",
        ],
      },
    ],
    comparisonTable: {
      caption: "Upfront Costs When Renting a Property in Dubai",
      headers: ["Item", "Apartment", "Villa / Townhouse", "Refundable?"],
      rows: [
        ["Security Deposit (Unfurnished / Furnished)", "5% / 10% of annual rent", "5% / 10% of annual rent", "Yes (at end of tenancy)"],
        ["Ejari Registration", "AED 175–220", "AED 175–220", "No"],
        ["DEWA Security Deposit + Activation", "AED 2,000 + AED 130", "AED 4,000 + AED 130", "Deposit refundable"],
        ["District Cooling Deposit (if not chiller-free)", "AED 1,000–2,000", "Usually DEWA AC", "Deposit refundable"],
        ["Brokerage Agency Fee", "5% of annual rent + 5% VAT (min AED 5,000)", "5% of annual rent + 5% VAT", "No"],
      ],
    },
    faqs: [
      {
        q: "Can I rent a long-term apartment in Dubai before my Emirates ID is issued?",
        a: "An Emirates ID (or official Emirates ID application receipt alongside residency processing) is required to register Ejari. If your visa is still in progress, SWK can arrange DTCM-licensed monthly residences until your Emirates ID is ready.",
      },
    ],
  },
  selling: {
    slug: "selling",
    badge: "SWK Seller & Landlord Handbook · Dubai",
    title: "Complete Guide to Selling Your Dubai Property",
    subtitle: "Required seller documents, RERA Form A marketing permits, accurate DLD comparable pricing, NOC timelines, and transfer day settlement.",
    directAnswer:
      "To legally market and sell a property in Dubai, the registered owner must sign RERA Form A with a licensed brokerage (maximum 3 brokerages at any one time) via the Dubai REST app so a DLD Trakheesi marketing permit and Madmoun QR code can be issued. Sellers typically pay the Developer NOC fee (AED 500–5,000), mortgage early-settlement fee if financed (up to 1% capped at AED 10,000), and agreed agency fee.",
    lastUpdated: "2026-11-01",
    reviewedBy: "Issaadi Chahrazed · Senior Sales Consultant (RERA ORN 51517)",
    readTime: "6 min read",
    sections: [
      {
        id: "valuation-and-form-a",
        heading: "1. Data-Backed Valuation & Signing RERA Form A",
        summary:
          "Overpricing stalls listings in Dubai because portals display historical DLD transaction prices openly. We price properties using verified DLD transfers from the past 90 days.",
        bullets: [
          "Required seller documents: Title Deed (or Oqood for off-plan resale), valid Passport, Emirates ID (if resident), and latest service-charge statement.",
          "RERA Form A is generated digitally and approved by the owner via UAE Pass or Dubai REST OTP, generating the official Trakheesi permit and Madmoun QR code.",
          "Under DLD regulations, maximum 3 Form A permits can be active for the same unit simultaneously.",
        ],
      },
      {
        id: "tenanted-vs-vacant",
        heading: "2. Selling a Tenanted vs Vacant Property",
        summary:
          "Vacant-on-transfer homes appeal to both end-users and investors, while tenanted homes provide immediate day-one rental cash flow.",
        bullets: [
          "If selling to an end-user who requires vacant possession from an existing tenant, Dubai law requires a 12-month eviction notice served via Notary Public or registered post.",
          "If selling with an active tenant in place, the security deposit and pro-rata rent cheque are reconciled on the settlement statement at DLD transfer.",
        ],
      },
      {
        id: "noc-and-settlement",
        heading: "3. Form F, Liability Letter (if Mortgaged), Developer NOC & Transfer",
        summary:
          "A cash sale typically completes in 2 to 3 weeks; a sale involving a seller's mortgage clearance and/or buyer's mortgage typically takes 4 to 7 weeks.",
        bullets: [
          "If the property has an existing mortgage, the seller requests a Bank Liability Letter (~7–14 working days) and the buyer/buyer's bank settles the outstanding balance prior to NOC.",
          "Developer NOC is issued once service charges are paid up to the transfer date (excess service charges paid in advance are reimbursed pro-rata by the buyer).",
        ],
      },
    ],
    comparisonTable: {
      caption: "Seller Document & Cost Checklist in Dubai",
      headers: ["Stage", "Requirement / Fee", "Typical Timeline", "Notes"],
      rows: [
        ["Marketing Mandate", "Title Deed, Passport, Emirates ID + RERA Form A", "Same day", "Generates Trakheesi Permit & Madmoun QR"],
        ["Sale Agreement", "Signed RERA Form F (MOU) + Buyer's 10% Deposit Cheque", "Day 1 of offer acceptance", "Held in escrow/trustee until transfer"],
        ["Mortgage Clearance (if applicable)", "Bank Liability Letter + DLD Mortgage Release (AED 1,290–1,560)", "7–14 working days", "Early settlement fee capped at 1% (max AED 10,000)"],
        ["Developer NOC", "AED 500 to AED 5,000 (+ VAT)", "3–7 working days", "Confirms zero outstanding service charges"],
        ["DLD Trustee Transfer", "Manager's Cheque proceeds & Title Deed transfer", "45–60 minutes on transfer day", "Immediate funds release to seller"],
      ],
    },
    faqs: [
      {
        q: "Can I sell an off-plan property before handover in Dubai?",
        a: "Yes, once you have paid the developer's minimum resale threshold (typically 30% to 40% of the SPA price depending on the developer) and obtained the developer's NOC.",
      },
    ],
  },
  investing: {
    slug: "investing",
    badge: "SWK Investor Briefing · Gross vs Net Yield & Golden Visa",
    title: "Dubai Real Estate Investment Guide (Net Yields, Payment Plans & Risk Controls)",
    subtitle: "An analytical framework for evaluating gross vs net rental yields, off-plan payment schedules, currency peg stability, and UAE Golden Visa qualification.",
    directAnswer:
      "Dubai residential real estate offers 0% annual property tax and 0% personal rental income tax in the UAE, with the UAE Dirham pegged to the US Dollar at 3.6725 AED/USD since 1997. However, disciplined investors always calculate Net Yield rather than Gross Yield—deducting annual RERA Mollak service charges, maintenance reserves, leasing fees, and vacancy buffers—and verify developer escrow compliance before committing capital.",
    lastUpdated: "2026-11-01",
    reviewedBy: "Mohammad Haseeb · Founder & CEO (RERA ORN 51517)",
    readTime: "8 min read",
    sections: [
      {
        id: "gross-vs-net-yield",
        heading: "1. Calculating True Net Yield (Not Headline Gross Yield)",
        summary:
          "Headline gross yield is Annual Rent ÷ Purchase Price. True net yield deducts all upfront acquisition costs (DLD 4% + fees) and annual operating expenses.",
        bullets: [
          "Formula: Net Yield (%) = (Annual Gross Rent − Annual Service Charges − Maintenance/Management Reserve) ÷ (Purchase Price + DLD & Acquisition Costs) × 100.",
          "Mid-market communities (such as JVC and Business Bay studios/1BRs) often produce higher percentage net yields, whereas prime waterfront and villa communities (Palm Jumeirah, Downtown Dubai, Dubai Hills Estate) historically exhibit stronger capital liquidity and lower tenant turnover.",
          "Never rely on 'guaranteed return' marketing without inspecting who underwrites the guarantee and whether the purchase price was inflated to fund it.",
        ],
      },
      {
        id: "off-plan-due-diligence",
        heading: "2. Off-Plan Investment Due Diligence & Escrow Rules",
        summary:
          "Dubai Law No. 8 of 2007 mandates that every off-plan project have a dedicated DLD project escrow account where buyer instalments are released only against certified construction milestones.",
        bullets: [
          "Verify the project number and escrow account bank on the Dubai Land Department (dubailand.gov.ae) or Dubai REST app before transferring funds.",
          "Assess the developer's historical handover record across previous cycles, not just their brochure renders.",
          "Check the minimum payment threshold required by the developer if you plan to exit (assign/resell) before completion.",
        ],
      },
      {
        id: "golden-visa-and-currency",
        heading: "3. 10-Year UAE Golden Visa & Overseas Investor Structuring",
        summary:
          "Property investors acquiring AED 2,000,000 or more in Dubai real estate (ready or eligible off-plan) can apply for the renewable 10-year UAE residency visa.",
        bullets: [
          "Multiple properties in the investor's name can be combined to reach the AED 2,000,000 threshold.",
          "Mortgaged properties are eligible subject to the current DLD / ICP equity and bank NOC rules.",
          "Because the UAE Dirham (AED) is pegged to the USD at 3.6725, USD-linked investors face zero FX volatility between AED and USD.",
        ],
      },
    ],
    comparisonTable: {
      caption: "Dubai Investment Strategy Comparison Matrix",
      headers: ["Strategy", "Typical Entry Capital", "Primary Return Driver", "Key Risk to Manage"],
      rows: [
        ["Ready High-Yield Apartment (JVC / Business Bay / Marina)", "AED 950,000 – AED 2.5M", "Immediate annual rental cash flow", "Service charge per sq ft & tenant screening"],
        ["Prime Family Villa / Townhouse (Dubai Hills / Palm)", "AED 4.5M – AED 40M+", "Capital preservation & long-stay family tenants", "Higher ticket size & lower percentage yield"],
        ["Tier-1 Developer Off-Plan Launch (Emaar / Sobha / Aldar / Nakheel)", "10%–20% booking + milestone plan", "Staged capital deployment & handover appreciation", "Construction timeline & supply in surrounding sub-community"],
      ],
    },
    faqs: [
      {
        q: "Are rental income or capital gains taxed in Dubai?",
        a: "For individual private property owners in the UAE, there is currently no personal income tax on residential rental income and no capital gains tax on property resales. Overseas investors should always consult a tax advisor in their country of tax residence regarding foreign-source income rules.",
      },
    ],
  },
};

const GUIDE_LIST: RealEstateGuide[] = Object.values(RAW_GUIDES).map((g) => ({
  ...g,
  eyebrow: g.badge,
  updatedAt: g.lastUpdated,
  keyTakeaways: g.sections.map((s) => `${s.heading}: ${s.summary}`),
  sections: g.sections.map((s) => ({
    ...s,
    body: s.summary,
  })),
}));

const GUIDE_RECORD = Object.fromEntries(GUIDE_LIST.map((g) => [g.slug, g])) as Record<
  RealEstateGuide["slug"],
  RealEstateGuide
>;

export const GUIDES: RealEstateGuide[] & Record<RealEstateGuide["slug"], RealEstateGuide> =
  Object.assign([...GUIDE_LIST], GUIDE_RECORD);

export function getGuide(slug: string): RealEstateGuide | undefined {
  return GUIDE_LIST.find((g) => g.slug === slug);
}
