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
            <svg viewBox="0 0 400 360" style={{width: "100%"}}>
              <defs>
                <linearGradient id="compG" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(72% 0.14 235)" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="oklch(72% 0.14 235)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[
                {y: 30, w: 360, label: "PROGRAM · CONFIGURATION CONTROL"},
                {y: 90, w: 320, label: "DIGITAL TRAVELERS · INSPECTION GATES"},
                {y: 150, w: 280, label: "ROUTED PRODUCTION · MULTI-NODE"},
                {y: 210, w: 240, label: "SUPPLIER COMPLIANCE · AS9100 / EN 9100"},
                {y: 270, w: 200, label: "SECURE CELLS · ITAR / CUI AWARE"},
              ].map((l, i) => (
                <g key={i}>
                  <rect x={(400 - l.w) / 2} y={l.y} width={l.w} height={42}
                    fill="var(--bg-panel)" stroke="var(--accent)" strokeWidth="0.8" opacity={1 - i * 0.05}/>
                  <text x="200" y={l.y + 26} textAnchor="middle"
                    fontFamily="var(--f-mono)" fontSize="10" fill="var(--text-hi)" letterSpacing="1.4">{l.label}</text>
                </g>
              ))}
              <g stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" strokeDasharray="3 3">
                <line x1="20" y1="51" x2="20" y2="291"/>
                <line x1="380" y1="51" x2="380" y2="291"/>
              </g>
              <text x="12" y="340" fontFamily="var(--f-mono)" fontSize="9" fill="var(--text-faint)" letterSpacing="1.4">CONTINUOUS AUDIT PATH · TRACEABILITY PRESERVED ACROSS NODES</text>
            </svg>
          </div>
          <div className="comp-list">
            {[
              ["AS9100", "Aerospace quality management alignment across workflows and supplier integration.", "ACTIVE", "a"],
              ["EN 9100", "European aerospace certification alignment as the entity operationalizes.", "PHASED", "p"],
              ["ITAR / EAR", "Export-control aware operational logic for defense-aligned programs.", "ACTIVE", "a"],
              ["CUI Handling", "Controlled Unclassified Information handling protocols for sensitive work.", "ACTIVE", "a"],
              ["Digital Travelers", "Every unit carries its documentation, inspection record, and configuration state.", "EMBEDDED", "a"],
              ["Secure Cells", "Physically and digitally segmented cells for IP-sensitive and defense programs.", "DESIGNED", "a"],
              ["Audit Logging", "Continuous monitoring with role-based access across systems and data.", "EMBEDDED", "a"],
            ].map(([std, desc, status, kind]) => (
              <div key={std} className="comp-row">
                <div className="std">{std}</div>
                <div className="desc">{desc}</div>
                <div className={"status " + kind}>● {status}</div>
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
        <SecHead tag="12 · Economic Impact" meta="Direct · Indirect · Systemic"
          title="A force multiplier, not a single-site employer."
          lede="The platform delivers measurable direct impact at each node, but the majority of economic value is generated through activation of the existing regional manufacturing base. Utilization rises, SMEs scale, and the regional ecosystem captures programs that previously bypassed it."
        />

        <div className="impact">
          <div className="impact-cell">
            <div className="coord">DIRECT · Employment</div>
            <div className="big">20 to 35<small>launch</small></div>
            <div className="big" style={{color: "var(--accent)"}}>150 to 250<small>scaled</small></div>
            <div className="unit">Per facility · high-skill technical roles</div>
            <p className="narr">Engineers, technicians, compliance specialists, and operations personnel concentrated in advanced-manufacturing disciplines. Long-term, non-transient, career-grade employment.</p>
          </div>
          <div className="impact-cell">
            <div className="coord">DIRECT · Throughput</div>
            <div className="big">€90 to 115<small>M / yr</small></div>
            <div className="unit">Annual aerospace production output · scaled facility</div>
            <p className="narr">High-mix, low-volume manufacturing. Multi-program execution. Integration of distributed supplier production under a unified execution layer.</p>
          </div>
          <div className="impact-cell">
            <div className="coord">INDIRECT · Multiplier</div>
            <div className="big">Majority<small>of total value</small></div>
            <div className="unit">Generated via regional SME activation</div>
            <p className="narr">Most economic value is generated through activation of the regional supplier base. SMEs gain consistent aerospace flow, improved utilization, and access to programs previously out of reach.</p>
          </div>
        </div>

        <div style={{marginTop: 0, borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "32px 40px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 32}}>
          <div className="coord">Systemic outcomes</div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28}}>
            {[
              ["Supplier utilization", "Aggregated demand across multiple programs raises utilization and stabilizes revenue across the regional industrial base."],
              ["Workforce pipeline", "Structured partnerships with universities and technical institutes convert regional talent into advanced-manufacturing capability."],
              ["Program attraction", "A coordinated manufacturing capability makes the region materially more competitive for aerospace and defense program placement."],
            ].map(([h, d]) => (
              <div key={h}>
                <div style={{fontFamily: "var(--f-display)", fontSize: 15, fontWeight: 500, color: "var(--text-hi)", letterSpacing: "-0.005em", marginBottom: 8}}>{h}</div>
                <div style={{fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5}}>{d}</div>
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
