/* global React, EuropeMap, ASGARD_NODES, REGIONS_DATA, SecHead */
const { useState: useState3 } = React;

// ============================================================
// NETWORK, Europe map with phase & mode toggles
// ============================================================
function Network() {
  const [phase, setPhase] = useState3(1);
  const [mode, setMode] = useState3("network"); // network | coverage | regions
  const [active, setActive] = useState3(0);

  const node = ASGARD_NODES[active];

  return (
    <section className="sec-pad" id="network">
      <div className="shell">
        <SecHead tag="07 · Continental Network Strategy" meta="Distributed · Gated Activation"
          title="Distributed production. Controlled execution. A network, not a site."
          lede="The architecture is fixed; the locations are selected. Each node is a control point in a continental manufacturing system — a candidate anchor, Forge, or network node activated only when routing density, compliance continuity, and regional alignment clear the gate. Every major European industrial corridor resolves into one-day reach of a system node, regardless of which specific regions enter first."
        />

        <div className="net-wrap">
          <div className="net-canvas">
            <div className="grid-layer"/>
            <EuropeMap phase={phase} mode={mode} active={active} setActive={setActive}/>
          </div>

          <aside className="net-panel">
            <div className="meta"><span>Node · {node.id}</span><span>Selected candidate</span></div>
            <h3>Node Profile</h3>
            <div className="tagrow">
              {node.role === "candidate" && <span className="tag on">● Candidate HQ</span>}
              {node.role === "forge"     && <span className="tag on">● Forge Node</span>}
              {node.role === "planned"   && <span className="tag">◌ Network Node</span>}
              <span className="tag">{node.status}</span>
            </div>
            <p>{node.roleLabel}</p>

            <dl>
              <div><dt>Role</dt><dd>{node.role === "candidate" ? "Candidate HQ" : node.role === "forge" ? "Forge Node" : "Network Node"}</dd></div>
              <div><dt>Status</dt><dd>{node.status}</dd></div>
              <div><dt>Radius</dt><dd>8 to 10 hr</dd></div>
              <div><dt>Topology</dt><dd>Distributed · routed</dd></div>
            </dl>

            <div className="coord" style={{marginTop: 8}}>View mode</div>
            <div className="net-toggle">
              <button className={mode==="network"?"on":""} onClick={()=>setMode("network")}>Network</button>
              <button className={mode==="coverage"?"on":""} onClick={()=>setMode("coverage")}>Coverage</button>
              <button className={mode==="flow"?"on":""} onClick={()=>setMode("flow")}>Program Flow</button>
            </div>
            <p className="mode-hint">
              {mode === "network"  && "Inter-node routes activate as gates clear."}
              {mode === "coverage" && "8 to 10 hour ground-transport radius around each activated node."}
              {mode === "flow"     && "One program moving: suppliers → Forge → command layer."}
            </p>
          </aside>
        </div>

        <div className="coord" style={{marginTop: 40, marginBottom: 8}}>Activation layers · each phase is gated, not timed</div>
        <div className="phase-strip">
          {[
            {p: 1, t: "Anchor Node Selection",   o: "Identify and validate the candidate command layer.",              g: "Candidate HQ selected; institutional + compliance alignment confirmed."},
            {p: 2, t: "First Forge Activation",  o: "Stand up the first integration + certification control point.",   g: "First Forge operational against validated supplier density."},
            {p: 3, t: "Multi-Node Routing",      o: "Route programs across more than one Forge under one config.",     g: "Sustained cross-node production under single configuration authority."},
            {p: 4, t: "Network Densification",   o: "Add nodes where routing load exceeds regional capacity.",          g: "Network utilization and routing throughput exceed single-node limits."},
            {p: 5, t: "Continental Coverage",    o: "Close the coverage lattice across major industrial corridors.",    g: "Every major corridor within one-day ground reach of a system node."},
          ].map(x => (
            <button key={x.p} className={phase===x.p?"on":""} onClick={() => setPhase(x.p)}>
              <span>Phase {x.p} · Gate {x.p}</span>
              <strong>{x.t}</strong>
              <em style={{display:"block", fontStyle:"normal", opacity:0.72, marginTop:6, fontSize:11, lineHeight:1.4}}>{x.o}</em>
              <em style={{display:"block", fontStyle:"normal", opacity:0.55, marginTop:4, fontSize:10, lineHeight:1.4}}>Gate: {x.g}</em>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HOW A PROGRAM MOVES THROUGH THE NETWORK
// Map-layered flow: intake → Launchbelt → distributed production →
// inter-node routing → Forge convergence → delivery
// ============================================================
const PF_STAGES = [
  {
    id: "S01", name: "Program intake",
    loc: "Customer · Program Request",
    kicker: "REQUEST",
    text: "Aerospace program requirements enter the system and are digitally defined. A single intake point registers the program against a routed execution plan.",
    ops: ["Requirements + certifications captured", "Classification applied", "Program registered against plan"]
  },
  {
    id: "S02", name: "System decomposition",
    loc: "Launchbelt · orchestration layer",
    kicker: "DECOMPOSE",
    text: "Launchbelt decomposes the program into routable manufacturing packages and assigns them across the network. Routing paths appear as the system resolves capability, capacity, and compliance alignment.",
    ops: ["Work packages parsed", "Capability + capacity matched", "Compliance-aware routing"]
  },
  {
    id: "S03", name: "Distributed production",
    loc: "Qualified suppliers · continental base",
    kicker: "EXECUTE",
    text: "Qualified suppliers across Europe execute production based on capability, capacity, and certification alignment. Localized activity lights up across every active region of the network.",
    ops: ["Regional production activation", "Traveler data streaming live", "Configuration preserved at source"]
  },
  {
    id: "S04", name: "Inter-node routing",
    loc: "Distributed · dynamic routing",
    kicker: "ROUTE",
    text: "Workflows are dynamically routed between facilities to maintain throughput and continuity. Cross-links between regions adapt as load, capacity, and exceptions move through the system.",
    ops: ["Adaptive cross-node routing", "Exceptions re-routed, not lost", "Throughput preserved under load"]
  },
  {
    id: "S05", name: "Forge convergence",
    loc: "Asgard Forge · integration + control",
    kicker: "CONVERGE",
    text: "Components converge at Forge nodes for controlled integration, certification, and IP-protected assembly. Configuration authority and secure cells sit at a small number of control points.",
    ops: ["Subassembly integration", "CMM + metrology certification", "Secure cells for IP-sensitive work"]
  },
  {
    id: "S06", name: "Final delivery",
    loc: "Customer · certified throughput",
    kicker: "DELIVER",
    text: "Completed systems are validated, certified, and delivered back to the customer with full traceability. What entered as a requirement exits as certified, auditable, program-ready throughput.",
    ops: ["Full audit trail", "Certification package included", "Throughput, not one-off delivery"]
  }
];

function ProgramFlow() {
  const [step, setStep] = useState3(0);
  const [playing, setPlaying] = useState3(false);
  const sectionRef = React.useRef(null);

  // Auto-advance when playing
  React.useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (step < PF_STAGES.length - 1) setStep(s => s + 1);
      else setPlaying(false);
    }, 4200);
    return () => clearTimeout(t);
  }, [playing, step]);

  // Scroll-driven: advance a stage each time user scrolls past a threshold
  // inside the section (only after the first stage is visible).
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let active = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { active = e.isIntersecting && e.intersectionRatio > 0.5; });
    }, { threshold: [0, 0.5, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const s = PF_STAGES[step];

  return (
    <section className="sec-pad" id="programflow" style={{background: "var(--bg-base)"}} ref={sectionRef}>
      <div className="shell">
        <div className="pfm-bridge">The gap is not capability. It is coordination. This is how the system executes.</div>
        <SecHead tag="03 · How It Works · Program Flow" meta="Intake → Launchbelt → Execute → Route → Converge → Deliver"
          title="A live view of how a program moves through the continental network."
          lede="This is how a single aerospace program or part request moves through Asgard, from intake, through decomposition and distributed execution, through dynamic inter-node routing, through convergence at a Forge, to certified delivery. The continent is the factory floor."
        />

        <div className="pfm-orient">
          <div className="pfm-orient-item"><span className="pfm-orient-dot node"/>Nodes represent qualified manufacturing partners across Europe.</div>
          <div className="pfm-orient-item"><span className="pfm-orient-dot forge"/>Forges act as controlled integration and certification points.</div>
          <div className="pfm-orient-item"><span className="pfm-orient-dot lb"/>Launchbelt is the orchestration layer routing work across the network.</div>
        </div>

        <div className="pfm-wrap">
          <div className="pfm-canvas">
            <div className="grid-layer"/>
            {/* Base geography + nodes, without the default auto-routing */}
            <EuropeMap phase={5} mode="network" active={0} setActive={() => {}} flowMode={true} />
            {/* Stage overlay, owns all program motion */}
            <ProgramFlowOverlay step={step}/>

            <div className="pfm-hud">
              <div className="pfm-hud-row">
                <span className="pfm-hud-tag">AAE · PROGRAM FLOW · LIVE</span>
                <span className="pfm-hud-tag pfm-hud-stage">STAGE {String(step+1).padStart(2,"0")} / {String(PF_STAGES.length).padStart(2,"0")} · {s.kicker}</span>
              </div>
            </div>

            <div className="pfm-caption">
              <div className="pfm-caption-id">{s.id} · {s.loc}</div>
              <h4>{s.name}</h4>
              <p>{s.text}</p>
            </div>

            <div className="pfm-controls">
              <button className="pfm-ctrl" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀</button>
              <button className={"pfm-ctrl play" + (playing ? " on" : "")} onClick={() => {
                if (step === PF_STAGES.length - 1) { setStep(0); setPlaying(true); }
                else setPlaying(p => !p);
              }}>{playing ? "❙❙  Pause" : "▶  Play flow"}</button>
              <button className="pfm-ctrl" onClick={() => setStep(Math.min(PF_STAGES.length - 1, step + 1))} disabled={step === PF_STAGES.length - 1}>▶</button>
            </div>
          </div>

          <ol className="pfm-track">
            {PF_STAGES.map((x, i) => (
              <li key={x.id}
                className={"pfm-step" + (i === step ? " on" : "") + (i < step ? " done" : "")}
                onClick={() => { setPlaying(false); setStep(i); }}>
                <div className="pfm-step-id">{x.id} · {x.kicker}</div>
                <div className="pfm-step-name">{x.name}</div>
                <ul className="pfm-step-ops">
                  {x.ops.map((op, j) => <li key={j}>{op}</li>)}
                </ul>
                <div className="pfm-step-bar"/>
              </li>
            ))}
          </ol>
        </div>

        <div className="pfm-principles">
          {[
            ["Distributed", "Production lives across the supplier base."],
            ["Centralized", "Launchbelt holds routing + config authority."],
            ["Dynamic",     "Workflows re-route between facilities live."],
            ["Controlled",  "Integration converges at Forge nodes."],
            ["Certified",   "Output leaves with full auditable provenance."],
          ].map(([h, d], i) => (
            <div key={i} className="pfm-principle">
              <div className="pfm-principle-n">{String(i+1).padStart(2,"0")}</div>
              <div className="pfm-principle-h">{h}</div>
              <div className="pfm-principle-d">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Geographic overlay that sits on top of the Europe map and owns all
// per-stage motion. Uses window.projectEurope to place elements on the
// same projection as the base map.
function ProgramFlowOverlay({ step }) {
  const V = (typeof window !== "undefined" && window.EUROPE_VIEW) || { W: 1000, H: 900 };
  const proj = (typeof window !== "undefined" && window.projectEurope) || (() => [0, 0]);
  const nodes = (typeof window !== "undefined" && window.ASGARD_NODES) || [];

  // Project every node once
  const projected = React.useMemo(() => nodes.map(n => {
    const p = proj(n.lon, n.lat);
    return { ...n, x: p ? p[0] : 0, y: p ? p[1] : 0 };
  }), [nodes]);

  const anchor = projected.find(n => n.role === "candidate");
  const forges = projected.filter(n => n.role === "forge");
  const plannedNodes = projected.filter(n => n.role === "planned");
  // "Production nodes" = all on-map nodes, since every node receives routed
  // work in the distributed model.
  const prodNodes = projected;

  // Off-map abstract points — intake top-left, Launchbelt band top-center,
  // delivery top-right. These sit above the geographic canvas.
  const intake     = { x: V.W * 0.07, y: V.H * 0.08 };
  const launchbelt = { x: V.W * 0.50, y: V.H * 0.06 };
  const delivery   = { x: V.W * 0.93, y: V.H * 0.08 };

  // Deterministic supplier satellites around each node (tight cluster)
  const satellitesFor = (n, count = 5, radiusBase = 26) => {
    const seed = n.id.charCodeAt(n.id.length - 1) + n.id.charCodeAt(0);
    return Array.from({ length: count }, (_, k) => {
      const a = ((seed * 41 + k * 83) % 360) * Math.PI / 180;
      const r = radiusBase + ((seed * 17 + k * 31) % 18);
      return { x: n.x + Math.cos(a) * r, y: n.y + Math.sin(a) * r * 0.78, k };
    });
  };

  // Curve helper for a graceful arc between two points
  const arc = (A, B, curve = 0.18) => {
    const mx = (A.x + B.x) / 2;
    const my = (A.y + B.y) / 2;
    const dx = B.x - A.x, dy = B.y - A.y;
    // perpendicular offset
    const ox = -dy * curve;
    const oy = dx * curve;
    return `M ${A.x} ${A.y} Q ${mx + ox} ${my + oy} ${B.x} ${B.y}`;
  };

  // Stage-specific activity
  const showIntake     = step >= 0;
  const intakePulse    = step === 0;
  const showLB         = step >= 1;
  const lbActive       = step === 1 || step === 2;
  const showDispatch   = step === 1;               // LB → nodes
  const showSatellites = step >= 2 && step <= 4;
  const showRegionPulse= step === 2;               // node pulses + sat→node flow
  const showCross      = step === 3;               // node↔node routing
  const showConverge   = step === 4;               // nodes → forges
  const showDelivery   = step === 5;               // forge → delivery

  // A small curated set of cross-links for stage 3 (node ↔ node).
  const findNode = (id) => projected.find(n => n.id === id);
  const crossLinks = [
    ["AAE-N01", "AAE-N02"],
    ["AAE-N02", "AAE-N03"],
    ["AAE-N03", "AAE-N04"],
    ["AAE-N03", "AAE-N06"],
    ["AAE-N04", "AAE-N05"],
    ["AAE-N05", "AAE-N07"],
    ["AAE-N07", "AAE-N08"],
    ["AAE-N01", "AAE-N09"],
  ].map(([a, b]) => [findNode(a), findNode(b)]).filter(([a, b]) => a && b);

  // Satellite pool for production / convergence stages
  const allSats = React.useMemo(() => {
    return prodNodes.flatMap(n => satellitesFor(n, n.role === "planned" ? 4 : 6).map(s => ({ ...s, host: n })));
  }, [projected]);

  return (
    <svg className="pfm-overlay" viewBox={`0 0 ${V.W} ${V.H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="pfm-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="pfm-glow-soft" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="pfm-lb-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"  stopColor="oklch(72% 0.14 235)" stopOpacity="0"/>
          <stop offset="15%" stopColor="oklch(76% 0.14 235)" stopOpacity="0.65"/>
          <stop offset="50%" stopColor="oklch(86% 0.12 235)" stopOpacity="0.95"/>
          <stop offset="85%" stopColor="oklch(76% 0.14 235)" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="oklch(72% 0.14 235)" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* ============================================================
          LAUNCHBELT BAND — abstract orchestration strip at top of map
          Appears once program has entered the system.
          ============================================================ */}
      {showLB && (
        <g className="pfm-lb" opacity={lbActive ? 1 : 0.6}>
          <line x1={V.W * 0.12} y1={launchbelt.y}
                x2={V.W * 0.88} y2={launchbelt.y}
                stroke="url(#pfm-lb-grad)" strokeWidth="1.2"/>
          {/* Tick marks along band */}
          {Array.from({ length: 18 }).map((_, i) => {
            const x = V.W * 0.14 + i * (V.W * 0.72 / 17);
            return (
              <line key={i} x1={x} y1={launchbelt.y - 3} x2={x} y2={launchbelt.y + 3}
                    stroke="oklch(72% 0.14 235)" strokeWidth="0.5" opacity={0.55}/>
            );
          })}
          {/* Label */}
          <g transform={`translate(${launchbelt.x}, ${launchbelt.y - 22})`}>
            <text textAnchor="middle" fontFamily="var(--f-mono)" fontSize="11"
                  fill="oklch(86% 0.12 235)" letterSpacing="3" fontWeight="500">
              LAUNCHBELT · ORCHESTRATION LAYER
            </text>
          </g>
          {/* Core marker */}
          <circle cx={launchbelt.x} cy={launchbelt.y} r={lbActive ? 7 : 5}
                  fill="oklch(90% 0.12 235)" filter="url(#pfm-glow)"/>
          {lbActive && (
            <circle cx={launchbelt.x} cy={launchbelt.y} r="14" fill="none"
                    stroke="oklch(82% 0.14 235)" strokeWidth="0.8" opacity="0.6">
              <animate attributeName="r" values="10;26;10" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite"/>
            </circle>
          )}
        </g>
      )}

      {/* ============================================================
          STAGE 1 — INTAKE
          A single request enters the system from off-map (top-left)
          and connects into the Launchbelt.
          ============================================================ */}
      {showIntake && (
        <g className="pfm-intake">
          {/* Label + marker */}
          <g transform={`translate(${intake.x}, ${intake.y})`}>
            <circle r="9" fill="none" stroke="oklch(84% 0.14 78)" strokeWidth="0.9" opacity="0.9"/>
            <circle r={intakePulse ? 4.5 : 3.5} fill="oklch(88% 0.14 78)" filter="url(#pfm-glow)"/>
            {intakePulse && (
              <circle r="12" fill="none" stroke="oklch(84% 0.14 78)" strokeWidth="0.8" opacity="0.6">
                <animate attributeName="r" values="8;22;8" dur="2.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2.2s" repeatCount="indefinite"/>
              </circle>
            )}
            <text x="0" y="-18" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="11"
                  fill="oklch(90% 0.10 80)" letterSpacing="2" fontWeight="500">
              PROGRAM REQUEST
            </text>
            <text x="0" y="28" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="9"
                  fill="var(--text-faint)" letterSpacing="1.6">
              CUSTOMER · INTAKE
            </text>
          </g>
          {/* Line from intake → Launchbelt, appears once LB is present */}
          {showLB && (() => {
            const d = arc(intake, launchbelt, 0.08);
            return (
              <g>
                <path d={d} fill="none" stroke="oklch(84% 0.14 78)" strokeWidth="1.1"
                      opacity="0.65" strokeDasharray={intakePulse ? "none" : "3 4"}/>
                {intakePulse && (
                  <>
                    <circle r="4" fill="oklch(92% 0.14 80)" filter="url(#pfm-glow)">
                      <animateMotion dur="2.2s" repeatCount="indefinite" path={d}/>
                    </circle>
                    <circle r="2.5" fill="oklch(94% 0.14 80)">
                      <animateMotion dur="2.2s" begin="0.7s" repeatCount="indefinite" path={d}/>
                    </circle>
                  </>
                )}
              </g>
            );
          })()}
        </g>
      )}

      {/* ============================================================
          STAGE 2 — DECOMPOSITION (dispatch from Launchbelt)
          Launchbelt fans out routing rays to every active node.
          ============================================================ */}
      {showDispatch && prodNodes.map((n, i) => {
        const d = arc(launchbelt, n, 0.12);
        return (
          <g key={"disp" + n.id}>
            <path d={d} fill="none" stroke="oklch(82% 0.14 235)" strokeWidth="0.8"
                  opacity="0.55"/>
            <circle r="2.6" fill="oklch(92% 0.12 235)" filter="url(#pfm-glow)">
              <animateMotion dur={`${1.8 + (i % 4) * 0.2}s`} begin={`${(i * 0.12) % 1.4}s`}
                             repeatCount="indefinite" path={d}/>
            </circle>
          </g>
        );
      })}

      {/* ============================================================
          STAGES 3-5 — SUPPLIER SATELLITES around each node
          Small gold dots representing the qualified supplier base
          feeding each active node.
          ============================================================ */}
      {showSatellites && allSats.map((s, i) => {
        const d = `M ${s.x} ${s.y} L ${s.host.x} ${s.host.y}`;
        const isRegion  = showRegionPulse;
        const isConverge = showConverge;
        // In convergence, only show satellites feeding Forges
        if (isConverge && s.host.role !== "forge") return null;
        return (
          <g key={"sat" + i}>
            <path d={d} stroke="oklch(82% 0.12 78)" strokeWidth="0.4" fill="none"
                  opacity={isRegion ? 0.55 : 0.3}/>
            <circle cx={s.x} cy={s.y} r="1.3" fill="oklch(92% 0.13 82)"
                    filter="url(#pfm-glow)" opacity="0.9"/>
            {(isRegion || isConverge) && (
              <circle r="1.6" fill="oklch(94% 0.14 82)" filter="url(#pfm-glow)">
                <animateMotion dur={`${1.6 + (i % 5) * 0.25}s`}
                               begin={`${(i * 0.13) % 1.8}s`}
                               repeatCount="indefinite" path={d}/>
              </circle>
            )}
          </g>
        );
      })}

      {/* ============================================================
          STAGE 3 — DISTRIBUTED PRODUCTION
          Every on-map node pulses with localized activity.
          ============================================================ */}
      {showRegionPulse && prodNodes.map((n, i) => (
        <g key={"reg" + n.id}>
          <circle cx={n.x} cy={n.y} r="24" fill="none"
                  stroke="oklch(82% 0.14 235)" strokeWidth="0.7" opacity="0.7">
            <animate attributeName="r" values="16;36;16"
                     dur={`${2.6 + (i % 4) * 0.3}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;0;0.8"
                     dur={`${2.6 + (i % 4) * 0.3}s`} repeatCount="indefinite"/>
          </circle>
          <circle cx={n.x} cy={n.y} r="3" fill="oklch(92% 0.12 235)"
                  filter="url(#pfm-glow-soft)"/>
        </g>
      ))}

      {/* ============================================================
          STAGE 4 — INTER-NODE ROUTING
          Cross-links between regions activate with bidirectional flow.
          ============================================================ */}
      {showCross && crossLinks.map(([A, B], i) => {
        const d1 = arc(A, B, 0.14);
        const d2 = arc(B, A, 0.14);
        return (
          <g key={"cross" + i}>
            <path d={d1} fill="none" stroke="oklch(82% 0.14 235)" strokeWidth="0.85"
                  opacity="0.7"/>
            <circle r="2.4" fill="oklch(92% 0.12 235)" filter="url(#pfm-glow)">
              <animateMotion dur={`${2.0 + (i % 3) * 0.3}s`}
                             begin={`${(i * 0.2) % 1.4}s`}
                             repeatCount="indefinite" path={d1}/>
            </circle>
            <circle r="1.8" fill="oklch(88% 0.10 235)">
              <animateMotion dur={`${2.3 + (i % 3) * 0.3}s`}
                             begin={`${(i * 0.25) % 1.6}s`}
                             repeatCount="indefinite" path={d2}/>
            </circle>
          </g>
        );
      })}

      {/* ============================================================
          STAGE 5 — FORGE CONVERGENCE
          Streams from every non-Forge node converge into the Forges.
          Forges glow intensely.
          ============================================================ */}
      {showConverge && (
        <>
          {/* streams from planned + anchor → nearest Forge */}
          {projected.filter(n => n.role !== "forge").map((src, i) => {
            // nearest forge
            const target = forges.reduce((best, f) => {
              const d = Math.hypot(f.x - src.x, f.y - src.y);
              return (!best || d < best.d) ? { f, d } : best;
            }, null);
            if (!target) return null;
            const d = arc(src, target.f, 0.12);
            return (
              <g key={"conv" + src.id}>
                <path d={d} fill="none" stroke="oklch(84% 0.14 78)" strokeWidth="0.9"
                      opacity="0.65"/>
                <circle r="2.8" fill="oklch(92% 0.14 80)" filter="url(#pfm-glow)">
                  <animateMotion dur={`${2.0 + (i % 4) * 0.25}s`}
                                 begin={`${(i * 0.18) % 1.6}s`}
                                 repeatCount="indefinite" path={d}/>
                </circle>
              </g>
            );
          })}
          {/* Forge intensity rings */}
          {forges.map((f, i) => (
            <g key={"frg" + f.id}>
              <circle cx={f.x} cy={f.y} r="28" fill="none"
                      stroke="oklch(84% 0.14 78)" strokeWidth="1" opacity="0.85">
                <animate attributeName="r" values="18;42;18"
                         dur={`${2.4 + (i % 3) * 0.3}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.9;0;0.9"
                         dur={`${2.4 + (i % 3) * 0.3}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={f.x} cy={f.y} r="6" fill="oklch(90% 0.14 78)"
                      filter="url(#pfm-glow-soft)"/>
              <text x={f.x} y={f.y - 34} textAnchor="middle" fontFamily="var(--f-mono)"
                    fontSize="10" fill="oklch(90% 0.14 78)" letterSpacing="2" fontWeight="500">
                FORGE
              </text>
            </g>
          ))}
        </>
      )}

      {/* ============================================================
          STAGE 6 — FINAL DELIVERY
          Collapsed outbound path from the primary Forge to the customer.
          All other activity stabilizes.
          ============================================================ */}
      {showDelivery && (() => {
        // pick the Forge geographically nearest to the delivery point
        const sorted = [...forges].sort((a, b) =>
          Math.hypot(a.x - delivery.x, a.y - delivery.y) -
          Math.hypot(b.x - delivery.x, b.y - delivery.y));
        const frg = sorted[0];
        if (!frg) return null;
        const d = arc(frg, delivery, 0.08);
        return (
          <g>
            {/* Forge still glowing */}
            <circle cx={frg.x} cy={frg.y} r="9" fill="oklch(90% 0.14 78)"
                    filter="url(#pfm-glow-soft)"/>
            <circle cx={frg.x} cy={frg.y} r="22" fill="none"
                    stroke="oklch(84% 0.14 78)" strokeWidth="0.9" opacity="0.9">
              <animate attributeName="r" values="16;34;16" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.9;0;0.9" dur="3s" repeatCount="indefinite"/>
            </circle>
            {/* Outbound line */}
            <path d={d} fill="none" stroke="oklch(86% 0.14 80)" strokeWidth="1.4" opacity="0.95"/>
            <circle r="5" fill="oklch(94% 0.14 80)" filter="url(#pfm-glow)">
              <animateMotion dur="2.6s" repeatCount="indefinite" path={d}/>
            </circle>
            <circle r="3" fill="oklch(94% 0.14 80)">
              <animateMotion dur="2.6s" begin="0.9s" repeatCount="indefinite" path={d}/>
            </circle>
            {/* Delivery marker */}
            <g transform={`translate(${delivery.x}, ${delivery.y})`}>
              <rect x="-10" y="-10" width="20" height="20" fill="none"
                    stroke="oklch(84% 0.14 78)" strokeWidth="1" opacity="0.9"/>
              <circle r="5" fill="oklch(92% 0.14 80)" filter="url(#pfm-glow)"/>
              <circle r="14" fill="none" stroke="oklch(84% 0.14 78)" strokeWidth="0.8" opacity="0.7">
                <animate attributeName="r" values="10;22;10" dur="2.4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite"/>
              </circle>
              <text x="0" y="-18" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="11"
                    fill="oklch(90% 0.10 80)" letterSpacing="2" fontWeight="500">
                DELIVERY
              </text>
              <text x="0" y="30" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="9"
                    fill="var(--text-faint)" letterSpacing="1.6">
                CUSTOMER · CERTIFIED
              </text>
            </g>
          </g>
        );
      })()}
    </svg>
  );
}

window.ProgramFlow = ProgramFlow;

// ============================================================
// REGIONS
// ============================================================
function Regions() {
  const [active, setActive] = useState3(0);
  const r = REGIONS_DATA[active];

  return (
    <section className="sec-pad" id="regions" style={{background: "var(--bg-base)"}}>
      <div className="shell">
        <SecHead tag="08 · Strategic Regional Roles" meta="HQ · Hub · Hub · Hub"
          title="Four regions. One coordinated execution layer."
          lede="Each region plays a distinct structural role within the continental network. Together they form the initial operating couple: an institutional command layer, a primary manufacturing engine, an aerospace program gravity node, and a northern logistics acceleration point."
        />

        <div className="regions">
          {REGIONS_DATA.map((reg, i) => (
            <div key={reg.id}
              className={"region" + (i === active ? " on" : "") + (reg.hq ? " hq" : "")}
              onClick={() => setActive(i)}>
              <div className="rid">
                <span>{reg.id}</span>
                <span>{reg.country}</span>
              </div>
              <h4>{reg.short}</h4>
              <div className="role">{reg.role}</div>
              <div className="sum">{reg.sum}</div>
            </div>
          ))}
        </div>

        <div className="region-detail">
          <div>
            <div className="coord">{r.id} · {r.country}</div>
            <h3 style={{marginTop: 8}}>{r.name}</h3>
            <div style={{fontFamily: "var(--f-mono)", fontSize: 12, color: r.hq ? "var(--signal)" : "var(--accent)", marginTop: 10, letterSpacing: "0.1em", textTransform: "uppercase"}}>
              {r.role}
            </div>
            <div className="prose">
              {r.narrative.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div>
            <div className="coord">Strategic strengths</div>
            <ul className="strengths">
              {r.strengths.map(([h, d], i) => (
                <li key={i}>
                  <span className="n">{String(i+1).padStart(2,"0")}</span>
                  <div>
                    <div style={{fontFamily: "var(--f-display)", fontSize: 15, color: "var(--text-hi)", fontWeight: 500, letterSpacing: "-0.005em", marginBottom: 4}}>{h}</div>
                    <div style={{color: "var(--text-dim)", fontSize: 13, lineHeight: 1.5}}>{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FACILITY MODEL
// ============================================================
function Facility() {
  const [size, setSize] = useState3("scaled");
  return (
    <section className="sec-pad" id="facility">
      <div className="shell">
        <SecHead tag="09 · Facility Model" meta="Node · Not Factory"
          title="A convergence node, not a standalone factory."
          lede="Each European facility is a controlled integration point within the distributed manufacturing system. Modular, demand-driven, and capital-efficient, sized for validated throughput and designed for compliance from day one."
        />

        <div className="facility">
          <div className="facility-diagram">
            <span className="fd-lbl tl">AAE-FACILITY-01 · PLAN</span>
            <span className="fd-lbl tr">{size === "initial" ? "30 to 50k SQ FT" : "60 to 100k SQ FT"}</span>
            <span className="fd-lbl bl">SCHEMATIC</span>
            <span className="fd-lbl br">REV 2026.04</span>

            <svg viewBox="0 0 500 400" style={{width: "100%", height: "100%"}}>
              <g stroke="var(--line-strong)" strokeWidth="1" fill="none">
                <rect x="60" y="60" width={size==="initial"? 280 : 380} height={size==="initial"? 240 : 280}/>
              </g>
              {/* zones */}
              {(size === "initial" ? [
                {x: 70, y: 70, w: 120, h: 90, label: "INTEGRATION", color: "var(--accent)"},
                {x: 200, y: 70, w: 130, h: 90, label: "COMPOSITES", color: "var(--accent)"},
                {x: 70, y: 170, w: 80, h: 60, label: "METROLOGY", color: "var(--text-dim)"},
                {x: 160, y: 170, w: 80, h: 60, label: "MACHINE", color: "var(--text-dim)"},
                {x: 250, y: 170, w: 80, h: 60, label: "SECURE", color: "var(--signal)"},
                {x: 70, y: 240, w: 260, h: 50, label: "LOGISTICS · LOADING", color: "var(--text-faint)"},
              ] : [
                {x: 70, y: 70, w: 150, h: 120, label: "INTEGRATION", color: "var(--accent)"},
                {x: 230, y: 70, w: 200, h: 80, label: "COMPOSITES · THERMOPLASTICS", color: "var(--accent)"},
                {x: 230, y: 160, w: 90, h: 80, label: "MACHINING", color: "var(--text-dim)"},
                {x: 330, y: 160, w: 100, h: 80, label: "METROLOGY · CMM", color: "var(--text-dim)"},
                {x: 70, y: 200, w: 150, h: 70, label: "SECURE PROD.", color: "var(--signal)"},
                {x: 70, y: 280, w: 360, h: 50, label: "LOGISTICS · MULTI-DOCK", color: "var(--text-faint)"},
              ]).map((z, i) => (
                <g key={i}>
                  <rect x={z.x} y={z.y} width={z.w} height={z.h} fill="var(--bg-panel)" stroke={z.color} strokeWidth="1"/>
                  <text x={z.x + z.w/2} y={z.y + z.h/2 + 4} textAnchor="middle"
                    fontFamily="var(--f-mono)" fontSize="9" fill={z.color} letterSpacing="1.2">
                    {z.label}
                  </text>
                </g>
              ))}
              {/* grid dots */}
              {Array.from({length: 40}).map((_, i) => {
                const x = 60 + (i % 10) * 42;
                const y = 60 + Math.floor(i / 10) * 70;
                return <circle key={i} cx={x} cy={y} r="1" fill="var(--text-faint)" opacity="0.35"/>;
              })}
            </svg>
          </div>

          <div className="facility-info">
            <div className="coord">Footprint scale</div>
            <div className="size-toggle">
              <button className={size==="initial"?"on":""} onClick={()=>setSize("initial")}>Initial · 30 to 50k</button>
              <button className={size==="scaled"?"on":""} onClick={()=>setSize("scaled")}>Scaled · 60 to 100k</button>
            </div>

            <h3>{size === "initial" ? "Initial deployment" : "Scaled operations"}</h3>
            <p>
              {size === "initial"
                ? "The initial footprint establishes operational presence, validates workflows, and supports early program execution. Sized for proof rather than speculative volume, with integration, secure production environments, and initial composites capability."
                : "The scaled footprint expands integration capacity, adds multi-program cells, and brings full inspection and certification infrastructure online. Capacity benchmark of 150 to 250 employees and $100M, $125M of annual throughput per node."}
            </p>
            <div className="stats">
              <div className="stat">
                <div className="n">{size === "initial" ? "20 to 35" : "150 to 250"}</div>
                <div className="l">Direct employment</div>
              </div>
              <div className="stat">
                <div className="n">{size === "initial" ? "Up to $25M" : "$100 to 125M"}</div>
                <div className="l">Annual throughput</div>
              </div>
            </div>
          </div>
        </div>

        {/* zone list */}
        <div className="zone-list">
          {[
            ["Z01", "Integration & assembly", "Configurable subassembly lines and multi-program cells. Material flow optimized for inbound supplier components.", "COMMISSIONED"],
            ["Z02", "Composites & thermoplastics", "Prepreg layup, thermoplastic forming, and controlled curing and finishing environments.", "COMMISSIONED"],
            ["Z03", "Machining & fabrication support", "Light precision machining and internal tooling to support integration workflows.", "PHASE 1"],
            ["Z04", "Inspection & metrology", "CMM, non-destructive inspection, and certification-grade documentation processing.", "EMBEDDED"],
            ["Z05", "Secure production", "Restricted-access cells for defense and IP-sensitive programs with segmented material and information flow.", "GOVERNMENT-GRADE"],
          ].map(([id, name, desc, status]) => (
            <div key={id} className="zone">
              <div className="zid">{id}</div>
              <h5>{name}</h5>
              <div className="desc">{desc}</div>
              <div className="status">{status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Network = Network;
window.Regions = Regions;
window.Facility = Facility;
