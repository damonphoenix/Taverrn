"use client";

import { toPng } from "html-to-image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const THEME = {
  cream: "#F8F4EF",
  ink: "#1a1a1a",
  night: "#14100e",
  amber: "#e08e36",
  muted: "#6b7280",
  mutedLight: "#94a3b8",
} as const;

const W = 1320;
const H = 2868;
const IPAD_W = 2064;
const IPAD_H = 2752;
const AW = 1080;
const AH = 1920;
const AT7P_W = 1200;
const AT7P_H = 1920;
const AT7L_W = 1920;
const AT7L_H = 1200;
const AT10P_W = 1600;
const AT10P_H = 2560;
const AT10L_W = 2560;
const AT10L_H = 1600;
const FGW = 1024;
const FGH = 500;

const IPHONE_SIZES = [
  { label: '6.9"', w: 1320, h: 2868 },
  { label: '6.5"', w: 1284, h: 2778 },
  { label: '6.3"', w: 1206, h: 2622 },
  { label: '6.1"', w: 1125, h: 2436 },
] as const;

const IPAD_SIZES = [
  { label: '13" iPad', w: 2064, h: 2752 },
  { label: '12.9" iPad Pro', w: 2048, h: 2732 },
] as const;

const ANDROID_SIZES = [{ label: "Phone", w: 1080, h: 1920 }] as const;
const ANDROID_7P_SIZES = [{ label: '7" Portrait', w: 1200, h: 1920 }] as const;
const ANDROID_7L_SIZES = [{ label: '7" Landscape', w: 1920, h: 1200 }] as const;
const ANDROID_10P_SIZES = [{ label: '10" Portrait', w: 1600, h: 2560 }] as const;
const ANDROID_10L_SIZES = [{ label: '10" Landscape', w: 2560, h: 1600 }] as const;
const FG_SIZES = [{ label: "Feature Graphic", w: 1024, h: 500 }] as const;

type Device =
  | "iphone"
  | "android"
  | "android-7"
  | "android-10"
  | "ipad"
  | "feature-graphic";
type Orientation = "portrait" | "landscape";

const MK_W = 1022;
const MK_H = 2082;
const SC_L = (52 / MK_W) * 100;
const SC_T = (46 / MK_H) * 100;
const SC_W = (918 / MK_W) * 100;
const SC_H = (1990 / MK_H) * 100;
const SC_RX = (126 / 918) * 100;
const SC_RY = (126 / 1990) * 100;

const MK_RATIO = 1022 / 2082;
const TAB_P_RATIO = 0.667;
const TAB_L_RATIO = 1.5;
const IPAD_RATIO = 0.77;

type WidthFn = (cW: number, cH: number) => number;

function phoneW(cW: number, cH: number, clamp = 0.84) {
  return Math.min(clamp, 0.72 * (cH / cW) * MK_RATIO);
}
function tabletPW(cW: number, cH: number, clamp = 0.8) {
  return Math.min(clamp, 0.72 * (cH / cW) * TAB_P_RATIO);
}
function tabletLW(cW: number, cH: number, clamp = 0.62) {
  return Math.min(clamp, 0.75 * (cH / cW) * TAB_L_RATIO);
}
function ipadW(cW: number, cH: number, clamp = 0.75) {
  return Math.min(clamp, 0.72 * (cH / cW) * IPAD_RATIO);
}

const SLIDE_IDS = ["home", "brew", "formats", "video", "trust", "more"] as const;
/** Use ".svg" if you switch back to vector placeholders in `public/screenshots/**`. */
const SCREENSHOT_EXT = ".png" as const;

const imageCache: Record<string, string> = {};

function img(path: string): string {
  return imageCache[path] || path;
}

function imagePaths(): string[] {
  const bases = [
    "/screenshots/apple/iphone",
    "/screenshots/apple/ipad",
    "/screenshots/android/phone",
    "/screenshots/android/tablet-7/portrait",
    "/screenshots/android/tablet-7/landscape",
    "/screenshots/android/tablet-10/portrait",
    "/screenshots/android/tablet-10/landscape",
  ];
  return [
    "/mockup.png",
    "/app-icon.svg",
    ...bases.flatMap((b) => SLIDE_IDS.map((id) => `${b}/${id}${SCREENSHOT_EXT}`)),
  ];
}

async function preloadAllImages(): Promise<void> {
  await Promise.all(
    imagePaths().map(async (path) => {
      const resp = await fetch(path);
      const blob = await resp.blob();
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      imageCache[path] = dataUrl;
    }),
  );
}

type PhoneComp = (p: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}) => React.ReactElement;

function Phone({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", aspectRatio: `${MK_W}/${MK_H}`, ...style }}>
      <img
        src={img("/mockup.png")}
        alt=""
        style={{ display: "block", width: "100%", height: "100%" }}
        draggable={false}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          overflow: "hidden",
          left: `${SC_L}%`,
          top: `${SC_T}%`,
          width: `${SC_W}%`,
          height: `${SC_H}%`,
          borderRadius: `${SC_RX}% / ${SC_RY}%`,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

function AndroidPhone({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", aspectRatio: "9/19.5", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8% / 4%",
          background: "linear-gradient(160deg, #2a2a2e 0%, #18181b 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.55)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "3%",
            height: "1%",
            borderRadius: "50%",
            background: "#0d0d0f",
            border: "1px solid rgba(255,255,255,0.06)",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "4%",
            top: "2%",
            width: "92%",
            height: "96%",
            borderRadius: "6% / 3%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function AndroidTabletP({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", aspectRatio: "5/8", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "5% / 3%",
          background: "linear-gradient(160deg, #2a2a2e 0%, #18181b 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 8px 48px rgba(0,0,0,0.6)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "1%",
            height: "1%",
            borderRadius: "50%",
            background: "#0d0d0f",
            border: "1px solid rgba(255,255,255,0.07)",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "5% / 3%",
            border: "1px solid rgba(255,255,255,0.05)",
            pointerEvents: "none",
            zIndex: 15,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "4%",
            top: "2%",
            width: "92%",
            height: "96%",
            borderRadius: "3% / 2%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function AndroidTabletL({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", aspectRatio: "8/5", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "3% / 5%",
          background: "linear-gradient(160deg, #2a2a2e 0%, #18181b 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 8px 48px rgba(0,0,0,0.6)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "1%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "1%",
            height: "1%",
            borderRadius: "50%",
            background: "#0d0d0f",
            border: "1px solid rgba(255,255,255,0.07)",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "3% / 5%",
            border: "1px solid rgba(255,255,255,0.05)",
            pointerEvents: "none",
            zIndex: 15,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "2%",
            top: "4%",
            width: "96%",
            height: "92%",
            borderRadius: "2% / 3%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function IPad({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", aspectRatio: "770/1000", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "5% / 4%",
          background: "linear-gradient(180deg, #2C2C2E 0%, #1C1C1E 100%)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "1%",
            height: "1%",
            borderRadius: "50%",
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.08)",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "5% / 4%",
            border: "1px solid rgba(255,255,255,0.06)",
            pointerEvents: "none",
            zIndex: 15,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "4%",
            top: "3%",
            width: "92%",
            height: "94%",
            borderRadius: "2% / 2%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function Caption({
  cW,
  label,
  headline,
  accent,
  fg,
}: {
  cW: number;
  label: string;
  headline: React.ReactNode;
  accent: string;
  fg: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 5,
        maxWidth: "88%",
      }}
    >
      <div
        style={{
          fontSize: Math.round(cW * 0.028),
          fontWeight: 600,
          color: accent,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: Math.round(cW * 0.02),
          fontSize: Math.round(cW * 0.09),
          fontWeight: 700,
          color: fg,
          lineHeight: 0.98,
        }}
      >
        {headline}
      </div>
    </div>
  );
}

type SlideProps = { cW: number; cH: number };
type SlideDef = { id: string; component: (p: SlideProps) => React.ReactElement };

function shot(base: string, id: (typeof SLIDE_IDS)[number]): string {
  return img(`/${base}/${id}${SCREENSHOT_EXT}`);
}

function makeSlide1(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "hero",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `radial-gradient(120% 80% at 50% 0%, ${THEME.amber}33 0%, transparent 55%), linear-gradient(165deg, ${THEME.night} 0%, #0b0a08 100%)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: Math.round(cW * 0.55),
              height: Math.round(cW * 0.55),
              borderRadius: "50%",
              background: `${THEME.amber}22`,
              filter: "blur(60px)",
              top: Math.round(-cW * 0.08),
              right: Math.round(-cW * 0.05),
            }}
          />
          <div style={{ position: "absolute", top: Math.round(cW * 0.08), left: Math.round(cW * 0.06), right: Math.round(cW * 0.06) }}>
            <Caption
              cW={cW}
              label="Brewery"
              accent={THEME.amber}
              fg={THEME.cream}
              headline={
                <>
                  Your files never
                  <br />
                  hit the network.
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "home")}
            alt="Home"
            style={{
              position: "absolute",
              bottom: 0,
              width: `${fw}%`,
              left: "50%",
              transform: "translateX(-50%) translateY(13%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeSlide2(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "brew",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(180deg, ${THEME.cream} 0%, #ebe4d9 100%)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: Math.round(cH * 0.12),
              left: Math.round(cW * 0.06),
              width: "46%",
            }}
          >
            <Caption
              cW={cW}
              label="Fast output"
              accent={THEME.amber}
              fg={THEME.ink}
              headline={
                <>
                  Pick a format.
                  <br />
                  Leave with the file.
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "brew")}
            alt="Convert"
            style={{
              position: "absolute",
              bottom: 0,
              right: Math.round(-cW * 0.02),
              width: `${Math.min(fw, 72)}%`,
              transform: "translateY(10%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeSlide3(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "formats",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(135deg, #0f0f10 0%, ${THEME.night} 100%)`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: Math.round(cW * 0.08), left: 0, right: 0, textAlign: "center", paddingLeft: Math.round(cW * 0.06), paddingRight: Math.round(cW * 0.06) }}>
            <Caption
              cW={cW}
              label="Formats"
              accent={THEME.amber}
              fg={THEME.cream}
              headline={
                <>
                  Images, sound,
                  <br />
                  video, and sheets.
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "formats")}
            alt="Formats"
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              width: `${fw * 0.92}%`,
              transform: "translateX(-50%) translateY(12%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeSlide4(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "video",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(90deg, ${THEME.cream} 0%, #f2ebe2 100%)`,
            overflow: "hidden",
          }}
        >
          <PhoneComp
            src={shot(base, "video")}
            alt="Video"
            style={{
              position: "absolute",
              bottom: 0,
              left: Math.round(-cW * 0.04),
              width: `${Math.min(fw, 78)}%`,
              transform: "translateY(8%) rotate(-3deg)",
              opacity: 0.95,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: Math.round(cH * 0.14),
              right: Math.round(cW * 0.06),
              width: "48%",
              textAlign: "right",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Caption
                cW={cW}
                label="Video"
                accent={THEME.amber}
                fg={THEME.ink}
                headline={
                  <>
                    Cut and convert
                    <br />
                    inside your tab.
                  </>
                }
              />
            </div>
          </div>
        </div>
      );
    },
  };
}

function makeSlide5(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "trust",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `radial-gradient(90% 70% at 50% 100%, ${THEME.amber}44 0%, transparent 50%), ${THEME.night}`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: Math.round(cW * 0.08), left: Math.round(cW * 0.06), right: Math.round(cW * 0.06) }}>
            <Caption
              cW={cW}
              label="Privacy"
              accent={THEME.amber}
              fg={THEME.cream}
              headline={
                <>
                  No uploads.
                  <br />
                  No servers.
                  <br />
                  <span style={{ color: THEME.mutedLight }}>Just your chip.</span>
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "trust")}
            alt="Privacy"
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              width: `${fw * 0.88}%`,
              transform: "translateX(-50%) translateY(14%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeSlide6(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "more",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(180deg, #fdfaf6 0%, ${THEME.cream} 100%)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: Math.round(cH * 0.1),
              left: Math.round(cW * 0.06),
              width: "52%",
            }}
          >
            <Caption
              cW={cW}
              label="Extras"
              accent={THEME.amber}
              fg={THEME.ink}
              headline={
                <>
                  Extensions,
                  <br />
                  PDF tools,
                  <br />
                  and more.
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "more")}
            alt="More"
            style={{
              position: "absolute",
              bottom: 0,
              right: Math.round(-cW * 0.01),
              width: `${Math.min(fw, 68)}%`,
              transform: "translateY(11%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeTabLSlide1(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "hero-landscape",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(110deg, ${THEME.night} 0%, #0d0c0a 100%)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "5%",
              width: "34%",
              transform: "translateY(-50%)",
            }}
          >
            <Caption
              cW={cW}
              label="Brewery"
              accent={THEME.amber}
              fg={THEME.cream}
              headline={
                <>
                  Your files never
                  <br />
                  hit the network.
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "home")}
            alt="Home"
            style={{
              position: "absolute",
              right: "-3%",
              top: "50%",
              width: `${fw}%`,
              transform: "translateY(-50%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeTabLSlide2(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "brew-landscape",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(110deg, ${THEME.cream} 0%, #ebe4d9 100%)`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "50%", left: "5%", width: "34%", transform: "translateY(-50%)" }}>
            <Caption
              cW={cW}
              label="Fast output"
              accent={THEME.amber}
              fg={THEME.ink}
              headline={
                <>
                  Pick a format.
                  <br />
                  Leave with the file.
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "brew")}
            alt="Convert"
            style={{
              position: "absolute",
              right: "-4%",
              top: "50%",
              width: `${fw * 0.95}%`,
              transform: "translateY(-50%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeTabLSlide3(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "formats-landscape",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(110deg, #0f0f10 0%, ${THEME.night} 100%)`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "50%", left: "5%", width: "34%", transform: "translateY(-50%)" }}>
            <Caption
              cW={cW}
              label="Formats"
              accent={THEME.amber}
              fg={THEME.cream}
              headline={
                <>
                  Images, sound,
                  <br />
                  video, and sheets.
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "formats")}
            alt="Formats"
            style={{
              position: "absolute",
              right: "-3%",
              top: "50%",
              width: `${fw}%`,
              transform: "translateY(-50%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeTabLSlide4(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "video-landscape",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(110deg, ${THEME.cream} 0%, #f2ebe2 100%)`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "50%", left: "5%", width: "34%", transform: "translateY(-50%)" }}>
            <Caption
              cW={cW}
              label="Video"
              accent={THEME.amber}
              fg={THEME.ink}
              headline={
                <>
                  Cut and convert
                  <br />
                  inside your tab.
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "video")}
            alt="Video"
            style={{
              position: "absolute",
              right: "-3%",
              top: "50%",
              width: `${fw}%`,
              transform: "translateY(-50%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeTabLSlide5(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "trust-landscape",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(110deg, ${THEME.night} 0%, #0b0a08 100%)`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "50%", left: "5%", width: "36%", transform: "translateY(-50%)" }}>
            <Caption
              cW={cW}
              label="Privacy"
              accent={THEME.amber}
              fg={THEME.cream}
              headline={
                <>
                  No uploads.
                  <br />
                  No servers.
                  <br />
                  <span style={{ color: THEME.mutedLight }}>Just your chip.</span>
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "trust")}
            alt="Privacy"
            style={{
              position: "absolute",
              right: "-3%",
              top: "50%",
              width: `${fw}%`,
              transform: "translateY(-50%)",
            }}
          />
        </div>
      );
    },
  };
}

function makeTabLSlide6(PhoneComp: PhoneComp, widthFn: WidthFn, base: string): SlideDef {
  return {
    id: "more-landscape",
    component: ({ cW, cH }) => {
      const fw = widthFn(cW, cH) * 100;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: `linear-gradient(110deg, #fdfaf6 0%, ${THEME.cream} 100%)`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "50%", left: "5%", width: "34%", transform: "translateY(-50%)" }}>
            <Caption
              cW={cW}
              label="Extras"
              accent={THEME.amber}
              fg={THEME.ink}
              headline={
                <>
                  Extensions,
                  <br />
                  PDF tools,
                  <br />
                  and more.
                </>
              }
            />
          </div>
          <PhoneComp
            src={shot(base, "more")}
            alt="More"
            style={{
              position: "absolute",
              right: "-3%",
              top: "50%",
              width: `${fw}%`,
              transform: "translateY(-50%)",
            }}
          />
        </div>
      );
    },
  };
}

const IPHONE_SLIDES: SlideDef[] = [
  makeSlide1(Phone, phoneW, "screenshots/apple/iphone"),
  makeSlide2(Phone, phoneW, "screenshots/apple/iphone"),
  makeSlide3(Phone, phoneW, "screenshots/apple/iphone"),
  makeSlide4(Phone, phoneW, "screenshots/apple/iphone"),
  makeSlide5(Phone, phoneW, "screenshots/apple/iphone"),
  makeSlide6(Phone, phoneW, "screenshots/apple/iphone"),
];

const ANDROID_SLIDES: SlideDef[] = [
  makeSlide1(AndroidPhone, phoneW, "screenshots/android/phone"),
  makeSlide2(AndroidPhone, phoneW, "screenshots/android/phone"),
  makeSlide3(AndroidPhone, phoneW, "screenshots/android/phone"),
  makeSlide4(AndroidPhone, phoneW, "screenshots/android/phone"),
  makeSlide5(AndroidPhone, phoneW, "screenshots/android/phone"),
  makeSlide6(AndroidPhone, phoneW, "screenshots/android/phone"),
];

const ANDROID_7P_SLIDES: SlideDef[] = [
  makeSlide1(AndroidTabletP, tabletPW, "screenshots/android/tablet-7/portrait"),
  makeSlide2(AndroidTabletP, tabletPW, "screenshots/android/tablet-7/portrait"),
  makeSlide3(AndroidTabletP, tabletPW, "screenshots/android/tablet-7/portrait"),
  makeSlide4(AndroidTabletP, tabletPW, "screenshots/android/tablet-7/portrait"),
  makeSlide5(AndroidTabletP, tabletPW, "screenshots/android/tablet-7/portrait"),
  makeSlide6(AndroidTabletP, tabletPW, "screenshots/android/tablet-7/portrait"),
];

const ANDROID_7L_SLIDES: SlideDef[] = [
  makeTabLSlide1(AndroidTabletL, tabletLW, "screenshots/android/tablet-7/landscape"),
  makeTabLSlide2(AndroidTabletL, tabletLW, "screenshots/android/tablet-7/landscape"),
  makeTabLSlide3(AndroidTabletL, tabletLW, "screenshots/android/tablet-7/landscape"),
  makeTabLSlide4(AndroidTabletL, tabletLW, "screenshots/android/tablet-7/landscape"),
  makeTabLSlide5(AndroidTabletL, tabletLW, "screenshots/android/tablet-7/landscape"),
  makeTabLSlide6(AndroidTabletL, tabletLW, "screenshots/android/tablet-7/landscape"),
];

const ANDROID_10P_SLIDES: SlideDef[] = [
  makeSlide1(AndroidTabletP, tabletPW, "screenshots/android/tablet-10/portrait"),
  makeSlide2(AndroidTabletP, tabletPW, "screenshots/android/tablet-10/portrait"),
  makeSlide3(AndroidTabletP, tabletPW, "screenshots/android/tablet-10/portrait"),
  makeSlide4(AndroidTabletP, tabletPW, "screenshots/android/tablet-10/portrait"),
  makeSlide5(AndroidTabletP, tabletPW, "screenshots/android/tablet-10/portrait"),
  makeSlide6(AndroidTabletP, tabletPW, "screenshots/android/tablet-10/portrait"),
];

const ANDROID_10L_SLIDES: SlideDef[] = [
  makeTabLSlide1(AndroidTabletL, tabletLW, "screenshots/android/tablet-10/landscape"),
  makeTabLSlide2(AndroidTabletL, tabletLW, "screenshots/android/tablet-10/landscape"),
  makeTabLSlide3(AndroidTabletL, tabletLW, "screenshots/android/tablet-10/landscape"),
  makeTabLSlide4(AndroidTabletL, tabletLW, "screenshots/android/tablet-10/landscape"),
  makeTabLSlide5(AndroidTabletL, tabletLW, "screenshots/android/tablet-10/landscape"),
  makeTabLSlide6(AndroidTabletL, tabletLW, "screenshots/android/tablet-10/landscape"),
];

const IPAD_SLIDES: SlideDef[] = [
  makeSlide1(IPad, ipadW, "screenshots/apple/ipad"),
  makeSlide2(IPad, ipadW, "screenshots/apple/ipad"),
  makeSlide3(IPad, ipadW, "screenshots/apple/ipad"),
  makeSlide4(IPad, ipadW, "screenshots/apple/ipad"),
  makeSlide5(IPad, ipadW, "screenshots/apple/ipad"),
  makeSlide6(IPad, ipadW, "screenshots/apple/ipad"),
];

const FG_SLIDE: SlideDef = {
  id: "feature-graphic",
  component: ({ cW, cH }) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(125deg, ${THEME.night} 0%, #1a120c 45%, ${THEME.amber}55 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: Math.round(cW * 0.06),
        paddingRight: Math.round(cW * 0.06),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: Math.round(cW * 0.03) }}>
        <img
          src={img("/app-icon.svg")}
          alt=""
          width={Math.round(cW * 0.12)}
          height={Math.round(cW * 0.12)}
          style={{ borderRadius: Math.round(cW * 0.022) }}
          draggable={false}
        />
        <div>
          <div
            style={{
              fontSize: Math.round(cW * 0.05),
              fontWeight: 800,
              color: THEME.cream,
              lineHeight: 1.1,
            }}
          >
            Brewery
          </div>
          <div
            style={{
              fontSize: Math.round(cW * 0.025),
              color: "rgba(248,244,239,0.75)",
              marginTop: Math.round(cW * 0.008),
            }}
          >
            Brew your files — 100% local.
          </div>
        </div>
      </div>
      <div
        style={{
          width: Math.round(cW * 0.22),
          height: Math.round(cH * 0.5),
          borderRadius: Math.round(cW * 0.02),
          background: `${THEME.amber}33`,
          filter: "blur(2px)",
          boxShadow: `0 0 80px ${THEME.amber}66`,
        }}
      />
    </div>
  ),
};

async function captureSlide(el: HTMLElement, w: number, h: number): Promise<string> {
  el.style.left = "0px";
  el.style.opacity = "1";
  el.style.zIndex = "-1";

  const opts = { width: w, height: h, pixelRatio: 1, cacheBust: true } as const;
  await toPng(el, opts);
  const dataUrl = await toPng(el, opts);

  el.style.left = "-9999px";
  el.style.opacity = "";
  el.style.zIndex = "";
  return dataUrl;
}

function SlidePreviewCard({
  cW,
  cH,
  children,
}: {
  cW: number;
  cH: number;
  children: React.ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      const next = Math.min(cr.width / cW, cr.height / cH, 1);
      setScale(next || 0.2);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [cW, cH]);

  return (
    <div
      ref={host}
      style={{
        width: "100%",
        aspectRatio: `${cW} / ${cH}`,
        position: "relative",
        background: "#e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: cW,
          height: cH,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function StoreScreenshotsPage() {
  const [ready, setReady] = useState(false);
  const [device, setDevice] = useState<Device>("iphone");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [exporting, setExporting] = useState<string | null>(null);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    preloadAllImages().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isTablet = device === "android-7" || device === "android-10";

  const { cW, cH, currentSizes, slides } = useMemo(() => {
    if (device === "android-7") {
      return orientation === "landscape"
        ? { cW: AT7L_W, cH: AT7L_H, currentSizes: ANDROID_7L_SIZES, slides: ANDROID_7L_SLIDES }
        : { cW: AT7P_W, cH: AT7P_H, currentSizes: ANDROID_7P_SIZES, slides: ANDROID_7P_SLIDES };
    }
    if (device === "android-10") {
      return orientation === "landscape"
        ? { cW: AT10L_W, cH: AT10L_H, currentSizes: ANDROID_10L_SIZES, slides: ANDROID_10L_SLIDES }
        : { cW: AT10P_W, cH: AT10P_H, currentSizes: ANDROID_10P_SIZES, slides: ANDROID_10P_SLIDES };
    }
    if (device === "android") return { cW: AW, cH: AH, currentSizes: ANDROID_SIZES, slides: ANDROID_SLIDES };
    if (device === "ipad") return { cW: IPAD_W, cH: IPAD_H, currentSizes: IPAD_SIZES, slides: IPAD_SLIDES };
    if (device === "feature-graphic")
      return { cW: FGW, cH: FGH, currentSizes: FG_SIZES, slides: [FG_SLIDE] };
    return { cW: W, cH: H, currentSizes: IPHONE_SIZES, slides: IPHONE_SLIDES };
  }, [device, orientation]);

  const exportAll = useCallback(async () => {
    const size = currentSizes[sizeIdx];
    if (!size) return;
    for (let i = 0; i < slides.length; i++) {
      setExporting(`${i + 1}/${slides.length}`);
      const el = exportRefs.current[i];
      if (!el) continue;
      const dataUrl = await captureSlide(el, size.w, size.h);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${String(i + 1).padStart(2, "0")}-${slides[i].id}-en-${size.w}x${size.h}.png`;
      a.click();
      await new Promise((r) => setTimeout(r, 300));
    }
    setExporting(null);
  }, [currentSizes, sizeIdx, slides]);

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "var(--font-sans-ui)" }}>
        Loading assets…
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        position: "relative",
        overflowX: "hidden",
        fontFamily: "var(--font-sans-ui), system-ui, sans-serif",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            overflowX: "auto",
            minWidth: 0,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>Brewery · Store shots</span>

          <div style={{ display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 8, padding: 4, flexShrink: 0 }}>
            {(["iphone", "android", "ipad", "feature-graphic"] as Device[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDevice(d);
                  setSizeIdx(0);
                }}
                style={{
                  padding: "4px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  background: device === d ? "#fff" : "transparent",
                  color: device === d ? "#2563eb" : "#6b7280",
                }}
              >
                {d === "iphone" ? "iPhone" : d === "android" ? "Android" : d === "ipad" ? "iPad" : "Feature Graphic"}
              </button>
            ))}
            <select
              value={isTablet ? device : ""}
              onChange={(e) => {
                const v = e.target.value as Device;
                if (v) {
                  setDevice(v);
                  setSizeIdx(0);
                }
              }}
              style={{
                fontSize: 12,
                border: "none",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
                background: isTablet ? "#fff" : "transparent",
                color: isTablet ? "#2563eb" : "#6b7280",
              }}
            >
              <option value="" disabled>
                Android Tab.
              </option>
              <option value="android-7">Android 7&quot;</option>
              <option value="android-10">Android 10&quot;</option>
            </select>
          </div>

          {isTablet && (
            <div style={{ display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 8, padding: 4, flexShrink: 0 }}>
              {(["portrait", "landscape"] as Orientation[]).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    setOrientation(o);
                    setSizeIdx(0);
                  }}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    background: orientation === o ? "#fff" : "transparent",
                    color: orientation === o ? "#2563eb" : "#6b7280",
                  }}
                >
                  {o === "portrait" ? "Portrait ↕" : "Landscape ↔"}
                </button>
              ))}
            </div>
          )}

          {device !== "feature-graphic" && (
            <select
              value={sizeIdx}
              onChange={(e) => setSizeIdx(Number(e.target.value))}
              style={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 10px" }}
            >
              {currentSizes.map((s, i) => (
                <option key={s.label} value={i}>
                  {s.label} — {s.w}×{s.h}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={{ flexShrink: 0, padding: "10px 16px", borderLeft: "1px solid #e5e7eb" }}>
          <button
            type="button"
            onClick={exportAll}
            disabled={!!exporting}
            style={{
              padding: "7px 20px",
              background: exporting ? "#93c5fd" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: exporting ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {exporting ? `Exporting… ${exporting}` : "Export All"}
          </button>
        </div>
      </div>

      <div
        style={{
          padding: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {slides.map((slide, i) => (
          <SlidePreviewCard key={slide.id} cW={cW} cH={cH}>
            <slide.component cW={cW} cH={cH} />
          </SlidePreviewCard>
        ))}
      </div>

      <div style={{ position: "absolute", left: -9999, top: 0, width: cW, pointerEvents: "none" }}>
        {slides.map((slide, i) => (
          <div
            key={`export-${slide.id}`}
            ref={(el) => {
              exportRefs.current[i] = el;
            }}
            style={{ width: cW, height: cH, position: "absolute", top: i * (cH + 40), left: 0 }}
          >
            <slide.component cW={cW} cH={cH} />
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 24px 32px",
          fontSize: 13,
          color: "#6b7280",
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: "0 0 12px", fontWeight: 600, color: "#374151" }}>What you actually need to do</p>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>Right now:</strong> open this page, pick a device tab, click <strong>Export All</strong>. You get PNGs for
            the store. The images inside the frames load as <code style={{ fontSize: 12 }}>.png</code> from{" "}
            <code style={{ fontSize: 12 }}>public/screenshots/…</code> (replace with your own captures as needed).
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Before you submit to Apple/Google:</strong> swap in <strong>real PNG screenshots</strong> of{" "}
            <strong>https://brewery.phx.cx</strong> (Safari on your iPhone, or Simulator). Keep the same basenames:{" "}
            <code style={{ fontSize: 12 }}>home</code>, <code style={{ fontSize: 12 }}>brew</code>,{" "}
            <code style={{ fontSize: 12 }}>formats</code>, <code style={{ fontSize: 12 }}>video</code>,{" "}
            <code style={{ fontSize: 12 }}>trust</code>, <code style={{ fontSize: 12 }}>more</code>. For vector placeholders
            instead, set <code style={{ fontSize: 12 }}>SCREENSHOT_EXT</code> to <code style={{ fontSize: 12 }}>&quot;.svg&quot;</code>.
          </li>
          <li>
            Each slide’s headline is marketing copy on top; the PNG is only what appears <em>inside</em> the device frame.
            Match each PNG to the story (e.g. <code style={{ fontSize: 12 }}>home</code> = main hero / bar counter).
          </li>
        </ol>
      </div>
    </div>
  );
}
