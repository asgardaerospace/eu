/* global React, PHASES_EU, KB_CATEGORIES, SecHead */
const { useState: useState5 } = React;

// ============================================================
// ROADMAP
// ============================================================
function Roadmap() {
  const [phase, setPhase] = useState5(0);
  const active = PHASES_EU[phase];
  const fillPct = ((phase + 0.5) / PHASES_EU.length) * 100;

  return (
    <section className="sec-pad" id="roadmap" style={{background: "var(--bg-base)"}}>
      <div className="shell">
        <SecHead tag="14 · Deployment Roadmap" meta="5 Phases · 0 → Year 4+"
          title="From HQ landing to full continental coverage."
          lede="The European deployment unfolds in five disciplined phases. Each phase unlocks the next through operational proof, supplier density, routed production, compliance continuity, and economic justification for facility expansion."
        />

        <div className="roadmap">
          <div className="rm-track">
            <div className="rm-fill" style={{width: fillPct + "%"}}/>
          </div>
          <div className="rm-ticks">
            {PHASES_EU.map((p, i) => (
              <button key={p.id} className={"rm-tick" + (i === phase ? " on" : i < phase ? " done" : "")} onClick={() => setPhase(i)}>
                <span className="dot"/>
                <div className="p">Phase {p.id}</div>
                <h5>{p.title}</h5>
                <div className="window">{p.window}</div>
              </button>
            ))}
          </div>

          <div className="rm-detail">
            <div>
              <div className="coord">Phase {active.id} · {active.window}</div>
              <h4 style={{marginTop: 10}}>{active.title}</h4>
            </div>
            <p>{active.prose}</p>
            <ul>{active.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// KNOWLEDGE BASE
// ============================================================
function KnowledgeBase() {
  const [cat, setCat] = useState5(0);
  const [open, setOpen] = useState5({ 0: true });
  const active = KB_CATEGORIES[cat];

  return (
    <section className="sec-pad" id="kb">
      <div className="shell">
        <SecHead tag="15 · Knowledge Base" meta="6 Categories · Deep Reference"
          title="The full reference, organized for stakeholders."
          lede="This section operates as a deep-reference asset for government stakeholders, regional agencies, aerospace executives, and investment partners. Every category maps directly to a formal briefing document."
        />

        <div className="kb">
          <div className="kb-tabs">
            {KB_CATEGORIES.map((c, i) => (
              <button key={c.key} className={i === cat ? "on" : ""} onClick={() => { setCat(i); setOpen({ 0: true }); }}>
                <span>{c.meta}</span>
                <strong>{c.label}</strong>
              </button>
            ))}
          </div>
          <div className="kb-body">
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--line)"}}>
              <div className="coord">{active.meta} · {active.label}</div>
              <div className="coord">{active.items.length} entries</div>
            </div>
            <div className="kb-acc">
              {active.items.map((item, i) => (
                <div key={i} className="kb-item">
                  <button className="kb-q" onClick={() => setOpen({ ...open, [i]: !open[i] })}>
                    <span className="n">{String(i+1).padStart(2,"0")}</span>
                    <span>{item.q}</span>
                    <span className="tgl">{open[i] ? "−" : "+"}</span>
                  </button>
                  {open[i] && (
                    <div className="kb-a">
                      {item.a.map((p, j) => <p key={j}>{p}</p>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CLOSING
// ============================================================
function Closing() {
  return (
    <section className="close-hero" id="contact">
      <div className="shell">
        <div className="eyebrow" style={{justifyContent: "center", color: "var(--text-mid)"}}>
          <span className="dot"/>AAE · Strategic Engagement
        </div>
        <h2>Enabling Europe's next-generation aerospace infrastructure.</h2>
        <p>
          Asgard Aerospace Europe is establishing a coordinated manufacturing infrastructure layer to support the continent's next industrial phase.
          The platform integrates regional capability into a unified execution system, enabling scalable, sovereign-aligned aerospace production.
          Engagement is underway with regional governments, institutional investors, and strategic industrial partners.
        </p>
        <div className="ctas">
          <a className="btn primary" href="https://calendly.com/odin-asgardaerospace/asgard-aerospace-introduction" target="_blank" rel="noopener">Initiate Engagement <span className="arrow">→</span></a>
          <a className="btn" href="mailto:contact@asgardaerospace.com?subject=Regional%20Partnership%20%C2%B7%20AAE">Explore Regional Partnership</a>
          <a className="btn" href="mailto:contact@asgardaerospace.com?subject=Strategic%20Briefing%20%C2%B7%20AAE">Request Strategic Briefing</a>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer className="ftr">
      <div className="shell">
        <h3>Asgard Aerospace<br/>Europe.</h3>
        <div className="ftr-grid">
          <div className="ftr-col">
            <h5>Motto</h5>
            <div style={{fontFamily: "var(--f-display)", fontSize: 20, color: "var(--text-hi)", letterSpacing: "-0.015em", lineHeight: 1.2, marginTop: 8}}>
              Forging Brilliance,<br/>Destined by Design.
            </div>
            <div style={{marginTop: 24, fontSize: 13, color: "var(--text-dim)", maxWidth: "36ch", lineHeight: 1.55}}>
              A sovereign-aligned manufacturing platform for European aerospace and defense, engineered as infrastructure.
            </div>
          </div>
          <div className="ftr-col">
            <h5>Platform</h5>
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#model">Asgard model</a></li>
              <li><a href="#execution">Execution model</a></li>
              <li><a href="#facility">Facility model</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
          <div className="ftr-col">
            <h5>Europe</h5>
            <ul>
              <li><a href="#network">Network strategy</a></li>
              <li><a href="#regions">Regional roles</a></li>
              <li><a href="#operating">Operating model</a></li>
              <li><a href="#roadmap">Deployment roadmap</a></li>
              <li><a href="#impact">Economic impact</a></li>
            </ul>
          </div>
          <div className="ftr-col">
            <h5>Engage</h5>
            <ul>
              <li><a href="https://calendly.com/odin-asgardaerospace/asgard-aerospace-introduction" target="_blank" rel="noopener">Book an introduction</a></li>
              <li><a href="mailto:contact@asgardaerospace.com?subject=Regional%20Partnership%20%C2%B7%20AAE">Regional partnership</a></li>
              <li><a href="mailto:contact@asgardaerospace.com?subject=Strategic%20Briefing%20%C2%B7%20AAE">Strategic briefing</a></li>
              <li><a href="#kb">Knowledge base</a></li>
            </ul>
          </div>
        </div>
        <div className="ftr-bottom">
          <span>© 2026 Asgard Aerospace · AAE Europe</span>
          <span>REV · 2026.04 · v1.0</span>
          <span>Not a public solicitation</span>
        </div>
      </div>
    </footer>
  );
}

window.Roadmap = Roadmap;
window.KnowledgeBase = KnowledgeBase;
window.Closing = Closing;
window.Footer = Footer;
