import { TICKER_ITEMS } from "@/lib/data";

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full overflow-hidden py-4 border-y border-hairline bg-[var(--canvas-parchment)] backdrop-blur-md">
      <div className="ticker-wrap">
        <div className="ticker-track">
          {items.map((item, i) => (
            <span key={i} className="t-item font-label-code text-xs uppercase tracking-widest text-ink-muted-48 px-6">
              <span className="text-primary mr-3">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
