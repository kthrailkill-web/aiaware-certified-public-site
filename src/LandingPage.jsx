import { useState, useEffect, useRef } from "react";
import "./LandingPage.css";

// ===== DATA =====
const WHY_NOW_STATS = [
  { stat: "82:1", label: "Machine-to-human identity ratio across enterprise cloud environments" },
  { stat: "48%", label: "Of cybersecurity pros rank agentic AI as the #1 attack vector for 2026" },
  { stat: "76%", label: "Of organizations report shadow AI problems — up 15% year-over-year" },
  { stat: "$38M", label: "Maximum EU AI Act fine — or 7% of global revenue" },
];

const COURSE1_MODULES = [
  { num: "01", title: "The Identity Revolution", desc: "How identity replaced the network as the security boundary. Zero Trust as an identity strategy. IAM foundations refreshed for the machine era.", topics: ["The New Perimeter", "IAM Foundations Refreshed", "Identity-First Security", "Identity Landscape Mapping Lab"] },
  { num: "02", title: "Non-Human Identities Deep Dive", desc: "Classifying and governing NHIs: service accounts, API keys, tokens, bots, RPA, AI agents, and MCP connections at enterprise scale.", topics: ["NHI Taxonomy & Lifecycle", "Secrets Management", "Privilege Sprawl & Identity Debt", "NHI Discovery & Classification Lab"] },
  { num: "03", title: "Agentic AI: The New Identity Frontier", desc: "Provisioning, credentialing, and governing autonomous AI agents. MCP protocols, shadow AI detection, and prompt injection defense.", topics: ["Agent Identity Architecture", "MCP & Agent Protocols", "Shadow AI & Rogue Agents", "Securing Agent Workflows Lab"] },
  { num: "04", title: "Zero Trust for Human + Machine", desc: "Extending Zero Trust to every agent, service account, and API. Continuous verification, adaptive access, and ITDR at machine speed.", topics: ["Continuous Verification", "Adaptive Access Control", "Microsegmentation & Identity", "Zero Trust Policy Design Lab"] },
  { num: "05", title: "IAM Tooling & Platform Strategy", desc: "Evaluating the modern IAM stack: IGA, PAM, CIEM, ISPM, ITDR. Vendor-neutral platform assessment and integration architecture.", topics: ["Modern IAM Stack", "Vendor Landscape Analysis", "Passwordless & Phishing-Resistant Auth", "IAM Tool Evaluation Lab"] },
  { num: "06", title: "Governance, Risk & Compliance", desc: "Navigating EU AI Act, NIST AI RMF, ISO 42001, SOX, HIPAA, and PCI-DSS identity requirements. Policy templates and risk frameworks.", topics: ["Regulatory Landscape", "AI Identity Policies", "Board-Level Communication", "Policy & Risk Assessment Lab"] },
  { num: "07", title: "Real-World Implementation", desc: "Enterprise case studies from financial services, healthcare, and technology. Migration strategies and building the business case.", topics: ["Financial Services Case Study", "Healthcare Case Study", "Technology Case Study", "Implementation Roadmap Capstone"] },
  { num: "08", title: "The Future: 2027 and Beyond", desc: "Post-quantum cryptography, decentralized identity for agents, agent-to-agent economies, and your final certification assessment.", topics: ["Post-Quantum Cryptography", "Decentralized Identity & DIDs", "Identity as Code", "Final Exam & Certification"] },
];

const COURSE2_MODULES = [
  { num: "01", title: "Foundations of AI Governance", desc: "Why AI governance matters, the global regulatory landscape, and how EU AI Act, ISO 42001, and NIST AI RMF layer together.", topics: ["Global Regulatory Landscape", "Risk-Based vs Rights-Based Models", "The Three Pillars", "Governance Maturity Assessment Lab"] },
  { num: "02", title: "The EU AI Act: Law to Implementation", desc: "Deep dive into the world's first comprehensive AI law. Risk categories, obligations, timelines, and operationalizing compliance.", topics: ["Risk Categories & Prohibited Practices", "High-Risk AI & Conformity Assessment", "GPAI Obligations", "EU AI Act Risk Classification Lab"] },
  { num: "03", title: "ISO/IEC 42001: Building an AIMS", desc: "The world's first certifiable AI standard. Build, implement, and prepare for audit of an AI Management System.", topics: ["10 Clauses + 38 Annex A Controls", "PDCA Cycle for AI", "ISO 27001 Overlap", "AIMS Gap Assessment Lab"] },
  { num: "04", title: "NIST AI Risk Management Framework", desc: "Master the Govern-Map-Measure-Manage functions. Build a practical risk management program aligned to the US baseline.", topics: ["4 Core Functions & 60 Subcategories", "Trustworthy AI Characteristics", "NIST-to-ISO Control Mapping", "AI Risk Register Lab"] },
  { num: "05", title: "Data Governance, Bias & Fairness", desc: "Govern training data, detect and mitigate bias, implement fairness testing. SHAP, LIME, model cards, and explainability.", topics: ["AI Data Lifecycle", "Bias Taxonomy & Detection Tools", "Fairness Definitions", "Bias Audit Lab"] },
  { num: "06", title: "AI Risk Assessment & Model Risk", desc: "AI impact assessments, model validation, drift detection, red teaming, incident response, and third-party AI risk.", topics: ["ISO 42005 Impact Assessments", "Model Risk Management", "Red Teaming AI Systems", "AI Impact Assessment Lab"] },
  { num: "07", title: "Building the AI Governance Program", desc: "Operationalize everything: governance structure, policies, control catalogs, compliance matrices, and audit evidence.", topics: ["Governance Operating Models", "Multi-Framework Control Catalog", "Board-Level Reporting", "Governance Program Blueprint Lab"] },
  { num: "08", title: "Audit, Certification & Road Ahead", desc: "Prepare for ISO 42001 certification audit, continuous compliance, emerging regulations, and your 90-day implementation roadmap.", topics: ["ISO 42001 Audit Prep", "Continuous Compliance Tools", "Emerging Global Regulations", "90-Day Roadmap Capstone"] },
];

const COURSE3_MODULES = [
  { num: "01", title: "The AI Threat Landscape", desc: "The 2026 AI threat landscape: prompt injection, agent hijacking, shadow AI, supply chain attacks, and the visibility gap your SOC can't see.", topics: ["AI Threat Taxonomy", "Agentic AI Attack Surface", "Shadow AI Explosion", "AI Attack Surface Mapping Lab"] },
  { num: "02", title: "Shadow AI: Finding & Controlling", desc: "Discover, govern, and control unsanctioned AI tools across every department. DLP for AI, browser controls, and fast-track approval workflows.", topics: ["Shadow AI Discovery", "AI Acceptable Use Policy", "DLP for AI Tools", "Shadow AI Discovery & Remediation Lab"] },
  { num: "03", title: "AI Security Awareness Training", desc: "Build an AI security awareness program that changes behavior. Prompt hygiene, output verification, deepfake defense, and role-specific training.", topics: ["EU AI Act Article 4 Literacy", "Prompt Hygiene", "Social Engineering via AI", "Build an Awareness Module Lab"] },
  { num: "04", title: "Securing AI Agents in Production", desc: "Unique agent identities, least privilege, MCP security, tool use governance, human oversight patterns, and runtime guardrails.", topics: ["Agent Identity & Credentials", "MCP Security & Monitoring", "Human Oversight Patterns", "Agent Security Architecture Lab"] },
  { num: "05", title: "AI Supply Chain & MLSecOps", desc: "MLBOM, model provenance, dependency scanning, data poisoning defense, vendor assessment, and securing the ML development lifecycle.", topics: ["ML Bill of Materials", "Model Scanning & Provenance", "Third-Party AI Vendor Assessment", "MLBOM & Vendor Assessment Lab"] },
  { num: "06", title: "Continuous Monitoring & Detection", desc: "AI-specific SIEM rules, behavioral baselines, drift detection, prompt injection detection, and SOC playbooks for AI alerts.", topics: ["AI Behavioral Baselines", "Prompt Injection Detection", "SOC Playbook for AI", "AI Detection Rule Lab"] },
  { num: "07", title: "AI Incident Response & Recovery", desc: "AI-specific IR playbooks, agent containment, forensics, root cause analysis, regulatory notification, and tabletop exercises.", topics: ["AI Incident Taxonomy", "Containment & Forensics", "Regulatory Notification", "AI Incident Tabletop Exercise Lab"] },
  { num: "08", title: "Building the AI SecOps Program", desc: "The complete operational blueprint: roles, calendars, tool approval workflows, metrics, board reporting, and your 12-month roadmap.", topics: ["AI SecOps Operating Model", "Metrics That Matter", "Executive Reporting", "12-Month SecOps Roadmap Capstone"] },
];

const COURSE4_MODULES = [
  { num: "01", title: "The Bottleneck Is a Design Flaw", desc: "Why governance bottlenecks are design problems, not headcount problems. The broken model vs. the new model — from 5-6 human decision points to 1-2.", topics: ["The Design Reframe", "Broken Model vs New Model", "5 Mindset Shifts"] },
  { num: "02", title: "Compliance as Architecture", desc: "Compliance as a property, not a gate. The type-safety analogy. Structural control, automated verification, and continuous signal patterns.", topics: ["Property vs Gate", "Structural Control", "Automated Verification", "Continuous Signal"] },
  { num: "03", title: "Policy-as-Code for AI Pipelines", desc: "Write OPA/Rego policies that enforce gate closure before agent tasking. Integrate into CI/CD pipelines. Test policy logic against allow and deny scenarios.", topics: ["OPA/Rego Policies", "CI/CD Integration", "Gate Enforcement", "Lab 1: Policy-as-Code"] },
  { num: "04", title: "Risk-Tiered Automation", desc: "Classify AI agent tasks into Low/Medium/High risk tiers. Automated gate closure for Tier 1, async review for Tier 2, hard-block for Tier 3.", topics: ["Risk Classification", "Automated Gate Closure", "Async Human Review", "Hard-Block Criteria"] },
  { num: "05", title: "NHI as an Enforcement Boundary", desc: "Four NHI design patterns: stage-scoped, JIT, gate-linked, audit-linked credentials. The credential IS the governance control.", topics: ["Stage-Scoped Credentials", "JIT Provisioning", "Gate-Linked Permissions", "Lab 2: NHI Scope Model"] },
  { num: "06", title: "Governance Agent Design Patterns", desc: "Deploy AI to audit AI at machine speed. Scope verification, creep detection, evidence generation, and violation escalation — all automated.", topics: ["Governance Agent Architecture", "Scope Verification", "Auto-Evidence Generation", "Lab 3: Governance Agent Capstone"] },
  { num: "07", title: "The Real Tooling Landscape", desc: "Honest assessment of the 4-layer governance stack: coding agents, policy engines, monitoring platforms, and NHI/IAM platforms. What works, what's emerging, what's missing.", topics: ["4-Layer Stack", "Coding Agent Governance", "Policy Engines (OPA/Cedar)", "The Honest Gap Map"] },
  { num: "08", title: "Measuring Governance Performance", desc: "Define metrics that prove your governance architecture works. The new engineer identity: compliance by construction.", topics: ["Governance Metrics", "Practical Starter Stacks", "The New Engineer Identity", "Course Completion & Artifacts"] },
];

// Helper to build a mailto: URL with pre-filled subject and body.
// Each pricing card uses this so signups land in the inbox already labeled
// by which tier the user is interested in (filterable in Gmail).
const buildMailto = (subject, body) =>
  `mailto:aiaware@aiawarecertified.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

// 6-card pricing layout (2026-04-08): each course gets its own roadmap-colored
// card. `state: "live"` = solid filled button + lit border + glow shadow.
// `state: "waitlist"` = outline button + dim border + transparent bg.
// As courses launch, flip their state from "waitlist" to "live".
const PRICING = [
  {
    tier: "Course 1: IAM for the Agentic AI Era",
    track: "Build",
    price: "$797",
    originalPrice: "$997",
    per: "Class Starts May 14, Early Sign-Up Opens May 4",
    features: [
      "8 modules | 8 labs | Exam",
      "IAM specialty credential",
      "12 months course access",
      "Permanent credential verification",
    ],
    cta: "Notify Me at Launch",
    state: "live",
    color: "#2DD4BF",
    badge: "Class Starts May 14",
    note: "$797 Early Release Rate — through June 15",
    href: buildMailto(
      "Course 1 Launch Notification Request \u2014 IAM for the Agentic AI Era",
      "Hi,\n\nPlease notify me when Course 1: IAM for the Agentic AI Era launches.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
    ),
  },
  {
    tier: "Course 2: AI Compliance & Governance Frameworks",
    track: "Govern",
    price: "TBD",
    per: "Pricing announced at launch",
    features: [
      "GRC specialty credential",
      "12 months course access",
      "Permanent credential verification",
    ],
    cta: "Notify Me at Launch",
    state: "waitlist",
    color: "#4CAF50",
    href: buildMailto(
      "Course 2 Launch Notification Request \u2014 AI Compliance & Governance Frameworks",
      "Hi,\n\nPlease notify me when Course 2: AI Compliance & Governance Frameworks launches.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
    ),
  },
  {
    tier: "Course 3: Operating & Securing AI in Production",
    track: "Operate",
    price: "TBD",
    per: "Pricing announced at launch",
    features: [
      "Security Ops credential",
      "12 months course access",
      "Permanent credential verification",
    ],
    cta: "Notify Me at Launch",
    state: "waitlist",
    color: "#64C8FF",
    href: buildMailto(
      "Course 3 Launch Notification Request \u2014 Operating & Securing AI in Production",
      "Hi,\n\nPlease notify me when Course 3: Operating & Securing AI in Production launches.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
    ),
  },
  {
    tier: "Course 4: AI Governance for Engineers",
    track: "Engineer",
    price: "TBD",
    per: "Pricing announced at launch",
    features: [
      "Engineering credential",
      "12 months course access",
      "Permanent credential verification",
    ],
    cta: "Notify Me at Launch",
    state: "waitlist",
    color: "#F59E0B",
    href: buildMailto(
      "Course 4 Launch Notification Request \u2014 AI Governance for Engineers",
      "Hi,\n\nPlease notify me when Course 4: AI Governance for Engineers launches.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
    ),
  },
  {
    tier: "Complete Program",
    price: "TBD",
    per: "All 4 Courses",
    features: [
      "All 4 courses (75+ hours)",
      "32 modules + all hands-on labs",
      "Comprehensive certification exam",
      'Full "AI Aware Certified\u2122 Professional" designation',
    ],
    cta: "Notify Me at Launch",
    state: "waitlist",
    color: "#0D7377",
    badge: "BEST Value Coming",
    note: "Bundle pricing announced as each course goes live",
    href: buildMailto(
      "Complete Program Launch Notification Request \u2014 AI Aware Certified",
      "Hi,\n\nPlease notify me when the AI Aware Certified Complete Program (all 4 courses) launches with full pricing.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
    ),
  },
  {
    tier: "Enterprise",
    price: "TBD",
    per: "Team Licensing",
    features: [
      "Team licensing (10+)",
      "All courses included",
      "Custom case studies",
      "Virtual self-paced delivery",
      "Executive briefing included",
    ],
    cta: "Contact Us",
    state: "waitlist",
    color: "#FFFFFF",
    note: "Volume discounts available",
    href: buildMailto(
      "AI Aware Certified Enterprise Inquiry",
      "Hi,\n\nI'm inquiring about enterprise / team licensing for AI Aware Certified.\n\nCompany name:\nNumber of seats needed:\nWhich courses (1, 2, 3, 4, or all):\nDesired start date:\nNotes:\n\nThanks!"
    ),
  },
];

// ===== COMPONENTS =====

function NavBar() {
  return (
    <nav className="nav-bar">
      <a href="#" className="flex items-center">
        <img src="/logo-nav.jpg" alt="AI Aware Certified" className="h-[4.5rem]" style={{ mixBlendMode: 'lighten' }} />
      </a>
      <div className="hidden md:flex items-center gap-8">
        <a href="#courses" className="text-sm text-white/85 hover:text-white/90 transition-colors">Courses</a>
        <a href="#curriculum" className="text-sm text-white/85 hover:text-white/90 transition-colors">Curriculum</a>
        <a href="#pricing" className="text-sm text-white/85 hover:text-white/90 transition-colors">Pricing</a>
        <a href="#roadmap" className="text-sm text-white/85 hover:text-white/90 transition-colors">Roadmap</a>
        <a href="#contact" className="btn-primary !py-2 !px-5 !text-sm">Contact Us</a>
      </div>
    </nav>
  );
}

function HeroBackground() {
  return (
    <>
      <div className="bg-gradient-animated" />
      <div className="corner-accent tl" />
      <div className="corner-accent tr" />
      <div className="corner-accent bl" />
      <div className="corner-accent br" />
      <div className="scan-line" />
      <div className="pulse-ring" />
      <div className="pulse-ring" />
      <div className="pulse-ring" />

      <div className="circuit-layer">
        <svg viewBox="0 0 1400 800" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#0D7377" fill="none" strokeWidth="0.5">
            <path d="M0,200 Q200,180 400,220 T800,190 T1400,210" opacity="0.5" />
            <path d="M0,400 Q300,380 600,420 T1000,390 T1400,400" opacity="0.4" />
            <path d="M0,600 Q250,580 500,620 T900,590 T1400,610" opacity="0.3" />
            <path d="M300,100 Q320,300 280,500 T320,700" opacity="0.3" />
            <path d="M700,50 Q720,250 680,450 T720,750" opacity="0.4" />
            <path d="M1100,100 Q1080,300 1120,500 T1080,700" opacity="0.3" />
            <path d="M100,100 Q350,250 500,350 T700,400" opacity="0.2" />
            <path d="M1300,100 Q1050,250 900,350 T700,400" opacity="0.2" />
            <path d="M100,700 Q350,550 500,450 T700,400" opacity="0.2" />
            <path d="M1300,700 Q1050,550 900,450 T700,400" opacity="0.2" />
          </g>
          <g fill="#0D7377" opacity="0.3">
            <circle cx="200" cy="195" r="3"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" /></circle>
            <circle cx="400" cy="220" r="2.5"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" /></circle>
            <circle cx="600" cy="190" r="3"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.5s" repeatCount="indefinite" /></circle>
            <circle cx="800" cy="210" r="2"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.8s" repeatCount="indefinite" /></circle>
            <circle cx="1000" cy="200" r="3"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="4.2s" repeatCount="indefinite" /></circle>
            <circle cx="1200" cy="215" r="2.5"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.3s" repeatCount="indefinite" /></circle>
            <circle cx="300" cy="400" r="3"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.7s" repeatCount="indefinite" /></circle>
            <circle cx="900" cy="395" r="3"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.1s" repeatCount="indefinite" /></circle>
            <circle cx="1100" cy="410" r="2.5"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.9s" repeatCount="indefinite" /></circle>
          </g>
        </svg>
      </div>

      <div className="shield-symbol">
        <svg viewBox="0 0 380 380" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D7377" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D7377" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#2E7D32" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0D7377" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <g transform="translate(190,190)">
            <path d="M0,-120 L80,-80 L80,30 Q80,90 0,120 Q-80,90 -80,30 L-80,-80 Z" fill="url(#innerGlow)" stroke="url(#tealGrad)" strokeWidth="1.5" opacity="0.5">
              <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
            </path>
            <path d="M0,-80 L50,-55 L50,15 Q50,60 0,80 Q-50,60 -50,15 L-50,-55 Z" fill="none" stroke="#0D7377" strokeWidth="1" opacity="0.3" />
            <path d="M-20,5 L-5,20 L25,-15" stroke="#0D7377" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
            </path>
            <circle cx="50" cy="-20" r="2" fill="#0D7377" opacity="0.4" />
            <circle cx="-50" cy="-20" r="2" fill="#0D7377" opacity="0.4" />
            <circle cx="0" cy="-80" r="2.5" fill="#4CAF50" opacity="0.4" />
            <circle cx="35" cy="40" r="1.5" fill="#4CAF50" opacity="0.3" />
            <circle cx="-35" cy="40" r="1.5" fill="#4CAF50" opacity="0.3" />
          </g>
          <g transform="translate(190,190)">
            <circle cx="0" cy="0" r="140" fill="none" stroke="#0D7377" strokeWidth="0.3" strokeDasharray="3,8" opacity="0.3">
              <animateTransform attributeName="transform" type="rotate" values="0;360" dur="20s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="165" fill="none" stroke="#4CAF50" strokeWidth="0.3" strokeDasharray="5,12" opacity="0.2">
              <animateTransform attributeName="transform" type="rotate" values="360;0" dur="30s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>

      <div className="orbit-ring orbit-ring-1" />
      <div className="orbit-ring orbit-ring-2" />
      <div className="orbit-ring orbit-ring-3" />

      <div className="particle particle-teal" style={{ width: 12, height: 12, top: '25%', left: '15%', animationDelay: '0s', animationDuration: '5s' }} />
      <div className="particle particle-green" style={{ width: 10, height: 10, top: '65%', left: '12%', animationDelay: '1s', animationDuration: '7s' }} />
      <div className="particle particle-cyan" style={{ width: 8, height: 8, top: '30%', left: '82%', animationDelay: '2s', animationDuration: '6s' }} />
      <div className="particle particle-teal" style={{ width: 14, height: 14, top: '70%', left: '85%', animationDelay: '0.5s', animationDuration: '5.5s' }} />
      <div className="particle particle-white" style={{ width: 6, height: 6, top: '15%', left: '60%', animationDelay: '3s', animationDuration: '8s' }} />
      <div className="particle particle-green" style={{ width: 10, height: 10, top: '80%', left: '40%', animationDelay: '1.5s', animationDuration: '6.5s' }} />
      <div className="particle particle-cyan" style={{ width: 7, height: 7, top: '40%', left: '75%', animationDelay: '1.8s', animationDuration: '6.2s' }} />
      <div className="particle particle-teal" style={{ width: 9, height: 9, top: '85%', left: '65%', animationDelay: '3.5s', animationDuration: '5.3s' }} />

      <div className="data-flow" style={{ top: '30%', left: 0, width: '40%', animationDelay: '0s' }} />
      <div className="data-flow" style={{ top: '50%', left: '60%', width: '40%', animationDelay: '1.5s' }} />
      <div className="data-flow" style={{ top: '70%', left: '10%', width: '35%', animationDelay: '3s' }} />

      <div className="top-fade" />
      <div className="bottom-fade" />
    </>
  );
}

function HeroSection() {
  return (
    <section className="hero-section">
      <HeroBackground />
      <div className="hero-content">
        <p className="text-sm font-medium tracking-[3px] uppercase text-[#4CAF50]/70 mb-6">
          Professional Certification Program
        </p>

        <h1 className="font-['Playfair_Display',serif] text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight mb-4"
            style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}>
          Master AI Security,<br />
          <span className="text-[#0D7377]">Identity & Governance</span>
        </h1>

        <p className="tagline text-base md:text-lg font-light text-white/85 text-center mb-3 max-w-3xl" style={{ letterSpacing: '1px' }}>
          Four practitioner-built certification tracks for the agentic AI era
        </p>
        <p className="text-sm text-white/75 text-center mb-10 max-w-2xl">
          Identity + Governance + Operations &bull; EU AI Act + ISO 42001 + NIST AI RMF + MLSecOps
        </p>

        <div className="cta-buttons flex flex-col sm:flex-row gap-4 mb-10">
          <a href="#courses" className="btn-primary">Explore Courses</a>
          <a href="#pricing" className="btn-outline">View Pricing</a>
        </div>

        <div className="stat-pills flex flex-wrap justify-center gap-4">
          {[
            { color: "#2DD4BF", label: "Course 1: IAM for the Agentic AI Era" },
            { color: "#4CAF50", label: "8 Modules | 8 Labs | Exam" },
            { color: "#64C8FF", label: "Hands-On Labs in Every Module" },
            { color: "#F59E0B", label: "Coming Soon: Compliance \u00B7 Operations \u00B7 Engineering" },
          ].map((pill) => (
            <div key={pill.label} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full" style={{ background: pill.color, boxShadow: `0 0 8px ${pill.color}80` }} />
              <span className="text-sm text-white/85 tracking-wider">{pill.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyNowSection() {
  return (
    <section id="why-now" className="section-dark py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-sm font-medium tracking-[4px] uppercase text-[#0D7377] mb-4">Why This Matters Now</p>
          <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-white mb-6">
            The Threat Landscape Has <span className="text-[#0D7377]">Fundamentally Shifted</span>
          </h2>
          <p className="text-lg text-white/85 max-w-3xl mx-auto">
            Non-human identities outnumber humans 82-to-1. AI agents execute workflows with elevated privileges.
            The EU AI Act is enforceable August 2026. Shadow AI is in every department. Organizations need professionals
            who can build the identity layer, govern compliance, and operate AI securely every single day.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_NOW_STATS.map((s) => (
            <div key={s.stat} className="feature-card reveal text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0D7377] mb-3 font-['Playfair_Display',serif]">{s.stat}</div>
              <p className="text-sm text-white/85 leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursesOverviewSection() {
  return (
    <section id="courses" className="section-darker py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-sm font-medium tracking-[4px] uppercase text-[#4CAF50] mb-4">Four Tracks, One Credential</p>
          <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-white mb-6">
            The Complete <span className="text-[#0D7377]">AI Aware Certified</span> Program
          </h2>
          <p className="text-lg text-white/85 max-w-3xl mx-auto">
            Build the identity layer. Govern the compliance framework. Operate it securely every day.
            Engineer compliance into the system. Complete all four to earn the full
            AI Aware Certified&#8482; Professional designation.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Course 1 */}
          <div className="reveal rounded-2xl border border-[#0D7377]/30 bg-gradient-to-b from-[rgba(13,115,119,0.08)] to-transparent p-8 relative">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/10">
              <span className="text-[10px] text-[#2DD4BF] tracking-widest uppercase font-medium">Class Starts May 14</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#0D7377]/15 border border-[#0D7377]/30 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <path d="M12 2L4 6v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V6l-8-4z" stroke="#0D7377" strokeWidth="1.5" />
                  <path d="M9 12l2 2 4-4" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#2DD4BF] tracking-wider uppercase font-medium">Course 1</p>
                <p className="text-xs text-white/70">Specialty Badge: IAM</p>
              </div>
            </div>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-white mb-2">
              IAM for the Agentic AI Era
            </h3>
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              Securing human & non-human identities in an AI-first world.
              Managing autonomous agents, machine identities & Zero Trust at enterprise scale.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/85">
                <span className="text-[#0D7377]">&#9656;</span> 8 modules | 8 labs | Exam
              </div>
              <div className="flex items-center gap-2 text-sm text-white/85">
                <span className="text-[#0D7377]">&#9656;</span> NHIs, MCP security, privilege sprawl, ITDR, Zero Trust
              </div>
              <div className="flex items-center gap-2 text-sm text-white/85">
                <span className="text-[#0D7377]">&#9656;</span> For: IAM engineers, security architects, CISOs
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="#curriculum" className="btn-primary !py-2 !px-5 !text-sm">View Modules</a>
              <span className="text-sm text-white/85">
                <span className="text-white/50 line-through mr-1">$997</span>
                <span className="text-[#2DD4BF] font-semibold">$797</span>
                <span className="text-white/75"> &mdash; Early Release Rate, through June 15</span>
              </span>
            </div>
          </div>

          {/* Course 2 - Coming Soon */}
          <div className="reveal rounded-2xl border border-white/8 bg-white/[0.02] p-8 relative">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
              <span className="text-[10px] text-white/75 tracking-widest uppercase font-medium">Coming Soon</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#4CAF50]/5 border border-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="#4CAF50" strokeWidth="1.5" />
                  <path d="M8 12h8M8 8h8M8 16h5" stroke="#0D7377" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#4CAF50] tracking-wider uppercase font-medium">Course 2</p>
                <p className="text-xs text-white/15">Specialty Badge: GRC</p>
              </div>
            </div>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-white/85 mb-2">
              AI Compliance & Governance Frameworks
            </h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Building, auditing & sustaining enterprise AI governance programs.
              Mastering EU AI Act, ISO/IEC 42001, NIST AI RMF & global AI regulation.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-[#4CAF50]/40">&#9656;</span> EU AI Act, ISO 42001, NIST AI RMF, bias, model risk
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-[#4CAF50]/40">&#9656;</span> For: GRC pros, compliance officers, CISOs, auditors
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href={buildMailto(
                "Course 2 Launch Notification Request \u2014 AI Compliance & Governance Frameworks",
                "Hi,\n\nPlease notify me when Course 2: AI Compliance & Governance Frameworks launches.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
              )} className="btn-outline !py-2 !px-5 !text-sm !border-[#4CAF50]/40 !text-[#4CAF50]">Notify Me at Launch</a>
              <span className="text-sm text-white/75">Coming Soon</span>
            </div>
          </div>

          {/* Course 3 - Coming Soon */}
          <div className="reveal rounded-2xl border border-white/8 bg-white/[0.02] p-8 relative">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
              <span className="text-[10px] text-white/75 tracking-widest uppercase font-medium">Coming Soon</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#64C8FF]/5 border border-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#64C8FF" strokeWidth="1.5" />
                  <path d="M12 7v5l3 3" stroke="#0D7377" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#64C8FF] tracking-wider uppercase font-medium">Course 3</p>
                <p className="text-xs text-white/15">Specialty Badge: Security Operations</p>
              </div>
            </div>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-white/85 mb-2">
              Operating & Securing AI in Production
            </h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Day-to-day AI security operations, user education & continuous controls.
              What do you do Monday morning when AI is already live?
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-[#64C8FF]/40">&#9656;</span> Shadow AI, agent security, MLSecOps, IR, SOC playbooks
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-[#64C8FF]/40">&#9656;</span> For: SOC teams, IT ops, DevSecOps, platform engineers
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href={buildMailto(
                "Course 3 Launch Notification Request \u2014 Operating & Securing AI in Production",
                "Hi,\n\nPlease notify me when Course 3: Operating & Securing AI in Production launches.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
              )} className="btn-outline !py-2 !px-5 !text-sm !border-[#64C8FF]/40 !text-[#64C8FF]">Notify Me at Launch</a>
              <span className="text-sm text-white/75">Coming Soon</span>
            </div>
          </div>

          {/* Course 4 - Coming Soon */}
          <div className="reveal rounded-2xl border border-white/8 bg-white/[0.02] p-8 relative">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
              <span className="text-[10px] text-white/75 tracking-widest uppercase font-medium">Coming Soon</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/5 border border-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40" fill="none">
                  <path d="M4 6h16M4 12h16M4 18h10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 15l-3 3 3 3" stroke="#0D7377" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#F59E0B] tracking-wider uppercase font-medium">Course 4</p>
                <p className="text-xs text-white/15">Specialty Badge: Engineering</p>
              </div>
            </div>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-white/85 mb-2">
              AI Governance for Engineers
            </h3>
            <p className="text-sm text-white/70 mb-1 font-medium italic">Compliance by Construction</p>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Build systems that cannot violate compliance. Policy-as-code, NHI enforcement boundaries,
              governance agents, and risk-tiered automation.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-[#F59E0B]/40">&#9656;</span> OPA/Rego, NHI scoping, governance agents, MLSecOps
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-[#F59E0B]/40">&#9656;</span> For: SREs, DevOps, platform engineers, AI/ML developers
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href={buildMailto(
                "Course 4 Launch Notification Request \u2014 AI Governance for Engineers",
                "Hi,\n\nPlease notify me when Course 4: AI Governance for Engineers launches.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
              )} className="btn-outline !py-2 !px-5 !text-sm !border-[#F59E0B]/40 !text-[#F59E0B]">Notify Me at Launch</a>
              <span className="text-sm text-white/75">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Bundle callout */}
        <div className="mt-10 reveal">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#0D7377]/20 border border-[#0D7377]/40 flex items-center justify-center text-xs text-[#0D7377] font-bold">1</div>
                <div className="w-8 h-8 rounded-full bg-[#4CAF50]/15 border border-[#4CAF50]/30 flex items-center justify-center text-xs text-[#4CAF50] font-bold">2</div>
                <div className="w-8 h-8 rounded-full bg-[#64C8FF]/15 border border-[#64C8FF]/25 flex items-center justify-center text-xs text-[#64C8FF] font-bold">3</div>
                <div className="w-8 h-8 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/25 flex items-center justify-center text-xs text-[#F59E0B] font-bold">4</div>
              </div>
              <div>
                <p className="text-white font-semibold">Complete Program: All Four Courses</p>
                <p className="text-sm text-white/80">Identity + Governance + Operations + Engineering</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white font-['Playfair_Display',serif]">TBD</span>
                <span className="text-[10px] text-white/60 tracking-widest uppercase font-medium mt-1">Pricing Coming Soon</span>
              </div>
              <a
                href={buildMailto(
                  "Complete Program Launch Notification Request \u2014 AI Aware Certified",
                  "Hi,\n\nPlease notify me when the AI Aware Certified Complete Program (all 4 courses) launches with full pricing.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
                )}
                className="btn-primary !py-2 !px-5 !text-sm"
              >
                Notify Me at Launch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CurriculumSection() {
  const [activeTab, setActiveTab] = useState("course1");
  const moduleMap = { course1: COURSE1_MODULES, course2: COURSE2_MODULES, course3: COURSE3_MODULES, course4: COURSE4_MODULES };
  const infoMap = {
    course1: { label: "Course 1", title: "IAM for the Agentic AI Era", color: "#2DD4BF", hours: "", labs: "8 labs" },
    course2: { label: "Course 2", title: "AI Compliance & Governance Frameworks", color: "#4CAF50", hours: "", labs: "" },
    course3: { label: "Course 3", title: "Operating & Securing AI in Production", color: "#64C8FF", hours: "", labs: "" },
    course4: { label: "Course 4", title: "AI Governance for Engineers", color: "#F59E0B", hours: "", labs: "" },
  };
  const modules = moduleMap[activeTab];
  const courseInfo = infoMap[activeTab];

  return (
    <section id="curriculum" className="section-dark py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="text-base md:text-lg font-bold tracking-[4px] uppercase text-[#2DD4BF] mb-4">Curriculum</p>
          <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-white mb-6">
            IAM for Agentic AI <span className="text-white/40">&middot;</span> 8 Modules <span className="text-white/40">&middot;</span> <span className="text-[#2DD4BF]">8 Labs</span>
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center rounded-xl border border-white/10 bg-white/[0.02] p-1 gap-1">
            <button
              onClick={() => setActiveTab("course1")}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex flex-col items-center leading-tight ${
                activeTab === "course1"
                  ? "bg-[#2DD4BF]/20 text-white border border-[#2DD4BF]"
                  : "text-white hover:text-white border border-transparent"
              }`}
            >
              <span>Course 1: IAM for Agentic AI</span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#2DD4BF] mt-1">Class Starts May 14</span>
            </button>
            <button
              onClick={() => setActiveTab("course2")}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex flex-col items-center leading-tight ${
                activeTab === "course2"
                  ? "bg-[#4CAF50]/15 text-[#4CAF50] border border-[#4CAF50]"
                  : "text-[#4CAF50] hover:text-[#4CAF50] border border-transparent"
              }`}
            >
              <span>Course 2: AI Compliance & Governance</span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#4CAF50] mt-1">Coming Soon</span>
            </button>
            <button
              onClick={() => setActiveTab("course3")}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex flex-col items-center leading-tight ${
                activeTab === "course3"
                  ? "bg-[#64C8FF]/15 text-[#64C8FF] border border-[#64C8FF]"
                  : "text-[#64C8FF] hover:text-[#64C8FF] border border-transparent"
              }`}
            >
              <span>Course 3: AI Security Ops</span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#64C8FF] mt-1">Coming Soon</span>
            </button>
            <button
              onClick={() => setActiveTab("course4")}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex flex-col items-center leading-tight ${
                activeTab === "course4"
                  ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]"
                  : "text-[#F59E0B] hover:text-[#F59E0B] border border-transparent"
              }`}
            >
              <span>Course 4: AI Governance for Engineers</span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#F59E0B] mt-1">Coming Soon</span>
            </button>
          </div>
        </div>

        {/* Course info bar */}
        <div className="mb-8 text-center">
          <p className="text-xs tracking-wider uppercase font-medium mb-1" style={{ color: courseInfo.color }}>{courseInfo.label}</p>
          <p className="text-xl text-white font-semibold font-['Playfair_Display',serif]">{courseInfo.title}</p>
          {courseInfo.labs ? (
            <p className="text-sm text-white/75 mt-1">{["8 modules", courseInfo.hours, courseInfo.labs, "Certification exam"].filter(Boolean).join(" • ")}</p>
          ) : (
            <p className="text-sm text-white/75 mt-1">Coming soon &mdash; curriculum announced at launch</p>
          )}
        </div>

        {/* Modules list */}
        <div className="space-y-4">
          {modules.map((m) => (
            <div key={`${activeTab}-${m.num}`} className="module-card grid md:grid-cols-[80px_1fr_1fr] gap-4 items-start">
              <div>
                <div className="text-3xl font-bold font-['Playfair_Display',serif]" style={{ color: `${courseInfo.color}40` }}>{m.num}</div>
                <div className="text-xs text-white/70 mt-1">{m.hours}</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{m.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{m.desc}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {m.topics.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full border border-white/8 bg-white/[0.02] text-white/75">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursePhilosophySection() {
  return (
    <section className="section-darker py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="reveal grid md:grid-cols-[1fr_2fr] gap-12 items-center">
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-2xl border border-[rgba(13,115,119,0.2)] bg-gradient-to-br from-[rgba(13,115,119,0.1)] to-transparent flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
                <path d="M40 8L12 22v18c0 16.5 12 31.2 28 36 16-4.8 28-19.5 28-36V22L40 8z" stroke="#0D7377" strokeWidth="1.5" fill="rgba(13,115,119,0.1)" />
                <path d="M30 40l6 6 14-14" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium tracking-[4px] uppercase text-[#0D7377] mb-4">Course Philosophy</p>
            <h3 className="font-['Playfair_Display',serif] text-3xl font-bold text-white mb-4">
              Built by a Practitioner, Not a Vendor
            </h3>
            <p className="text-white/85 mb-6 leading-relaxed">
              Every module reflects real enterprise deployments &mdash; not theoretical frameworks
              or vendor marketing. This curriculum was built by a practitioner who has personally
              led the transition from legacy human-identity IAM to agentic AI identity governance
              at production scale, inside an AI-first identity security company. The same playbook
              used to rebuild enterprise identity programs for the agentic era is the playbook this
              course teaches. Real experience. Real scars. Real frameworks that work.
            </p>
            <div className="space-y-3">
              {[
                "Drawn from real-world implementations across IT, cybersecurity, technology, manufacturing, HR, healthcare, and higher education",
                "Vendor-neutral — covers the full landscape without favoring any single platform",
                "Production-tested frameworks you can apply on day one",
                "Updated continuously as the agentic era evolves \u2014 MCP, A2A protocols, evolving NHI taxonomy, and the latest regulatory frameworks (EU AI Act, ISO 42001, NIST AI RMF)",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <svg className="w-4 h-4 mt-1 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l3 3 5-5" stroke="#0D7377" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-white/85">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="section-dark py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-sm font-medium tracking-[4px] uppercase text-[#0D7377] mb-4">Who This Is For</p>
          <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-white mb-6">
            Built for <span className="text-[#0D7377]">Practitioners</span> & <span className="text-[#4CAF50]">Leaders</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { role: "IAM Engineers & Architects", desc: "Expanding into NHI and AI agent security. Take your IAM expertise into the agentic era.", courses: "Courses 1 & 4" },
            { role: "CISOs & Security Leaders", desc: "Building AI governance programs. Understand identity risks, compliance obligations, and daily operations.", courses: "Courses 1, 2, 3 & 4" },
            { role: "GRC & Compliance Officers", desc: "Navigating EU AI Act, ISO 42001, and NIST AI RMF. Build audit-ready governance programs.", courses: "Courses 2 & 3" },
            { role: "SOC Teams & IT Operations", desc: "Monitoring AI systems, detecting threats, responding to AI incidents, and controlling shadow AI.", courses: "Courses 1 & 3" },
            { role: "DevSecOps & Platform Engineers", desc: "Securing the AI supply chain, MLSecOps pipelines, and agent runtime environments. Ship governance into your CI/CD.", courses: "Courses 1, 3 & 4" },
            { role: "ML/AI Engineers & Architects", desc: "Building production AI agents, NHI workflows, and policy-as-code pipelines. Compliance by construction, not as a checkbox.", courses: "Courses 1 & 4" },
            { role: "AI Product Managers", desc: "Shipping AI features that need to pass risk reviews. Speak the language of compliance, security, and engineering.", courses: "Courses 2 & 4" },
            { role: "Legal, Privacy & Audit Teams", desc: "Understanding AI regulatory requirements, risk assessments, and certification audit preparation.", courses: "Course 2" },
          ].map((a) => (
            <div key={a.role} className="feature-card reveal flex flex-col h-full">
              <h3 className="text-base font-semibold text-white mb-2">{a.role}</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-3 flex-1">{a.desc}</p>
              <p className="text-xs text-[#2DD4BF] font-semibold mt-auto pt-2">Recommended: {a.courses}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="section-darker py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-sm font-medium tracking-[4px] uppercase text-[#4CAF50] mb-4">Pricing</p>
          <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-white mb-6">
            Invest in Your <span className="text-[#0D7377]">AI Expertise</span>
          </h2>
          <p className="text-lg text-white/80">
            Individual courses, the advanced engineering track, or the complete program.
            Course 1 class starts May 14. Early sign-up opens May 4 with a $797 Early Release Rate through June 15 &mdash; join the launch list to lock it in.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRICING.map((p) => {
            const isLive = p.state === "live";
            // Color helpers — append hex alpha for translucent fills.
            // 1A = ~10%, 26 = ~15%, 40 = ~25%, 80 = ~50%
            const cardStyle = isLive
              ? {
                  borderColor: p.color,
                  borderWidth: "2px",
                  background: `linear-gradient(to bottom, ${p.color}1A, transparent)`,
                  boxShadow: `0 0 24px -8px ${p.color}80`,
                }
              : {
                  borderColor: `${p.color}40`,
                  borderWidth: "2px",
                  background: "rgba(255,255,255,0.02)",
                };
            const buttonStyle = isLive
              ? {
                  background: p.color,
                  color: "#0a0a1a",
                  border: `2px solid ${p.color}`,
                }
              : {
                  background: "transparent",
                  color: p.color,
                  border: `2px solid ${p.color}`,
                };
            const badgeStyle = isLive
              ? { background: p.color, color: "#0a0a1a", border: "none" }
              : { background: `${p.color}26`, color: p.color, border: `1px solid ${p.color}66` };
            return (
              <div
                key={p.tier}
                className="reveal rounded-2xl p-8 flex flex-col relative transition-all"
                style={cardStyle}
              >
                {p.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap"
                    style={badgeStyle}
                  >
                    {p.badge}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white mb-1">{p.tier}</h3>
                {p.track && (
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-1"
                    style={{ color: p.color }}
                  >
                    {p.track}
                  </p>
                )}
                <p className="text-xs text-white/85 mb-4">{p.per}</p>
                <div className="mb-6">
                  {p.originalPrice && (
                    <span className="text-4xl font-bold text-white/60 line-through mr-3 font-['Playfair_Display',serif]">
                      {p.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-white font-['Playfair_Display',serif]">
                    {p.price}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 8l3 3 5-5"
                          stroke={p.color}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm text-white/85">{f}</span>
                    </li>
                  ))}
                </ul>
                {p.note && (
                  <p
                    className="text-xs text-center mb-3 font-medium"
                    style={{ color: isLive ? p.color : "rgba(255,255,255,0.75)" }}
                  >
                    {p.note}
                  </p>
                )}
                {p.cta && (
                  <a
                    href={p.href || "#contact"}
                    className="text-center font-semibold py-3 px-6 rounded-lg transition-all"
                    style={buttonStyle}
                  >
                    {p.cta}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  return (
    <section id="roadmap" className="section-dark py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-base md:text-lg font-semibold tracking-[4px] uppercase text-[#0D7377] mb-4">Certification Roadmap</p>
          <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-white mb-6">
            Four Courses. One <span className="text-[#4CAF50]">Complete Credential</span>.
          </h2>
          <p className="text-lg text-white/85 max-w-3xl mx-auto">
            Build. Govern. Operate. Engineer. The AI Aware Certified&#8482; program covers identity security,
            compliance governance, daily security operations, and hands-on engineering — the most comprehensive
            AI governance certification program in the market.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Course 1 - Class Starts May 14 */}
          <div className="reveal rounded-2xl border-2 border-[#2DD4BF] bg-gradient-to-b from-[rgba(45,212,191,0.10)] to-transparent p-8 relative shadow-[0_0_24px_-8px_rgba(45,212,191,0.5)]">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/40">
              <span className="text-[10px] text-[#2DD4BF] tracking-widest uppercase font-bold">Class Starts May 14</span>
            </div>
            <div className="text-4xl font-bold text-[#2DD4BF]/30 font-['Playfair_Display',serif] mb-4">01</div>
            <p className="text-xs text-[#2DD4BF] tracking-wider uppercase font-medium mb-2">Build</p>
            <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-white mb-3 leading-tight">IAM for the Agentic AI Era</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Deep and narrow: identity & access management for autonomous AI agents, non-human identities, and Zero Trust.
            </p>
            <p className="text-xs text-white">8 modules | 8 labs | Exam | IAM badge</p>
          </div>

          {/* Course 2 - Coming Soon */}
          <div className="reveal rounded-2xl border-2 border-[#4CAF50] bg-gradient-to-b from-[rgba(76,175,80,0.06)] to-transparent p-8 relative shadow-[0_0_24px_-8px_rgba(76,175,80,0.5)]">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#4CAF50]/15 border border-[#4CAF50]/25">
              <span className="text-[10px] text-[#4CAF50] tracking-widest uppercase font-medium">Coming Soon</span>
            </div>
            <div className="text-4xl font-bold text-[#4CAF50]/20 font-['Playfair_Display',serif] mb-4">02</div>
            <p className="text-xs text-[#4CAF50] tracking-wider uppercase font-medium mb-2">Govern</p>
            <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-white mb-3 leading-tight">AI Compliance & Governance Frameworks</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Broad and comprehensive: EU AI Act, ISO 42001, NIST AI RMF, bias, model risk, and enterprise-wide AI governance.
            </p>
          </div>

          {/* Course 3 - Coming Soon */}
          <div className="reveal rounded-2xl border-2 border-[#64C8FF] bg-gradient-to-b from-[rgba(100,200,255,0.06)] to-transparent p-8 relative overflow-hidden shadow-[0_0_24px_-8px_rgba(100,200,255,0.5)]">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full border border-[#64C8FF]/30 bg-[#64C8FF]/10">
              <span className="text-[10px] text-[#64C8FF] tracking-widest uppercase font-medium">Coming Soon</span>
            </div>
            <div className="text-4xl font-bold text-[#64C8FF]/20 font-['Playfair_Display',serif] mb-4">03</div>
            <p className="text-xs text-[#64C8FF] tracking-wider uppercase font-medium mb-2">Operate</p>
            <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-white mb-3 leading-tight">Operating & Securing AI in Production</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Day-to-day operations: shadow AI control, user education, agent security, supply chain, monitoring, and incident response.
            </p>
          </div>

          {/* Course 4 - Coming Soon */}
          <div className="reveal rounded-2xl border-2 border-[#F59E0B] bg-gradient-to-b from-[rgba(245,158,11,0.06)] to-transparent p-8 relative shadow-[0_0_24px_-8px_rgba(245,158,11,0.5)]">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/25">
              <span className="text-[10px] text-[#F59E0B] tracking-widest uppercase font-medium">Coming Soon</span>
            </div>
            <div className="text-4xl font-bold text-[#F59E0B]/20 font-['Playfair_Display',serif] mb-4">04</div>
            <p className="text-xs text-[#F59E0B] tracking-wider uppercase font-medium mb-2">Engineer</p>
            <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-white mb-3 leading-tight">AI Governance for Engineers</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Compliance by construction: policy-as-code, NHI enforcement boundaries, governance agents, and building systems that are compliant by design.
            </p>
          </div>
        </div>

        {/* Certification path callout */}
        <div className="mt-12 text-center reveal">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0D7377]" />
              <span className="text-xs text-white/80">Build</span>
            </div>
            <svg className="w-4 h-4 text-white/15" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
              <span className="text-xs text-white/80">Govern</span>
            </div>
            <svg className="w-4 h-4 text-white/15" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#64C8FF]" />
              <span className="text-xs text-white/80">Operate</span>
            </div>
            <svg className="w-4 h-4 text-white/15" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="text-xs text-white/80">Engineer</span>
            </div>
            <svg className="w-4 h-4 text-white/15" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold text-[#0D7377]">AI Aware Certified&#8482;</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contact" className="cta-section py-24 px-6">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="reveal">
          <p className="text-sm font-medium tracking-[4px] uppercase text-[#4CAF50] mb-4">Get Started</p>
          <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-white mb-6">
            Secure the Future of <span className="text-[#0D7377]">AI</span>
          </h2>
          <p className="text-lg text-white/85 mb-10 max-w-xl mx-auto">
            Course 1 (IAM for the Agentic AI Era) class starts May 14. Early sign-up opens May 4 — $797 Early Release Rate through June 15.
            Courses 2, 3, and 4 launching soon after Course 1. Get notified when courses are released and you can register.
          </p>

          {/* Course 1 - Notify Me at Launch button */}
          <div className="mb-10">
            <a
              href={buildMailto(
                "Course 1 Launch Notification Request \u2014 IAM for the Agentic AI Era",
                "Hi,\n\nPlease notify me when Course 1: IAM for the Agentic AI Era launches.\n\nName: \nCompany / Role: \nNotes (optional): \n\nThanks!"
              )}
              className="btn-primary inline-block !px-8 !py-4 !text-base"
            >
              Notify Me at Launch
            </a>
          </div>

          {/* Contact Us card */}
          <div id="contact" className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <p className="text-base text-white/85 leading-relaxed mb-6">
              Have questions about the curriculum, certification path, or enterprise options?
              We&rsquo;d love to hear from you.
            </p>
            <a
              href={buildMailto(
                "AI Aware Certified \u2014 General Inquiry",
                "Hi,\n\nI have a question about AI Aware Certified.\n\nName: \nCompany / Role: \nMy question: \n\nThanks!"
              )}
              className="btn-outline inline-block !px-6 !py-3"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <a href="#" className="flex items-center gap-3">
            <img src="/logo.png" alt="AI Aware Certified" className="h-8" style={{ mixBlendMode: 'lighten' }} />
          </a>
          <div className="flex items-center gap-6 text-sm text-white/75">
            <a href="#courses" className="hover:text-white/60 transition-colors">Courses</a>
            <a href="#curriculum" className="hover:text-white/60 transition-colors">Curriculum</a>
            <a href="#pricing" className="hover:text-white/60 transition-colors">Pricing</a>
            <a href="#roadmap" className="hover:text-white/60 transition-colors">Roadmap</a>
            <a href="#contact" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:items-start items-center gap-1">
            <p className="text-xs text-white/20">&copy; 2026 AI Aware Certified&#8482;. All rights reserved.</p>
            <p className="text-xs text-white/30">AI Aware LLC &mdash; a Wyoming Limited Liability Company &bull; <a href="mailto:aiaware@aiawarecertified.com" className="hover:text-white/60 transition-colors">aiaware@aiawarecertified.com</a></p>
          </div>
          <p className="text-xs text-white/15">Identity &bull; Governance &bull; Operations &bull; EU AI Act &bull; ISO 42001 &bull; NIST AI RMF &bull; MLSecOps</p>
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN COMPONENT =====
export default function LandingPage() {
  const mainRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = mainRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={mainRef} className="bg-[#0a1a1a]">
      <NavBar />
      <HeroSection />
      <WhyNowSection />
      <CoursesOverviewSection />
      <CurriculumSection />
      <CoursePhilosophySection />
      <AudienceSection />
      <PricingSection />
      <RoadmapSection />
      <CTASection />
      <Footer />
    </div>
  );
}
