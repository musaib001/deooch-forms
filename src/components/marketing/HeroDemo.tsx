"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUp, Check, Link2, LoaderCircle, Star, Zap } from "lucide-react";

/**
 * The hero's proof-of-product: a looping, self-narrating scene of someone
 * asking their AI assistant for a form and watching it get built, published,
 * and answered.
 *
 * Two constraints shaped the implementation:
 *
 *  1. Every element is rendered from the first frame and only its opacity /
 *     transform changes, so the box never reflows and the page below it never
 *     shifts. That includes the typed prompt, whose untyped tail is rendered
 *     invisible rather than absent.
 *  2. Everything is a pure function of one elapsed-time value, so there is a
 *     single timer and no per-element state that can fall out of sync.
 */

const PROMPT = "@deoochform create a customer feedback form";
const MENTION = "@deoochform".length;

const TICK = 50;
const MS_PER_CHAR = 40;

// Beat sheet, in ms from the start of the loop.
const TYPE_START = 400;
const TYPE_END = TYPE_START + PROMPT.length * MS_PER_CHAR;
const SEND = TYPE_END + 350;
const TOOL_CALL = SEND + 400;
const FIELD_AT = [TOOL_CALL + 900, TOOL_CALL + 1300, TOOL_CALL + 1700];
const TOOL_DONE = TOOL_CALL + 2200;
const PUBLISH = TOOL_DONE + 300;
const ROW_AT = [PUBLISH + 700, PUBLISH + 1100, PUBLISH + 1500];
const LOOP = ROW_AT[2] + 2800;

const FIELDS = [
  { label: "How would you rate us?", kind: "rating" },
  { label: "Email address", kind: "email" },
  { label: "What could we improve?", kind: "textarea" },
] as const;

const ROWS = [
  { who: "amelia@northwind.co", rating: 5 },
  { who: "raj@lumenlabs.io", rating: 4 },
  { who: "s.okafor@fieldkit.dev", rating: 5 },
];

/** Fade-and-rise, or nothing at all under reduced motion (handled globally). */
function reveal(shown: boolean) {
  return shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2";
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function HeroDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  // Read through useSyncExternalStore rather than an effect so the server
  // renders the animated-from-zero frame and the client can correct itself
  // without a setState-in-effect round trip.
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );

  useEffect(() => {
    const node = ref.current;
    // Nobody benefits from a timer running against a scene they can't see, and
    // reduced-motion users get the finished frame instead of the performance.
    if (!node || reduced) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      timer ??= setInterval(
        () => setT((prev) => (prev > LOOP ? 0 : prev + TICK)),
        TICK,
      );
    };
    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.15 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [reduced]);

  // One clock. Reduced motion pins it to the last frame of the loop.
  const now = reduced ? LOOP - 1 : t;

  const typed = Math.max(
    0,
    Math.min(PROMPT.length, Math.floor((now - TYPE_START) / MS_PER_CHAR)),
  );
  const sent = now >= SEND;
  const calling = now >= TOOL_CALL;
  const built = now >= TOOL_DONE;
  const published = now >= PUBLISH;
  const responses = ROW_AT.filter((at) => now >= at).length;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated demo: a prompt in an AI assistant creates a customer feedback form in Deooch Forms, publishes a share link, and collects responses."
      className="relative w-full max-w-xl rounded-2xl border border-ink-border bg-ink-raised/70 shadow-2xl backdrop-blur-sm"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-ink-border px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1.5 text-xs font-medium text-ink-muted">
          Your AI assistant
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ink-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          MCP
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* The prompt, typed into a composer that becomes a sent message. */}
        <div
          className={`ml-auto flex max-w-[92%] items-end gap-2 rounded-2xl rounded-br-md border px-3.5 py-2.5 text-[13px] leading-snug transition-[background-color,border-color] duration-200 ease-out ${
            sent
              ? "border-transparent bg-brand text-brand-foreground"
              : "border-ink-border bg-ink text-ink-foreground"
          }`}
        >
          <span>
            <span
              className={
                sent ? "font-semibold" : "font-semibold text-brand-on-ink"
              }
            >
              {PROMPT.slice(0, Math.min(typed, MENTION))}
            </span>
            {PROMPT.slice(MENTION, typed)}
            <span
              className={`inline-block w-[2px] translate-y-[2px] self-center bg-current ${
                typed > 0 && !sent ? "animate-caret" : "opacity-0"
              }`}
              // Matches the line box so the caret never changes the bubble's height.
              style={{ height: "1em" }}
            />
            {/* Invisible tail reserves the final size from frame one. */}
            <span className="opacity-0" aria-hidden>
              {PROMPT.slice(typed)}
            </span>
          </span>
          <ArrowUp
            aria-hidden
            className={`h-4 w-4 shrink-0 transition-opacity duration-150 ${
              sent ? "opacity-0" : "opacity-60"
            }`}
          />
        </div>

        {/* Tool call */}
        <div
          className={`flex items-center gap-2 self-start rounded-lg border border-ink-border bg-ink px-3 py-2 transition-[opacity,transform] duration-300 ease-out ${reveal(
            calling,
          )}`}
        >
          {built ? (
            <Check aria-hidden className="h-3.5 w-3.5 text-success" />
          ) : (
            <LoaderCircle
              aria-hidden
              className="h-3.5 w-3.5 animate-spin text-brand-on-ink"
            />
          )}
          <span className="font-mono text-[11px] text-ink-foreground">
            create_form
          </span>
          <span className="text-[11px] text-ink-muted">
            {built ? "3 fields added" : "running…"}
          </span>
        </div>

        {/* The form it built. Light card on the dark band: this is the product. */}
        <div
          className={`rounded-xl border border-border bg-card p-4 shadow-lg transition-[opacity,transform] duration-300 ease-out ${reveal(
            calling,
          )}`}
        >
          <p className="text-[13px] font-bold text-foreground">
            Customer feedback
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {FIELDS.map((field, i) => (
              <div
                key={field.label}
                className={`transition-[opacity,transform] duration-300 ease-out ${reveal(
                  now >= FIELD_AT[i],
                )}`}
              >
                <p className="text-[11px] font-semibold text-muted-foreground">
                  {field.label}
                </p>
                {field.kind === "rating" ? (
                  <span className="mt-1.5 flex gap-1">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <Star
                        key={n}
                        aria-hidden
                        className="h-4 w-4 fill-brand text-brand"
                      />
                    ))}
                  </span>
                ) : (
                  <span
                    className={`mt-1.5 block w-full rounded-md border border-input bg-muted ${
                      field.kind === "textarea" ? "h-9" : "h-7"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Published link */}
        <div
          className={`flex items-center gap-2 rounded-lg border border-ink-border bg-ink px-3 py-2 transition-[opacity,transform] duration-300 ease-out ${reveal(
            published,
          )}`}
        >
          <Link2 aria-hidden className="h-3.5 w-3.5 text-brand-on-ink" />
          <span className="truncate font-mono text-[11px] text-ink-foreground">
            forms.deooch.com/f/kx9r2
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-success">
            <Check aria-hidden className="h-3 w-3" />
            Live
          </span>
        </div>

        {/* Responses landing */}
        <div
          className={`rounded-lg border border-ink-border bg-ink transition-[opacity,transform] duration-300 ease-out ${reveal(
            responses > 0,
          )}`}
        >
          <div className="flex items-center gap-2 border-b border-ink-border px-3 py-2">
            <Zap aria-hidden className="h-3.5 w-3.5 text-brand-on-ink" />
            <span className="text-[11px] font-semibold text-ink-foreground">
              Responses
            </span>
            <span className="ml-auto font-mono text-[11px] tabular-nums text-ink-muted">
              {responses} new
            </span>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={row.who}
              className={`flex items-center gap-2 px-3 py-1.5 transition-[opacity,transform] duration-300 ease-out ${reveal(
                now >= ROW_AT[i],
              )}`}
            >
              <span className="truncate text-[11px] text-ink-muted">
                {row.who}
              </span>
              <span className="ml-auto flex shrink-0 gap-0.5">
                {Array.from({ length: row.rating }, (_, n) => (
                  <Star
                    key={n}
                    aria-hidden
                    className="h-2.5 w-2.5 fill-brand-on-ink text-brand-on-ink"
                  />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
