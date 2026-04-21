/* global React, PHASES_US, SecHead, Eyebrow */
const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;

// ============================================================
// ASGARD MODEL
// ============================================================
function Model() {
  return (
    <section className="sec-pad" id="model">
      <div className="shell">
        <SecHead tag="03 · The Asgard Model" meta="Route · Integrate · Control"
          title="Three layers. One coordinated flow."
          lede="Launchbelt routes. Forges integrate and control. Suppliers execute. Together they form a single operating system that converts distributed capability into certified, traceable throughput."
        />

        <div className="model-diagram">
          <div className="model-layer orchestration">
            <div>
              <div className="lid">Layer 01 · Digital</div>
              <div style={{fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--accent)", marginTop: 4, letterSpacing: "0.1em"}}>LAUNCHBELT</div>
            </div>
            <div>
              <h4><span className="bar"/>Routing & orchestration</h4>
              <p className="desc">Constraint-driven routing engine. Parses assemblies into manufacturable components, maps material and certification requirements, and dispatches work across qualified facilities while preserving traceability, configuration state, and program isolation at every handoff.</p>
              <div className="tech-row">
                <span className="tag on">Routing</span>
                <span className="tag on">Compliance</span>
                <span className="tag on">Traceability</span>
                <span className="tag on">Configuration</span>
              </div>
            </div>
            <div style={{fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--accent)", letterSpacing: "0.14em"}}>ACTIVE</div>
          </div>

          <div className="model-connector">┃ governs ┃</div>

          <div className="model-layer forge">
            <div>
              <div className="lid">Layer 02 · Physical</div>
              <div style={{fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--signal)", marginTop: 4, letterSpacing: "0.1em"}}>ASGARD FORGE</div>
            </div>
            <div>
              <h4><span className="bar"/>Control points of the system</h4>
              <p className="desc">Forges are where the network commits. They converge supplier output into integrated assemblies, hold certification authority, enforce configuration control, and operate the secure cells where IP-sensitive and defense-aligned work executes. Every routed flow terminates at, or is gated by, a Forge.</p>
              <div className="tech-row">
                <span className="tag">Integration</span>
                <span className="tag">Certification</span>
                <span className="tag">IP Protection</span>
                <span className="tag">Secure Cells</span>
              </div>
            </div>
            <div style={{fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--signal)", letterSpacing: "0.14em"}}>DEPLOY</div>
          </div>

          <div className="model-connector">┃ coordinates ┃</div>

          <div className="model-layer network">
            <div>
              <div className="lid">Layer 03 · Network</div>
              <div style={{fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--text-dim)", marginTop: 4, letterSpacing: "0.1em"}}>SUPPLIER BASE</div>
            </div>
            <div>
              <h4><span className="bar"/>The execution base</h4>
              <p className="desc">Qualified regional manufacturers receive routed work orders with embedded travelers, specs, and compliance context. Thousands of certified facilities operate as coordinated executors of a continental flow, not as disconnected vendors chasing one-off orders.</p>
              <div className="tech-row">
                <span className="tag">Machining</span>
                <span className="tag">Fabrication</span>
                <span className="tag">Materials</span>
                <span className="tag">Subsystems</span>
              </div>
            </div>
            <div style={{fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.14em"}}>ACTIVATE</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// U.S. EXECUTION LOGIC
// ============================================================
function UsExecution() {
  return (
    <section className="sec-pad" id="execution" style={{background: "var(--bg-base)"}}>
      <div className="shell">
        <SecHead tag="04 · Production-Driven Execution Model" meta="Sequenced · Gated · Validated"
          title="Physical scale will be earned through validated production flow."
          lede="This model defines how the platform scales. Execution progresses only after each layer is validated under real production conditions. Platform capability, supplier integration, and facility expansion are sequenced against operational proof, not projection."
        />

        <div className="phases">
          {PHASES_US.map((p, i) => (
            <div className="phase" key={p.n} style={{"--phase-idx": i, "--phase-total": PHASES_US.length}}>
              <div className="phase-progress" aria-hidden="true">
                <span className="phase-progress-fill" />
              </div>
              <div className="phase-head">
                <div className="phase-eyebrow">Phase {p.n}</div>
                <h5>{p.title}</h5>
              </div>
              <div className="phase-field">
                <div className="phase-lbl">Purpose</div>
                <p>{p.purpose}</p>
              </div>
              <div className="phase-field">
                <div className="phase-lbl">Unlock Condition</div>
                <p>{p.unlock}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="doctrine">
          <div className="doctrine-panel">
            <span className="doctrine-corner tl" aria-hidden="true" />
            <span className="doctrine-corner tr" aria-hidden="true" />
            <span className="doctrine-corner bl" aria-hidden="true" />
            <span className="doctrine-corner br" aria-hidden="true" />

            <div className="doctrine-head">
              <span className="doctrine-dot" aria-hidden="true" />
              <span className="doctrine-label">System Doctrine</span>
              <span className="doctrine-id">// 04 · EXEC-PRINCIPLE</span>
            </div>

            <blockquote className="doctrine-quote">
              <span className="q-mark" aria-hidden="true">“</span>
              Capital deployment will follow <em>validated throughput</em>,
              <br/>not speculative demand.
              <span className="doctrine-break" aria-hidden="true" />
              Each layer, platform, network, and facility,
              <br/>must be <em>operationally proven</em> before the next is deployed.
            </blockquote>

            <div className="doctrine-foot">
              <span className="doctrine-rule" aria-hidden="true" />
              <p className="doctrine-reinforce">
                This model governs how the platform scales across regions, facilities, and programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// WHY EUROPE, WHY NOW
// ============================================================
function WhyNow() {
  return (
    <section className="sec-pad" id="why-now">
      <div className="shell">
        <SecHead tag="05 · Why Europe · Why Now" meta="Structural · Strategic · Time-bound"
          title="The window is open. It will not remain open indefinitely."
          lede="A confluence of defense investment, sovereign-capability requirements, and manufacturing capacity gaps has created a time-bound opportunity to build coordinated industrial infrastructure. First-movers capture platform deployment. Others import capability from elsewhere."
        />

        <div className="timing-row">
          <div className="timing-cell">
            <div className="big">↑ <small>accelerating</small></div>
            <h5>European defense investment</h5>
            <p>Member-state defense budgets are expanding. The demand pipeline, air, ISR, space, dual-use, is materializing faster than the continent's coordinated manufacturing capacity can absorb it.</p>
          </div>
          <div className="timing-cell">
            <div className="big">SOV</div>
            <h5>Sovereign capability mandate</h5>
            <p>Europe is structurally motivated to strengthen internal industrial capacity and reduce external dependency. The platform model aligns directly with sovereign-capability requirements.</p>
          </div>
          <div className="timing-cell">
            <div className="big">×1000s</div>
            <h5>Capable suppliers, fragmented</h5>
            <p>Capability is not the constraint. Coordination is. The continent's industrial base is ready for a unified execution layer, and the pain of fragmentation is increasingly visible.</p>
          </div>
          <div className="timing-cell">
            <div className="big">01</div>
            <h5>First-mover window</h5>
            <p>The HQ region captures initial deployment, program flow, and long-term strategic positioning in the network. The compounding advantage accrues to the region that moves first.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Model = Model;
window.UsExecution = UsExecution;
window.WhyNow = WhyNow;
