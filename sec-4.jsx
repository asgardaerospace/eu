/* global React, SecHead */
const { useState: useState4 } = React;

// ============================================================
// OPERATING MODEL / ENTITY
// ============================================================
function Operating() {
  const entityCards = [
    ["European Operating Entity", "Dedicated EU-based structure aligned with regional regulation and public investment frameworks."],
    ["Regional Ownership Model", "Flexible capital participation aligned with regional deployment priorities."],
  ];
  const systemCards = [
    ["Shared Technical Architecture", "Unified platform, compliance logic, and execution layer across regions."],
    ["IP Governance Framework", "Shared technical IP with localized operational control where required."],
    ["Government & Industrial Integration", "Structured pathways for public agencies, primes, and institutional partners."],
  ];
  return (
    <section className="sec-pad ops-section" id="operating">
      <div className="shell">
        <SecHead tag="10 · Operating Model & Entity" meta="Sovereign · Shared · Autonomous"
          title={<>Dedicated European entity<br/>Shared architecture<br/>Regional autonomy</>}
          lede="Asgard Aerospace Europe is structured as a dedicated operating entity with local operational control and a shared technical architecture. The design preserves sovereign-capability requirements without fragmenting the underlying execution layer."
        />

        <div className="ops-group">
          <div className="ops-group-label">Entity Structure</div>
          <div className="ops-grid-v2 cols-2">
            {entityCards.map(([t, d]) => (
              <div key={t} className="ops-card">
                <div className="ops-card-accent"/>
                <h5>{t}</h5>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ops-group">
          <div className="ops-group-label">System Integration</div>
          <div className="ops-grid-v2 cols-3">
            {systemCards.map(([t, d]) => (
              <div key={t} className="ops-card">
                <div className="ops-card-accent"/>
                <h5>{t}</h5>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ops-reinforce">This structure enables sovereign alignment without fragmenting execution.</div>
      </div>
    </section>
  );
}

// ============================================================
// SECURITY & COMPLIANCE
// ============================================================
function Security() {
  return (
    <section className="sec-pad" id="security">
      <div className="shell">
        <SecHead tag="11 · Security & Compliance" meta="Defense-grade · Audit-ready"
          title="Compliance is embedded in execution, not layered on."
          lede="Aerospace and defense manufacturing cannot scale without strict adherence to certification and documentation standards. The platform is designed so that compliance, traceability, and configuration control are properties of the workflow itself, operational from the first routed unit."
        />

        <div className="compliance">
          <div className="comp-viz">
            <div className="coord" style={{marginBottom: 24}}>Compliance architecture · conceptual</div>
            <svg viewBox="0 0 400 440" style={{width: "100%"}}>
              {[
                {label: "Program Control", sub: null},
                {label: "Digital Travelers", sub: "Inspection Gates"},
                {label: "Routed Production", sub: "Multi-Node"},
                {label: "Supplier Compliance", sub: "AS9100 / EN 9100"},
                {label: "Secure Cells", sub: "ITAR / CUI"},
              ].map((l, i) => {
                const boxH = 64;
                const gap = 20;
                const y = 20 + i * (boxH + gap);
                const w = 320;
                const x = (400 - w) / 2;
                return (
                  <g key={i}>
                    {i > 0 && (
                      <line x1="200" y1={y - gap} x2="200" y2={y}
                        stroke="var(--accent)" strokeWidth="0.6" opacity="0.55" strokeDasharray="2 3"/>
                    )}
                    <rect x={x} y={y} width={w} height={boxH}
                      fill="var(--bg-panel)" stroke="var(--accent)" strokeWidth="0.8"/>
                    <text x="200" y={l.sub ? y + 28 : y + boxH / 2 + 4} textAnchor="middle"
                      fontFamily="var(--f-display)" fontSize="15" fontWeight="500" fill="var(--text-hi)" letterSpacing="0.2">
                      {l.label}
                    </text>
                    {l.sub && (
                      <text x="200" y={y + 48} textAnchor="middle"
                        fontFamily="var(--f-mono)" fontSize="9" fill="var(--text-faint)" letterSpacing="1.4">
                        {l.sub.toUpperCase()}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x="40" y="430" fontFamily="var(--f-mono)" fontSize="9" fill="var(--text-faint)" letterSpacing="1.4">
                CONTINUOUS AUDIT PATH · TRACEABILITY PRESERVED ACROSS NODES
              </text>
            </svg>
          </div>
          <div className="comp-list">
            {[
              ["AS9100", "Quality management alignment across workflows and supplier integration."],
              ["EN 9100", "European certification alignment as the entity operationalizes."],
              ["ITAR / EAR", "Export-control-aware execution for defense-aligned programs."],
              ["CUI Handling", "Controlled handling protocols for sensitive program data."],
              ["Digital Travelers", "Each unit carries its configuration, inspection record, and traceability data."],
              ["Secure Cells", "Segmented environments for IP-sensitive and defense programs."],
              ["Audit Logging", "Continuous monitoring across systems, workflows, and access layers."],
            ].map(([std, desc]) => (
              <div key={std} className="comp-row">
                <div className="std">{std}</div>
                <div className="desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ECONOMIC IMPACT
// ============================================================
function Impact() {
  return (
    <section className="sec-pad" id="impact" style={{background: "var(--bg-base)"}}>
      <div className="shell">
        <SecHead tag="12 · Economic Impact" meta="Workforce · Throughput · Activation"
          title="A force multiplier, not a single-site employer."
          lede="The platform delivers measurable direct impact at each node, but the primary economic value is generated through activation of the existing regional manufacturing base. A lean command layer orchestrates distributed, high-skill production nodes."
        />

        <div className="impact">
          <div className="impact-cell">
            <div className="coord">WORKFORCE · Distributed Model</div>

            <div style={{display: "flex", flexDirection: "column", gap: 6, marginTop: 4}}>
              <div style={{fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-dim)"}}>Headquarters · European command layer</div>
              <div style={{fontFamily: "var(--f-display)", fontSize: "clamp(40px, 4.4vw, 60px)", color: "var(--text-hi)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 0.9}}>20–35<small style={{fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--text-dim)", letterSpacing: 0, marginLeft: 6}}>personnel</small></div>
              <div style={{fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.55}}>Program routing · network orchestration · compliance oversight · customer interface.</div>
            </div>

            <div style={{height: 1, background: "var(--line)", margin: "14px 0 4px"}} />

            <div style={{display: "flex", flexDirection: "column", gap: 6}}>
              <div style={{fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)"}}>Forge nodes · per facility</div>
              <div style={{fontFamily: "var(--f-display)", fontSize: "clamp(48px, 5.2vw, 72px)", color: "var(--text-hi)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 0.9}}>75–150<small style={{fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--text-dim)", letterSpacing: 0, marginLeft: 6}}>per Forge</small></div>
              <div style={{fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.55}}>High-skill technical workforce: integration · composites · machining support · inspection and compliance.</div>
            </div>

            <p className="narr" style={{marginTop: 18, fontStyle: "italic"}}>Lean command layer with distributed, high-skill production nodes.</p>
          </div>

          <div className="impact-cell">
            <div className="coord">DIRECT · Throughput per Forge</div>
            <div className="big">€55–72<small>M / yr</small></div>
            <div className="unit">Annual aerospace production · per Forge</div>
            <p className="narr">High-mix, multi-program aerospace production. Integration of distributed supplier output into certified assemblies under a unified execution layer.</p>
          </div>

          <div className="impact-cell">
            <div className="coord">INDIRECT · Regional Industrial Activation</div>
            <div style={{fontFamily: "var(--f-display)", fontSize: "clamp(24px, 2.1vw, 28px)", color: "var(--text-hi)", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.2, marginTop: 2}}>
              The primary economic impact is generated through activation of the regional supplier base.
            </div>
            <ul style={{listStyle: "none", padding: 0, margin: "14px 0 0", display: "flex", flexDirection: "column", gap: 8}}>
              {[
                "SMEs gain access to aerospace and defense programs",
                "Existing manufacturing capacity is utilized more efficiently",
                "Revenue stability improves across the industrial base",
                "Regional capability shifts toward higher-value production",
              ].map((t) => (
                <li key={t} style={{fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.5, paddingLeft: 14, position: "relative"}}>
                  <span style={{position: "absolute", left: 0, top: 0, color: "var(--accent)"}}>·</span>{t}
                </li>
              ))}
            </ul>
            <p className="narr" style={{marginTop: 18, fontStyle: "italic"}}>For every Forge, dozens of regional suppliers are integrated into continuous aerospace production flow.</p>
          </div>
        </div>

        <div style={{marginTop: 48, borderTop: "1px solid var(--line)", paddingTop: 32}}>
          <div style={{display: "flex", alignItems: "baseline", gap: 16, marginBottom: 28}}>
            <div className="coord">13 · System-Level Economic Impact</div>
            <div style={{fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-dim)"}}>Why governments invest</div>
          </div>
          <div style={{fontFamily: "var(--f-display)", fontSize: "clamp(22px, 2vw, 28px)", color: "var(--text-hi)", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.25, maxWidth: 880, marginBottom: 36}}>
            Beyond direct employment and throughput, the platform reshapes the regional industrial base — raising utilization, building the workforce pipeline, and attracting programs that previously bypassed the region.
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid var(--line)"}}>
            {[
              ["Supplier Utilization", "Aggregated demand across multiple programs increases utilization across existing manufacturing infrastructure, stabilizing revenue and reducing idle capacity."],
              ["Workforce Development", "Structured partnerships with universities and technical institutes create a pipeline of engineers and technicians aligned with advanced manufacturing requirements."],
              ["Program Attraction", "A coordinated manufacturing capability increases regional competitiveness for aerospace and defense program placement, driving long-term industrial investment."],
            ].map(([h, d], i) => (
              <div key={h} style={{padding: "28px 28px 32px", borderRight: i < 2 ? "1px solid var(--line)" : 0, display: "flex", flexDirection: "column", gap: 10}}>
                <div style={{fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-dim)"}}>{`0${i+1}`}</div>
                <div style={{fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 500, color: "var(--text-hi)", letterSpacing: "-0.01em"}}>{h}</div>
                <div style={{fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.55}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// GOVERNMENT VALUE
// ============================================================
function Government() {
  return (
    <section className="sec-pad" id="government">
      <div className="shell">
        <SecHead tag="13 · Government Value" meta="Sovereignty · Readiness · Impact"
          title="Built for public-sector partnership."
          lede="The platform is commercially viable independent of subsidy. Public support enhances speed and scale, and is structured around measurable industrial and employment outcomes."
        />

        <div className="gov-grid">
          {[
            ["Industrial sovereignty", "Strengthens internal manufacturing capability and reduces dependency on external supply chains."],
            ["Defense readiness", "Enables rapid, compliant scaling of production for defense-aligned programs when demand spikes."],
            ["High-skill employment", "Durable technical jobs in advanced manufacturing, concentrated in the host region."],
            ["Supplier modernization", "Regional SMEs gain aerospace-grade workflows, compliance systems, and program access."],
            ["Program attraction", "Coordinated infrastructure makes the region competitive for future aerospace and defense programs."],
            ["Strategic positioning", "Host region becomes a structural node within continental and transatlantic manufacturing networks."],
          ].map(([t, d], i) => (
            <div key={t} className="gov-card">
              <div className="i">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {i === 0 && <><path d="M12 3 L20 7 L20 13 C20 17 16 20 12 21 C8 20 4 17 4 13 L4 7 Z"/></>}
                  {i === 1 && <><circle cx="12" cy="12" r="8"/><path d="M12 8 L12 12 L15 14"/></>}
                  {i === 2 && <><circle cx="12" cy="8" r="3"/><path d="M6 20 C6 16 9 14 12 14 C15 14 18 16 18 20"/></>}
                  {i === 3 && <><rect x="4" y="8" width="16" height="12"/><path d="M8 8 L8 5 L16 5 L16 8"/></>}
                  {i === 4 && <><path d="M4 12 L12 4 L20 12 L12 20 Z"/></>}
                  {i === 5 && <><path d="M3 12 L21 12 M12 3 L12 21"/><circle cx="12" cy="12" r="4"/></>}
                </svg>
              </div>
              <h5>{t}</h5>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Operating = Operating;
window.Security = Security;
window.Impact = Impact;
window.Government = Government;
