import Link from "next/link"
import { ArrowLeft, Building2, Compass, Phone, Search } from "lucide-react"
import { SITE, communities } from "@/lib/swk"
import { Illustration } from "@/components/ui/not-found"

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] bg-[#faf7f2] text-[#0f2244] flex items-center justify-center py-20 px-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="mx-auto w-56 text-[#94652c]/25">
          <Illustration className="w-full h-auto" />
        </div>

        <div>
          <span className="rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">
            404 · Page or Listing Moved
          </span>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            This Property or Page Could Not Be Found
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#39455a] max-w-xl mx-auto">
            If you followed an older property link, the residence may have been sold, leased, or archived. Use the search bar or shortcuts below to explore currently available Dubai properties.
          </p>
        </div>

        {/* Direct Search Form to /properties */}
        <form
          action="/properties"
          method="get"
          className="mx-auto flex max-w-lg flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94652c]" />
            <input
              type="text"
              name="q"
              placeholder="Search Downtown, Dubai Hills, Marina, Emaar..."
              className="w-full rounded-full border border-[#e6dfd2] bg-white pl-10 pr-4 py-3 text-xs text-[#0f2244] placeholder:text-[#5f6a82] focus:border-[#94652c] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#0f2244] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-[#f3dfb1]"
          >
            Search Properties
          </button>
        </form>

        {/* Popular Communities */}
        <div className="pt-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94652c] mb-3">
            Explore Popular Dubai Communities
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {communities.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="rounded-full border border-[#e6dfd2] bg-white px-3.5 py-1.5 text-xs text-[#39455a] hover:border-[#94652c]"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#0f2244] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Homepage
          </Link>
          <Link
            href="/off-plan"
            className="inline-flex items-center gap-2 rounded-full border border-[#e6dfd2] px-5 py-2.5 text-xs font-semibold text-[#0f2244] hover:border-[#94652c]"
          >
            <Building2 className="h-3.5 w-3.5 text-[#94652c]" /> Off-Plan Launches
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-[#e6dfd2] px-5 py-2.5 text-xs font-semibold text-[#0f2244] hover:border-[#94652c]"
          >
            <Phone className="h-3.5 w-3.5 text-[#94652c]" /> Contact SWK ({SITE.phone})
          </Link>
        </div>
      </div>
    </div>
  )
}
