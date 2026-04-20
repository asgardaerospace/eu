/* global React, EuropeMap, REGIONS_DATA, PHASES_US, PHASES_EU, KB_CATEGORIES, ASGARD_NODES */
const { useState, useEffect, useRef, Fragment } = React;

// ============================================================
// SHARED BITS
// ============================================================
function Eyebrow({ children }) {
  return <div className="eyebrow"><span className="dot"/>{children}</div>;
}

function SecHead({ id, tag, title, lede, meta }) {
  return (
    <header className="sec-head" id={id}>
      <div className="sec-id">
        <span>§ <strong>{tag}</strong></span>
        {meta && <span>{meta}</span>}
      </div>
      <div>
        <h2>{title}</h2>
        {lede && <p className="lede">{lede}</p>}
      </div>
    </header>
  );
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="reveal" style={{ transitionDelay: delay + "ms" }}>{children}</div>;
}

// ============================================================
// NAV
// ============================================================
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-brand">
          <svg className="mark" viewBox="0 0 40 40" fill="none">
            <path d="M20 3 L34 34 L6 34 Z" stroke="var(--text-hi)" strokeWidth="1.4"/>
            <path d="M20 14 L28 30 L12 30 Z" fill="var(--accent)" opacity="0.9"/>
            <circle cx="20" cy="22" r="1.6" fill="var(--bg-void)"/>
          </svg>
          <div>
            <div className="name">Asgard Aerospace</div>
          </div>
          <span className="sub">Europe · AAE</span>
        </div>
        <div className="nav-links">
          <a href="#overview">Overview</a>
          <a href="#model">Model</a>
          <a href="#network">Network</a>
          <a href="#programflow">Program Flow</a>
          <a href="#regions">Regions</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#kb">Knowledge Base</a>
        </div>
        <a href="https://calendly.com/odin-asgardaerospace/asgard-aerospace-introduction" target="_blank" rel="noopener" className="nav-cta">Request Briefing →</a>
      </div>
    </nav>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero() {
  return (
    <section className="hero hero-bleed" id="top">
      <div className="hero-map-layer">
        <EuropeMap phase={5} mode="network" active={0} setActive={() => {}} poster={true}/>
        <div className="hero-map-fade"/>
        <div className="hero-map-vignette"/>
      </div>

      <div className="shell hero-inner">
        <div className="hero-copy">
          <Eyebrow>AAE · Continental Platform · v1.0</Eyebrow>
          <h1>
            The missing<br/>
            <em>infrastructure layer</em><br/>
            for European<br/>
            aerospace<br/>
            manufacturing.
          </h1>
          <p className="sub">
            Europe's industrial base is capable. It is not coordinated. Without a routing and control layer,
            capacity cannot scale to meet defense demand. Asgard Aerospace Europe is the platform that converts
            distributed capability into continental throughput: sovereign-aligned, compliance-embedded,
            and operationally proven.
          </p>
          <div className="hero-ctas">
            <a className="btn primary" href="#network">Explore the European Network <span className="arrow">→</span></a>
            <a className="btn" href="#regions">View Strategic Regions</a>
            <a className="btn" href="#operating">Review Operating Model</a>
          </div>

          <div className="hero-meta">
            <div>
              <div className="coord">Motto</div>
              <div className="hero-meta-val">Forging Brilliance,<br/>Destined by Design.</div>
            </div>
            <div>
              <div className="coord">Deployment Horizon</div>
              <div className="hero-meta-val">HQ landing 0–3 mo;<br/>first facility 3–12 mo</div>
            </div>
            <div>
              <div className="coord">Network End-State</div>
              <div className="hero-meta-val">One-day ground reach<br/>across major EU corridors</div>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-ind">
        <span>Scroll · AAE//0001</span>
        <div className="line-anim"/>
      </div>
    </section>
  );
}

// ============================================================
// EXECUTIVE OVERVIEW
// ============================================================
function ExecOverview() {
  return (
    <section className="sec-pad" id="overview">
      <div className="shell">
        <SecHead tag="01 · Executive Overview" meta="Platform · Scope · Intent"
          title="The infrastructure layer Europe's aerospace base is missing."
          lede="Capability is not the constraint; coordination is. Asgard Aerospace Europe routes production across qualified suppliers, integrates work at controlled Forge nodes, and preserves certification continuity end-to-end. Without this layer, capacity does not convert into throughput, and throughput is what defense demand now requires."
        />

        <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "1px solid var(--line)"}}>
          {[
            ["01", "Convert capacity into throughput", "Thousands of qualified European suppliers run below their ceiling. Asgard routes consistent, high-value work across the base and turns latent capability into measurable production output."],
            ["02", "Execute compliance, don't retrofit it", "AS9100-aligned workflows, digital travelers, and configuration control ship with the routing layer. Every flow is auditable at source, certification is a property of execution, not a deliverable after the fact."],
            ["03", "Forge sovereign capability", "A dedicated European entity, aligned with regional funding and procurement frameworks, holds IP and operational control locally while sharing technical architecture across the transatlantic platform."],
            ["04", "Operate as allied infrastructure", "Shared routing, shared discipline, regional autonomy. European programs move at platform speed without fragmentation or control loss across borders."],
          ].map(([n,t,d], i) => (
            <div key={n} style={{padding: "32px 28px", borderRight: i<3 ? "1px solid var(--line)" : 0}}>
              <div style={{fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--accent)", letterSpacing: "0.14em", marginBottom: 16}}>MANDATE {n}</div>
              <h4 style={{fontFamily: "var(--f-display)", fontWeight: 500, fontSize: 18, color: "var(--text-hi)", letterSpacing: "-0.005em", marginBottom: 12, lineHeight: 1.2}}>{t}</h4>
              <p style={{fontSize: 13, color: "var(--text-dim)", lineHeight: 1.55}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PROBLEM — living execution matrix
// ============================================================
function probSeed(n) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Fragmented panel: jittered grid, deterministic per-node timings
const FRAG_NODES = (() => {
  const cols = 8, rows = 4, nodes = [];
  for (let i = 0; i < cols * rows; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const jx = (probSeed(i + 1) - 0.5) * 14;
    const jy = (probSeed(i + 101) - 0.5) * 12;
    const r = probSeed(i + 37);
    nodes.push({
      i,
      x: 46 + col * 44 + jx,
      y: 48 + row * 55 + jy,
      base: 0.18 + probSeed(i + 17) * 0.38,
      dur: (1.6 + probSeed(i + 29) * 3.2).toFixed(2),
      begin: (probSeed(i + 53) * 4).toFixed(2),
      flicker: probSeed(i + 71) < 0.22,
      dead: r < 0.18,
    });
  }
  return nodes;
})();

// Unsuccessful connection attempts: node pairs + phase offsets
const FRAG_ATTEMPTS = [
  [0, 10, 0.0], [3, 12, 0.7], [6, 14, 1.3], [9, 18, 2.1],
  [15, 23, 0.3], [17, 26, 1.8], [20, 28, 2.6], [13, 22, 3.2],
  [25, 31, 4.1], [4, 19, 4.7],
].map(([a, b, d]) => ({ a, b, d: d.toFixed(2) }));

// Coordinated panel: tiered matrix
const COORD_CENTER = { x: 200, y: 128 };

const COORD_T2 = Array.from({ length: 6 }, (_, i) => {
  const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
  return {
    i, ang,
    x: COORD_CENTER.x + Math.cos(ang) * 52,
    y: COORD_CENTER.y + Math.sin(ang) * 52 * 0.92,
  };
});

const COORD_T3 = Array.from({ length: 12 }, (_, i) => {
  const ang = (i / 12) * Math.PI * 2 - Math.PI / 2 + Math.PI / 12;
  const r = 104 + probSeed(i + 7) * 6;
  return {
    i, ang,
    x: COORD_CENTER.x + Math.cos(ang) * r,
    y: COORD_CENTER.y + Math.sin(ang) * r * 0.74,
  };
});

// Tier-2 → nearest tier-3 (2 per tier-2)
const COORD_T23 = (() => {
  const out = [];
  COORD_T3.forEach((n, ti) => {
    let bestD = Infinity, bestI = 0;
    COORD_T2.forEach((m, j) => {
      const d = (n.x - m.x) ** 2 + (n.y - m.y) ** 2;
      if (d < bestD) { bestD = d; bestI = j; }
    });
    out.push({ t3: ti, t2: bestI });
  });
  return out;
})();

// Tier-3 lateral cross-links (intelligent, not random)
const COORD_T3LAT = [[0, 1], [3, 4], [6, 7], [9, 10], [2, 11], [5, 8]];
// Tier-2 ring lateral
const COORD_T2RING = Array.from({ length: 6 }, (_, i) => [i, (i + 1) % 6]);

function Problem() {
  return (
    <section className="sec-pad" id="problem" style={{background: "var(--bg-base)"}}>
      <div className="shell">
        <SecHead tag="02 · The European Problem" meta="Fragmentation · Coordination Gap"
          title="Capability without coordination does not scale."
          lede="Thousands of certified European manufacturers run as independent nodes. Work reaches them through ad-hoc channels; certification continuity breaks at every handoff; utilization is invisible and unroutable. Defense demand is now accelerating faster than this fragmented structure can absorb, and without a coordination layer, capacity cannot be converted into throughput."
        />

        <div className="prob-split">
          <div className="prob-panel now">
            <div className="label">Current state · Fragmented</div>
            <h3>Distributed capability, uncoordinated execution</h3>
            <div className="prob-canvas frag">
              <svg viewBox="0 0 400 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="fragDead" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="var(--line-strong)" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="var(--line-strong)" stopOpacity="0"/>
                  </radialGradient>
                </defs>

                {/* idle-capacity dead zones */}
                <ellipse cx="88" cy="195" rx="74" ry="42" fill="url(#fragDead)" opacity="0.45"/>
                <ellipse cx="312" cy="62" rx="58" ry="36" fill="url(#fragDead)" opacity="0.35"/>

                {/* unsuccessful connection attempts — brief, never stabilize */}
                {FRAG_ATTEMPTS.map(({ a, b, d }, k) => {
                  const A = FRAG_NODES[a], B = FRAG_NODES[b];
                  if (!A || !B) return null;
                  return (
                    <line key={`att-${k}`}
                      x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                      stroke="var(--text-faint)" strokeWidth="0.5"
                      strokeDasharray="3 4" opacity="0">
                      <animate attributeName="opacity"
                        values="0;0.28;0.18;0" keyTimes="0;0.18;0.55;1"
                        dur="2.4s" begin={`${d}s`} repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset"
                        values="0;-14" dur="2.4s" begin={`${d}s`} repeatCount="indefinite"/>
                    </line>
                  );
                })}

                {/* nodes — asynchronous pulse, flicker, dim subset */}
                {FRAG_NODES.map(n => {
                  const vals = n.flicker
                    ? `${n.base};${(n.base * 0.25).toFixed(3)};${n.base};${(n.base * 0.15).toFixed(3)};${(n.base * 0.9).toFixed(3)};${n.base}`
                    : `${n.base};${(n.base * 1.3).toFixed(3)};${(n.base * 0.55).toFixed(3)};${n.base}`;
                  const kt = n.flicker ? "0;0.08;0.18;0.32;0.55;1" : "0;0.4;0.7;1";
                  const fill = n.dead ? "var(--line-strong)" : "var(--text-dim)";
                  return (
                    <g key={n.i} className="frag-node">
                      <circle cx={n.x} cy={n.y} r="3.4" fill={fill} opacity={n.base}>
                        {!n.dead && (
                          <animate attributeName="opacity"
                            values={vals} keyTimes={kt}
                            dur={`${n.dur}s`} begin={`${n.begin}s`} repeatCount="indefinite"/>
                        )}
                      </circle>
                      <circle cx={n.x} cy={n.y} r="6.5" fill="none"
                        stroke="var(--line)" strokeWidth="0.4"
                        opacity={n.dead ? 0.15 : 0.28}/>
                    </g>
                  );
                })}

                <text x="200" y="246" textAnchor="middle"
                  fontFamily="var(--f-mono)" fontSize="9"
                  fill="var(--text-faint)" letterSpacing="1.6" opacity="0.55">
                  UNROUTED CAPACITY
                </text>
              </svg>
            </div>
            <ul className="prob-list">
              <li>Execution distributed across independent suppliers</li>
              <li>Compliance continuity breaks across facilities</li>
              <li>Utilization inconsistent; capacity invisible</li>
              <li>Configuration control vulnerable across programs</li>
            </ul>
          </div>

          <div className="prob-panel future">
            <div className="label">Asgard state · Coordinated</div>
            <h3>Distributed production, centralized control</h3>
            <div className="prob-canvas coord">
              <svg viewBox="0 0 400 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="pf" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="oklch(72% 0.14 235)" stopOpacity="0.3"/>
                    <stop offset="55%" stopColor="oklch(72% 0.14 235)" stopOpacity="0.08"/>
                    <stop offset="100%" stopColor="oklch(72% 0.14 235)" stopOpacity="0"/>
                  </radialGradient>
                  <filter id="coordGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.4" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                <circle cx={COORD_CENTER.x} cy={COORD_CENTER.y} r="108" fill="url(#pf)"/>

                {/* coordinated outward pulse waves */}
                {[0, 1.6, 3.2].map((b, k) => (
                  <circle key={`wave-${k}`}
                    cx={COORD_CENTER.x} cy={COORD_CENTER.y}
                    r="12" fill="none" stroke="var(--accent)" strokeWidth="0.6">
                    <animate attributeName="r" values="12;105" dur="4.8s" begin={`${b}s`} repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.55;0" dur="4.8s" begin={`${b}s`} repeatCount="indefinite"/>
                  </circle>
                ))}

                {/* persistent center → tier-2 routes */}
                {COORD_T2.map(n => (
                  <line key={`c2-${n.i}`}
                    x1={COORD_CENTER.x} y1={COORD_CENTER.y} x2={n.x} y2={n.y}
                    stroke="var(--accent)" strokeWidth="0.7" opacity="0.5"/>
                ))}

                {/* tier-2 ring (lateral orchestration) */}
                {COORD_T2RING.map(([a, b], k) => (
                  <line key={`t2r-${k}`}
                    x1={COORD_T2[a].x} y1={COORD_T2[a].y}
                    x2={COORD_T2[b].x} y2={COORD_T2[b].y}
                    stroke="var(--accent)" strokeWidth="0.35"
                    strokeDasharray="2 3" opacity="0.22"/>
                ))}

                {/* tier-2 → tier-3 routes */}
                {COORD_T23.map(({ t3, t2 }, k) => (
                  <line key={`t23-${k}`}
                    x1={COORD_T2[t2].x} y1={COORD_T2[t2].y}
                    x2={COORD_T3[t3].x} y2={COORD_T3[t3].y}
                    stroke="var(--accent)" strokeWidth="0.45" opacity="0.32"/>
                ))}

                {/* tier-3 lateral cross-node routing */}
                {COORD_T3LAT.map(([a, b], k) => (
                  <line key={`t3l-${k}`}
                    x1={COORD_T3[a].x} y1={COORD_T3[a].y}
                    x2={COORD_T3[b].x} y2={COORD_T3[b].y}
                    stroke="var(--accent)" strokeWidth="0.3"
                    strokeDasharray="1 3" opacity="0.18"/>
                ))}

                {/* data pulses: center → tier-2 (outbound dispatch) */}
                {COORD_T2.map((n, i) => {
                  const begin = (i * 0.35).toFixed(2);
                  return (
                    <circle key={`flow-c2-${i}`} r="1.8" fill="var(--accent-hi)" opacity="0">
                      <animateMotion
                        path={`M ${COORD_CENTER.x} ${COORD_CENTER.y} L ${n.x} ${n.y}`}
                        dur="2.4s" begin={`${begin}s`} repeatCount="indefinite"/>
                      <animate attributeName="opacity"
                        values="0;1;1;0" keyTimes="0;0.1;0.85;1"
                        dur="2.4s" begin={`${begin}s`} repeatCount="indefinite"/>
                    </circle>
                  );
                })}

                {/* data pulses: tier-2 → tier-3 (propagation wave) */}
                {COORD_T23.map(({ t3, t2 }, k) => {
                  const begin = (k * 0.18 + 0.6).toFixed(2);
                  return (
                    <circle key={`flow-t23-${k}`} r="1.4" fill="var(--accent-hi)" opacity="0">
                      <animateMotion
                        path={`M ${COORD_T2[t2].x} ${COORD_T2[t2].y} L ${COORD_T3[t3].x} ${COORD_T3[t3].y}`}
                        dur="2.8s" begin={`${begin}s`} repeatCount="indefinite"/>
                      <animate attributeName="opacity"
                        values="0;1;1;0" keyTimes="0;0.12;0.82;1"
                        dur="2.8s" begin={`${begin}s`} repeatCount="indefinite"/>
                    </circle>
                  );
                })}

                {/* occasional routing burst: bidirectional returns from tier-2 to center */}
                {COORD_T2.filter((_, i) => i % 2 === 0).map((n, i) => {
                  const begin = (4.2 + i * 0.15).toFixed(2);
                  return (
                    <circle key={`flow-r-${i}`} r="1.3" fill="var(--accent-hi)" opacity="0">
                      <animateMotion
                        path={`M ${n.x} ${n.y} L ${COORD_CENTER.x} ${COORD_CENTER.y}`}
                        dur="6s" begin={`${begin}s`} repeatCount="indefinite"/>
                      <animate attributeName="opacity"
                        values="0;0;1;1;0;0" keyTimes="0;0.05;0.12;0.22;0.3;1"
                        dur="6s" begin={`${begin}s`} repeatCount="indefinite"/>
                    </circle>
                  );
                })}

                {/* tier-3 nodes — locked into system, synchronized wave pulse */}
                {COORD_T3.map(n => (
                  <g key={`t3n-${n.i}`} className="coord-node t3">
                    <circle cx={n.x} cy={n.y} r="2.8" fill="var(--accent)" opacity="0.7">
                      <animate attributeName="opacity"
                        values="0.55;0.95;0.55" dur="3.2s"
                        begin={`${(n.i * 0.08).toFixed(2)}s`} repeatCount="indefinite"/>
                    </circle>
                  </g>
                ))}

                {/* tier-2 nodes — primary handoffs */}
                {COORD_T2.map(n => (
                  <g key={`t2n-${n.i}`} className="coord-node t2">
                    <circle cx={n.x} cy={n.y} r="4.6" fill="var(--accent)">
                      <animate attributeName="opacity"
                        values="0.8;1;0.8" dur="2.6s"
                        begin={`${(n.i * 0.12).toFixed(2)}s`} repeatCount="indefinite"/>
                    </circle>
                    <circle cx={n.x} cy={n.y} r="7.6" fill="none"
                      stroke="var(--accent)" strokeWidth="0.6" opacity="0.35"/>
                  </g>
                ))}

                {/* tier-1 execution layer core */}
                <circle cx={COORD_CENTER.x} cy={COORD_CENTER.y} r="11"
                  fill="var(--accent)" filter="url(#coordGlow)"/>
                <circle cx={COORD_CENTER.x} cy={COORD_CENTER.y} r="11"
                  fill="none" stroke="var(--accent-hi)" strokeWidth="0.6" opacity="0.55">
                  <animate attributeName="opacity"
                    values="0.45;0.9;0.45" dur="3.6s" repeatCount="indefinite"/>
                </circle>
                <circle cx={COORD_CENTER.x} cy={COORD_CENTER.y} r="16"
                  fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.7">
                  <animate attributeName="r" values="14;22;14" dur="2.8s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.7;0.05;0.7" dur="2.8s" repeatCount="indefinite"/>
                </circle>

                <text x={COORD_CENTER.x} y="246" textAnchor="middle"
                  fontFamily="var(--f-mono)" fontSize="9"
                  fill="var(--text-faint)" letterSpacing="1.6">
                  UNIFIED EXECUTION LAYER
                </text>
              </svg>
            </div>
            <ul className="prob-list">
              <li>Coordinated routing across qualified suppliers</li>
              <li>Compliance and traceability embedded in workflow</li>
              <li>Continuous visibility; capacity surfaces and flows</li>
              <li>Configuration control preserved end-to-end</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Nav = Nav;
window.Hero = Hero;
window.ExecOverview = ExecOverview;
window.Problem = Problem;
window.Eyebrow = Eyebrow;
window.SecHead = SecHead;
window.Reveal = Reveal;
