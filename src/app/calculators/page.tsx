"use client"

import * as React from "react"
import { Calculator, AlertCircle, Building2, Percent, Wallet, Calendar } from "lucide-react"
import { usePrefs } from "@/lib/prefs"
import { LivelyPageHero } from "@/components/ui/lively-page-hero"
import { EnquiryForm } from "@/components/site/enquiry-form"

export default function CalculatorsPage() {
  const { formatPrice, currency } = usePrefs()

  // 1. Mortgage & Purchase Cost state
  const [price, setPrice] = React.useState(2500000)
  const [downPct, setDownPct] = React.useState(20)
  const [ratePct, setRatePct] = React.useState(4.49)
  const [years, setYears] = React.useState(25)
  const [isReady, setIsReady] = React.useState(true)

  // 2. Rental Yield state
  const [annualRent, setAnnualRent] = React.useState(185000)
  const [areaSqft, setAreaSqft] = React.useState(1250)
  const [serviceChargePerSqft, setServiceChargePerSqft] = React.useState(18)
  const [annualMaintenance] = React.useState(4500)
  const [vacancyPct, setVacancyPct] = React.useState(5)

  // 3. Off-Plan Payment Schedule state
  const [offPlanStructure, setOffPlanStructure] = React.useState<"80-20" | "60-40" | "70-30">("60-40")

  // Calculations — Mortgage
  const downPaymentAed = Math.round((price * downPct) / 100)
  const loanAmountAed = Math.max(0, price - downPaymentAed)
  const monthlyRate = ratePct / 100 / 12
  const numPayments = years * 12
  const monthlyPaymentAed =
    loanAmountAed > 0 && monthlyRate > 0
      ? Math.round(
          (loanAmountAed * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1)
        )
      : 0
  const totalInterestAed = Math.max(0, monthlyPaymentAed * numPayments - loanAmountAed)

  // Calculations — DLD 4% & Upfront Costs
  const dldFeeAed = Math.round(price * 0.04)
  const trusteeOrOqoodAed = isReady ? (price >= 500000 ? 4200 : 2100) : 1050
  const titleDeedFeeAed = 580
  const mortgageRegAed = loanAmountAed > 0 ? Math.round(loanAmountAed * 0.0025 + 290) : 0
  const agencyFeeAed = isReady ? Math.round(price * 0.02 * 1.05) : 0 // 2% + 5% VAT on secondary
  const totalUpfrontFeesAed =
    dldFeeAed + trusteeOrOqoodAed + titleDeedFeeAed + mortgageRegAed + agencyFeeAed
  const totalCashRequiredAtTransferAed = downPaymentAed + totalUpfrontFeesAed

  // Calculations — Gross vs Net Yield
  const grossYieldPct = price > 0 ? (annualRent / price) * 100 : 0
  const annualServiceCharges = areaSqft * serviceChargePerSqft
  const vacancyAllowance = (annualRent * vacancyPct) / 100
  const netAnnualIncomeAed = Math.max(
    0,
    annualRent - annualServiceCharges - annualMaintenance - vacancyAllowance
  )
  const netYieldPct = price > 0 ? (netAnnualIncomeAed / price) * 100 : 0

  // Calculations — Off-Plan Schedule
  const bookingPct = 20
  const constructionPct =
    offPlanStructure === "80-20" ? 60 : offPlanStructure === "70-30" ? 50 : 40
  const handoverPct =
    offPlanStructure === "80-20" ? 20 : offPlanStructure === "70-30" ? 30 : 40

  // Calculations — 5-Year Buy vs Rent
  const fiveYearRentOutflow = annualRent * 5
  const fiveYearPrincipalRepaid = Math.round(loanAmountAed * 0.14)

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <LivelyPageHero
        badge="Interactive Dubai Property Calculators"
        title="Mortgage, DLD 4% Purchase Cost,"
        highlight="Net Yield & Off-Plan Calculators"
        description={`All figures are calculated primarily in UAE Dirhams (AED) and mirrored in your active display currency (${currency}). Adjust the sliders below to model upfront acquisition fees, monthly mortgage obligations, true net rental yield after service charges, and off-plan milestone schedules.`}
        backgroundImage="/img/hero/slides/02-imtiaz-kore-desktop.webp"
        primaryCta={{ label: "Explore 108+ Off-Plan Projects", href: "/off-plan" }}
        secondaryCta={{ label: "Request Custom DLD Cost Sheet", href: "/contact" }}
        sideImages={[
          {
            src: "/img/hero/slides/01-dubai-horizon-desktop.webp",
            label: "DLD 4% & Oqood Fee Breakdown",
            sublabel: "Exact Transfer & Registration Worksheet",
          },
          {
            src: "/img/hero/slides/05-sobha-century-desktop.webp",
            label: "Gross vs Net Rental Yield Model",
            sublabel: "Service Charge & Vacancy Adjusted ROI",
          },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-12">
        {/* Shared Property Price & Ready/Off-Plan Controls */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
                1. Property & Financing Inputs
              </h2>
              <div className="inline-flex rounded-full border border-[#e6dfd2] bg-[#faf7f2] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setIsReady(true)}
                  className={`rounded-full px-3 py-1 font-semibold transition ${
                    isReady ? "bg-[#0f2244] text-white" : "text-[#39455a]"
                  }`}
                >
                  Ready Property
                </button>
                <button
                  type="button"
                  onClick={() => setIsReady(false)}
                  className={`rounded-full px-3 py-1 font-semibold transition ${
                    !isReady ? "bg-[#0f2244] text-white" : "text-[#39455a]"
                  }`}
                >
                  Off-Plan
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#39455a]">Purchase Price</span>
                <span className="font-semibold text-[#94652c]">{formatPrice(price)}</span>
              </div>
              <input
                type="range"
                min={600000}
                max={25000000}
                step={50000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-[#e6cf9c]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#39455a]">Down Payment ({downPct}%)</span>
                <span className="font-semibold text-[#94652c]">{formatPrice(downPaymentAed)}</span>
              </div>
              <input
                type="range"
                min={20}
                max={80}
                step={5}
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className="w-full accent-[#e6cf9c]"
              />
              <p className="mt-1 text-[11px] text-[#5f6a82]">
                UAE Central Bank LTV guideline: typically 20% minimum deposit for UAE residents (first home ≤ AED 5M) and 40%+ for non-resident borrowers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#39455a]">Interest Rate</span>
                  <span className="font-semibold text-[#94652c]">{ratePct.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min={2.5}
                  max={7.5}
                  step={0.05}
                  value={ratePct}
                  onChange={(e) => setRatePct(Number(e.target.value))}
                  className="w-full accent-[#e6cf9c]"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#39455a]">Mortgage Term</span>
                  <span className="font-semibold text-[#94652c]">{years} Years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={25}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-[#e6cf9c]"
                />
              </div>
            </div>
          </div>

          {/* Outputs: Mortgage + DLD 4% Upfront Purchase Cost */}
          <div className="lg:col-span-7 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Mortgage Card */}
            <div className="rounded-3xl border border-[#94652c]/35 bg-[#151319] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
                  <Building2 className="h-4 w-4" /> Estimated Monthly Mortgage
                </div>
                <div className="mt-3 font-serif text-3xl md:text-4xl font-semibold text-[#0f2244]">
                  {formatPrice(monthlyPaymentAed)}
                  <span className="text-sm font-sans text-[#5f6a82]"> / month</span>
                </div>

                <dl className="mt-6 space-y-2.5 text-xs border-t border-[#e6dfd2] pt-4">
                  <div className="flex justify-between">
                    <dt className="text-[#5f6a82]">Loan Principal ({100 - downPct}%)</dt>
                    <dd className="font-semibold text-[#0f2244]">{formatPrice(loanAmountAed)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#5f6a82]">Down Payment ({downPct}%)</dt>
                    <dd className="font-semibold text-[#0f2244]">{formatPrice(downPaymentAed)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#5f6a82]">Total Interest Over {years} Yrs</dt>
                    <dd className="font-semibold text-[#0f2244]">{formatPrice(totalInterestAed)}</dd>
                  </div>
                </dl>
              </div>
              <p className="mt-4 text-[11px] text-[#5f6a82]">
                Indicative repayment only. Final rate, bank valuation fee (approx. AED 2,500–3,150), and life insurance depend on the UAE lender.
              </p>
            </div>

            {/* DLD 4% & Upfront Acquisition Breakdown */}
            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
                  <Wallet className="h-4 w-4" /> DLD 4% & Upfront Purchase Costs
                </div>
                <div className="mt-3 font-serif text-3xl font-semibold text-[#0f2244]">
                  {formatPrice(totalUpfrontFeesAed)}
                </div>
                <div className="text-xs text-[#5f6a82]">
                  Total estimated government & transaction fees
                </div>

                <dl className="mt-5 space-y-2 text-xs border-t border-[#e6dfd2] pt-4">
                  <div className="flex justify-between">
                    <dt className="text-[#39455a]">DLD Transfer / Oqood Fee (4%)</dt>
                    <dd className="font-semibold text-[#0f2244]">{formatPrice(dldFeeAed)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#39455a]">
                      {isReady ? "DLD Trustee Office Fee" : "Oqood Admin Fee"}
                    </dt>
                    <dd className="font-semibold text-[#0f2244]">{formatPrice(trusteeOrOqoodAed)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#39455a]">Title Deed / Certificate Admin</dt>
                    <dd className="font-semibold text-[#0f2244]">{formatPrice(titleDeedFeeAed)}</dd>
                  </div>
                  {isReady && (
                    <>
                      <div className="flex justify-between">
                        <dt className="text-[#39455a]">Mortgage Reg (0.25% + AED 290)</dt>
                        <dd className="font-semibold text-[#0f2244]">{formatPrice(mortgageRegAed)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[#39455a]">Brokerage Fee (2% + 5% VAT)</dt>
                        <dd className="font-semibold text-[#0f2244]">{formatPrice(agencyFeeAed)}</dd>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between border-t border-[#e6dfd2] pt-2.5 text-sm font-bold text-[#94652c]">
                    <dt>Total Cash Needed (Deposit + Fees)</dt>
                    <dd>{formatPrice(totalCashRequiredAtTransferAed)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Gross vs True Net Rental Yield Calculator + Off-Plan Payment Schedule */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6 rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
              <Percent className="h-4 w-4" /> 2. Gross vs True Net Rental Yield Worksheet
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
              Deduct Service Charges, Maintenance & Vacancy
            </h2>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#39455a]">Expected Annual Rent</span>
                <span className="font-semibold text-[#94652c]">{formatPrice(annualRent)} / yr</span>
              </div>
              <input
                type="range"
                min={45000}
                max={1500000}
                step={5000}
                value={annualRent}
                onChange={(e) => setAnnualRent(Number(e.target.value))}
                className="w-full accent-[#e6cf9c]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[#5f6a82] mb-1">Unit Area (sq ft)</label>
                <input
                  type="number"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(Math.max(300, Number(e.target.value)))}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#5f6a82] mb-1">Service Charge / sq ft</label>
                <input
                  type="number"
                  value={serviceChargePerSqft}
                  onChange={(e) => setServiceChargePerSqft(Math.max(5, Number(e.target.value)))}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#5f6a82] mb-1">Vacancy Buffer (%)</label>
                <input
                  type="number"
                  value={vacancyPct}
                  onChange={(e) => setVacancyPct(Math.max(0, Math.min(30, Number(e.target.value))))}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[#94652c]/30 bg-[#faf7f2] p-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f6a82]">
                  Gross Rental Yield
                </div>
                <div className="mt-1 font-serif text-3xl font-semibold text-[#0f2244]">
                  {grossYieldPct.toFixed(2)}%
                </div>
                <div className="text-[11px] text-[#5f6a82]">Before operating deductions</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#94652c]">
                  Estimated Net Yield
                </div>
                <div className="mt-1 font-serif text-3xl font-semibold text-[#94652c]">
                  {netYieldPct.toFixed(2)}%
                </div>
                <div className="text-[11px] text-[#39455a]">
                  Net: {formatPrice(netAnnualIncomeAed)} / yr
                </div>
              </div>
            </div>

            <div className="text-xs text-[#5f6a82] space-y-1">
              <div>
                • Annual Service Charges ({areaSqft} sq ft × AED {serviceChargePerSqft}):{" "}
                <strong className="text-[#0f2244]">{formatPrice(annualServiceCharges)}</strong>
              </div>
              <div>
                • 5-Year Rent Outflow vs Buying Comparison: Paying{" "}
                <strong className="text-[#0f2244]">{formatPrice(fiveYearRentOutflow)}</strong> in rent over 5 years vs amortising approx.{" "}
                <strong className="text-[#94652c]">{formatPrice(fiveYearPrincipalRepaid)}</strong> of loan principal.
              </div>
            </div>
          </div>

          {/* 3. Off-Plan Milestone Payment Schedule */}
          <div className="lg:col-span-6 rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
                <Calendar className="h-4 w-4" /> 3. Off-Plan Payment Schedule Planner
              </div>
              <div className="flex gap-1.5">
                {(["60-40", "70-30", "80-20"] as const).map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setOffPlanStructure(plan)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      offPlanStructure === plan
                        ? "bg-[#0f2244] text-white"
                        : "border border-[#e6dfd2] text-[#39455a]"
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
              Escrow Milestone Cash-Flow Breakdown ({offPlanStructure} Plan)
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                <div>
                  <strong className="text-[#94652c] block">
                    Stage 1: Reservation & SPA Signing ({bookingPct}% + 4% DLD Oqood)
                  </strong>
                  <span className="text-[#5f6a82]">
                    Paid into the DLD-registered project escrow account
                  </span>
                </div>
                <div className="text-right font-semibold text-[#0f2244]">
                  {formatPrice(Math.round(price * (bookingPct / 100)) + dldFeeAed)}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                <div>
                  <strong className="text-[#94652c] block">
                    Stage 2: Construction Milestones ({constructionPct}% across 4 instalments)
                  </strong>
                  <span className="text-[#5f6a82]">
                    Approx. {formatPrice(Math.round((price * (constructionPct / 100)) / 4))} per certified construction milestone
                  </span>
                </div>
                <div className="text-right font-semibold text-[#0f2244]">
                  {formatPrice(Math.round(price * (constructionPct / 100)))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#94652c]/35 bg-[#f6ead7] p-4">
                <div>
                  <strong className="text-[#94652c] block">
                    Stage 3: Completion & Key Handover ({handoverPct}%)
                  </strong>
                  <span className="text-[#39455a]">
                    Payable via cash or UAE bank handover mortgage upon BCC completion
                  </span>
                </div>
                <div className="text-right font-semibold text-[#94652c]">
                  {formatPrice(Math.round(price * (handoverPct / 100)))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory & Assumptions Disclaimer (§45) */}
        <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-5 text-xs text-[#39455a] flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-[#94652c] mt-0.5" />
          <div>
            <strong className="text-[#94652c] block mb-1">
              Calculator Assumptions & Non-Financial Advice Notice (Checklist §45):
            </strong>
            All calculator outputs on this page are illustrative estimates prepared by SWK Properties (RERA ORN 51517) for initial budgeting only. They do not constitute a mortgage offer, bank pre-approval, financial advice, or a guarantee of future rental returns. Actual DLD registration fees, trustee charges, developer Oqood fees, service charge indexes, and bank LTV ratios vary by property, developer, and borrower residency profile.
          </div>
        </div>

        {/* Consultation Form */}
        <EnquiryForm
          context="advisory"
          subject={`Custom Cash-Flow & Mortgage Breakdown (${formatPrice(price)})`}
          heading="Request a Written Cost & Mortgage Introduction Sheet"
          subheading="Our Sheikh Zayed Road team will prepare an exact DLD fee sheet for your target building and introduce you to an independent UAE mortgage adviser."
        />
      </div>
    </div>
  )
}
