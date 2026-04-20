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
        <SecHead tag="06 · Continental Network Strategy" meta="Hub-and-Spoke · Distributed"
          title="One continent. Four Forges. A coordinated execution network."
          lede="Europe is not served by one factory. It is served by a routed network of Forges, the control points of the system, each anchoring supplier density within an 8 to 10 hour ground radius. Forges converge work, hold certification authority, and protect IP; Launchbelt routes between them. Every major EU industrial corridor comes within one-day reach of an Asgard Forge."
        />

        <div className="net-wrap">
          <div className="net-canvas">
            <div className="grid-layer"/>
            <EuropeMap phase={phase} mode={mode} active={active} setActive={setActive}/>
          </div>

          <aside className="net-panel">
            <div className="meta"><span>Node · {node.id}</span><span>{node.country}</span></div>
            <h3>{node.name}</h3>
            <div className="tagrow">
              {node.role === "hq" && <span className="tag hq">● HQ</span>}
              {node.role === "hub" && <span className="tag on">● Active Hub</span>}
              {node.role === "planned" && <span className="tag">◌ Planned</span>}
              <span className="tag">Phase {node.phase}</span>
            </div>
            <p>{node.roleLabel}</p>

            <dl>
              <div><dt>Radius</dt><dd>8 to 10 hr</dd></div>
              <div><dt>Topology</dt><dd>Hub-spoke</dd></div>
              <div><dt>Footprint</dt><dd>30 to 100k sq ft</dd></div>
              <div><dt>Throughput</dt><dd>$100 to 125M</dd></div>
            </dl>

            <div className="coord" style={{marginTop: 8}}>View mode</div>
            <div className="net-toggle">
              <button className={mode==="network"?"on":""} onClick={()=>setMode("network")}>Network</button>
              <button className={mode==="coverage"?"on":""} onClick={()=>setMode("coverage")}>Coverage</button>
              <button className={mode==="flow"?"on":""} onClick={()=>setMode("flow")}>Program Flow</button>
            </div>
            <p className="mode-hint">
              {mode === "network"  && "Inter-forge routes activate as phases advance."}
              {mode === "coverage" && "8 to 10 hour ground-transport radius around each operational forge."}
              {mode === "flow"     && "One program moving: suppliers → forge → HQ delivery."}
            </p>
          </aside>
        </div>

        <div className="coord" style={{marginTop: 40, marginBottom: 8}}>Deployment phase selector · scrub to advance network</div>
        <div className="phase-strip">
          {[
            {p: 1, t: "HQ landing", w: "Months 0 to 3"},
            {p: 2, t: "First hubs", w: "Months 3 to 12"},
            {p: 3, t: "Secondary hubs", w: "Months 12 to 24"},
            {p: 4, t: "Central EU", w: "Year 2 to 4"},
            {p: 5, t: "One-day coverage", w: "Year 4+"},
          ].map(x => (
            <button key={x.p} className={phase===x.p?"on":""} onClick={() => setPhase(x.p)}>
              <span>Phase {x.p} · {x.w}</span>
              <strong>{x.t}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HOW A PROGRAM MOVES THROUGH THE NETWORK
// ============================================================
function ProgramFlow() {
  const [step, setStep] = useState3(0);
  const steps = [
    {
      id: "S01", name: "Program intake",
      loc: "Customer · MOD / prime / agency",
      color: "var(--signal)",
      text: "A defense or aerospace program enters the network. Requirements, certifications, security classification, and delivery windows are registered against a routed execution plan.",
      ops: ["Assembly parsed into components", "Spec + traveler generated", "Classification applied"]
    },
    {
      id: "S02", name: "Routed to suppliers",
      loc: "Launchbelt · digital layer",
      color: "var(--accent)",
      text: "The routing engine dispatches manufacturable work packages across qualified suppliers in the corridor, machining, fabrication, materials, and subsystem vendors receive work orders with embedded compliance context.",
      ops: ["Capability-matched routing", "Embedded digital travelers", "Live visibility of execution state"]
    },
    {
      id: "S03", name: "Supplier execution",
      loc: "Distributed · qualified base",
      color: "var(--accent)",
      text: "Components are produced inside the supplier base. Configuration, traceability, and certification data stream back to the platform in real time, the work remains part of a coordinated flow, not a handoff.",
      ops: ["As-built data captured at source", "Traceability preserved", "Exceptions routed, not lost"]
    },
    {
      id: "S04", name: "Forge integration",
      loc: "Asgard Forge · control point",
      color: "var(--signal)",
      text: "Components converge at a Forge. Subassemblies are integrated, inspected, certified, and, where required, processed inside secure cells. The Forge holds configuration authority and IP control for the program.",
      ops: ["Subassembly integration", "CMM + metrology certification", "Secure cells for IP-sensitive work"]
    },
    {
      id: "S05", name: "Program delivery",
      loc: "Customer · certified throughput",
      color: "var(--signal)",
      text: "The integrated article ships with a complete, auditable provenance record. What enters the network as a requirement exits as certified, traceable, program-ready output, at the throughput defense demand requires.",
      ops: ["Full audit trail", "Certification package included", "Throughput, not one-off delivery"]
    }
  ];
  const s = steps[step];

  return (
    <section className="sec-pad" id="programflow" style={{background: "var(--bg-base)"}}>
      <div className="shell">
        <SecHead tag="07 · How a Program Moves" meta="Intake → Route → Execute → Integrate → Deliver"
          title="A program enters as a requirement. It exits as throughput."
          lede="This is how a single aerospace or defense program moves through the Asgard network, from customer intake, through routed supplier execution, through the Forge as control point, to certified delivery. Each step is instrumented, traceable, and operationally gated."
        />

        <div className="pf-wrap">
          <ol className="pf-track">
            {steps.map((x, i) => (
              <li key={x.id}
                className={"pf-step" + (i === step ? " on" : "") + (i < step ? " done" : "")}
                onClick={() => setStep(i)}>
                <div className="pf-step-id">{x.id}</div>
                <div className="pf-step-name">{x.name}</div>
                <div className="pf-step-loc">{x.loc}</div>
                <div className="pf-step-bar"/>
              </li>
            ))}
          </ol>

          <div className="pf-body">
            <div>
              <div className="coord" style={{color: s.color}}>{s.id} · {s.loc}</div>
              <h3 style={{marginTop: 10}}>{s.name}</h3>
              <p className="pf-text">{s.text}</p>

              <div className="pf-ops">
                {s.ops.map((op, i) => (
                  <div key={i} className="pf-op">
                    <span className="pf-op-num">{String(i+1).padStart(2,"0")}</span>
                    <span>{op}</span>
                  </div>
                ))}
              </div>

              <div className="pf-nav">
                <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← Prev stage</button>
                <button className="pf-next" onClick={() => setStep(Math.min(4, step + 1))} disabled={step === 4}>
                  {step === 4 ? "End of flow" : "Next stage →"}
                </button>
              </div>
            </div>

            <div className="pf-diagram">
              <ProgramFlowDiagram step={step} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramFlowDiagram({ step }) {
  // Five lanes: Customer → Launchbelt → Suppliers → Forge → Customer
  const lanes = [
    { id: "CUST-IN", label: "PROGRAM", sub: "Customer intake",  x: 60,  y: 160, color: "oklch(84% 0.14 78)" },
    { id: "LB",      label: "LAUNCHBELT", sub: "Routing layer",  x: 200, y: 80,  color: "oklch(82% 0.14 235)" },
    { id: "SUP",     label: "SUPPLIERS",  sub: "Distributed execution", x: 380, y: 160, color: "oklch(82% 0.14 235)" },
    { id: "FRG",     label: "FORGE",      sub: "Integration + control", x: 560, y: 160, color: "oklch(84% 0.14 78)" },
    { id: "CUST-OUT",label: "DELIVERY",   sub: "Certified throughput",  x: 720, y: 160, color: "oklch(84% 0.14 78)" },
  ];
  // supplier cluster satellites
  const sats = [
    {x: 330, y: 80}, {x: 380, y: 60}, {x: 430, y: 80},
    {x: 330, y: 240}, {x: 380, y: 260}, {x: 430, y: 240},
  ];

  const activeEdges = {
    0: [], // intake only
    1: [["CUST-IN","LB"],["LB","SUP"]],
    2: [["LB","SUP"]],  // execution at suppliers
    3: [["SUP","FRG"]], // integration
    4: [["FRG","CUST-OUT"]],
  }[step] || [];

  return (
    <svg viewBox="0 0 800 320" style={{width: "100%", height: "100%"}}>
      <defs>
        <filter id="pfglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* baseline */}
      <line x1="0" y1="160" x2="800" y2="160" stroke="var(--line)" strokeWidth="0.6" strokeDasharray="2 6"/>

      {/* all lane connections (faint) */}
      {[["CUST-IN","LB"],["LB","SUP"],["SUP","FRG"],["FRG","CUST-OUT"]].map(([a,b],i) => {
        const A = lanes.find(l=>l.id===a), B = lanes.find(l=>l.id===b);
        const isActive = activeEdges.some(([aa,bb]) => aa===a && bb===b);
        const d = `M ${A.x} ${A.y} Q ${(A.x+B.x)/2} ${(A.y+B.y)/2 - 30} ${B.x} ${B.y}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={isActive ? "oklch(86% 0.12 235)" : "var(--line-strong)"}
              strokeWidth={isActive ? 1.6 : 0.7} opacity={isActive ? 0.95 : 0.35}/>
            {isActive && (
              <circle r="3.5" fill="oklch(90% 0.14 235)" filter="url(#pfglow)">
                <animateMotion dur="1.8s" repeatCount="indefinite" path={d}/>
              </circle>
            )}
          </g>
        );
      })}

      {/* supplier satellites, active during S02/S03 */}
      {(step === 1 || step === 2) && sats.map((s, i) => {
        const SUP = lanes.find(l=>l.id==="SUP");
        const d = `M ${SUP.x} ${SUP.y} Q ${(SUP.x+s.x)/2} ${(SUP.y+s.y)/2} ${s.x} ${s.y}`;
        return (
          <g key={"sat"+i}>
            <path d={d} fill="none" stroke="oklch(82% 0.14 235)" strokeWidth="0.6" opacity="0.6"/>
            <circle cx={s.x} cy={s.y} r="3" fill="oklch(82% 0.14 235)"/>
            <circle r="1.8" fill="oklch(90% 0.14 235)">
              <animateMotion dur={`${1.2 + i*0.15}s`} repeatCount="indefinite" path={d}/>
            </circle>
          </g>
        );
      })}

      {/* lane nodes */}
      {lanes.map((l, i) => {
        const isActiveLane = (
          (step === 0 && l.id === "CUST-IN") ||
          (step === 1 && (l.id === "LB" || l.id === "SUP")) ||
          (step === 2 && l.id === "SUP") ||
          (step === 3 && l.id === "FRG") ||
          (step === 4 && (l.id === "FRG" || l.id === "CUST-OUT"))
        );
        return (
          <g key={l.id}>
            {/* halo */}
            {isActiveLane && (
              <circle cx={l.x} cy={l.y} r="22" fill="none" stroke={l.color} strokeWidth="0.8" opacity="0.5">
                <animate attributeName="r" values="14;30;14" dur="2.4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite"/>
              </circle>
            )}
            <circle cx={l.x} cy={l.y} r="18" fill="none" stroke={isActiveLane ? l.color : "var(--line-strong)"} strokeWidth="0.8" opacity={isActiveLane ? 0.9 : 0.4}/>
            <circle cx={l.x} cy={l.y} r={isActiveLane ? 7 : 5} fill={isActiveLane ? l.color : "var(--text-dim)"} filter={isActiveLane ? "url(#pfglow)" : undefined}/>
            <text x={l.x} y={l.y - 30} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="10" fill={isActiveLane ? l.color : "var(--text-dim)"} letterSpacing="1.8" fontWeight="500">{l.label}</text>
            <text x={l.x} y={l.y + 40} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="9" fill="var(--text-faint)" letterSpacing="1">{l.sub}</text>
          </g>
        );
      })}

      {/* corner markers */}
      <g fontFamily="var(--f-mono)" fontSize="9" fill="var(--text-faint)" letterSpacing="1.2">
        <text x="16" y="20">PROGRAM FLOW · STAGE {step + 1} / 5</text>
        <text x="640" y="20">INSTRUMENTED · TRACEABLE</text>
      </g>
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
