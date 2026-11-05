import * as React from "react"

/** Two overlapping photographs on a framed backdrop (helper for Hero 04, not published with the registry block). */
export function ArtCollage({
  primaryImage,
  secondaryImage,
  primaryAlt = "",
  secondaryAlt = "",
}: {
  primaryImage: string
  secondaryImage: string
  primaryAlt?: string
  secondaryAlt?: string
}) {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
      <div className="absolute top-0 right-0 h-[78%] w-[68%] overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={primaryImage} alt={primaryAlt} className="h-full w-full object-cover" />
      </div>
      <div className="absolute bottom-0 left-0 h-[58%] w-[52%] overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={secondaryImage} alt={secondaryAlt} className="h-full w-full object-cover" />
      </div>
    </div>
  )
}

export default ArtCollage
