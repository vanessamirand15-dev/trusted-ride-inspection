import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import statesTopo from "us-atlas/states-10m.json";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { COVERAGE_REGIONS } from "@/lib/coverage";
import { Button } from "@/components/ui/button";

const W = 975;
const H = 610;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = statesTopo as any;
const states = feature(topo, topo.objects.states) as unknown as GeoJSON.FeatureCollection;
const borders = mesh(topo, topo.objects.states, (a: unknown, b: unknown) => a !== b);
const projection = geoAlbersUsa().fitSize([W, H], states);
const path = geoPath(projection);
const statePaths = states.features.map((f, i) => ({ id: String(f.id ?? i), name: String((f.properties as { name?: string } | null)?.name ?? ""), d: path(f) ?? "" }));
const borderPath = path(borders) ?? "";

const PIN_COORDS: Record<string, [number, number]> = {
  Northeast: [-74.0, 40.7],
  Southeast: [-84.4, 33.7],
  Midwest: [-87.6, 41.9],
  "South Central": [-96.8, 32.8],
  "Mountain West": [-104.99, 39.74],
  "West Coast": [-122.4, 37.77],
};

export function UsCoverageMap({ active, onSelect }: { active: string; onSelect: (name: string) => void }) {
  const [state, setState] = useState<string | null>(null);
  return (
    <div>
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Map of the United States, all states covered">
        {statePaths.map(s => (
          <path
            key={s.id}
            d={s.d}
            role="button"
            tabIndex={0}
            aria-label={`${s.name}: view coverage`}
            onClick={() => setState(s.name)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setState(s.name); } }}
            className={`cursor-pointer outline-none transition-colors hover:fill-accent/50 focus-visible:fill-accent/50 ${state === s.name ? "fill-accent/70" : "fill-accent/25"}`}
          >
            <title>{s.name}</title>
          </path>
        ))}
        <path d={borderPath} fill="none" className="stroke-card" strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
      {COVERAGE_REGIONS.map(r => {
        const p = projection(PIN_COORDS[r.name] ?? [-98, 39]);
        if (!p) return null;
        const on = active === r.name;
        return (
          <button
            key={r.name}
            type="button"
            onClick={() => onSelect(r.name)}
            aria-pressed={on}
            aria-label={r.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(p[0] / W) * 100}%`, top: `${(p[1] / H) * 100}%` }}
          >
            <span className={`block rounded-full border-2 border-accent/50 bg-accent/20 transition-all ${on ? "h-12 w-12" : "h-7 w-7"}`} />
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-card" />
            {on && (
              <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-card px-2 py-0.5 text-xs font-medium shadow-soft">{r.name}</span>
            )}
          </button>
        );
      })}
    </div>
    <div className="mt-3 rounded-xl border bg-card p-4" aria-live="polite">
      {state ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-accent" />{state}: active coverage</p>
            <p className="mt-1 text-sm text-muted-foreground">Verified inspectors serve every ZIP code in {state}.</p>
          </div>
          <Button asChild><Link to="/book">Request an inspection in {state}<ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Click any state to see its service coverage.</p>
      )}
    </div>
    </div>
  );
}
