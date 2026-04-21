/* global React, ReactDOM, d3, topojson */
// ============================================================
// AsgardSequence — cinematic system explanation for Asgard
// Aerospace Europe. Not a visual effect. A 40-second narrative
// that shows exactly how a program moves through the network.
//
// Every beat answers: what triggered this, what changed as a
// result. A single program pulse drives everything visible.
//
//   Phase 1  (0   – 5s)    Fragmentation
//   Phase 2  (5   – 10s)   Program entry
//   Phase 3  (10  – 23s)   Network routing
//   Phase 4  (23  – 31s)   Forge convergence
//   Phase 5  (31  – 40s)   Delivery state
//
// Phases are modular pure time-functions so a future guided
// mode can step through or pause at any boundary.
// ============================================================

const { useState, useEffect, useRef, useMemo } = React;

const CIN_VIEW_W  = 1000;
const CIN_VIEW_H  = 900;
const CIN_DURATION = 40;

// ── Phase manifest ─────────────────────────────────────────────
// Each phase is a closed interval [start, end). Transitions use
// micro-pauses at the seams so comprehension lands before motion.

const PHASES = [
  { id: 1, start: 0,  end: 5,  key: "fragmentation", eyebrow: "STATE · FRAGMENTED",    title: "European manufacturing exists as fragmented capability" },
  { id: 2, start: 5,  end: 10, key: "entry",         eyebrow: "PROGRAM · INTAKE",      title: "A program enters the network" },
  { id: 3, start: 10, end: 23, key: "routing",       eyebrow: "NETWORK · ROUTING",     title: "Work is routed across qualified suppliers" },
  { id: 4, start: 23, end: 31, key: "convergence",   eyebrow: "FORGE · CONVERGENCE",   title: "Production converges for integration and certification" },
  { id: 5, start: 31, end: 40, key: "delivery",      eyebrow: "DELIVERY · UNIFIED",    title: "Delivered under unified configuration control" },
];

// Program intake — the door into the system. Not a network node.
const CIN_ORIGIN = { lon: 4.90, lat: 52.37, label: "AMSTERDAM", sub: "PROGRAM INTAKE" };

// Network lattice. Forges are integration + certification
// authority; suppliers are qualified capability endpoints. The
// role drives every visual difference between the two.
const CIN_NODES = [
  { id: "AAE-N01", role: "forge",    lon:  2.17, lat: 41.39, city: "Barcelona", specialty: "Composites · Integration", tagDir: "SE" },
  { id: "AAE-N02", role: "forge",    lon: -2.68, lat: 43.26, city: "Bilbao",    specialty: "Heavy Metals · Forging",   tagDir: "W"  },
  { id: "AAE-N03", role: "forge",    lon:  1.44, lat: 43.60, city: "Toulouse",  specialty: "Final Assembly",           tagDir: "S"  },
  { id: "AAE-N04", role: "forge",    lon:  4.35, lat: 50.85, city: "Brussels",  specialty: "Avionics · Systems",       tagDir: "W"  },
  { id: "AAE-N05", role: "supplier", lon:  6.96, lat: 51.23, city: "Ruhr",      specialty: "Precision Machining",      tagDir: "E"  },
  { id: "AAE-N06", role: "supplier", lon:  9.19, lat: 45.46, city: "Milan",     specialty: "Engines",                  tagDir: "SE" },
  { id: "AAE-N07", role: "supplier", lon: 11.58, lat: 48.14, city: "Munich",    specialty: "Aerospace Electronics",    tagDir: "NE" },
  { id: "AAE-N08", role: "supplier", lon: 18.92, lat: 50.26, city: "Kraków",    specialty: "Fabrication",              tagDir: "E"  },
  { id: "AAE-N09", role: "supplier", lon: -9.14, lat: 38.72, city: "Lisbon",    specialty: "MRO · Test",               tagDir: "SW" },
  { id: "AAE-N10", role: "supplier", lon: 18.06, lat: 59.33, city: "Stockholm", specialty: "Defense Electronics",      tagDir: "E"  },
];

const CIN_FORGE_INDICES    = CIN_NODES.map((n, i) => n.role === "forge" ? i : -1).filter(i => i >= 0);
const CIN_SUPPLIER_INDICES = CIN_NODES.map((n, i) => n.role === "supplier" ? i : -1).filter(i => i >= 0);

// Phase 1 fragmented state — four unconnected suppliers sit
// dimly on the map. The forges stay dark; integration capability
// does not exist until the system actually coordinates it.
// Indices: 5 Milan, 6 Munich, 8 Lisbon, 9 Stockholm.
const INITIAL_VISIBLE = new Set([5, 6, 8, 9]);

// Phase 3 hop sequence — the program pulse visits each supplier
// in geographic sweep order. The sequence ends at Lisbon so the
// final hop is a long Atlantic reach that reads as continental
// coverage before convergence begins.
const HOP_SEQUENCE  = [4, 6, 5, 7, 9, 8]; // Ruhr → Munich → Milan → Kraków → Stockholm → Lisbon
const HOP_DURATION  = 1.75;  // travel time per hop
const HOP_DWELL     = 0.25;  // micro-pause on arrival
const HOP_START     = 10.5;  // phase 3 begins after a 0.5s settle
// Total phase 3 motion: 6 × 2.0 = 12s. Ends at 22.5s. 0.5s buffer.

// Phase 4 convergence mapping — each supplier routes to its
// nearest forge for integration and certification.
const CONVERGE_MAP = {
  4: 3, // Ruhr      → Brussels
  5: 2, // Milan     → Toulouse
  6: 3, // Munich    → Brussels
  7: 3, // Kraków    → Brussels
  8: 0, // Lisbon    → Barcelona
  9: 1, // Stockholm → Bilbao
};

// Phase 5 forge backbone — stable integration network that
// becomes visible once convergence completes.
const BACKBONE_EDGES = [
  [0, 2], // Barcelona ↔ Toulouse
  [1, 2], // Bilbao    ↔ Toulouse
  [2, 3], // Toulouse  ↔ Brussels
  [0, 1], // Barcelona ↔ Bilbao
];

// Phase 3 hop edges derived from HOP_SEQUENCE; index -1 = origin.
const HOP_EDGES = HOP_SEQUENCE.map((to, i) => [i === 0 ? -1 : HOP_SEQUENCE[i - 1], to]);

// ── Math / ease helpers ──────────────────────────────────────

function cinClamp01(t) { return Math.max(0, Math.min(1, t)); }
function cinEaseOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function cinEaseInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2; }
function cinRange(a, b, s) { const o = []; for (let v = a; v <= b; v += s) o.push(v); return o; }

// Smooth window: opacity rises 0→1 over `rise`, holds, falls to 0
// over `fall`. Used for phase-local fades.
function cinWindow(elapsed, start, rise, hold, fall) {
  const t = elapsed - start;
  if (t < 0) return 0;
  if (t < rise) return t / rise;
  if (t < rise + hold) return 1;
  if (t < rise + hold + fall) return 1 - (t - rise - hold) / fall;
  return 0;
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

// ── Geo fetch (memoised across mounts) ───────────────────────

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

// ============================================================
// AsgardSequence — component entrypoint
// ============================================================

function AsgardSequence({
  autoPlay = true,
  loop = true,
  className,
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

  // ── Projection and projected coordinates ────────────────────

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

  const currentPhase = PHASES.find(p => elapsed >= p.start && elapsed < p.end) || PHASES[PHASES.length - 1];

  // ── Phase-local state functions (pure, time-driven) ─────────

  // The index of the hop-sequence arrival node currently being
  // highlighted, or -1. Used to surface a single operational tag
  // at the node the pulse has just reached.
  function activeHopArrival() {
    if (elapsed < HOP_START || elapsed >= 23) return -1;
    const step = HOP_DURATION + HOP_DWELL;
    const localT = elapsed - HOP_START;
    const hopIndex = Math.floor(localT / step);
    if (hopIndex < 0 || hopIndex >= HOP_SEQUENCE.length) return -1;
    const inHop = localT - hopIndex * step;
    // Label appears in the last third of travel and holds through dwell.
    if (inHop < HOP_DURATION * 0.65) return -1;
    return HOP_SEQUENCE[hopIndex];
  }

  // How far a given supplier has progressed along the hop
  // sequence — returns 0 before it is visited, 1 after arrival.
  function hopArrivalProgress(nodeIdx) {
    const slot = HOP_SEQUENCE.indexOf(nodeIdx);
    if (slot < 0) return 0;
    const arriveAt = HOP_START + slot * (HOP_DURATION + HOP_DWELL) + HOP_DURATION;
    if (elapsed < arriveAt - HOP_DURATION) return 0;
    return cinClamp01((elapsed - (arriveAt - HOP_DURATION)) / HOP_DURATION);
  }

  // Edge reveal amount 0..1 for a phase-3 hop edge (origin→S0,
  // S0→S1, …). An edge draws in as its pulse traverses it.
  function hopEdgeReveal(hopIdx) {
    const start = HOP_START + hopIdx * (HOP_DURATION + HOP_DWELL);
    if (elapsed < start) return 0;
    return cinClamp01((elapsed - start) / HOP_DURATION);
  }

  // Convergence flow amount 0..1 for each supplier→forge edge.
  // Phase 4 draws feeders in over 3s then holds.
  function convergeReveal(supplierIdx) {
    const start = 24 + (supplierIdx - 4) * 0.25; // staggered 0.25s each
    if (elapsed < start) return 0;
    return cinClamp01((elapsed - start) / 2.5);
  }

  // Backbone reveal — forge-to-forge integration network.
  const backboneReveal = elapsed < 27 ? 0 : cinClamp01((elapsed - 27) / 3);

  // Is node visible at all? Gradually introduces nodes as the
  // system activates. Forges ignite only at phase 4 start.
  function nodeVisibility(i) {
    const n = nodesProj[i];
    if (n.role === "forge") {
      // Forges appear as integration points at phase 4.
      if (elapsed < 22.8) return 0;
      return cinClamp01((elapsed - 22.8) / 1.5);
    }
    if (INITIAL_VISIBLE.has(i)) {
      // Latent capability — dim from phase 1, brightens on visit.
      return 1;
    }
    // Other suppliers appear when the pulse reaches them.
    const slot = HOP_SEQUENCE.indexOf(i);
    if (slot < 0) return 0;
    const appearAt = HOP_START + slot * (HOP_DURATION + HOP_DWELL) + HOP_DURATION * 0.6;
    return elapsed >= appearAt ? cinClamp01((elapsed - appearAt) / 0.4) : 0;
  }

  // Activation level drives glow / size. 0.15 = latent, 1 = active.
  function nodeActivation(i) {
    const n = nodesProj[i];
    const vis = nodeVisibility(i);
    if (vis <= 0) return 0;

    if (n.role === "forge") {
      // Forges: ramp up through phase 4 to full brightness by
      // phase 5. Subtle breathing pulse once lit.
      if (elapsed < 23) return 0.15 * vis;
      const warmup = cinClamp01((elapsed - 23) / 3);
      const breath = elapsed >= 26 ? 0.08 * Math.sin((elapsed - 26) * 1.4) : 0;
      return (0.35 + 0.65 * warmup + breath) * vis;
    }

    // Supplier: latent 0.18 until pulse arrives, then full.
    const arrived = hopArrivalProgress(i);
    const base = INITIAL_VISIBLE.has(i) ? 0.18 : 0;
    return (base + (1 - base) * arrived) * vis;
  }

  // ── The single program pulse ────────────────────────────────
  // One trackable signal across phases 2–5. Returns null when
  // the pulse is not on screen (e.g. during phase 1 fragmentation).

  function programPulse() {
    // Phase 2 — enter from offscreen left toward Amsterdam.
    if (elapsed < 5) return null;
    if (elapsed < 10) {
      const t = cinClamp01((elapsed - 5.5) / 3.5); // enters at 5.5s, arrives at 9s
      if (t < 0) return { x: -90, y: originProj.y - 40, opacity: 0 };
      const start = { x: -90, y: originProj.y - 40 };
      const ease = cinEaseOutCubic(t);
      return {
        x: start.x + (originProj.x - start.x) * ease,
        y: start.y + (originProj.y - start.y) * ease,
        opacity: 1,
        phase: 2,
      };
    }

    // Phase 3 — hop through suppliers.
    if (elapsed < 23) {
      const step = HOP_DURATION + HOP_DWELL;
      const localT = elapsed - HOP_START;
      if (localT < 0) {
        return { x: originProj.x, y: originProj.y, opacity: 1, phase: 3 };
      }
      const hopIndex = Math.floor(localT / step);
      if (hopIndex >= HOP_SEQUENCE.length) {
        const last = nodesProj[HOP_SEQUENCE[HOP_SEQUENCE.length - 1]];
        return { x: last.x, y: last.y, opacity: 1, phase: 3 };
      }
      const inHop = localT - hopIndex * step;
      const fromIdx = hopIndex === 0 ? -1 : HOP_SEQUENCE[hopIndex - 1];
      const from = fromIdx < 0 ? originProj : nodesProj[fromIdx];
      const to = nodesProj[HOP_SEQUENCE[hopIndex]];
      if (inHop < HOP_DURATION) {
        const t = inHop / HOP_DURATION;
        const ease = cinEaseInOutCubic(t);
        return {
          x: from.x + (to.x - from.x) * ease,
          y: from.y + (to.y - from.y) * ease,
          opacity: 1,
          phase: 3,
        };
      }
      return { x: to.x, y: to.y, opacity: 1, phase: 3 };
    }

    // Phase 4 — pulse crosses from final supplier (Lisbon) to
    // primary forge (Toulouse), then holds at the forge while
    // peripheral feeders converge around it.
    if (elapsed < 31) {
      const last = nodesProj[HOP_SEQUENCE[HOP_SEQUENCE.length - 1]];
      const forge = nodesProj[2]; // Toulouse
      if (elapsed < 26.5) {
        const t = cinClamp01((elapsed - 23.5) / 3);
        const ease = cinEaseInOutCubic(t);
        return {
          x: last.x + (forge.x - last.x) * ease,
          y: last.y + (forge.y - last.y) * ease,
          opacity: 1,
          phase: 4,
        };
      }
      return { x: forge.x, y: forge.y, opacity: 1, phase: 4 };
    }

    // Phase 5 — delivery. Pulse traverses Toulouse → Brussels
    // → offscreen right. Fades after leaving the frame.
    if (elapsed < 40) {
      const path = [
        nodesProj[2], // Toulouse
        nodesProj[3], // Brussels
        { x: CIN_VIEW_W + 80, y: nodesProj[3].y - 60 }, // delivered
      ];
      const totalDur = 6; // 31 → 37
      const t = cinClamp01((elapsed - 31.5) / totalDur);
      if (t <= 0) {
        return { x: path[0].x, y: path[0].y, opacity: 1, phase: 5 };
      }
      const segT = t * (path.length - 1);
      const segI = Math.min(path.length - 2, Math.floor(segT));
      const localT = segT - segI;
      const from = path[segI], to = path[segI + 1];
      const ease = cinEaseInOutCubic(localT);
      const fade = elapsed > 37 ? cinClamp01(1 - (elapsed - 37) / 1.5) : 1;
      return {
        x: from.x + (to.x - from.x) * ease,
        y: from.y + (to.y - from.y) * ease,
        opacity: fade,
        phase: 5,
      };
    }

    return null;
  }

  const pulse = programPulse();

  // Amsterdam origin visibility — appears with the program entry,
  // persists through the rest of the sequence at low key once
  // the routing begins.
  const originOn = elapsed < 5.3 ? 0
    : elapsed < 10 ? cinClamp01((elapsed - 5.3) / 0.8)
    : 1;
  const originIntensity = elapsed < 10 ? 1 : 0.55;

  // Phase 4 forge halo strength — grows as convergence progresses.
  const forgeHalo = elapsed < 23 ? 0 : cinClamp01((elapsed - 23) / 3);

  // ── Render ─────────────────────────────────────────────────

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
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="cin-glow-soft" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="cin-forge-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="oklch(84% 0.14 78)" stopOpacity="0.5" />
            <stop offset="60%"  stopColor="oklch(78% 0.13 78)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="oklch(72% 0.12 78)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cin-origin-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="oklch(90% 0.16 230)" stopOpacity="0.6" />
            <stop offset="50%"  stopColor="oklch(82% 0.14 230)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="oklch(72% 0.14 235)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={CIN_VIEW_W} height={CIN_VIEW_H} fill="url(#cin-ocean)" />

        {/* Graticule — minimal, always present, low contrast */}
        <g stroke="oklch(26% 0.010 245)" strokeWidth="0.4" opacity="0.25" fill="none">
          {[-10, 0, 10, 20].map(lon => {
            const d = pathGen({ type: "LineString", coordinates: cinRange(30, 68, 1).map(lat => [lon, lat]) });
            return d ? <path key={"mx" + lon} d={d} /> : null;
          })}
          {[40, 50, 60].map(lat => {
            const d = pathGen({ type: "LineString", coordinates: cinRange(-20, 40, 1).map(lon => [lon, lat]) });
            return d ? <path key={"my" + lat} d={d} /> : null;
          })}
        </g>

        {geo && (
          <g>
            <path d={pathGen(geo.countries) || ""} fill="url(#cin-land)" />
            <path d={pathGen(geo.borders) || ""}   fill="none" stroke="oklch(24% 0.010 245)" strokeWidth="0.35" opacity="0.6" vectorEffect="non-scaling-stroke" />
            <path d={pathGen(geo.coastline) || ""} fill="none" stroke="oklch(55% 0.08 230)"  strokeWidth="0.8"  opacity="0.45" vectorEffect="non-scaling-stroke" />
          </g>
        )}

        {/* ── Phase 3 hop routes (draw in as pulse traverses) ── */}
        <g>
          {HOP_EDGES.map(([fromIdx, toIdx], i) => {
            const reveal = hopEdgeReveal(i);
            if (reveal <= 0.01) return null;
            const from = fromIdx < 0 ? originProj : nodesProj[fromIdx];
            const to = nodesProj[toIdx];
            const dx = to.x - from.x, dy = to.y - from.y;
            const mx = from.x + dx * reveal;
            const my = from.y + dy * reveal;
            // Fade routes down slightly after phase 3 so convergence reads.
            const afterFade = elapsed >= 23 ? 0.55 : 1;
            return (
              <g key={"hop-" + i} opacity={afterFade}>
                <line x1={from.x} y1={from.y} x2={mx} y2={my}
                  stroke="oklch(82% 0.14 230)" strokeWidth="0.85" opacity="0.5" strokeLinecap="round" />
              </g>
            );
          })}
        </g>

        {/* ── Phase 4 convergence feeders (supplier → forge) ── */}
        <g>
          {Object.entries(CONVERGE_MAP).map(([supIdx, forgeIdx]) => {
            const s = parseInt(supIdx, 10);
            const f = parseInt(forgeIdx, 10);
            const reveal = convergeReveal(s);
            if (reveal <= 0.01) return null;
            const A = nodesProj[s], B = nodesProj[f];
            const dx = B.x - A.x, dy = B.y - A.y;
            const mx = A.x + dx * reveal;
            const my = A.y + dy * reveal;
            // After phase 4 holds, feeders stay at steady opacity.
            const hold = elapsed >= 30 ? 0.65 : 1;
            return (
              <g key={`conv-${s}-${f}`} opacity={hold}>
                <line x1={A.x} y1={A.y} x2={mx} y2={my}
                  stroke="oklch(84% 0.13 78)" strokeWidth="0.9" opacity="0.55" strokeLinecap="round" />
                {elapsed >= 25 && elapsed < 31 && reveal > 0.6 && (
                  <circle r="1.6" fill="oklch(92% 0.13 82)" filter="url(#cin-glow)" opacity="0.85">
                    <animateMotion dur={`${2.5 + (s % 3) * 0.3}s`} repeatCount="indefinite"
                      path={`M ${A.x} ${A.y} L ${B.x} ${B.y}`} />
                  </circle>
                )}
              </g>
            );
          })}
        </g>

        {/* ── Phase 5 forge backbone ──────────────────────────── */}
        <g opacity={backboneReveal}>
          {BACKBONE_EDGES.map(([a, b], i) => {
            const A = nodesProj[a], B = nodesProj[b];
            return (
              <line key={"bb-" + i}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="oklch(78% 0.12 230)" strokeWidth="0.9" opacity="0.5" strokeLinecap="round" />
            );
          })}
        </g>

        {/* ── Amsterdam origin marker ──────────────────────────── */}
        {originOn > 0 && (
          <g opacity={originOn} transform={`translate(${originProj.x}, ${originProj.y})`}>
            <circle r="26" fill="url(#cin-origin-halo)" opacity={originIntensity} />
            <circle r="10" fill="none" stroke="oklch(84% 0.14 230)" strokeWidth="0.9" opacity={0.8 * originIntensity}>
              <animate attributeName="r" values="8;20;8" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values={`${0.85 * originIntensity};0;${0.85 * originIntensity}`} dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r="4.5" fill="oklch(94% 0.12 230)" filter="url(#cin-glow)" />
            <g stroke="oklch(84% 0.14 230)" strokeWidth="0.7" opacity={0.6 * originIntensity}>
              <line x1={-16} y1={0} x2={-9} y2={0} />
              <line x1={9}  y1={0} x2={16}  y2={0} />
              <line x1={0} y1={-16} x2={0} y2={-9} />
              <line x1={0} y1={9}  x2={0} y2={16}  />
            </g>
            {/* Origin label — only during phase 2 so it reads as intake, not clutter. */}
            {elapsed >= 6 && elapsed < 10.5 && (
              <g opacity={cinWindow(elapsed, 6, 0.6, 3.3, 0.6)}
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

        {/* ── Forge halos (phase 4+) — visible authority cue ───── */}
        {forgeHalo > 0 && CIN_FORGE_INDICES.map(fi => {
          const n = nodesProj[fi];
          return (
            <circle key={"halo-" + fi}
              cx={n.x} cy={n.y} r={42} fill="url(#cin-forge-halo)" opacity={forgeHalo} />
          );
        })}

        {/* ── Nodes ───────────────────────────────────────────── */}
        {nodesProj.map((n, i) => {
          const a = nodeActivation(i);
          if (a <= 0.01) return null;
          const isForge = n.role === "forge";
          // Forges are visibly larger and brighter.
          const baseR = isForge ? 7 : 4.2;
          const coreR = baseR * (0.55 + 0.55 * Math.min(1, a));
          const ringR = isForge ? 18 + 6 * Math.min(1, a) : 12 + 4 * Math.min(1, a);
          const color = isForge ? "oklch(86% 0.14 82)" : "oklch(82% 0.14 230)";
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={ringR} fill="none" stroke={color}
                strokeWidth={isForge ? 1.1 : 0.85} opacity={0.4 * Math.min(1, a) + 0.1} />
              {a > 0.5 && (
                <circle cx={n.x} cy={n.y} r={ringR} fill="none" stroke={color}
                  strokeWidth="0.75" opacity="0.5">
                  <animate attributeName="r" values={`${ringR};${ringR + (isForge ? 14 : 10)};${ringR}`}
                    dur={isForge ? "2.8s" : "3.6s"} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5"
                    dur={isForge ? "2.8s" : "3.6s"} repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={n.x} cy={n.y} r={coreR} fill={color}
                filter={a > 0.4 ? "url(#cin-glow)" : undefined} />
            </g>
          );
        })}

        {/* ── Inline labels ─────────────────────────────────────
            Two tiers:
             • During phase 3, the node the pulse just reached
               surfaces a single operational tag (city · specialty).
             • From phase 4 onward, every activated node shows a
               compact city label. Forges get bolder type. */}
        {(() => {
          const activeIdx = activeHopArrival();
          return nodesProj.map((n, i) => {
            const vis = nodeVisibility(i);
            if (vis < 0.4) return null;

            const isActiveHop = i === activeIdx;
            const showPersistent = elapsed >= 23.5;
            if (!isActiveHop && !showPersistent) return null;

            const op = isActiveHop
              ? cinWindow(elapsed, HOP_START + HOP_SEQUENCE.indexOf(i) * (HOP_DURATION + HOP_DWELL) + HOP_DURATION * 0.65, 0.25, HOP_DURATION * 0.35 + HOP_DWELL - 0.25, 0.4)
              : cinClamp01((elapsed - 23.5) / 1.5);

            if (op <= 0.02) return null;

            const [ox, oy] = cinTagOffset(n.tagDir, n.role === "forge" ? 24 : 18);
            const anchor = (n.tagDir === "W" || n.tagDir === "NW" || n.tagDir === "SW") ? "end" : "start";
            const isForge = n.role === "forge";

            return (
              <g key={"tag-" + n.id} opacity={op}
                 transform={`translate(${n.x + ox}, ${n.y + oy})`}>
                <text fontFamily="var(--f-mono, ui-monospace, monospace)"
                  fontSize={isForge ? 9.5 : 8.5}
                  letterSpacing="1.8"
                  fontWeight={isForge ? 600 : 400}
                  fill={isForge ? "oklch(92% 0.12 82)" : "oklch(90% 0.10 230)"}
                  textAnchor={anchor}>
                  {n.city.toUpperCase()}
                </text>
                {(isActiveHop || isForge) && (
                  <text y="11" fontFamily="var(--f-mono, ui-monospace, monospace)"
                    fontSize="7.5" letterSpacing="1.3"
                    fill={isForge ? "oklch(72% 0.08 82)" : "oklch(66% 0.07 230)"}
                    textAnchor={anchor}>
                    {isForge ? "FORGE · INTEGRATION" : n.specialty.toUpperCase()}
                  </text>
                )}
              </g>
            );
          });
        })()}

        {/* ── The single program pulse ────────────────────────── */}
        {pulse && pulse.opacity > 0 && (
          <g opacity={pulse.opacity}>
            <circle cx={pulse.x} cy={pulse.y} r="16"
              fill={pulse.phase === 4 ? "oklch(88% 0.13 82)" : "oklch(88% 0.14 230)"}
              opacity="0.18" filter="url(#cin-glow-soft)" />
            <circle cx={pulse.x} cy={pulse.y} r="4.5"
              fill={pulse.phase === 4 ? "oklch(94% 0.13 82)" : "oklch(94% 0.12 230)"}
              filter="url(#cin-glow)" />
            <circle cx={pulse.x} cy={pulse.y} r="8" fill="none"
              stroke={pulse.phase === 4 ? "oklch(88% 0.13 82)" : "oklch(88% 0.14 230)"}
              strokeWidth="0.8" opacity="0.6">
              <animate attributeName="r" values="6;13;6" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* ── HUD ─────────────────────────────────────────────── */}
        <g fontFamily="var(--f-mono, ui-monospace, monospace)" fontSize="10" fill="oklch(50% 0.010 245)" letterSpacing="1.5">
          <text x="18" y="26">AAE · EU · SEQUENCE · REV 2026.04</text>
          <text x={CIN_VIEW_W - 18} y="26" textAnchor="end">
            T {elapsed.toFixed(1).padStart(4, "0")} / {CIN_DURATION.toFixed(1)}
          </text>
          <text x="18" y={CIN_VIEW_H - 18}>
            PHASE {currentPhase.id} / {PHASES.length} · {currentPhase.eyebrow}
          </text>
        </g>
      </svg>

      {/* ── Phase text overlay (operational language only) ────── */}
      <div
        key={currentPhase.id}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "11%",
          transform: "translateX(-50%)",
          width: "min(820px, 88%)",
          textAlign: "center",
          pointerEvents: "none",
          animation: "cinFadeIn 0.9s cubic-bezier(0.22,0.61,0.36,1) both",
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
          {currentPhase.eyebrow}
        </div>
        <div style={{
          fontFamily: "var(--f-display, 'Archivo', sans-serif)",
          fontSize: "clamp(24px, 3.2vw, 44px)",
          fontWeight: 500,
          letterSpacing: "-0.022em",
          lineHeight: 1.12,
          color: "oklch(95% 0.004 250)",
        }}>
          {currentPhase.title}
        </div>
      </div>

      {/* ── Skip button ───────────────────────────────────────── */}
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
          from { opacity: 0; transform: translate(-50%, 10px); }
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
