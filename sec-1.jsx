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
// PROBLEM
// ============================================================
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
            <div className="prob-canvas">
              <svg viewBox="0 0 400 260" width="100%" height="100%">
                {Array.from({length: 28}).map((_, i) => {
                  const x = 40 + (i % 7) * 52 + (i % 3) * 6;
                  const y = 40 + Math.floor(i / 7) * 52 + (i % 2) * 4;
                  return <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="var(--text-dim)" opacity={0.4 + Math.random() * 0.5}/>
                    <circle cx={x} cy={y} r="7" fill="none" stroke="var(--line-strong)" strokeWidth="0.5" opacity="0.4"/>
                  </g>;
                })}
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
            <div className="prob-canvas">
              <svg viewBox="0 0 400 260" width="100%" height="100%">
                <defs>
                  <radialGradient id="pf" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="oklch(72% 0.14 235)" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="oklch(72% 0.14 235)" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <circle cx="200" cy="130" r="80" fill="url(#pf)"/>
                {Array.from({length: 28}).map((_, i) => {
                  const x = 40 + (i % 7) * 52 + (i % 3) * 6;
                  const y = 40 + Math.floor(i / 7) * 52 + (i % 2) * 4;
                  return <g key={i}>
                    <line x1={x} y1={y} x2="200" y2="130" stroke="var(--accent)" strokeWidth="0.4" opacity="0.25"/>
                    <circle cx={x} cy={y} r="3.5" fill="var(--accent)" opacity="0.7"/>
                  </g>;
                })}
                <circle cx="200" cy="130" r="10" fill="var(--accent)" />
                <circle cx="200" cy="130" r="18" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.6">
                  <animate attributeName="r" values="14;26;14" dur="2.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.7;0;0.7" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <text x="200" y="210" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="10" fill="var(--text-faint)" letterSpacing="1.5">UNIFIED EXECUTION LAYER</text>
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
