import Link from "next/link";
import { BarCounter } from "@/components/BarCounter/BarCounter";
import { WasmPreloader } from "@/components/WasmPreloader";
import { getBrewsForCategory } from "@/lib/brews";

export default function Home() {
  const textBrews = getBrewsForCategory("text");
  const imageBrews = getBrewsForCategory("image");
  const audioBrews = getBrewsForCategory("audio");
  const videoBrews = getBrewsForCategory("video");

  return (
    <main className="flex min-h-[calc(100vh-6rem)] flex-col items-center w-full px-4">
      <WasmPreloader />
      
      <header className="flex flex-col items-center text-center mt-12 mb-16 max-w-3xl">
        <h1 
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-[#111111] leading-[1.1] pb-2" 
          style={{ fontFamily: "var(--font-sans-ui)" }}
        >
          File conversion,
          <br className="hidden sm:block" />
          <span className="text-[var(--text-secondary)] font-medium">straight from the tap.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg sm:text-xl leading-relaxed text-[var(--text-secondary)] font-normal tracking-tight">
          Everything is brewed 100% locally on your device. Absolutely no data leaves your browser.
        </p>

        <div className="mt-10 w-full max-w-xl text-left">
          <label
            htmlFor="conversion-menu"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]"
            style={{ fontFamily: "var(--font-sans-ui)" }}
          >
            Menu (everything we can convert)
          </label>
          <select
            id="conversion-menu"
            defaultValue=""
            className="w-full rounded-2xl border border-[var(--border-subtle)] bg-white/70 px-4 py-3 text-sm text-[#111111] shadow-sm backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-amber)]"
            style={{ fontFamily: "var(--font-sans-ui)" }}
          >
            <option value="" disabled>
              Pick a recipe to see what’s in stock…
            </option>
            <optgroup label="Text / Data">
              {textBrews.map((b) => (
                <option key={b.id} value={b.id}>
                  {(b.acceptsExtensions?.join(", ") ?? "text")} → {b.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Images">
              {imageBrews.map((b) => (
                <option key={b.id} value={b.id}>
                  image → {b.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Audio">
              {audioBrews.map((b) => (
                <option key={b.id} value={b.id}>
                  audio → {b.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Video">
              {videoBrews.map((b) => (
                <option key={b.id} value={b.id}>
                  video → {b.label}
                </option>
              ))}
            </optgroup>
          </select>
          <p
            className="mt-2 text-xs text-[var(--text-secondary)]/80"
            style={{ fontFamily: "var(--font-sans-ui)" }}
          >
            This is the full menu. Upload a file below to see only the recipes that match your ingredient.
          </p>
        </div>
      </header>

      <div className="w-full max-w-4xl flex flex-col pt-4 pb-12 z-10">
        <BarCounter />
      </div>

      <footer className="mt-auto pt-12 text-center z-10 w-full mb-8">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium"
          aria-label="Footer links"
        >
          <Link
            href="/privacy"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-amber)]"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-amber)]"
          >
            Terms
          </Link>
          <a
            href="https://github.com/damonphoenix/brewery/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-amber)]"
          >
            ew, bugs?
          </a>
        </nav>
      </footer>
    </main>
  );
}
