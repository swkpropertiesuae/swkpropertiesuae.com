"use client"

import React, { useEffect, useRef, useState } from "react"

// ─────────────────────────────────────────────────────────────
// SUNSET SKYLINE HERO (21st.dev: gughigug/sunset-skyline-hero)
// Adapted for SWK Properties Dubai:
// Scroll-locked hero where scrolling forward pushes the camera
// through a luxury Sheikh Zayed Road penthouse window onto the
// Dubai skyline at sunset (Burj Khalifa & Downtown Dubai), and
// scrolling back closes it again — ending on a giant brand mark
// ("SWK PROPERTIES") behind a pixel-aligned transparent Dubai
// skyline cutout, topped with a liquid-glass navbar.
// Once the reveal completes (progress >= 0.98), the scroll lock
// releases smoothly so the user can continue down the page.
// ─────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
}

export interface SunsetSkylineHeroProps {
  /** Optional external MP4 video; defaults to interactive 60fps Dubai Sunset Window-Push animation */
  videoSrc?: string
  /** High-resolution golden-hour Dubai sunset skyline frame */
  skylineBaseSrc?: string
  /** Transparent-background PNG of just the Dubai skyline silhouette, pixel-aligned to the final frame */
  skylineSrc?: string
  title?: string
  subtitle?: string
  scrollHint?: string
  /** Giant brand mark that composes in behind the Dubai skyline cutout once the camera clears the window */
  brandMark?: string
  navItems?: NavItem[]
  signature?: { name: string; url: string } | false
  /** Total input distance (px) needed to scrub the full hero reveal */
  scrubDistance?: number
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_SKYLINE_BASE = "/img/hero/dubai-sunset-skyline.webp"
const DEFAULT_SKYLINE_CUTOUT = "/img/hero/dubai-sunset-skyline-cutout.png"
const DEFAULT_NAV: NavItem[] = [
  { label: "Off-Plan Releases", href: "/off-plan" },
  { label: "Buy Ready Homes", href: "/buy" },
  { label: "27+ Developers", href: "/developers" },
  { label: "Communities", href: "/communities" },
  { label: "Book Consultation", href: "/contact" },
]
const SANS = "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const COL_BG = "#0f2244"
const COL_TEXT = "#fff4e8"

// Progress breakpoints from gughigug/sunset-skyline-hero:
// Window push-through completes at 0.78, then 0.80..0.96 composes
// the giant brand mark behind the pixel-aligned Dubai skyline cutout.
const VIDEO_END = 0.78
const TEXT_START = 0.8
const TEXT_END = 0.93
const SKYLINE_START = 0.85
const SKYLINE_END = 0.96

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function SunsetSkylineHero({
  videoSrc,
  skylineBaseSrc = DEFAULT_SKYLINE_BASE,
  skylineSrc = DEFAULT_SKYLINE_CUTOUT,
  title = "WHERE THE DUBAI SKYLINE MEETS LEGACY.",
  subtitle = "18+ YEARS · 27+ PARTNER DEVELOPERS · 108+ VERIFIED UAE PROJECTS",
  scrollHint = "SCROLL TO ENTER DUBAI",
  brandMark = "SWK PROPERTIES",
  navItems = DEFAULT_NAV,
  signature = false,
  scrubDistance = 2400,
  className,
  style,
}: SunsetSkylineHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const skylineRef = useRef<HTMLImageElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!section) return

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    let duration = 0
    let rafId = 0
    let targetProgress = reduceMotion ? 1 : 0
    let currentProgress = reduceMotion ? 1 : 0
    let hasStartedScrolling = false
    let isSeeking = false
    let pendingTime: number | null = null
    let locked = false
    let lockedScrollY = 0
    let touchStartY = 0

    // Load the high-res Dubai sunset skyline image for 60fps window-push canvas rendering
    const skyImg = new Image()
    skyImg.decoding = "async"
    skyImg.src = skylineBaseSrc
    let skyImgLoaded = false
    skyImg.onload = () => {
      skyImgLoaded = true
      setReady(true)
    }

    const onLoadedData = () => {
      if (!video) return
      duration = video.duration || 0
      setReady(true)
      if (reduceMotion) {
        video.currentTime = duration
      }
    }
    if (video && videoSrc) {
      video.addEventListener("loadeddata", onLoadedData)
    }

    const onSeeked = () => {
      if (!video) return
      isSeeking = false
      if (pendingTime !== null) {
        const t = pendingTime
        pendingTime = null
        isSeeking = true
        video.currentTime = t
      }
    }
    if (video && videoSrc) {
      video.addEventListener("seeked", onSeeked)
    }

    function seekTo(t: number) {
      if (!video) return
      if (isSeeking) {
        pendingTime = t
        return
      }
      isSeeking = true
      video.currentTime = t
    }

    function engageLock() {
      if (locked || reduceMotion || typeof document === "undefined") return
      if (window.scrollY > 12) return
      locked = true
      lockedScrollY = window.scrollY
      const b = document.body.style
      b.position = "fixed"
      b.top = `-${lockedScrollY}px`
      b.left = "0"
      b.right = "0"
      b.width = "100%"
    }

    function releaseLock() {
      if (!locked || typeof document === "undefined") return
      locked = false
      const y = lockedScrollY
      const b = document.body.style
      b.position = ""
      b.top = ""
      b.left = ""
      b.right = ""
      b.width = ""
      window.scrollTo(0, y)
    }

    if (typeof window !== "undefined" && window.scrollY <= 12 && !reduceMotion) {
      engageLock()
    }

    function addDelta(deltaY: number): boolean {
      // If unlocked and user scrolled back to top of page and scrolls up, re-engage hero scrub!
      if (!locked) {
        if (window.scrollY <= 6 && deltaY < 0) {
          engageLock()
        } else {
          return false
        }
      }

      const next = clamp(targetProgress + deltaY / scrubDistance, 0, 1)
      targetProgress = next
      if (targetProgress > 0.001) hasStartedScrolling = true

      // When user finishes the full reveal (progress near 1) and continues scrolling down, unlock smoothly!
      if (deltaY > 0 && targetProgress >= 0.995 && currentProgress >= 0.955) {
        releaseLock()
        return false
      }

      return true
    }

    const onWheel = (e: WheelEvent) => {
      if (addDelta(e.deltaY)) {
        e.preventDefault()
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY
      const deltaY = touchStartY - y
      touchStartY = y
      if (addDelta(deltaY)) {
        e.preventDefault()
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })

    // Draw the 60fps camera push-through window onto the Dubai Sunset Skyline
    function drawDubaiSunsetFrame(videoT: number, timeMs: number) {
      if (!canvas || !skyImgLoaded) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cw = section!.clientWidth
      const ch = section!.clientHeight
      if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
        canvas.width = Math.round(cw * dpr)
        canvas.height = Math.round(ch * dpr)
      }
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.save()
      ctx.scale(dpr, dpr)

      // Compute exact object-fit: cover rectangle for skyImg so at videoT = 1.0
      // it aligns 100.0% pixel-for-pixel with the <img ref={skylineRef} /> cutout!
      const iw = skyImg.naturalWidth || 1920
      const ih = skyImg.naturalHeight || 1080
      const scaleCover = Math.max(cw / iw, ch / ih)
      const baseW = iw * scaleCover
      const baseH = ih * scaleCover
      const baseX = (cw - baseW) / 2
      const baseY = (ch - baseH) / 2

      // As videoT goes from 0 -> 1, the camera pushes forward toward the Dubai skyline:
      // At videoT = 0, skyline is slightly further back (zoom = 1.12 -> settles to 1.00 at videoT = 1.0 for exact cutout alignment)
      const eased = easeOutCubic(videoT)
      const skyScale = 1.12 - 0.12 * eased

      ctx.fillStyle = COL_BG
      ctx.fillRect(0, 0, cw, ch)

      // 1. Draw the golden-hour Dubai Sunset Skyline
      ctx.save()
      ctx.translate(cw / 2, ch / 2)
      ctx.scale(skyScale, skyScale)
      ctx.translate(-cw / 2, -ch / 2)
      ctx.drawImage(skyImg, baseX, baseY, baseW, baseH)

      // Subtle animated golden-hour sunset glow & water shimmer across the horizon
      const pulse = 0.5 + 0.5 * Math.sin(timeMs * 0.0018)
      const sunGrad = ctx.createRadialGradient(
        cw * 0.68,
        ch * 0.44,
        10,
        cw * 0.68,
        ch * 0.44,
        Math.max(cw, ch) * 0.55
      )
      sunGrad.addColorStop(0, `rgba(255, 200, 135, ${0.14 + 0.05 * pulse})`)
      sunGrad.addColorStop(0.45, `rgba(224, 155, 95, ${0.07 + 0.03 * pulse})`)
      sunGrad.addColorStop(1, "rgba(15, 34, 68, 0)")
      ctx.fillStyle = sunGrad
      ctx.fillRect(0, 0, cw, ch)
      ctx.restore()

      // 2. Architectural Penthouse Window Push-Through Layer (clears completely by videoT = 1.0)
      // At videoT = 0, the camera is inside a luxury Sheikh Zayed Road penthouse suite looking through
      // a grand floor-to-ceiling bronze-and-navy architectural window frame that scales up and parts open as you scroll.
      if (videoT < 0.995) {
        const winFade = clamp(1 - Math.pow(videoT, 2.2), 0, 1)
        const winZoom = 1 + Math.pow(videoT, 1.65) * 2.85
        const openW = cw * Math.min(0.98, 0.56 * winZoom)
        const openH = ch * Math.min(0.98, 0.62 * winZoom)
        const leftWall = (cw - openW) / 2
        const topWall = (ch - openH) / 2
        const rightWall = cw - leftWall
        const bottomWall = ch - topWall

        ctx.save()
        ctx.globalAlpha = winFade

        // Dark architectural penthouse interior surround (#0a172e -> #0f2244)
        ctx.fillStyle = "#081529"
        // Top header wall
        ctx.fillRect(0, 0, cw, Math.max(0, topWall))
        // Bottom sill wall
        ctx.fillRect(0, Math.min(ch, bottomWall), cw, Math.max(0, ch - bottomWall))
        // Left & right pilasters
        ctx.fillRect(0, Math.max(0, topWall), Math.max(0, leftWall), Math.max(0, openH))
        ctx.fillRect(Math.min(cw, rightWall), Math.max(0, topWall), Math.max(0, cw - rightWall), Math.max(0, openH))

        // Sliding casement glass panes parting left and right as camera pushes forward
        const slideOffset = eased * (openW * 0.55)
        const paneWidth = Math.max(0, openW * 0.5 - slideOffset)
        if (paneWidth > 2) {
          ctx.fillStyle = "rgba(15, 34, 68, 0.22)"
          ctx.fillRect(leftWall, topWall, paneWidth, openH)
          ctx.fillRect(rightWall - paneWidth, topWall, paneWidth, openH)

          // Warm rose-gold mullions on the parting window panes
          ctx.strokeStyle = "rgba(224, 193, 163, 0.65)"
          ctx.lineWidth = 2
          ctx.strokeRect(leftWall, topWall, paneWidth, openH)
          ctx.strokeRect(rightWall - paneWidth, topWall, paneWidth, openH)
        }

        // Outer bronze-gold architectural window frame border
        ctx.strokeStyle = "rgba(224, 193, 163, 0.78)"
        ctx.lineWidth = Math.max(2, 4 * (1 - videoT * 0.5))
        ctx.strokeRect(leftWall, topWall, openW, openH)

        // Subtle warm sunset reflection on the bottom travertine window sill
        const sillGrad = ctx.createLinearGradient(0, bottomWall, 0, ch)
        sillGrad.addColorStop(0, "rgba(224, 193, 163, 0.22)")
        sillGrad.addColorStop(1, "rgba(8, 21, 41, 0.95)")
        ctx.fillStyle = sillGrad
        ctx.fillRect(leftWall * 0.7, bottomWall, cw - leftWall * 1.4, ch - bottomWall)

        ctx.restore()
      }

      ctx.restore()
    }

    function frame(now: number) {
      currentProgress += (targetProgress - currentProgress) * 0.18

      const videoT = clamp(currentProgress / VIDEO_END, 0, 1)
      if (videoSrc && duration > 0) {
        seekTo(videoT * duration)
      } else {
        drawDubaiSunsetFrame(videoT, now)
      }

      if (titleRef.current) {
        const t = 1 - clamp(currentProgress / 0.3, 0, 1)
        titleRef.current.style.opacity = String(t)
        titleRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`
        titleRef.current.style.filter = `blur(${(1 - t) * 10}px)`
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = hasStartedScrolling ? "0" : "1"
      }
      if (brandRef.current) {
        const t = clamp((currentProgress - TEXT_START) / (TEXT_END - TEXT_START), 0, 1)
        brandRef.current.style.opacity = String(t)
        brandRef.current.style.transform = `translateY(${(1 - t) * 16}px) scale(${0.98 + t * 0.02})`
        brandRef.current.style.filter = `blur(${(1 - t) * 6}px)`
        brandRef.current.style.letterSpacing = `${(1 - t) * 0.22}em`
      }
      if (skylineRef.current) {
        const t = clamp((currentProgress - SKYLINE_START) / (SKYLINE_END - SKYLINE_START), 0, 1)
        skylineRef.current.style.opacity = String(t)
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${currentProgress})`
      }

      // If user reached the end of the scrub, automatically release lock so normal page scrolling works seamlessly
      if (locked && targetProgress >= 0.995 && currentProgress >= 0.965) {
        releaseLock()
      }

      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      if (video && videoSrc) {
        video.removeEventListener("loadeddata", onLoadedData)
        video.removeEventListener("seeked", onSeeked)
      }
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      cancelAnimationFrame(rafId)
      releaseLock()
    }
  }, [scrubDistance, skylineBaseSrc, videoSrc])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: COL_BG,
        ...style,
      }}
    >
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      )}

      {/* Giant Brand Mark — sits above the sunset skyline background (zIndex: 1) but below the Dubai skyline cutout (zIndex: 2), so Burj Khalifa & Downtown towers appear in front of it. */}
      <div
        ref={brandRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 5% 24vh",
          textAlign: "center",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <style>{`
          @media (max-width: 640px) {
            .tsh-brand-mark {
              font-size: clamp(38px, 11vw, 72px) !important;
              line-height: 1.08 !important;
              letter-spacing: 0.06em !important;
            }
          }
        `}</style>
        <span
          className="tsh-brand-mark font-serif"
          style={{
            fontWeight: 700,
            fontSize: "clamp(48px, 9.5vw, 156px)",
            lineHeight: 1.02,
            letterSpacing: "0.04em",
            color: COL_TEXT,
            textShadow: "0 10px 60px rgba(15,34,68,0.75)",
          }}
        >
          {brandMark}
        </span>
      </div>

      {/* Dubai Skyline Cutout — transparent everywhere in the sky, pixel-aligned with the sunset skyline beneath it so buildings stand in front of the giant brand mark. */}
      <img
        ref={skylineRef}
        src={skylineSrc}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Atmospheric Sunset Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(15,34,68,0.42), rgba(15,34,68,0) 32%, rgba(15,34,68,0.18) 70%, rgba(15,34,68,0.68))",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* Initial Headline that dissolves into blur as the camera pushes through the window */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6%",
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "clamp(10px, 1.2vw, 13px)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#E0C1A3",
            marginBottom: "14px",
            textShadow: "0 2px 16px rgba(15,34,68,0.85)",
          }}
        >
          {subtitle}
        </span>
        <span
          className="font-serif"
          style={{
            fontWeight: 600,
            fontSize: "clamp(26px, 4.8vw, 64px)",
            lineHeight: 1.15,
            letterSpacing: "0.02em",
            color: COL_TEXT,
            maxWidth: "980px",
            textShadow: "0 6px 36px rgba(15,34,68,0.85)",
          }}
        >
          {title}
        </span>
      </div>

      {/* Liquid-Glass Quick Mandate Pill — always visible, independent of scroll progress */}
      <nav
        aria-label="Dubai Skyline Hero Quick Links"
        style={{
          position: "absolute",
          top: "clamp(14px, 2.5vh, 24px)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(10px, 2vw, 24px)",
          padding: "clamp(7px, 1.2vw, 10px) clamp(14px, 2.4vw, 24px)",
          borderRadius: 999,
          background: "rgba(15, 34, 68, 0.42)",
          backdropFilter: "blur(16px) saturate(160%)",
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
          border: "1px solid rgba(224, 193, 163, 0.32)",
          maxWidth: "calc(100vw - 24px)",
          overflowX: "auto",
          zIndex: 4,
        }}
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "clamp(11px, 1.2vw, 13px)",
              color: "rgba(255,244,232,0.88)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.color = "#E0C1A3"
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.color = "rgba(255,244,232,0.88)"
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Scroll Hint Indicator */}
      <div
        ref={hintRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "clamp(20px, 5vh, 42px)",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "rgba(255,244,232,0.85)",
          fontFamily: SANS,
          fontSize: "clamp(10px, 1.2vw, 11px)",
          fontWeight: 700,
          letterSpacing: "0.28em",
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
          zIndex: 4,
        }}
      >
        <span>{scrollHint}</span>
        <svg
          width="14"
          height="18"
          viewBox="0 0 14 18"
          style={{ animation: "dubai-hero-bounce 1.6s ease-in-out infinite" }}
        >
          <style>{`
            @keyframes dubai-hero-bounce {
              0%, 100% { transform: translateY(0); opacity: 0.55; }
              50% { transform: translateY(5px); opacity: 1; }
            }
          `}</style>
          <path
            d="M7 1 L7 17 M2 12 L7 17 L12 12"
            stroke="#E0C1A3"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bottom Scroll Scrub Progress Bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: "rgba(255,244,232,0.14)",
          zIndex: 4,
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "100%",
            background: "linear-gradient(90deg, #94652c, #E0C1A3)",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {signature && (
        <span
          style={{
            position: "absolute",
            right: "clamp(12px, 2.5vw, 24px)",
            bottom: "clamp(10px, 2vw, 18px)",
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: "clamp(11px, 1.4vw, 13px)",
            letterSpacing: "0.01em",
            color: "rgba(255,244,232,0.6)",
            zIndex: 4,
          }}
        >
          by{" "}
          <a
            href={signature.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(255,244,232,0.6)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            {signature.name}
          </a>
        </span>
      )}
    </div>
  )
}
