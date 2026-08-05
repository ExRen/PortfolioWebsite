import { TICKER_ITEMS } from "@/lib/data";

export function Ticker() {
  // Duplicate items so the translate3d(-50%) animation loops seamlessly
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} className="t-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
