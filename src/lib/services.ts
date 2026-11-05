export type ServiceFaq = { question: string; answer: string; q: string; a: string }

export type ServiceStep = { step: string; text: string; title: string; body: string }

export type ServicePage = {
  slug: string
  title: string
  shortTitle: string
  short: string
  tagline: string
  eyebrow: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  image: string
  heroImage: string
  intro: string
  description: string
  scope: string[]
  whatIsIncluded: string[]
  process: { step: string; text: string }[]
  steps: ServiceStep[]
  fees: string
  feeTransparency: string
  whoFor: string[]
  whoItIsFor: string[]
  faqs: ServiceFaq[]
  ctaLabel: string
  related: string[]
}

type RawServicePage = Omit<
  ServicePage,
  | "shortTitle"
  | "tagline"
  | "heroImage"
  | "description"
  | "whatIsIncluded"
  | "steps"
  | "feeTransparency"
  | "whoItIsFor"
  | "faqs"
  | "ctaLabel"
> & {
  faqs: { question: string; answer: string }[]
}

const rawServicePages: RawServicePage[] = [
  {
    slug: "off-plan-advisory",
    title: "Off-plan advisory",
    short: "Early access to new launches, with the developer, payment plan and handover risk explained.",
    eyebrow: "Off-plan",
    metaTitle: "Off-Plan Property Advisory in Dubai & UAE | SWK Properties",
    metaDescription:
      "Independent off-plan advice in Dubai: compare new launches, payment plans and handover timelines, check escrow and Oqood registration, and reserve with confidence. RERA ORN 51517.",
    keywords: ["off plan properties Dubai", "new launches Dubai", "off plan payment plan Dubai", "Oqood registration", "escrow account off plan"],
    image: "/img/gallery/image9.webp",
    intro:
      "Off-plan means buying a home before it is finished, usually in stages tied to construction. It can put you into a community early on a structured payment plan, but it also means you carry delivery risk. We help you read a launch the way a lender would: who is building it, what has been delivered before, where your money sits, and what happens if dates slip.",
    scope: [
      "Launch briefings across Emaar, DAMAC, Sobha, Nakheel, Binghatti, Omniyat, Aldar, Arada and other UAE developers",
      "Side-by-side comparison of payment plans, booking amounts and post-handover options",
      "Developer track-record review using handed-over communities, not brochures",
      "Escrow, Oqood and Sales & Purchase Agreement walk-through",
      "Unit selection support: floor, view, orientation and layout",
      "Resale and exit-route discussion before you commit",
    ],
    process: [
      { step: "Brief", text: "We agree budget, goal (living, rental or growth), timeline and the communities you are open to." },
      { step: "Shortlist", text: "You get two to four launches compared on the same sheet: location, developer record, payment plan and handover." },
      { step: "Visit", text: "We arrange sales gallery and site visits, and a visit to a completed community by the same developer where possible." },
      { step: "Reserve", text: "We review the booking form and SPA with you, confirm the project is registered, and explain every payment milestone." },
      { step: "Track", text: "We follow construction updates and prepare you for handover, snagging and registration." },
    ],
    fees:
      "Off-plan commission is normally paid by the developer, not added to your price. SWK confirms in writing before any reservation whether and how it is paid.",
    whoFor: [
      "First-time buyers who want a lower entry price and staged payments",
      "Investors comparing yield and capital growth across launches",
      "Overseas buyers who need remote, paperwork-led support",
    ],
    faqs: [
      {
        question: "Is off-plan property in Dubai safe?",
        answer:
          "Dubai regulates off-plan sales through RERA project registration and escrow accounts that hold buyer payments. That reduces risk but does not remove it. We still check the developer's delivered projects and confirm the project is registered before you pay.",
      },
      {
        question: "What is Oqood?",
        answer:
          "Oqood is the Dubai Land Department's registration of an off-plan sale. It records your interest in the unit until the Title Deed is issued at handover.",
      },
      {
        question: "Can I resell before handover?",
        answer:
          "Often yes, once a minimum percentage of the price has been paid and the developer issues a no-objection certificate, but rules differ by developer. We check the resale terms in the SPA before you reserve.",
      },
    ],
    related: ["investment-advisory", "mortgage-assistance", "legal-documentation"],
  },
  {
    slug: "secondary-market",
    title: "Buying & selling ready property",
    short: "Resale apartments, villas and townhouses: valuation, viewings, negotiation and DLD transfer.",
    eyebrow: "Secondary market",
    metaTitle: "Buy & Sell Ready Property in Dubai | Secondary Market | SWK Properties",
    metaDescription:
      "Buy or sell apartments, villas and townhouses on Dubai's secondary market. Honest valuation, viewings, negotiation, Form F and DLD transfer handled by RERA-registered SWK Properties.",
    keywords: ["secondary market property Dubai", "buy apartment in Dubai", "sell my property Dubai", "ready properties Dubai", "DLD transfer"],
    image: "/img/gallery/image8.webp",
    intro:
      "Ready property means you can see what you are buying, check the building, and often move or rent within weeks. Whether you are buying or selling, our job is to price realistically, negotiate on evidence, and keep the transfer moving through the Dubai Land Department without surprises.",
    scope: [
      "Market valuation based on comparable recent transactions, not wishful asking prices",
      "Shortlisting with service charges, building condition and rental outlook beside the price",
      "Viewings, offer, negotiation and Memorandum of Understanding (Form F)",
      "Mortgage coordination, NOC from the developer and DLD transfer appointment",
      "For sellers: photography, listing preparation, viewings and buyer qualification",
      "Handover of utilities, DEWA and Ejari where the unit is being leased",
    ],
    process: [
      { step: "Brief or valuation", text: "Buyers share requirements; sellers receive a written valuation with comparables." },
      { step: "Market", text: "Buyers see a short list; sellers go to market with an agreed price and presentation plan." },
      { step: "Offer", text: "We negotiate and sign the MOU (Form F) with a security deposit held as required." },
      { step: "Clear", text: "Developer NOC, mortgage release or liability letters, and final cost statement." },
      { step: "Transfer", text: "Attend the Dubai Land Department registration, receive the Title Deed, and complete utility changes." },
    ],
    fees:
      "On resale transactions buyers pay a 4% Dubai Land Department transfer fee plus an AED 4,200 administrative fee, and a 2% agency commission. SWK states its own commission in writing before you sign anything.",
    whoFor: [
      "Buyers who want to see the finished home and move quickly",
      "Owners who want an honest price and a clean sale",
      "Investors buying tenanted units for immediate income",
    ],
    faqs: [
      {
        question: "What are the total costs of buying a ready property in Dubai?",
        answer:
          "Besides the purchase price, expect the 4% DLD transfer fee, a AED 4,200 DLD admin fee, a 2% agency commission, and, if you take a mortgage, bank arrangement and valuation fees.",
      },
      {
        question: "How long does a resale take?",
        answer:
          "A cash purchase can transfer in around two to four weeks once documents are ready. A mortgage purchase takes longer because of valuation and bank approvals.",
      },
      {
        question: "Can foreigners buy ready property in Dubai?",
        answer:
          "Yes, in designated freehold areas such as Downtown Dubai, Dubai Marina, Palm Jumeirah, Business Bay and Dubai Hills Estate. Ownership is full freehold.",
      },
    ],
    related: ["mortgage-assistance", "legal-documentation", "property-management"],
  },
  {
    slug: "leasing-rental",
    title: "Leasing & rental",
    short: "Find a home to rent, or let yours to the right tenant, with Ejari and move-in handled.",
    eyebrow: "Leasing",
    metaTitle: "Apartments & Villas for Rent in Dubai | Leasing Services | SWK Properties",
    metaDescription:
      "Rent a home in Dubai or let out your property. SWK handles viewings, tenant screening, tenancy contracts, Ejari registration and renewals for yearly rentals across Dubai.",
    keywords: ["apartments for rent in Dubai", "villas for rent in Dubai", "Ejari registration", "rent out property Dubai", "Dubai yearly rental"],
    image: "/img/gallery/image3.webp",
    intro:
      "Most Dubai tenancies are yearly and registered through Ejari. For tenants we match you to buildings by commute, budget and lifestyle. For landlords we find a reliable tenant, set a sensible rent, and make sure the paperwork is right from day one.",
    scope: [
      "Tenant search by community, budget, commute, school and pet policy",
      "Viewings, offer, tenancy contract and Ejari registration",
      "Landlord rent pricing based on current comparable listings",
      "Tenant screening and cheque or payment-schedule arrangements",
      "Move-in inspection report and utility connection support",
      "Renewal, rent-increase checks and notice handling",
    ],
    process: [
      { step: "Requirements", text: "Budget, move date, area, bedrooms and any must-haves." },
      { step: "Viewings", text: "A tight list, viewed in one trip where possible." },
      { step: "Offer & contract", text: "Rent, payment terms and conditions agreed; tenancy contract drafted." },
      { step: "Ejari", text: "Contract registered with Ejari, which is required for DEWA and visas." },
      { step: "Move in", text: "Inspection report, keys and utility setup." },
    ],
    fees:
      "Leasing commission and any admin fees are stated in writing before viewings. We do not charge hidden fees to tenants or landlords.",
    whoFor: [
      "Newcomers relocating to Dubai",
      "Landlords who want a screened tenant and a registered contract",
      "Investors turning a new handover into rental income",
    ],
    faqs: [
      {
        question: "What is Ejari?",
        answer:
          "Ejari is Dubai's tenancy contract registration system. It is needed for DEWA utilities, many visa applications and to enforce your rights as tenant or landlord.",
      },
      {
        question: "How are rents usually paid in Dubai?",
        answer:
          "Yearly rent is often paid in one to four instalments, commonly by post-dated cheque or bank transfer. The schedule is negotiated and written into the contract.",
      },
      {
        question: "Can I rent out a property while it has a mortgage?",
        answer:
          "Usually yes, but your lender may require consent. We check before listing.",
      },
    ],
    related: ["property-management", "secondary-market", "legal-documentation"],
  },
  {
    slug: "investment-advisory",
    title: "Investment advisory",
    short: "Yield, growth and exit analysis, community by community, in plain numbers.",
    eyebrow: "Investment",
    metaTitle: "Dubai Property Investment Advisory | ROI & Yield | SWK Properties",
    metaDescription:
      "Data-led Dubai property investment advice: compare rental yield, capital growth, payment plans and exit options across communities. Golden Visa eligibility explained. RERA ORN 51517.",
    keywords: ["Dubai property investment", "Dubai rental yield", "best areas to invest in Dubai", "Golden Visa property Dubai", "high ROI property Dubai"],
    image: "/img/gallery/image10.webp",
    intro:
      "A good investment starts with a clear objective: monthly income, long-term growth or residency. We model each option on realistic rents, service charges and holding costs, and we tell you when a launch does not stack up.",
    scope: [
      "Community comparison on rental demand, supply pipeline and service charges",
      "Net yield calculation after charges, vacancy and management",
      "Payment-plan cash-flow modelling for off-plan purchases",
      "Golden Visa eligibility check against current property thresholds",
      "Portfolio planning across ready and off-plan, Dubai and wider UAE",
      "Exit strategy: resale timing, rental conversion and refinancing",
    ],
    process: [
      { step: "Objective", text: "Income, growth, residency or a mix, plus your holding period." },
      { step: "Model", text: "We build the numbers on conservative assumptions you can challenge." },
      { step: "Compare", text: "Options ranked by net return and risk, not by commission." },
      { step: "Execute", text: "Purchase, financing and legal paperwork handled through SWK partners." },
      { step: "Review", text: "Annual review: hold, rent, refinance or sell." },
    ],
    fees:
      "Initial investment consultations are free. Where a purchase goes ahead, fees follow the underlying service (off-plan, resale or leasing) and are agreed in writing first.",
    whoFor: [
      "Overseas investors building a UAE portfolio",
      "Residents moving from renting to owning",
      "Existing owners deciding whether to hold, sell or add",
    ],
    faqs: [
      {
        question: "What rental yield can I expect in Dubai?",
        answer:
          "Gross yields vary widely by community, unit type and entry price. We show you net yield after service charges and vacancy for each shortlisted option instead of quoting a single market figure.",
      },
      {
        question: "Does property qualify me for a UAE Golden Visa?",
        answer:
          "Property investment can support a long-term residency visa if it meets the current minimum value and ownership conditions. Rules change, so we confirm the latest criteria with you before you buy.",
      },
    ],
    related: ["off-plan-advisory", "mortgage-assistance", "property-management"],
  },
  {
    slug: "property-management",
    title: "Property management",
    short: "Tenants, rent collection, maintenance and renewals, managed so you do not have to.",
    eyebrow: "Management",
    metaTitle: "Property Management in Dubai | Landlord Services | SWK Properties",
    metaDescription:
      "Hands-off property management for Dubai landlords: tenant sourcing, rent collection, maintenance, Ejari renewals and owner reporting from SWK Properties.",
    keywords: ["property management Dubai", "landlord services Dubai", "rent collection Dubai", "Ejari renewal"],
    image: "/img/gallery/image12.webp",
    intro:
      "If you own in Dubai but do not live here, or simply do not want to chase maintenance and cheques, we manage the tenancy for you and report clearly on what happened and what it cost.",
    scope: [
      "Tenant sourcing, screening and contract signing",
      "Rent collection and transfer to the owner",
      "Maintenance coordination with quotes approved by you",
      "Ejari registration and renewals, rent-increase compliance",
      "Periodic inspections with photo reports",
      "Owner statements covering rent, charges and expenses",
    ],
    process: [
      { step: "Onboard", text: "Handover of keys, documents and an initial condition report." },
      { step: "Let", text: "Tenant found and contract registered." },
      { step: "Run", text: "Rent, maintenance and communication handled." },
      { step: "Report", text: "Regular owner statements." },
      { step: "Renew", text: "Renewal or re-let at a realistic rent." },
    ],
    fees: "Management fees are agreed in writing before onboarding and shown on every owner statement.",
    whoFor: ["Overseas owners", "Investors with several units", "Busy owners who want fewer calls"],
    faqs: [
      {
        question: "Can I approve repairs before they are done?",
        answer: "Yes. Non-urgent repairs are quoted and need your approval. Emergencies are handled first and reported immediately.",
      },
    ],
    related: ["leasing-rental", "interior-fitout", "legal-documentation"],
  },
  {
    slug: "mortgage-assistance",
    title: "Mortgage assistance",
    short: "Bank-agnostic mortgage structuring for residents and non-residents.",
    eyebrow: "Finance",
    metaTitle: "Dubai Mortgage Assistance for Residents & Non-Residents | SWK Properties",
    metaDescription:
      "Compare UAE mortgage options for residents and non-residents. SWK structures the application, compares lender rates and coordinates valuation through to DLD registration.",
    keywords: ["Dubai mortgage for non residents", "UAE mortgage broker", "mortgage pre approval Dubai", "home loan Dubai"],
    image: "/img/gallery/image13.webp",
    intro:
      "Mortgage rules for UAE residents and non-residents differ on loan-to-value and documentation. We introduce you to lending partners, compare terms side by side, and keep the application moving so it does not hold up your purchase.",
    scope: [
      "Eligibility and affordability check",
      "Pre-approval with several banks compared",
      "Resident and non-resident structures",
      "Valuation, offer letter and liability letter coordination",
      "Mortgage registration at the Dubai Land Department",
    ],
    process: [
      { step: "Assess", text: "Income, liabilities and deposit reviewed." },
      { step: "Compare", text: "Rates and terms from lending partners." },
      { step: "Apply", text: "Documents submitted and valuation booked." },
      { step: "Approve", text: "Offer letter and final cost summary." },
      { step: "Register", text: "Mortgage registered at the DLD alongside the transfer." },
    ],
    fees: "SWK acts as a referral partner. Any referral arrangement is disclosed to you before you apply. Bank fees and DLD mortgage registration fees apply.",
    whoFor: ["First-time buyers", "Non-resident investors", "Owners refinancing"],
    faqs: [
      {
        question: "Can non-residents get a mortgage in the UAE?",
        answer: "Yes, though loan-to-value limits are usually lower than for residents and documentation is stricter. We map your options with lenders before you commit to a property.",
      },
    ],
    related: ["secondary-market", "off-plan-advisory", "investment-advisory"],
  },
  {
    slug: "legal-documentation",
    title: "Legal & documentation",
    short: "SPA review, DLD registration, power of attorney and Golden Visa paperwork.",
    eyebrow: "Legal",
    metaTitle: "Property Legal & Documentation Support in Dubai | SWK Properties",
    metaDescription:
      "DLD registration, SPA review, power of attorney and Golden Visa documentation for Dubai property buyers, handled with SWK's in-house legal partners.",
    keywords: ["DLD registration", "SPA review Dubai", "power of attorney Dubai property", "Title Deed Dubai", "Golden Visa documents"],
    image: "/img/gallery/image2.webp",
    intro:
      "The paperwork behind a Dubai purchase is straightforward when someone explains it in order. We coordinate with legal partners so you understand what you sign and when.",
    scope: [
      "Sales & Purchase Agreement review and plain-language summary",
      "Oqood and Title Deed registration with the DLD",
      "Power of attorney for overseas buyers",
      "Golden Visa and residency documentation",
      "Handover, snagging and title issue",
    ],
    process: [
      { step: "Review", text: "Contract read and key terms summarised." },
      { step: "Prepare", text: "Documents and IDs collected." },
      { step: "Register", text: "Oqood or title registration completed." },
      { step: "Complete", text: "Title Deed or Oqood certificate delivered." },
    ],
    fees: "Government fees are paid at cost. Legal partner fees are quoted before you instruct them.",
    whoFor: ["Overseas buyers", "First-time buyers", "Owners with inheritance or POA needs"],
    faqs: [
      {
        question: "Do I need to be in Dubai to buy?",
        answer: "No. With a power of attorney and remote document signing, many buyers complete without travelling. We tell you which steps do require presence.",
      },
    ],
    related: ["off-plan-advisory", "secondary-market", "mortgage-assistance"],
  },
  {
    slug: "interior-fitout",
    title: "Interior & fit-out",
    short: "Turnkey design and furnishing packages for handover-ready, rental-ready homes.",
    eyebrow: "Fit-out",
    metaTitle: "Interior Design & Fit-Out for Dubai Apartments | SWK Properties",
    metaDescription:
      "Turnkey interior design and furnishing packages for newly handed-over Dubai units, built for rental-ready returns or comfortable living. Quoted upfront by SWK Properties.",
    keywords: ["apartment fit out Dubai", "furnishing packages Dubai", "interior design Dubai apartment", "rental ready furnishing"],
    image: "/img/gallery/image4.webp",
    intro:
      "A unit that is furnished well rents faster and holds its value. We scope the work against your budget and the likely tenant, then manage the contractors so you are not on site.",
    scope: [
      "Design concept and budget",
      "Furniture and soft-furnishing packages",
      "Contractor management and snagging",
      "Photography ready for listing",
    ],
    process: [
      { step: "Brief", text: "Budget, style and target tenant." },
      { step: "Design", text: "Concept and itemised quote." },
      { step: "Build", text: "Delivery and installation." },
      { step: "Finish", text: "Snagging, styling and photography." },
    ],
    fees: "Fixed itemised quotes before any work starts.",
    whoFor: ["Investors renting out", "Owners moving in", "Overseas owners"],
    faqs: [
      {
        question: "Does furnishing increase rent?",
        answer: "Furnished units often command a different rent range and can let faster, but the right choice depends on the building and tenant profile. We advise before you spend.",
      },
    ],
    related: ["property-management", "leasing-rental", "off-plan-advisory"],
  },
]

export const servicePages: ServicePage[] = rawServicePages.map((s) => ({
  ...s,
  shortTitle: s.title,
  tagline: s.short,
  heroImage: s.image,
  description: s.intro,
  whatIsIncluded: s.scope,
  steps: s.process.map((p) => ({
    step: p.step,
    text: p.text,
    title: p.step,
    body: p.text,
  })),
  feeTransparency: s.fees,
  whoItIsFor: s.whoFor,
  faqs: s.faqs.map((f) => ({
    ...f,
    q: f.question,
    a: f.answer,
  })),
  ctaLabel: `Speak With Our ${s.title} Desk`,
}))

export const services = servicePages
export const getService = (slug: string) => servicePages.find((s) => s.slug === slug)
export const getServicePage = getService
