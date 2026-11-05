"use client";

import { Plus } from "lucide-react";
import { faqs } from "@/lib/swk";
import { SectionHeading } from "@/components/site/site-footer";

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-24 md:px-8">
      <SectionHeading
        eyebrow="Regulatory & Buyer FAQ"
        title={
          <>
            Questions, <em className="text-[#94652c]">answered clearly.</em>
          </>
        }
        lead="Direct answers on Dubai Land Department fees, escrow accounts, mortgages, and residency rules."
        align="center"
      />
      <div className="mt-12 space-y-3">
        {faqs.map((f, i) => (
          <details
            key={f.question}
            className="group rounded-2xl border border-[#e6dfd2] bg-white px-6 py-1 shadow-xs transition hover:border-[#94652c]/50"
            open={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-xl font-bold text-[#0f2244] [&::-webkit-details-marker]:hidden">
              {f.question}
              <Plus className="size-5 shrink-0 text-[#94652c] transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="pb-5 text-sm md:text-base leading-relaxed text-[#39455a]">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
