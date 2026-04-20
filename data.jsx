/* global React */
const REGIONS_DATA = [
  {
    id: "AAE-R01", short: "Barcelona", name: "Barcelona / Catalonia", role: "European HQ · Command Layer", hq: true, country: "ES",
    sum: "Command and coordination center for the European network. The anchor for compliance, funding, and long-term topology.",
    narrative: [
      "Barcelona is selected as the proposed European headquarters because the city operates simultaneously as a talent hub, a logistics corridor, and an institutionally aligned government environment. It is structurally suited to host the control layer of a continent-scale manufacturing platform.",
      "The HQ defines initial regional alignment, partnership pathways, and long-term network topology. It is not a factory. It is the center of gravity from which the rest of the European buildout is governed."
    ],
    strengths: [
      ["Talent density", "Multilingual engineering and operations workforce drawn from the greater Iberian technical ecosystem."],
      ["International operability", "Gateway-tier air and sea logistics; a city equipped for continental-scale coordination."],
      ["Government alignment", "Active industrial policy with direct pathways into regional investment and public funding mechanisms."],
      ["Expansion logic", "Natural anchor for Iberian and western-Mediterranean manufacturing flow."]
    ]
  },
  {
    id: "AAE-R02", short: "Basque Country", name: "Basque Country", role: "Primary Manufacturing Hub", country: "ES",
    sum: "The production engine. A dense advanced-manufacturing base with aerospace-grade precision capability and public partnership maturity.",
    narrative: [
      "The Basque Country operates as the primary manufacturing hub. The region carries one of Europe's highest densities of certified aerospace suppliers and a public-industrial partnership model that is structurally ready for platform-level deployment.",
      "As a routed-production anchor, the node absorbs high-volume structural and integration work. Its pairing with the Barcelona HQ creates an execution couple between control and capacity."
    ],
    strengths: [
      ["Aerospace density", "Concentration of AS9100 and EN 9100 suppliers covering machining, composites, and systems integration."],
      ["Advanced industrial base", "Deep precision-engineering culture, with skilled technician pipelines and established training infrastructure."],
      ["Government support", "Mature regional industrial agencies with a demonstrated history of co-investing in strategic manufacturing."],
      ["Precision capability", "Qualified capacity for high-value, IP-sensitive aerospace components and subassemblies."]
    ]
  },
  {
    id: "AAE-R03", short: "Toulouse", name: "Toulouse / Occitanie", role: "Aerospace Integration Node", country: "FR",
    sum: "Program gravity node. Direct proximity to Europe's most established aerospace cluster and prime-contractor ecosystem.",
    narrative: [
      "Toulouse sits at the center of European aerospace program gravity. A node in Occitanie positions Asgard adjacent to prime contractors, engineering depth, and the long-standing cluster logic that governs continental program flow.",
      "The node functions as an integration and engineering-facing point of presence, enabling rapid program onboarding and tight coupling with existing aerospace infrastructure."
    ],
    strengths: [
      ["Aerospace cluster", "Direct proximity to one of the densest aerospace primes and supplier clusters in Europe."],
      ["Program proximity", "Accelerated access to program pipelines, engineering flow, and certification infrastructure."],
      ["Engineering depth", "High concentration of aerospace-specialized engineering and systems-integration talent."],
      ["Prime ecosystem relevance", "Structural compatibility with the existing aerospace value chain across France and southern Europe."]
    ]
  },
  {
    id: "AAE-R04", short: "Flanders", name: "Flanders", role: "Northern Logistics & Expansion Node", country: "BE",
    sum: "Northern Europe logistics and institutional access point. Central EU connectivity and NATO-adjacent proximity.",
    narrative: [
      "Flanders operates as the northern European logistics and expansion node. Its positioning provides central EU connectivity and institutional proximity that is difficult to replicate elsewhere on the continent.",
      "As a network-acceleration node, it provides fast reach into Benelux, Germany, and Northern France, and acts as the natural jump-point for phase-three and phase-four deployment into Central Europe."
    ],
    strengths: [
      ["Logistics", "Port, rail, and highway infrastructure at the center of continental freight flow."],
      ["Central EU access", "Same-day reach into Germany, Netherlands, and Northern France."],
      ["NATO and institutional proximity", "Immediate access to EU and NATO institutional frameworks."],
      ["Network acceleration", "Geographically positioned to compress deployment time for subsequent European hubs."]
    ]
  }
];

const PHASES_US = [
  { id: "P1", title: "Platform & team formation", desc: "Launchbelt architecture defined; core operational leadership assembled.", progress: 100 },
  { id: "P2", title: "Supplier network activation", desc: "Capability-mapped onboarding of qualified manufacturing partners.", progress: 100 },
  { id: "P3", title: "Routed production validation", desc: "Multi-node coordinated production with continuous certification continuity.", progress: 100 },
  { id: "P4", title: "Forge activation", desc: "First controlled integration facility deployed against validated routing density.", progress: 85 },
  { id: "P5", title: "Scale & density expansion", desc: "Throughput-driven growth in program count, supplier density, and Forge capacity.", progress: 40 },
];

const PHASES_EU = [
  { id: "01", window: "Months 0 to 3", title: "HQ landing & structuring",
    prose: "European entity formation, HQ site alignment, and initial partnership frameworks with regional agencies and institutional stakeholders.",
    bullets: ["Entity structuring under European operating vehicle", "HQ site selection and alignment", "Regional government and investment partner alignment", "Strategic briefing of key stakeholders"] },
  { id: "02", window: "Months 3 to 12", title: "First facility & supplier activation",
    prose: "Initial Forge footprint (30,000 to 50,000 sq ft) comes online. Qualified regional supplier network is onboarded into the execution layer.",
    bullets: ["Retrofit or buildout of initial facility", "Compliance and traceability systems live from day one", "Supplier capability mapping and onboarding", "First routed production volume"] },
  { id: "03", window: "Months 12 to 24", title: "Secondary hubs",
    prose: "Deployment of additional hubs across complementary regions to extend geographic coverage and increase throughput density.",
    bullets: ["Second and third hub deployment", "Cross-region production routing", "Expansion of workforce toward scaled footprint", "Multi-program execution at network level"] },
  { id: "04", window: "Year 2 to 4", title: "Continental node expansion",
    prose: "Hub-and-spoke architecture scales across central and eastern corridors. Compounding network effects increase supplier utilization and routing efficiency.",
    bullets: ["Central Europe expansion (DE / PL corridor)", "Southern corridor activation (IT)", "Automation maturity within Launchbelt routing", "Regional specialization patterns emerge"] },
  { id: "05", window: "Year 4+", title: "One-day continental coverage",
    prose: "Network density reaches the point where every major European industrial region operates within one-day ground-transport reach of an Asgard node.",
    bullets: ["Full continental footprint", "Unified European manufacturing system", "Large-scale defense and aerospace program capacity", "Transatlantic industrial integration"] }
];

const KB_CATEGORIES = [
  {
    key: "strategic", label: "Strategic Briefing", meta: "DOC-01",
    items: [
      { q: "What is Asgard Aerospace?", a: [
        "Asgard Aerospace is a production-native manufacturing platform that coordinates, scales, and secures aerospace and defense manufacturing across distributed industrial bases.",
        "The company integrates digital orchestration with physical manufacturing infrastructure to deliver certified, traceable, and repeatable production at speed. Its operating model combines a constraint-driven routing platform with strategically deployed integration facilities."
      ]},
      { q: "Why Europe, and why a dedicated entity?", a: [
        "Europe possesses deep aerospace capability but fragmented execution. Thousands of certified suppliers operate as independent nodes without a unified execution layer governing capacity allocation, compliance continuity, or configuration control.",
        "Asgard Aerospace Europe is structured as a dedicated operating entity aligned with European regulatory frameworks and public funding mechanisms, while maintaining technological continuity with the U.S. platform."
      ]},
      { q: "How is this different from a single-facility investment?", a: [
        "This is not a branch office and not a standalone factory. It is the deployment of a continental manufacturing infrastructure layer that activates existing regional capacity while introducing controlled integration points where the network requires them."
      ]}
    ]
  },
  {
    key: "facility", label: "Facility Requirements", meta: "DOC-02",
    items: [
      { q: "Facility footprint and scaling model", a: [
        "Initial deployment is sized at 30,000 to 50,000 sq ft, supporting integration, secure production environments, and initial composites and thermoplastics capability.",
        "Scaled facilities reach 60,000 to 100,000 sq ft with expanded integration capacity, multi-program production cells, and full inspection and certification infrastructure. Capacity benchmark: 150 to 250 employees and $100M, $125M of annual throughput per scaled node."
      ]},
      { q: "Functional zones", a: [
        "Integration and assembly, composites and thermoplastics, machining and fabrication support, inspection and metrology, and secure production areas. Each zone is defined with explicit compliance and access controls rather than repurposed generic floor space."
      ]},
      { q: "Security posture", a: [
        "Physical access control, segmented work zones, encrypted digital infrastructure, role-based data access, and continuous audit logging. The facility is designed to support government-grade security expectations and IP-sensitive program handling."
      ]}
    ]
  },
  {
    key: "operating", label: "Operating Model", meta: "DOC-03",
    items: [
      { q: "Entity structure", a: [
        "Asgard Aerospace Europe is structured as a dedicated European operating entity with local operational control, a shared technical architecture with the U.S. platform, and regional ownership flexibility where strategically appropriate."
      ]},
      { q: "IP and governance", a: [
        "A shared IP framework governs the technical architecture while preserving regional operational autonomy. This enables alignment with sovereign-capability requirements without fragmenting the underlying execution layer."
      ]},
      { q: "Gating logic", a: [
        "Each phase of growth is unlocked only after operational proof: platform validation, supplier network qualification, routed production density, compliance continuity, and economic justification for facility deployment. Capital follows validated throughput, not speculative demand."
      ]}
    ]
  },
  {
    key: "economic", label: "Economic Impact", meta: "DOC-04",
    items: [
      { q: "Direct employment", a: [
        "Initial team of 20 to 35 personnel, scaling to 150 to 250 employees per fully scaled facility. Roles are concentrated in advanced-manufacturing disciplines: aerospace and manufacturing engineers, skilled technicians, quality and compliance specialists, and supply chain operations."
      ]},
      { q: "Production throughput", a: [
        "Each scaled facility targets $100M to $125M in annual aerospace production output, driven by high-mix, low-volume manufacturing, multi-program execution, and integration of distributed supplier production."
      ]},
      { q: "Multiplier effect", a: [
        "The majority of economic value is generated through activation of the regional manufacturing base: increased SME utilization, attraction of new aerospace programs, workforce development, and durable industrial positioning."
      ]}
    ]
  },
  {
    key: "regional", label: "Regional Strategy", meta: "DOC-05",
    items: [
      { q: "Why Barcelona as HQ", a: [
        "Talent density, international operability, government alignment, and logistics depth. The HQ becomes the anchor for compliance, funding pathways, and long-term network topology."
      ]},
      { q: "Role of the Basque Country", a: [
        "Primary manufacturing hub. The region carries one of Europe's highest densities of certified aerospace suppliers and a public-industrial partnership model structurally ready for platform-level deployment."
      ]},
      { q: "Role of Toulouse and Flanders", a: [
        "Toulouse operates as an aerospace integration and program gravity node, adjacent to the continent's densest aerospace cluster. Flanders functions as the northern logistics and institutional acceleration node."
      ]}
    ]
  },
  {
    key: "network", label: "Network Vision", meta: "DOC-06",
    items: [
      { q: "Hub-and-spoke architecture", a: [
        "Hubs are Asgard facilities operating as integration and control nodes. Spokes are regional supplier networks. Each hub is positioned to coordinate production within an 8 to 10 hour ground-transport radius."
      ]},
      { q: "End-state vision", a: [
        "A continental manufacturing system where every major industrial region operates within one-day ground coverage of an Asgard hub, and production flows continuously across regions under a unified execution layer."
      ]},
      { q: "Indicative hub regions", a: [
        "Iberian Peninsula, Southern France, Benelux / Northern Europe, Central Europe (DE/PL corridor), and Southern Europe. Hub selection is driven by supplier density, workforce availability, aerospace cluster presence, logistics connectivity, and government alignment."
      ]}
    ]
  }
];

window.REGIONS_DATA = REGIONS_DATA;
window.PHASES_US = PHASES_US;
window.PHASES_EU = PHASES_EU;
window.KB_CATEGORIES = KB_CATEGORIES;
