/* global React, d3, topojson */
const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// EUROPE NETWORK MAP v3
// Real coastlines (Natural Earth 50m via world-atlas topojson)
// Lambert conformal conic projection fit to Europe
// Night-lights aesthetic: dark ocean, faint coastlines,
// glowing city specks, clean schematic overlay.
// ============================================================

// Real lat/lon for every node. Projected live using the same
// projection as the coastlines so nodes sit on real cities.
// Node roles are system roles, not location commitments:
//   candidate — candidate HQ / command layer under evaluation
//   forge     — candidate Forge node (integration + certification authority)
//   planned   — candidate network node in the coverage lattice
const NODES = [
  { id: "AAE-N01", name: "Candidate · Iberian Anchor",     role: "candidate", phase: 1, country: "—", lon:  2.17, lat: 41.39, roleLabel: "Candidate HQ · Command Layer", status: "Deployment candidate" },
  { id: "AAE-N02", name: "Candidate · Northern Iberia",    role: "forge",     phase: 2, country: "—", lon: -2.68, lat: 43.26, roleLabel: "Forge Node · Integration + Certification", status: "Deployment candidate" },
  { id: "AAE-N03", name: "Candidate · Southern France",    role: "forge",     phase: 3, country: "—", lon:  1.44, lat: 43.60, roleLabel: "Forge Node · Integration + Certification", status: "Deployment candidate" },
  { id: "AAE-N04", name: "Candidate · Northern Corridor",  role: "forge",     phase: 4, country: "—", lon:  4.35, lat: 50.85, roleLabel: "Forge Node · Integration + Certification", status: "Deployment candidate" },
  { id: "AAE-N05", name: "Candidate · Central Corridor",   role: "planned",   phase: 5, country: "—", lon:  6.96, lat: 51.23, roleLabel: "Network Node · Coverage lattice",         status: "Phase-aligned" },
  { id: "AAE-N06", name: "Candidate · Southern Corridor",  role: "planned",   phase: 5, country: "—", lon:  9.19, lat: 45.46, roleLabel: "Network Node · Coverage lattice",         status: "Phase-aligned" },
  { id: "AAE-N07", name: "Candidate · Alpine Corridor",    role: "planned",   phase: 5, country: "—", lon: 11.58, lat: 48.14, roleLabel: "Network Node · Coverage lattice",         status: "Phase-aligned" },
  { id: "AAE-N08", name: "Candidate · Eastern Corridor",   role: "planned",   phase: 5, country: "—", lon: 18.92, lat: 50.26, roleLabel: "Network Node · Coverage lattice",         status: "Phase-aligned" },
  { id: "AAE-N09", name: "Candidate · Atlantic Edge",      role: "planned",   phase: 5, country: "—", lon: -9.14, lat: 38.72, roleLabel: "Network Node · Coverage lattice",         status: "Phase-aligned" },
  { id: "AAE-N10", name: "Candidate · Nordic Edge",        role: "planned",   phase: 5, country: "—", lon: 18.06, lat: 59.33, roleLabel: "Network Node · Coverage lattice",         status: "Phase-aligned" },
];

// Major European metros for the "city lights" layer. Each [lon, lat, brightness 1-3].
// Intentionally sparse; the reference image is 80% dark.
const CITY_LIGHTS = [
  // UK & Ireland
  [-0.12, 51.50, 3], [-2.24, 53.48, 2], [-1.55, 53.80, 2], [-4.25, 55.86, 2], [-1.90, 52.48, 2], [-6.26, 53.35, 2], [-3.19, 55.95, 1], [-1.61, 54.97, 1], [-2.59, 51.45, 1],
  // France
  [2.35, 48.85, 3], [4.84, 45.76, 2], [5.37, 43.30, 2], [1.44, 43.60, 2], [7.27, 43.70, 1], [-1.55, 47.22, 1], [-0.57, 44.84, 1], [3.08, 50.63, 1], [4.40, 45.19, 1],
  // Iberia
  [-3.70, 40.42, 3], [2.17, 41.39, 2], [-8.61, 41.15, 2], [-9.14, 38.72, 2], [-5.98, 37.39, 1], [-0.37, 39.47, 1], [-4.42, 36.72, 1], [-5.66, 43.54, 1], [-2.93, 43.26, 1],
  // Benelux
  [4.35, 50.85, 2], [4.90, 52.37, 2], [4.48, 51.92, 2], [4.31, 52.08, 1], [6.13, 49.61, 1], [3.72, 51.05, 1],
  // Germany
  [13.40, 52.52, 3], [11.58, 48.14, 2], [9.99, 53.55, 2], [8.68, 50.11, 2], [6.77, 51.23, 2], [6.96, 50.94, 2], [11.08, 49.45, 1], [8.40, 49.01, 1], [9.18, 48.78, 1], [12.37, 51.34, 1], [13.74, 51.05, 1], [10.00, 51.53, 1], [7.47, 51.51, 1],
  // Switzerland / Austria
  [8.54, 47.37, 1], [7.45, 46.95, 1], [6.14, 46.20, 1], [16.37, 48.21, 2], [13.04, 47.81, 1], [14.30, 48.30, 1],
  // Italy
  [12.48, 41.90, 3], [9.19, 45.46, 2], [14.27, 40.85, 2], [11.26, 43.77, 1], [13.35, 38.12, 1], [12.34, 45.44, 1], [10.40, 44.49, 1], [13.37, 38.11, 1], [14.51, 35.90, 1],
  // Scandinavia
  [18.06, 59.33, 2], [10.75, 59.91, 2], [12.57, 55.68, 2], [24.94, 60.17, 2], [11.97, 57.71, 1], [13.19, 55.70, 1], [10.40, 63.43, 1], [5.33, 60.39, 1],
  // Poland + Central
  [21.01, 52.23, 2], [19.94, 50.06, 2], [17.04, 51.11, 1], [18.92, 50.26, 1], [16.92, 52.41, 1], [14.55, 53.43, 1],
  // Czech / Slovakia / Hungary
  [14.42, 50.07, 2], [19.04, 47.50, 2], [17.11, 48.15, 1], [16.60, 49.20, 1],
  // Balkans
  [20.46, 44.80, 1], [16.00, 45.81, 1], [14.50, 46.05, 1], [23.32, 42.70, 1], [26.10, 44.43, 1], [23.73, 37.98, 2],
  // Eastern
  [30.52, 50.45, 2], [27.56, 53.90, 1], [23.90, 54.69, 1], [24.10, 56.95, 1], [24.75, 59.44, 1],
  // North Africa (for atmospheric balance, reference shows it)
  [-7.59, 33.57, 1], [-5.00, 34.02, 1], [-3.00, 36.73, 1], [3.05, 36.75, 1], [10.18, 36.81, 1], [13.19, 32.89, 1],
];

// Edges: [fromIdx, toIdx, activatesAtPhase]
const EDGES = [
  [0, 1, 2],
  [0, 2, 3], [1, 2, 3],
  [2, 3, 4], [1, 3, 4], [0, 3, 4],
  [3, 4, 5], [3, 6, 5], [4, 7, 5], [2, 5, 5], [0, 8, 5],
  [6, 5, 5], [4, 9, 5], [7, 8, 5], [5, 6, 5],
];

// ============================================================
// ASYNC TOPOJSON LOADER, cached across mounts
// ============================================================
let _mapDataPromise = null;
function loadMapData() {
  if (_mapDataPromise) return _mapDataPromise;
  _mapDataPromise = fetch("https://unpkg.com/world-atlas@2.0.2/countries-50m.json")
    .then(r => r.json())
    .then(topo => {
      const countries = topojson.feature(topo, topo.objects.countries);
      const borders   = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
      const coastline = topojson.mesh(topo, topo.objects.countries, (a, b) => a === b);
      return { countries, borders, coastline };
    })
    .catch(e => { _mapDataPromise = null; throw e; });
  return _mapDataPromise;
}

// ============================================================
// PROJECTION, fixed Lambert conformal conic fit to Europe
// ============================================================
const VIEW_W = 1000;
const VIEW_H = 900;

function makeProjection(poster = false) {
  // Lambert conformal conic. Poster view zooms into industrial Europe
  // (France / Germany / N. Italy / Iberia) and crops the Arctic.
  if (poster) {
    return d3.geoConicConformal()
      .rotate([-8, 0])
      .center([2, 46])
      .parallels([42, 52])
      .scale(1600)
      .translate([VIEW_W / 2 + 30, VIEW_H / 2 + 180])
      .precision(0.3);
  }
  return d3.geoConicConformal()
    .rotate([-10, 0])
    .center([0, 52])
    .parallels([40, 60])
    .scale(950)
    .translate([VIEW_W / 2, VIEW_H / 2 + 30])
    .precision(0.3);
}

// Hero-only supplementary nodes. Dense in the industrial corridor
// mid-right of the frame so the hero composition balances the headline.
const POSTER_EXTRA = [
  { lon:  4.84, lat: 45.76 }, // Lyon
  { lon:  7.75, lat: 48.58 }, // Strasbourg
  { lon:  8.68, lat: 50.11 }, // Frankfurt
  { lon:  9.18, lat: 48.78 }, // Stuttgart
  { lon: 13.40, lat: 52.52 }, // Berlin
  { lon: 10.00, lat: 53.55 }, // Hamburg
  { lon:  7.58, lat: 47.56 }, // Basel
  { lon:  7.67, lat: 45.07 }, // Turin
  { lon: 12.48, lat: 41.90 }, // Rome
  { lon: 14.27, lat: 40.85 }, // Naples
  { lon: 11.26, lat: 43.77 }, // Florence
  { lon:  4.90, lat: 52.37 }, // Amsterdam
  { lon: -3.70, lat: 40.42 }, // Madrid
  { lon:  2.35, lat: 48.85 }, // Paris
];

// ============================================================
// MAP COMPONENT
// ============================================================
function EuropeMap({ phase, mode, active, setActive, poster = false }) {
  const [geo, setGeo] = useState(null);

  useEffect(() => {
    let alive = true;
    loadMapData().then(d => { if (alive) setGeo(d); });
    return () => { alive = false; };
  }, []);

  const projection = useMemo(() => makeProjection(poster), [poster]);
  const pathGen    = useMemo(() => d3.geoPath(projection), [projection]);

  // Project every node and city once
  const nodesProj = useMemo(
    () => NODES.map(n => {
      const p = projection([n.lon, n.lat]);
      return { ...n, x: p[0], y: p[1] };
    }),
    [projection]
  );
  const cityLightsProj = useMemo(
    () => CITY_LIGHTS.map(([lon, lat, b]) => {
      const p = projection([lon, lat]);
      return p ? { x: p[0], y: p[1], b } : null;
    }).filter(Boolean),
    [projection]
  );

  // Hero-only extra node scatter
  const posterExtras = useMemo(
    () => POSTER_EXTRA.map(n => {
      const p = projection([n.lon, n.lat]);
      return p ? { x: p[0], y: p[1] } : null;
    }).filter(Boolean),
    [projection]
  );

  // Poster edges: connect every operational/extra node to its 2-3 nearest peers
  const posterEdges = useMemo(() => {
    if (!poster) return [];
    const pts = [
      ...nodesProj.filter(n => n.role !== "planned").map(n => ({ x: n.x, y: n.y })),
      ...posterExtras,
    ];
    const edges = [];
    for (let i = 0; i < pts.length; i++) {
      const dists = pts.map((p, j) => ({ j, d: i === j ? Infinity : Math.hypot(p.x - pts[i].x, p.y - pts[i].y) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      dists.forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edges.find(e => e.key === key)) {
          edges.push({ key, a: pts[i], b: pts[j] });
        }
      });
    }
    return edges;
  }, [poster, nodesProj, posterExtras]);

  // In poster mode, exclude nodes outside the industrial core frame
  const POSTER_EXCLUDE = new Set(["AAE-N10"]); // Stockholm (too far north for the cropped hero view)
  const visibleNodeIdx = nodesProj
    .map((n, i) => (n.phase <= phase && !(poster && POSTER_EXCLUDE.has(n.id)) ? i : null))
    .filter(v => v !== null);
  const visibleSet = new Set(visibleNodeIdx);
  const visibleEdges = EDGES.filter(([a, b, p]) => p <= phase && visibleSet.has(a) && visibleSet.has(b));
  const isFlow     = mode === "flow";
  const isCoverage = mode === "coverage";

  // Coverage radius: approx 450km ground reach, projected
  const covR = (() => {
    const ref = NODES[0];
    const a = projection([ref.lon, ref.lat]);
    const b = projection([ref.lon + 6, ref.lat]); // ~500km at mid-lat
    return a && b ? Math.hypot(a[0] - b[0], a[1] - b[1]) : 140;
  })();

  return (
    <svg className="net-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Ocean: deep navy with subtle radial falloff */}
        <radialGradient id="ocean-grad" cx="50%" cy="45%" r="70%">
          <stop offset="0%"  stopColor="oklch(14% 0.020 245)"/>
          <stop offset="70%" stopColor="oklch(11% 0.015 250)"/>
          <stop offset="100%" stopColor="oklch(8% 0.010 250)"/>
        </radialGradient>

        {/* Land fill, slightly lifted from ocean */}
        <linearGradient id="land-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(17% 0.012 245)"/>
          <stop offset="100%" stopColor="oklch(13% 0.010 250)"/>
        </linearGradient>

        <filter id="city-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="1.6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hq-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        <radialGradient id="hq-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="oklch(84% 0.14 78)" stopOpacity="0.55"/>
          <stop offset="40%" stopColor="oklch(78% 0.13 78)" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="oklch(72% 0.12 78)" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="cov-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="oklch(72% 0.14 235)" stopOpacity="0.22"/>
          <stop offset="60%" stopColor="oklch(72% 0.14 235)" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="oklch(72% 0.14 235)" stopOpacity="0"/>
        </radialGradient>

        {/* Clip land to land so city dots don't leak into ocean */}
        {geo && (
          <clipPath id="land-clip">
            <path d={pathGen(geo.countries)}/>
          </clipPath>
        )}
      </defs>

      {/* OCEAN */}
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#ocean-grad)"/>

      {/* GRATICULE, faint */}
      <g stroke="oklch(28% 0.010 245)" strokeWidth="0.4" opacity="0.35" fill="none">
        {[-20, -10, 0, 10, 20, 30, 40].map(lon => {
          const line = d3.geoPath(projection)({
            type: "LineString",
            coordinates: d3.range(25, 72, 1).map(lat => [lon, lat]),
          });
          return <path key={"gx" + lon} d={line}/>;
        })}
        {[30, 40, 50, 60, 70].map(lat => {
          const line = d3.geoPath(projection)({
            type: "LineString",
            coordinates: d3.range(-25, 50, 1).map(lon => [lon, lat]),
          });
          return <path key={"gy" + lat} d={line}/>;
        })}
      </g>

      {geo && (
        <>
          {/* LAND FILL */}
          <path d={pathGen(geo.countries)}
            fill="url(#land-grad)"
            stroke="none"/>

          {/* INTERNAL COUNTRY BORDERS, very faint */}
          <path d={pathGen(geo.borders)}
            fill="none"
            stroke="oklch(24% 0.010 245)"
            strokeWidth="0.35"
            opacity="0.7"
            vectorEffect="non-scaling-stroke"/>

          {/* COASTLINE, glowing cyan edge */}
          <path d={pathGen(geo.coastline)}
            fill="none"
            stroke="oklch(55% 0.08 230)"
            strokeWidth="0.9"
            opacity="0.55"
            vectorEffect="non-scaling-stroke"/>
          <path d={pathGen(geo.coastline)}
            fill="none"
            stroke="oklch(75% 0.10 220)"
            strokeWidth="0.35"
            opacity="0.85"
            vectorEffect="non-scaling-stroke"/>

          {/* CITY LIGHTS, clipped to land */}
          <g clipPath="url(#land-clip)">
            {cityLightsProj.map((c, i) => {
              const r = c.b === 3 ? 2.0 : c.b === 2 ? 1.3 : 0.8;
              const op = c.b === 3 ? 1 : c.b === 2 ? 0.85 : 0.6;
              return (
                <g key={"ct" + i}>
                  {c.b >= 2 && (
                    <circle cx={c.x} cy={c.y} r={r * 3}
                      fill="oklch(92% 0.08 90)" opacity={op * 0.25} filter="url(#city-glow)"/>
                  )}
                  <circle cx={c.x} cy={c.y} r={r}
                    fill={c.b === 3 ? "oklch(96% 0.06 90)" : "oklch(90% 0.05 90)"}
                    opacity={op}/>
                </g>
              );
            })}
          </g>
        </>
      )}

      {/* COVERAGE RINGS */}
      {isCoverage && nodesProj.filter((n, i) => visibleSet.has(i) && n.role !== "planned").map(n => (
        <g key={"cov" + n.id}>
          <circle cx={n.x} cy={n.y} r={covR} fill="url(#cov-grad)"/>
          <circle cx={n.x} cy={n.y} r={covR}
            fill="none" stroke="oklch(72% 0.14 235)"
            strokeWidth="0.6" strokeDasharray="2 5" opacity="0.5"/>
        </g>
      ))}

      {/* NETWORK EDGES, straight lines with traveling particles */}
      {!isFlow && !poster && visibleEdges.map(([a, b], i) => {
        const A = nodesProj[a], B = nodesProj[b];
        const d = `M ${A.x} ${A.y} L ${B.x} ${B.y}`;
        return (
          <g key={"e" + i}>
            <path d={d} fill="none"
              stroke="oklch(70% 0.12 230)"
              strokeWidth="0.9"
              opacity="0.55"/>
            <circle r="2.4" fill="oklch(90% 0.12 230)" filter="url(#node-glow)">
              <animateMotion dur={`${3 + (i % 5) * 0.5}s`} repeatCount="indefinite" path={d}/>
            </circle>
          </g>
        );
      })}

      {/* POSTER MESH: dense, flat-hierarchy routing */}
      {poster && posterEdges.map((e, i) => {
        const d = `M ${e.a.x} ${e.a.y} L ${e.b.x} ${e.b.y}`;
        const len = Math.hypot(e.a.x - e.b.x, e.a.y - e.b.y);
        const isLong = len > 140;
        return (
          <g key={"pe" + i}>
            <path d={d} fill="none"
              stroke="oklch(72% 0.12 230)"
              strokeWidth={isLong ? 0.55 : 0.85}
              opacity={isLong ? 0.35 : 0.6}/>
            {i % 3 === 0 && (
              <circle r="1.8" fill="oklch(90% 0.12 230)" filter="url(#node-glow)">
                <animateMotion dur={`${3 + (i % 5) * 0.5}s`} repeatCount="indefinite" path={d}/>
              </circle>
            )}
          </g>
        );
      })}

      {/* PROGRAM FLOW: routing into the candidate command layer */}
      {isFlow && nodesProj.filter((n, i) => visibleSet.has(i) && n.role !== "candidate" && n.role !== "planned").map((forge, fi) => {
        const anchor = nodesProj.find(n => n.role === "candidate") || nodesProj[0];
        const d = `M ${forge.x} ${forge.y} L ${anchor.x} ${anchor.y}`;
        return (
          <g key={"flow" + fi}>
            <path d={d} fill="none"
              stroke="oklch(82% 0.14 230)"
              strokeWidth="1.1" opacity="0.7"/>
            <circle r="3" fill="oklch(92% 0.12 230)" filter="url(#node-glow)">
              <animateMotion dur="3.2s" repeatCount="indefinite" path={d}/>
            </circle>
          </g>
        );
      })}

      {/* GOLD FEEDER DOTS — small supplier points around each operational node,
          with tiny particle trails flowing inward */}
      {nodesProj.map((n, i) => {
        if (!visibleSet.has(i)) return null;
        if (n.role === "planned" && !poster) return null;
        // deterministic scatter based on node id
        const seed = n.id.charCodeAt(n.id.length - 1) + n.id.charCodeAt(0);
        const count = poster ? 5 : (n.role === "hq" ? 9 : n.role === "hub" ? 6 : 4);
        const feeders = Array.from({ length: count }, (_, k) => {
          const a = ((seed * 37 + k * 77) % 360) * Math.PI / 180;
          const r = 22 + ((seed * 13 + k * 29) % 26);
          return {
            x: n.x + Math.cos(a) * r,
            y: n.y + Math.sin(a) * r * 0.75,
            k,
          };
        });
        return (
          <g key={"feed" + n.id} opacity={n.role === "planned" ? 0.45 : 1}>
            {feeders.map((f, k) => {
              const d = `M ${f.x} ${f.y} L ${n.x} ${n.y}`;
              return (
                <g key={k}>
                  <path d={d} stroke="oklch(82% 0.12 78)" strokeWidth="0.35" opacity="0.3" fill="none"/>
                  <circle cx={f.x} cy={f.y} r="1.1"
                    fill="oklch(92% 0.13 82)" filter="url(#city-glow)" opacity="0.95"/>
                  <circle r="1.4" fill="oklch(94% 0.14 82)" filter="url(#city-glow)" opacity="0.9">
                    <animateMotion dur={`${2.2 + (k % 4) * 0.5}s`} repeatCount="indefinite" path={d}
                      begin={`${(k * 0.35) % 2}s`}/>
                  </circle>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* POSTER MODE: small secondary nodes on industrial cities */}
      {poster && posterExtras.map((n, i) => (
        <g key={"pnx" + i}>
          <circle cx={n.x} cy={n.y} r="9" fill="none"
            stroke="oklch(72% 0.12 230)" strokeWidth="0.6" opacity="0.35"/>
          <circle cx={n.x} cy={n.y} r="3.5" fill="oklch(82% 0.14 230)"
            filter="url(#node-glow)" opacity="0.9"/>
        </g>
      ))}

      {/* NODES */}
      {nodesProj.map((n, i) => {
        if (!visibleSet.has(i)) return null;
        const isActive     = active === i;
        const isPlanned    = n.role === "planned";
        const isCurrentPhase = n.phase === phase;
        // Labels accumulate across phases by default. Instead, only show a label
        // for the node(s) the current gate activates, plus whichever node the user
        // has explicitly selected. At phase 5 multiple nodes match; we render a
        // single grouped annotation below instead of per-node callouts.
        const phase5Group  = phase === 5 && isCurrentPhase;
        const showLabel    = !poster && (isActive || (isCurrentPhase && phase !== 5));
        // Quiet emphasis on non-active-phase nodes; lift the current phase.
        const emphasize    = isCurrentPhase || isActive;
        const quietOpacity = emphasize ? 1 : 0.55;

        // Poster mode: flat hierarchy. Everyone is a primary cyan node.
        if (poster) {
          const pDotR = isPlanned ? 4.5 : 5.5;
          return (
            <g key={n.id}>
              {/* subtle halo */}
              <circle cx={n.x} cy={n.y} r="18" fill="none"
                stroke="oklch(72% 0.12 230)" strokeWidth="0.8" opacity="0.55"/>
              <circle cx={n.x} cy={n.y} r="10" fill="none"
                stroke="oklch(82% 0.12 230)" strokeWidth="0.6" opacity="0.5">
                <animate attributeName="r" values="8;18;8" dur={`${2.8 + (i % 3) * 0.4}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0;0.7" dur={`${2.8 + (i % 3) * 0.4}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={n.x} cy={n.y} r={pDotR} fill="oklch(84% 0.14 230)"
                filter="url(#node-glow)"/>
            </g>
          );
        }

        const color     = "oklch(82% 0.14 230)";
        const dotR      = (isPlanned ? 4 : 5.5) * (emphasize ? 1 : 0.9);
        const ringR     = isActive ? 22 : (isCurrentPhase ? 19 : 16);
        const plannedRingOpacity = isPlanned ? (emphasize ? 0.7 : 0.3) : (emphasize ? 0.9 : 0.45);

        return (
          <g key={n.id} style={{ cursor: "pointer", transition: "opacity 400ms ease" }}
             opacity={quietOpacity}
             onClick={() => setActive(i)}>
            {/* outer target ring */}
            <circle cx={n.x} cy={n.y} r={ringR}
              fill="none" stroke={color}
              strokeWidth={isActive ? 1.4 : isCurrentPhase ? 1.2 : 0.9}
              opacity={plannedRingOpacity}/>

            {/* crosshair ticks */}
            <g stroke={color} strokeWidth="0.7" opacity={isPlanned ? (emphasize ? 0.6 : 0.25) : (emphasize ? 0.8 : 0.45)}>
              <line x1={n.x - ringR - 4} y1={n.y} x2={n.x - ringR + 2} y2={n.y}/>
              <line x1={n.x + ringR - 2} y1={n.y} x2={n.x + ringR + 4} y2={n.y}/>
              <line x1={n.x} y1={n.y - ringR - 4} x2={n.x} y2={n.y - ringR + 2}/>
              <line x1={n.x} y1={n.y + ringR - 2} x2={n.x} y2={n.y + ringR + 4}/>
            </g>

            {/* pulse, active-phase emphasis only */}
            {emphasize && (
              <circle cx={n.x} cy={n.y} r="10" fill="none"
                stroke={color} strokeWidth={isCurrentPhase ? 1 : 0.8}
                opacity={isCurrentPhase ? 0.7 : 0.55}>
                <animate attributeName="r" values={`${ringR - 2};${ringR + 14};${ringR - 2}`}
                  dur={isCurrentPhase ? "2.6s" : "3.2s"} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0;0.8"
                  dur={isCurrentPhase ? "2.6s" : "3.2s"} repeatCount="indefinite"/>
              </circle>
            )}

            {/* core dot */}
            <circle cx={n.x} cy={n.y} r={dotR} fill={color}
              filter={emphasize ? "url(#node-glow)" : undefined}
              opacity={isPlanned ? (emphasize ? 0.9 : 0.55) : (emphasize ? 1 : 0.75)}/>

            {/* label — only for the node(s) this gate activates, or the explicitly selected node */}
            {showLabel && (
              <g transform={`translate(${n.x + ringR + 8}, ${n.y - 16})`}
                 style={{ transition: "opacity 400ms ease" }}>
                <rect x="-4" y="-11" width={n.name.length * 6.8 + 10} height="30"
                  fill="oklch(11% 0.010 250)" opacity={isActive ? 0.92 : 0.82}
                  stroke={color} strokeWidth={isActive ? 0.7 : 0.5}/>
                <text fontFamily="var(--f-mono)" fontSize="9"
                  fill="oklch(62% 0.008 250)" letterSpacing="1">{n.id}</text>
                <text y="13" fontFamily="var(--f-display)" fontSize="13"
                  fill={color} fontWeight="500">{n.name}</text>
              </g>
            )}
          </g>
        );
      })}

      {/* PHASE 5 GROUPED ANNOTATION — one compact summary instead of 6 stacked callouts.
          Anchored to the visible phase-5 node centroid so it sits inside the coverage cluster. */}
      {!poster && phase === 5 && (() => {
        const p5 = nodesProj.filter((n, i) => n.phase === 5 && visibleSet.has(i));
        if (!p5.length) return null;
        const cx = p5.reduce((s, n) => s + n.x, 0) / p5.length;
        const cy = p5.reduce((s, n) => s + n.y, 0) / p5.length;
        const anchor = p5.reduce((best, n) => {
          const d = Math.hypot(n.x - cx, n.y - cy);
          return d < best.d ? { n, d } : best;
        }, { n: p5[0], d: Infinity }).n;
        const label = "Continental coverage lattice";
        const sub   = `+${p5.length} corridor nodes · single-day ground radius`;
        const w     = Math.max(label.length, sub.length) * 6.8 + 20;
        return (
          <g transform={`translate(${anchor.x + 28}, ${anchor.y - 38})`}
             style={{ transition: "opacity 400ms ease" }}>
            <line x1="-20" y1="38" x2="-4" y2="18"
              stroke="oklch(82% 0.14 230)" strokeWidth="0.6" opacity="0.6"/>
            <rect x="-4" y="-11" width={w} height="42"
              fill="oklch(11% 0.010 250)" opacity="0.9"
              stroke="oklch(82% 0.14 230)" strokeWidth="0.7"/>
            <text fontFamily="var(--f-mono)" fontSize="9"
              fill="oklch(62% 0.008 250)" letterSpacing="1.2">GATE 5 · ACTIVE</text>
            <text y="13" fontFamily="var(--f-display)" fontSize="13"
              fill="oklch(82% 0.14 230)" fontWeight="500">{label}</text>
            <text y="26" fontFamily="var(--f-mono)" fontSize="9"
              fill="oklch(70% 0.010 245)" letterSpacing="0.8">{sub}</text>
          </g>
        );
      })()}

      {/* HUD CORNERS */}
      {!poster && (
        <g fontFamily="var(--f-mono)" fontSize="10" fill="oklch(50% 0.010 245)" letterSpacing="1.5">
          <text x="18" y="26">AAE · EU · REV 2026.04 · LIVE</text>
          <text x={VIEW_W - 18} y="26" textAnchor="end">PHASE {phase}/5</text>
          <text x="18" y={VIEW_H - 18}>SCHEMATIC · NOT TO SCALE</text>
          <text x={VIEW_W - 18} y={VIEW_H - 18} textAnchor="end">
            {visibleNodeIdx.length} NODES TRACKED · {mode.toUpperCase()}
          </text>
        </g>
      )}

      {/* Loading state */}
      {!geo && (
        <g fontFamily="var(--f-mono)" fontSize="11" fill="oklch(55% 0.010 245)" letterSpacing="2">
          <text x={VIEW_W / 2} y={VIEW_H / 2} textAnchor="middle" opacity="0.7">
            ACQUIRING GEODETIC DATA…
          </text>
        </g>
      )}
    </svg>
  );
}

window.EuropeMap = EuropeMap;
window.ASGARD_NODES = NODES;
