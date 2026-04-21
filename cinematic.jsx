/* global React, ReactDOM, d3, topojson */
// ============================================================
// AsgardSequence (JSX mirror of components/cinematic/AsgardSequence.tsx)
//
// A 36-second cinematic cover for Asgard Aerospace Europe. Acts as
// a preload / splash that plays once before minimising to reveal the
// site. Tells the full system story — origin → routing → specialty
// contribution → Forge integration → delivery → empowerment — across
// a projected Europe map.
//
//   Scene 1  (0 – 4s)   Fragmented state
//   Scene 2  (4 – 8s)   Program intake · Amsterdam
//   Scene 3  (8 – 20s)  Every region contributes what it does best
//   Scene 4  (20 – 26s) Flows integrate at the Forge
//   Scene 5  (26 – 30s) Certified · Routed · Delivered
//   Scene 6  (30 – 36s) Continental execution layer · brand
// ============================================================

const { useState, useEffect, useRef, useMemo } = React;

const CIN_VIEW_W = 1000;
const CIN_VIEW_H = 900;
const CIN_DURATION = 36;

const CIN_SCENES = [
  { id: 1, start: 0,  end: 4,  title: "Europe has capability. It lacks coordination.",           eyebrow: "STATE · FRAGMENTED" },
  { id: 2, start: 4,  end: 8,  title: "A program enters the network.",                            eyebrow: "INTAKE · AMSTERDAM" },
  { id: 3, start: 8,  end: 20, title: "Every region contributes what it does best.",              eyebrow: "ROUTING · SPECIALTY" },
  { id: 4, start: 20, end: 26, title: "Flows integrate at the Forge.",                            eyebrow: "INTEGRATION · CERTIFICATION" },
  { id: 5, start: 26, end: 30, title: "Certified. Routed. Delivered.",                            eyebrow: "DELIVERY · CONTINENTAL" },
  { id: 6, start: 30, end: 36, title: "A continental manufacturing infrastructure layer.",        eyebrow: "ASGARD AEROSPACE · EUROPE" },
];

// The program enters Europe here. Distinct from the network nodes —
// it's the front door of the system, not an integration point.
const CIN_ORIGIN = { lon: 4.90, lat: 52.37, label: "AMSTERDAM", sub: "PROGRAM INTAKE" };

// Field delivery endpoints. Not infrastructure nodes — these are the
// customers, bases, and programs the network delivers into. They
// appear briefly during Scene 5 to dramatise continental reach.
const CIN_DELIVERIES = [
  { lon:  2.35, lat: 48.85, label: "PARIS" },
  { lon: 13.40, lat: 52.52, label: "BERLIN" },
  { lon: 12.48, lat: 41.90, label: "ROME"  },
];

// Network nodes with city + specialty. Same lattice as the site map;
// city names anchor the story in real geography.
const CIN_NODES = [
  { id: "AAE-N01", name: "Iberian Anchor",    role: "candidate", lon:  2.17, lat: 41.39, city: "Barcelona", specialty: "Composites · Integration",    tagDir: "SE" },
  { id: "AAE-N02", name: "Northern Iberia",   role: "forge",     lon: -2.68, lat: 43.26, city: "Bilbao",    specialty: "Heavy Metals · Forging",      tagDir: "W"  },
  { id: "AAE-N03", name: "Southern France",   role: "forge",     lon:  1.44, lat: 43.60, city: "Toulouse",  specialty: "Final Assembly",              tagDir: "S"  },
  { id: "AAE-N04", name: "Northern Corridor", role: "forge",     lon:  4.35, lat: 50.85, city: "Brussels",  specialty: "Avionics · Systems",          tagDir: "W"  },
  { id: "AAE-N05", name: "Central Corridor",  role: "planned",   lon:  6.96, lat: 51.23, city: "Ruhr",      specialty: "Precision Machining",         tagDir: "E"  },
  { id: "AAE-N06", name: "Southern Corridor", role: "planned",   lon:  9.19, lat: 45.46, city: "Milan",     specialty: "Engines",                     tagDir: "SE" },
  { id: "AAE-N07", name: "Alpine Corridor",   role: "planned",   lon: 11.58, lat: 48.14, city: "Munich",    specialty: "Aerospace Electronics",       tagDir: "NE" },
  { id: "AAE-N08", name: "Eastern Corridor",  role: "planned",   lon: 18.92, lat: 50.26, city: "Kraków",    specialty: "Fabrication",                 tagDir: "E"  },
  { id: "AAE-N09", name: "Atlantic Edge",     role: "planned",   lon: -9.14, lat: 38.72, city: "Lisbon",    specialty: "MRO · Test",                  tagDir: "SW" },
  { id: "AAE-N10", name: "Nordic Edge",       role: "planned",   lon: 18.06, lat: 59.33, city: "Stockholm", specialty: "Defense Electronics",         tagDir: "E"  },
];

// Network edges — routing topology that stabilises by scene 6.
const CIN_EDGES = [
  [0, 1], [0, 2], [1, 2], [2, 3], [1, 3], [0, 3],
  [3, 4], [3, 6], [4, 7], [2, 5], [0, 8],
  [6, 5], [4, 9], [7, 8], [5, 6],
];

// Indices of Forges (integration + certification authority).
const CIN_FORGE_INDICES = CIN_NODES
  .map((n, i) => (n.role === "candidate" || n.role === "forge" ? i : -1))
  .filter(i => i >= 0);

// Activation order for scene 3 — radiate outward from Amsterdam by
// great-circle distance, so the cascade reads as a continental sweep.
const CIN_ACTIVATION_ORDER = (() => {
  const d2 = (n) => (n.lon - CIN_ORIGIN.lon) ** 2 + (n.lat - CIN_ORIGIN.lat) ** 2;
  const sorted = CIN_NODES.map((_, i) => i).sort((a, b) => d2(CIN_NODES[a]) - d2(CIN_NODES[b]));
  const order = [];
  sorted.forEach((idx, slot) => { order[idx] = slot; });
  return order;
})();

// Inverse lookup — "slot N → node index."
const CIN_ORDER_BY_SLOT = CIN_NODES.map((_, i) => i)
  .sort((a, b) => CIN_ACTIVATION_ORDER[a] - CIN_ACTIVATION_ORDER[b]);

function cinFeederPoints(cx, cy, seed, count) {
  const out = [];
  for (let k = 0; k < count; k++) {
    const a = ((seed * 37 + k * 83) % 360) * (Math.PI / 180);
    const r = 70 + ((seed * 13 + k * 41) % 60);
    out.push({
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r * 0.75,
      phase: (k * 0.37) % 1,
    });
  }
  return out;
}

// 8-way directional offset for inline node tags.
function cinTagOffset(dir, r) {
  const m = {
    N:  [ 0, -1],  NE: [ 0.8, -0.6], E:  [ 1,  0], SE: [ 0.8,  0.6],
    S:  [ 0,  1],  SW: [-0.8,  0.6], W:  [-1,  0], NW: [-0.8, -0.6],
  };
  const [mx, my] = m[dir] || m.E;
  return [mx * r, my * r];
}

let _cinGeoPromise = null;
function cinLoadGeo() {
  if (_cinGeoPromise) return _cinGeoPromise;
  _cinGeoPromise = fetch("https://unpkg.com/world-atlas@2.0.2/countries-50m.json")
    .then(r => r.json())
    .then(topo => ({
      countries: topojson.feature(topo, topo.objects.countries),
      coastline: topojson.mesh(topo, topo.objects.countries, (a, b) => a === b),
      borders:   topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b),
    }))
    .catch(e => { _cinGeoPromise = null; throw e; });
  return _cinGeoPromise;
}

function cinEaseOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function cinEaseInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function cinEaseInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2; }
function cinRange(a, b, s) { const o = []; for (let v = a; v <= b; v += s) o.push(v); return o; }
function cinClamp01(t) { return Math.max(0, Math.min(1, t)); }

function AsgardSequence({
  autoPlay = true,
  loop = true,
  className,
  brandMarkSrc,
  onComplete,
  onSkip,
  fill = false,
  startElapsed = 0,
}) {
  const [geo, setGeo] = useState(null);
  const [elapsed, setElapsed] = useState(startElapsed);
  const [playing, setPlaying] = useState(autoPlay);

  const rafRef = useRef(null);
  const lastTickRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    cinLoadGeo().then(g => { if (alive) setGeo(g); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const tick = (t) => {
      if (lastTickRef.current == null) lastTickRef.current = t;
      const dt = (t - lastTickRef.current) / 1000;
      lastTickRef.current = t;
      setElapsed(prev => {
        const next = prev + dt;
        if (next >= CIN_DURATION) {
          if (!completedRef.current) {
            completedRef.current = true;
            if (onComplete) setTimeout(onComplete, 0);
          }
          if (loop) { completedRef.current = false; return 0; }
          setPlaying(false);
          return CIN_DURATION;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = null;
    };
  }, [playing, loop, onComplete]);

  const projection = useMemo(() => (
    d3.geoConicConformal()
      .rotate([-10, 0])
      .center([0, 52])
      .parallels([40, 60])
      .scale(950)
      .translate([CIN_VIEW_W / 2, CIN_VIEW_H / 2 + 30])
      .precision(0.3)
  ), []);

  const pathGen = useMemo(() => d3.geoPath(projection), [projection]);

  const nodesProj = useMemo(() => CIN_NODES.map(n => {
    const p = projection([n.lon, n.lat]) || [0, 0];
    return { ...n, x: p[0], y: p[1] };
  }), [projection]);

  const originProj = useMemo(() => {
    const p = projection([CIN_ORIGIN.lon, CIN_ORIGIN.lat]) || [0, 0];
    return { ...CIN_ORIGIN, x: p[0], y: p[1] };
  }, [projection]);

  const deliveriesProj = useMemo(() => CIN_DELIVERIES.map(d => {
    const p = projection([d.lon, d.lat]) || [0, 0];
    return { ...d, x: p[0], y: p[1] };
  }), [projection]);

  const currentScene = CIN_SCENES.find(s => elapsed >= s.start && elapsed < s.end) || CIN_SCENES[CIN_SCENES.length - 1];

  // Per-node activation 0..1+. Drives opacity, core radius, and ring pulse.
  function nodeActivation(i) {
    const n = nodesProj[i];
    const isForge = n.role === "candidate" || n.role === "forge";

    if (elapsed < 4) {
      // Scene 1 — uniformly dim, "capability without coordination."
      return 0.15;
    }
    if (elapsed < 8) {
      // Scene 2 — intake pulse arriving; nodes still mostly dim.
      // First Forge (N04 Brussels, closest to Amsterdam) begins to
      // stir at the end of scene 2.
      if (i === 3) return 0.15 + 0.25 * cinClamp01((elapsed - 7) / 1);
      return 0.15;
    }
    if (elapsed < 20) {
      // Scene 3 — radial cascade from Amsterdam.
      const slot = CIN_ACTIVATION_ORDER[i];
      const activateAt = 8 + slot * 1.15;
      const t = (elapsed - activateAt) / 1.2;
      return 0.15 + 0.85 * cinClamp01(t);
    }
    if (elapsed < 26) {
      // Scene 4 — Forges pulse warmer; secondary nodes dim slightly so
      // the convergence reads clearly.
      if (isForge) return 1 + 0.18 * Math.sin((elapsed - 20) * 2.2);
      return 0.72;
    }
    if (elapsed < 30) {
      // Scene 5 — delivery. Forges hold full brightness; others steady.
      return isForge ? 1 : 0.8;
    }
    // Scene 6 — full, stable continental lattice.
    return 1;
  }

  function edgeOpacity(a, b) {
    if (elapsed < 8) return 0;
    const w = Math.min(nodeActivation(a), nodeActivation(b));
    const base = Math.max(0, (w - 0.2) / 0.8);
    if (elapsed < 26) return base * 0.55;
    if (elapsed < 30) return base * 0.65;
    return 0.75;
  }

  // Scene 2 intake pulse: off-screen → Amsterdam over 2.5s.
  const intakeT = elapsed >= 4 && elapsed < 8 ? cinClamp01((elapsed - 4.5) / 2.5) : -1;
  const intakeStart = { x: -90, y: originProj.y - 40 };
  const intake = intakeT >= 0 ? {
    x: intakeStart.x + (originProj.x - intakeStart.x) * cinEaseOutCubic(intakeT),
    y: intakeStart.y + (originProj.y - intakeStart.y) * cinEaseOutCubic(intakeT),
    opacity: intakeT < 0.92 ? 1 : Math.max(0, 1 - (intakeT - 0.92) / 0.08),
  } : null;

  // Amsterdam origin marker visibility — appears at scene 2 intake,
  // persists subtly through the rest of the sequence.
  const originOn = elapsed >= 4.3 ? cinClamp01((elapsed - 4.3) / 0.6) : 0;
  const originPulse = elapsed >= 5.5 && elapsed < 20
    ? 0.5 + 0.5 * Math.sin((elapsed - 5.5) * 3.2) : 0;

  // Scene 3 routing pulses — from Amsterdam to each node in staggered order.
  function scene3RoutePulse(nodeIdx) {
    if (elapsed < 8 || elapsed >= 20) return null;
    const slot = CIN_ACTIVATION_ORDER[nodeIdx];
    const start = 8 + slot * 1.15;
    const dur = 1.2;
    const localT = (elapsed - start) / dur;
    if (localT < 0 || localT > 1) return null;
    const n = nodesProj[nodeIdx];
    const ease = cinEaseInOutCubic(localT);
    return {
      x: originProj.x + (n.x - originProj.x) * ease,
      y: originProj.y + (n.y - originProj.y) * ease,
      opacity: localT < 0.15 ? localT / 0.15 : localT > 0.85 ? (1 - localT) / 0.15 : 1,
    };
  }

  // Scene 4 Forge convergence feeders (gold).
  const convergeT = elapsed >= 20 && elapsed < 26 ? (elapsed - 20) / 6 : -1;

  // Scene 5 delivery pulses — from the geographic centroid of the
  // Forge cluster to each delivery endpoint. Staggered by 0.6s.
  function scene5DeliveryPulse(deliveryIdx) {
    if (elapsed < 26 || elapsed >= 30) return null;
    const start = 26 + deliveryIdx * 0.5;
    const dur = 2.2;
    const localT = (elapsed - start) / dur;
    if (localT < 0 || localT > 1) return null;
    const forgePts = CIN_FORGE_INDICES.map(i => nodesProj[i]);
    const cx = forgePts.reduce((s, p) => s + p.x, 0) / forgePts.length;
    const cy = forgePts.reduce((s, p) => s + p.y, 0) / forgePts.length;
    const tgt = deliveriesProj[deliveryIdx];
    const ease = cinEaseInOutCubic(localT);
    return {
      from: { x: cx, y: cy },
      pos:  { x: cx + (tgt.x - cx) * ease, y: cy + (tgt.y - cy) * ease },
      to:   { x: tgt.x, y: tgt.y },
      opacity: localT < 0.1 ? localT / 0.1 : localT > 0.9 ? (1 - localT) / 0.1 : 1,
      arrived: localT > 0.8,
    };
  }

  // Scene 6 brand reveal: 0 → 1 across 30–32s, stable thereafter.
  const brandT = elapsed >= 30 ? cinClamp01((elapsed - 30) / 1.6) : 0;

  // Scene 3 rotating callout: index of the node whose specialty is
  // currently on screen. Uses the slot-order lookup.
  const calloutIdx = (() => {
    if (elapsed < 8 || elapsed >= 20) return -1;
    const slot = Math.min(CIN_NODES.length - 1, Math.floor((elapsed - 8) / 1.15));
    return CIN_ORDER_BY_SLOT[slot];
  })();

  // Specialty tag opacity per node. Tags appear as the node ignites,
  // hold through scene 4, fade out during scene 5.
  function tagOpacity(i) {
    if (elapsed < 8) return 0;
    const slot = CIN_ACTIVATION_ORDER[i];
    const appearAt = 8 + slot * 1.15 + 0.8;
    if (elapsed < appearAt) return 0;
    if (elapsed < 26) return cinClamp01((elapsed - appearAt) / 0.6);
    if (elapsed < 28) return 1 - cinClamp01((elapsed - 26) / 2);
    return 0;
  }

  // Count currently lit nodes (for HUD).
  const countLit = (
    elapsed < 4 ? 0 :
    elapsed < 8 ? 0 :
    elapsed < 20 ? Math.min(CIN_NODES.length, Math.floor((elapsed - 8) / 1.15) + 1) :
    CIN_NODES.length
  );

  // ── Render ─────────────────────────────────────────────────────

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: fill ? "100%" : undefined,
        aspectRatio: fill ? undefined : `${CIN_VIEW_W} / ${CIN_VIEW_H}`,
        background: "oklch(8% 0.010 250)",
        overflow: "hidden",
        fontFamily: "var(--f-body, system-ui, sans-serif)",
      }}
    >
      <svg
        viewBox={`0 0 ${CIN_VIEW_W} ${CIN_VIEW_H}`}
        preserveAspectRatio={fill ? "xMidYMid slice" : "xMidYMid meet"}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <radialGradient id="cin-ocean" cx="50%" cy="45%" r="70%">
            <stop offset="0%"   stopColor="oklch(14% 0.020 245)" />
            <stop offset="70%"  stopColor="oklch(11% 0.015 250)" />
            <stop offset="100%" stopColor="oklch(8% 0.010 250)" />
          </radialGradient>
          <linearGradient id="cin-land" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="oklch(17% 0.012 245)" />
            <stop offset="100%" stopColor="oklch(13% 0.010 250)" />
          </linearGradient>
          <filter id="cin-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="cin-glow-soft" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="cin-glow-big" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="cin-forge-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="oklch(84% 0.14 78)" stopOpacity="0.55" />
            <stop offset="60%"  stopColor="oklch(78% 0.13 78)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(72% 0.12 78)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cin-origin-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="oklch(90% 0.16 230)" stopOpacity="0.7" />
            <stop offset="50%"  stopColor="oklch(82% 0.14 230)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(72% 0.14 235)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cin-delivery-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="oklch(92% 0.12 160)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(70% 0.12 160)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={CIN_VIEW_W} height={CIN_VIEW_H} fill="url(#cin-ocean)" />

        {/* Graticule */}
        <g stroke="oklch(26% 0.010 245)" strokeWidth="0.4" opacity="0.3" fill="none">
          {[-20, -10, 0, 10, 20, 30].map(lon => {
            const d = pathGen({ type: "LineString", coordinates: cinRange(25, 72, 1).map(lat => [lon, lat]) });
            return d ? <path key={"mx" + lon} d={d} /> : null;
          })}
          {[30, 40, 50, 60, 70].map(lat => {
            const d = pathGen({ type: "LineString", coordinates: cinRange(-25, 50, 1).map(lon => [lon, lat]) });
            return d ? <path key={"my" + lat} d={d} /> : null;
          })}
        </g>

        {geo && (
          <g>
            <path d={pathGen(geo.countries) || ""} fill="url(#cin-land)" />
            <path d={pathGen(geo.borders) || ""}   fill="none" stroke="oklch(24% 0.010 245)" strokeWidth="0.35" opacity="0.65" vectorEffect="non-scaling-stroke" />
            <path d={pathGen(geo.coastline) || ""} fill="none" stroke="oklch(55% 0.08 230)"  strokeWidth="0.9"  opacity="0.5"  vectorEffect="non-scaling-stroke" />
            <path d={pathGen(geo.coastline) || ""} fill="none" stroke="oklch(75% 0.10 220)"  strokeWidth="0.35" opacity="0.8"  vectorEffect="non-scaling-stroke" />
          </g>
        )}

        {/* Routes (scene 3+) */}
        <g>
          {CIN_EDGES.map(([a, b], i) => {
            const op = edgeOpacity(a, b);
            if (op <= 0.01) return null;
            const A = nodesProj[a], B = nodesProj[b];
            const d = `M ${A.x} ${A.y} L ${B.x} ${B.y}`;
            const showPulse = elapsed >= 12 && elapsed < 26;
            return (
              <g key={"edge-" + i}>
                <path d={d} fill="none" stroke="oklch(70% 0.12 230)" strokeWidth="0.9" opacity={op} />
                {showPulse && (
                  <circle r="2.2" fill="oklch(90% 0.12 230)" filter="url(#cin-glow)" opacity={op * 1.1}>
                    <animateMotion dur={`${3 + (i % 5) * 0.4}s`} repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}
        </g>

        {/* Intake trail (scene 2) */}
        {intake && (
          <g opacity={intake.opacity}>
            <line x1={intakeStart.x} y1={intakeStart.y} x2={intake.x} y2={intake.y}
              stroke="oklch(82% 0.14 230)" strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
            <circle cx={intake.x} cy={intake.y} r="20" fill="oklch(82% 0.14 230)" opacity="0.18" filter="url(#cin-glow-soft)" />
            <circle cx={intake.x} cy={intake.y} r="5" fill="oklch(94% 0.12 230)" filter="url(#cin-glow)" />
          </g>
        )}

        {/* Amsterdam origin marker */}
        {originOn > 0 && (
          <g opacity={originOn} transform={`translate(${originProj.x}, ${originProj.y})`}>
            <circle r="28" fill="url(#cin-origin-halo)" opacity={0.6 + 0.4 * originPulse} />
            <circle r="10" fill="none" stroke="oklch(84% 0.14 230)" strokeWidth="0.9" opacity="0.8">
              <animate attributeName="r" values="8;22;8" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0;0.9" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill="oklch(94% 0.12 230)" filter="url(#cin-glow)" />
            {/* Crosshair ticks */}
            <g stroke="oklch(84% 0.14 230)" strokeWidth="0.8" opacity="0.7">
              <line x1={-18} y1={0} x2={-10} y2={0} />
              <line x1={10}  y1={0} x2={18}  y2={0} />
              <line x1={0} y1={-18} x2={0} y2={-10} />
              <line x1={0} y1={10}  x2={0} y2={18}  />
            </g>
            {/* Origin label — ONLY during scene 2 to avoid persistent clutter */}
            {elapsed >= 5 && elapsed < 9 && (
              <g opacity={cinClamp01((elapsed - 5) / 0.6) * (elapsed < 8.2 ? 1 : cinClamp01((9 - elapsed) / 0.8))}
                 transform="translate(14, -28)">
                <rect x="-4" y="-12" width="168" height="34" fill="oklch(11% 0.010 250)" stroke="oklch(84% 0.14 230)" strokeWidth="0.7" opacity="0.92" />
                <text fontFamily="var(--f-mono, ui-monospace, monospace)" fontSize="9" letterSpacing="1.6" fill="oklch(84% 0.14 230)">
                  {CIN_ORIGIN.sub}
                </text>
                <text y="14" fontFamily="var(--f-display, 'Archivo', sans-serif)" fontSize="14" fontWeight="500" fill="oklch(95% 0.004 250)" letterSpacing="0.02em">
                  {CIN_ORIGIN.label}
                </text>
              </g>
            )}
          </g>
        )}

        {/* Scene 3 routing pulses — Amsterdam → each node */}
        {elapsed >= 8 && elapsed < 20 && nodesProj.map((n, i) => {
          const p = scene3RoutePulse(i);
          if (!p) return null;
          const d = `M ${originProj.x} ${originProj.y} L ${n.x} ${n.y}`;
          return (
            <g key={"s3p-" + i} opacity={p.opacity}>
              <path d={d} stroke="oklch(78% 0.14 230)" strokeWidth="0.7" opacity="0.35" fill="none" strokeDasharray="2 3" />
              <circle cx={p.x} cy={p.y} r="3.2" fill="oklch(94% 0.12 230)" filter="url(#cin-glow)" />
            </g>
          );
        })}

        {/* Scene 4 Forge convergence feeders */}
        {convergeT >= 0 && CIN_FORGE_INDICES.map(fi => {
          const n = nodesProj[fi];
          const feeders = cinFeederPoints(n.x, n.y, n.id.charCodeAt(4) + fi * 11, 7);
          return (
            <g key={"forge-" + fi}>
              <circle cx={n.x} cy={n.y} r="44" fill="url(#cin-forge-halo)" opacity={convergeT} />
              {feeders.map((f, k) => {
                const local = (convergeT + f.phase) % 1;
                const inward = cinEaseInOutQuad(local);
                const x = f.x + (n.x - f.x) * inward;
                const y = f.y + (n.y - f.y) * inward;
                const op = Math.sin(local * Math.PI) * 0.9;
                return (
                  <g key={k}>
                    <line x1={f.x} y1={f.y} x2={n.x} y2={n.y}
                      stroke="oklch(82% 0.12 78)" strokeWidth="0.35" opacity={0.25 * convergeT} />
                    <circle cx={x} cy={y} r="1.9" fill="oklch(92% 0.13 82)" filter="url(#cin-glow)" opacity={op} />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Scene 5 delivery pulses + endpoints */}
        {elapsed >= 26 && elapsed < 30 && deliveriesProj.map((d, di) => {
          const p = scene5DeliveryPulse(di);
          const endpointOn = elapsed >= 26 + di * 0.5 ? cinClamp01((elapsed - 26 - di * 0.5) / 0.8) : 0;
          return (
            <g key={"del-" + di}>
              {p && (
                <g opacity={p.opacity}>
                  <line x1={p.from.x} y1={p.from.y} x2={p.to.x} y2={p.to.y}
                    stroke="oklch(88% 0.12 160)" strokeWidth="0.6" opacity="0.35" fill="none" strokeDasharray="3 4" />
                  <circle cx={p.pos.x} cy={p.pos.y} r="3.4" fill="oklch(94% 0.13 160)" filter="url(#cin-glow)" />
                </g>
              )}
              {endpointOn > 0 && (
                <g opacity={endpointOn} transform={`translate(${d.x}, ${d.y})`}>
                  <circle r="22" fill="url(#cin-delivery-halo)" />
                  {/* Diamond marker for delivery (distinct from circular nodes) */}
                  <g transform="rotate(45)">
                    <rect x={-4} y={-4} width="8" height="8" fill="none" stroke="oklch(90% 0.12 160)" strokeWidth="1" />
                    <rect x={-2} y={-2} width="4" height="4" fill="oklch(94% 0.13 160)" filter="url(#cin-glow)" />
                  </g>
                  <text y={-18} textAnchor="middle"
                    fontFamily="var(--f-mono, ui-monospace, monospace)" fontSize="9" letterSpacing="2"
                    fill="oklch(90% 0.12 160)">
                    {d.label}
                  </text>
                  <text y={24} textAnchor="middle"
                    fontFamily="var(--f-mono, ui-monospace, monospace)" fontSize="8" letterSpacing="2"
                    fill="oklch(70% 0.08 160)">
                    DELIVERED
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodesProj.map((n, i) => {
          const a = nodeActivation(i);
          const isForge = n.role === "forge" || n.role === "candidate";
          const warmMix = elapsed >= 20 && elapsed < 30 && isForge ? Math.min(1, (elapsed - 20) / 1.5) * 0.6 : 0;
          const color = warmMix > 0
            ? `color-mix(in oklch, oklch(82% 0.14 230) ${(1 - warmMix) * 100}%, oklch(84% 0.14 78) ${warmMix * 100}%)`
            : "oklch(82% 0.14 230)";
          const baseR = n.role === "planned" ? 4 : 5.5;
          const coreR = baseR * (0.6 + 0.6 * Math.min(1, a));
          const ringR = 14 + 6 * Math.min(1, a);
          return (
            <g key={n.id} opacity={0.35 + 0.65 * Math.min(1, a)}>
              <circle cx={n.x} cy={n.y} r={ringR} fill="none" stroke={color} strokeWidth="0.9" opacity={0.55 * Math.min(1, a) + 0.15} />
              {a > 0.5 && (
                <circle cx={n.x} cy={n.y} r={ringR} fill="none" stroke={color} strokeWidth="0.8" opacity="0.6">
                  <animate attributeName="r" values={`${ringR};${ringR + 16};${ringR}`} dur={isForge ? "2.6s" : "3.4s"} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur={isForge ? "2.6s" : "3.4s"} repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={n.x} cy={n.y} r={coreR} fill={color} filter={a > 0.4 ? "url(#cin-glow)" : undefined} />
            </g>
          );
        })}

        {/* Specialty tags — inline, appear as each node ignites (scenes 3–4). */}
        {nodesProj.map((n, i) => {
          const op = tagOpacity(i);
          if (op <= 0.02) return null;
          const [ox, oy] = cinTagOffset(n.tagDir, 20);
          const textAnchor =
            n.tagDir === "W" || n.tagDir === "NW" || n.tagDir === "SW" ? "end" : "start";
          return (
            <g key={"tag-" + n.id} opacity={op}
               transform={`translate(${n.x + ox}, ${n.y + oy})`}>
              <text fontFamily="var(--f-mono, ui-monospace, monospace)" fontSize="8.5" letterSpacing="1.6"
                fill="oklch(90% 0.10 230)" textAnchor={textAnchor}>
                {n.city.toUpperCase()}
              </text>
              <text y="10" fontFamily="var(--f-mono, ui-monospace, monospace)" fontSize="8" letterSpacing="1.2"
                fill="oklch(68% 0.08 230)" textAnchor={textAnchor}>
                {n.specialty.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Scene 6 — brand backdrop dim */}
        {brandT > 0 && (
          <rect x={0} y={0} width={CIN_VIEW_W} height={CIN_VIEW_H}
            fill="oklch(8% 0.010 250)" opacity={brandT * 0.35} />
        )}

        {/* HUD */}
        <g fontFamily="var(--f-mono, ui-monospace, monospace)" fontSize="10" fill="oklch(50% 0.010 245)" letterSpacing="1.5">
          <text x="18" y="26">AAE · EU · SEQUENCE · REV 2026.04</text>
          <text x={CIN_VIEW_W - 18} y="26" textAnchor="end">
            T {elapsed.toFixed(1).padStart(4, "0")} / {CIN_DURATION.toFixed(1)}
          </text>
          <text x="18" y={CIN_VIEW_H - 18}>SCENE {currentScene.id} / {CIN_SCENES.length}</text>
          <text x={CIN_VIEW_W - 18} y={CIN_VIEW_H - 18} textAnchor="end">
            {countLit} / {CIN_NODES.length} REGIONS ACTIVE
          </text>
        </g>
      </svg>

      {/* ── Scene 6 brand layer (HTML over SVG so it uses real fonts + image) ── */}
      {brandT > 0 && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          pointerEvents: "none",
          opacity: brandT,
          transform: `translateY(${(1 - brandT) * 10}px)`,
        }}>
          {brandMarkSrc ? (
            <img src={brandMarkSrc} alt=""
              style={{ width: "clamp(56px, 7vw, 86px)", height: "auto", marginBottom: 22, filter: "drop-shadow(0 0 24px oklch(72% 0.14 235 / 0.45))" }} />
          ) : (
            <svg viewBox="0 0 40 40" fill="none"
              style={{ width: "clamp(56px, 7vw, 86px)", height: "auto", marginBottom: 22, filter: "drop-shadow(0 0 24px oklch(72% 0.14 235 / 0.45))" }}>
              <path d="M20 3 L34 34 L6 34 Z" stroke="var(--text-hi, oklch(95% 0.004 250))" strokeWidth="1.4"/>
              <path d="M20 14 L28 30 L12 30 Z" fill="var(--accent, oklch(72% 0.14 235))" opacity="0.9"/>
              <circle cx="20" cy="22" r="1.6" fill="var(--bg-void, oklch(11% 0.008 250))"/>
            </svg>
          )}
          <div style={{
            fontFamily: "var(--f-mono, ui-monospace, monospace)",
            fontSize: 11,
            letterSpacing: "0.28em",
            color: "oklch(72% 0.14 235)",
            textTransform: "uppercase",
            marginBottom: 16,
          }}>
            Asgard Aerospace · Europe
          </div>
          <div style={{
            fontFamily: "var(--f-display, 'Archivo', sans-serif)",
            fontSize: "clamp(28px, 4.2vw, 56px)",
            fontWeight: 500,
            letterSpacing: "-0.028em",
            lineHeight: 1.02,
            color: "oklch(95% 0.004 250)",
            textAlign: "center",
            maxWidth: "min(820px, 88%)",
          }}>
            A continental<br />manufacturing<br />infrastructure layer.
          </div>
          <div style={{
            marginTop: 28,
            fontFamily: "var(--f-mono, ui-monospace, monospace)",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "oklch(62% 0.008 250)",
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            {CIN_NODES.length} Regions · Unlimited Routes · 1 Execution Layer
          </div>
        </div>
      )}

      {/* ── Scene overlay text (scenes 1–5) ───────────────────────── */}
      {brandT < 0.5 && (
        <div
          key={currentScene.id + "-" + (currentScene.id === 3 ? calloutIdx : 0)}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "11%",
            transform: "translateX(-50%)",
            width: "min(820px, 88%)",
            textAlign: "center",
            pointerEvents: "none",
            animation: "cinFadeIn 0.7s cubic-bezier(0.22,0.61,0.36,1) both",
            opacity: 1 - brandT,
          }}
        >
          <div style={{
            fontFamily: "var(--f-mono, ui-monospace, monospace)",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "oklch(72% 0.14 235)",
            marginBottom: 14,
            textTransform: "uppercase",
          }}>
            {currentScene.eyebrow}
          </div>
          <div style={{
            fontFamily: "var(--f-display, 'Archivo', sans-serif)",
            fontSize: "clamp(24px, 3.2vw, 44px)",
            fontWeight: 500,
            letterSpacing: "-0.022em",
            lineHeight: 1.08,
            color: "oklch(95% 0.004 250)",
          }}>
            {currentScene.id === 3 && calloutIdx >= 0
              ? `${CIN_NODES[calloutIdx].city} · ${CIN_NODES[calloutIdx].specialty}`
              : currentScene.title}
          </div>
          {currentScene.id === 3 && (
            <div style={{
              marginTop: 14,
              fontFamily: "var(--f-body, system-ui, sans-serif)",
              fontSize: "clamp(13px, 1.05vw, 16px)",
              color: "oklch(70% 0.010 245)",
              letterSpacing: "0.01em",
            }}>
              Every region contributes what it does best.
            </div>
          )}
        </div>
      )}

      {/* ── Skip button ──────────────────────────────────────────── */}
      {onSkip && (
        <button
          onClick={onSkip}
          aria-label="Skip intro"
          style={cinSkipBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "oklch(95% 0.004 250)";
            e.currentTarget.style.borderColor = "oklch(72% 0.14 235)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "oklch(72% 0.010 245)";
            e.currentTarget.style.borderColor = "oklch(28% 0.010 250)";
          }}
        >
          Skip <span style={{ marginLeft: 6 }}>→</span>
        </button>
      )}

      <style>{`
        @keyframes cinFadeIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to   { opacity: 1; transform: translate(-50%, 0);   }
        }
      `}</style>
    </div>
  );
}

const cinSkipBtn = {
  position: "absolute",
  top: "clamp(16px, 2.2vw, 28px)",
  right: "clamp(16px, 2.2vw, 28px)",
  padding: "9px 16px",
  borderRadius: 2,
  border: "1px solid oklch(28% 0.010 250)",
  background: "color-mix(in oklch, oklch(11% 0.008 250) 72%, transparent)",
  color: "oklch(72% 0.010 245)",
  fontFamily: "var(--f-mono, ui-monospace, monospace)",
  fontSize: 11,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  cursor: "pointer",
  backdropFilter: "blur(8px)",
  zIndex: 3,
  transition: "color 0.2s ease, border-color 0.2s ease",
};

window.AsgardSequence = AsgardSequence;
