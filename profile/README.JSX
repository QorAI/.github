import { useState } from "react";

const COLORS = {
  bg: "#0a0e1a",
  surface: "#111827",
  surfaceLight: "#1a2235",
  border: "#2a3450",
  text: "#e2e8f0",
  textMuted: "#8892a8",
  fast: "#f59e0b",
  fastGlow: "rgba(245,158,11,0.15)",
  medium: "#3b82f6",
  mediumGlow: "rgba(59,130,246,0.15)",
  slow: "#8b5cf6",
  slowGlow: "rgba(139,92,246,0.15)",
  accent: "#10b981",
  accentGlow: "rgba(16,185,129,0.15)",
  danger: "#ef4444",
  dangerGlow: "rgba(239,68,68,0.12)",
  white: "#ffffff",
};

const Arrow = ({ x1, y1, x2, y2, color = COLORS.textMuted, dashed = false, label = "", animate = false }) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 8;
  const ax = x2 - headLen * Math.cos(angle - Math.PI / 6);
  const ay = y2 - headLen * Math.sin(angle - Math.PI / 6);
  const bx = x2 - headLen * Math.cos(angle + Math.PI / 6);
  const by = y2 - headLen * Math.sin(angle + Math.PI / 6);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? "6,4" : "none"}
        opacity={0.7}
      />
      {animate && (
        <circle r={3} fill={color}>
          <animateMotion dur="2s" repeatCount="indefinite" path={`M${x1},${y1} L${x2},${y2}`} />
        </circle>
      )}
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} opacity={0.7} />
      {label && (
        <text x={mx} y={my - 8} fill={COLORS.textMuted} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">
          {label}
        </text>
      )}
    </g>
  );
};

const Box = ({ x, y, w, h, label, sublabel, color, glowColor, icon, active = false, onClick }) => (
  <g onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
    <rect x={x} y={y} width={w} height={h} rx={8} fill={active ? glowColor : COLORS.surface}
      stroke={active ? color : COLORS.border} strokeWidth={active ? 2 : 1} />
    {active && <rect x={x} y={y} width={w} height={h} rx={8} fill="none"
      stroke={color} strokeWidth={1} opacity={0.3} filter="url(#glow)" />}
    <text x={x + w / 2} y={y + (sublabel ? h / 2 - 4 : h / 2 + 1)} fill={active ? color : COLORS.text}
      fontSize={12} fontWeight="600" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">
      {icon ? `${icon} ${label}` : label}
    </text>
    {sublabel && (
      <text x={x + w / 2} y={y + h / 2 + 12} fill={COLORS.textMuted}
        fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">
        {sublabel}
      </text>
    )}
  </g>
);

const FreqBar = ({ x, y, w, freq, color, label }) => {
  const blocks = 12;
  const active = Math.round(blocks * freq);
  return (
    <g>
      <text x={x} y={y - 4} fill={COLORS.textMuted} fontSize={8} fontFamily="'JetBrains Mono', monospace">{label}</text>
      {Array.from({ length: blocks }).map((_, i) => (
        <rect key={i} x={x + i * (w / blocks + 1)} y={y} width={w / blocks - 1} height={6} rx={1}
          fill={i < active ? color : COLORS.border} opacity={i < active ? 0.8 : 0.3} />
      ))}
    </g>
  );
};

const VIEWS = {
  overview: {
    title: "HOPE Architecture Overview",
    desc: "The full pipeline: Input tokens flow through Self-Modifying Titans (or Attention), then through the Continuum Memory System with 3 frequency levels. Each HOPE Block repeats this pattern.",
  },
  cms: {
    title: "Continuum Memory System (CMS)",
    desc: "Unlike standard Transformers with just one FFN, CMS uses multiple MLP layers that update at different speeds. Fast layers capture immediate context, slow layers store long-term knowledge. This is what prevents catastrophic forgetting.",
  },
  selfmod: {
    title: "Self-Modifying Titans",
    desc: "The model modifies its own weights during the forward pass. It measures how 'surprising' each token is (teach signal). High surprise → update fast weights. Low surprise → skip. This is like neuroplasticity in the brain.",
  },
  optimizer: {
    title: "Deep Momentum GD (DMGD)",
    desc: "Standard optimizers (Adam, SGD) use simple running averages. DMGD replaces momentum with a neural network that learns to compress gradient history — acting as associative memory that maps data to its error signal.",
  },
  training: {
    title: "Training Pipeline",
    desc: "Phase 1: Pre-train with standard objectives. Phase 2: Enable self-modification and CMS multi-frequency updates. Phase 3: Evaluate continual learning — train on new data and check if old knowledge is preserved.",
  },
};

export default function NestedLearningDiagram() {
  const [activeView, setActiveView] = useState("overview");
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const view = VIEWS[activeView];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: COLORS.text, padding: "24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .nav-btn { transition: all 0.2s; border: 1px solid ${COLORS.border}; }
        .nav-btn:hover { border-color: ${COLORS.accent}; background: ${COLORS.accentGlow} !important; }
        .nav-btn.active { border-color: ${COLORS.accent} !important; background: ${COLORS.accentGlow} !important; }
        .info-card { animation: slideIn 0.3s ease; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
            <span style={{ color: COLORS.accent }}>⬡</span> Nested Learning — How HOPE Works
          </h1>
          <p style={{ color: COLORS.textMuted, margin: "6px 0 0", fontSize: 13 }}>
            Interactive architecture diagram · Behrouz et al., NeurIPS 2025
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {Object.entries(VIEWS).map(([key, v]) => (
            <button key={key} className={`nav-btn ${activeView === key ? "active" : ""}`}
              onClick={() => setActiveView(key)}
              style={{
                background: activeView === key ? COLORS.accentGlow : COLORS.surface,
                color: activeView === key ? COLORS.accent : COLORS.textMuted,
                padding: "8px 16px", borderRadius: 6, cursor: "pointer",
                fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
              }}>
              {key === "overview" ? "⬡ Overview" : key === "cms" ? "◈ CMS" : key === "selfmod" ? "⟐ Self-Mod" : key === "optimizer" ? "∇ DMGD" : "▶ Training"}
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="info-card" key={activeView} style={{
          background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "16px 20px", marginBottom: 20,
        }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 16, margin: "0 0 6px", color: COLORS.accent }}>{view.title}</h2>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{view.desc}</p>
        </div>

        {/* Main Diagram */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, overflow: "auto" }}>
          <svg viewBox="0 0 900 520" width="100%" style={{ display: "block" }}>
            <defs>
              <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {activeView === "overview" && (
              <g>
                {/* Input */}
                <Box x={20} y={220} w={120} h={50} label="Input Tokens" sublabel='"The cat sat"' color={COLORS.text} glowColor={COLORS.surfaceLight} />
                <Arrow x1={140} y1={245} x2={180} y2={245} color={COLORS.textMuted} animate />

                {/* Embedding */}
                <Box x={180} y={220} w={100} h={50} label="Embedding" sublabel="+ Position" color={COLORS.text} glowColor={COLORS.surfaceLight} />
                <Arrow x1={280} y1={245} x2={320} y2={245} color={COLORS.textMuted} animate />

                {/* HOPE Block */}
                <rect x={320} y={60} width={380} height={380} rx={12} fill="none" stroke={COLORS.accent} strokeWidth={1.5} strokeDasharray="8,4" opacity={0.4} />
                <text x={510} y={85} fill={COLORS.accent} fontSize={13} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">
                  HOPE Block (×N layers)
                </text>

                {/* Self-Modifying Titans */}
                <Box x={350} y={110} w={320} h={60} label="Self-Modifying Titans" sublabel="Learns its own update rules (Eqs 83-93)"
                  color={COLORS.fast} glowColor={COLORS.fastGlow} active
                  onClick={() => setActiveView("selfmod")} />
                <Arrow x1={510} y1={170} x2={510} y2={200} color={COLORS.fast} animate />

                {/* CMS */}
                <rect x={350} y={200} width={320} height={200} rx={8} fill={COLORS.surfaceLight} stroke={COLORS.border} />
                <text x={510} y={222} fill={COLORS.text} fontSize={11} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">
                  Continuum Memory System
                </text>

                <Box x={370} y={235} w={280} h={40} label="⚡ Fast MLP" sublabel="Update every ~16 tokens"
                  color={COLORS.fast} glowColor={COLORS.fastGlow} active />
                <Arrow x1={510} y1={275} x2={510} y2={290} color={COLORS.medium} />
                <Box x={370} y={290} w={280} h={40} label="◆ Medium MLP" sublabel="Update every ~64 tokens"
                  color={COLORS.medium} glowColor={COLORS.mediumGlow} active />
                <Arrow x1={510} y1={330} x2={510} y2={345} color={COLORS.slow} />
                <Box x={370} y={345} w={280} h={40} label="🔮 Slow MLP" sublabel="Update every ~256 tokens"
                  color={COLORS.slow} glowColor={COLORS.slowGlow} active />

                {/* Frequency indicators */}
                <FreqBar x={370} y={410} w={90} freq={1.0} color={COLORS.fast} label="Fast freq" />
                <FreqBar x={475} y={410} w={90} freq={0.4} color={COLORS.medium} label="Med freq" />
                <FreqBar x={580} y={410} w={90} freq={0.1} color={COLORS.slow} label="Slow freq" />

                {/* Output */}
                <Arrow x1={700} y1={245} x2={740} y2={245} color={COLORS.textMuted} animate />
                <Box x={740} y={220} w={140} h={50} label="Output Logits" sublabel="Next token pred" color={COLORS.accent} glowColor={COLORS.accentGlow} active />

                {/* Residual connection */}
                <path d="M 340 245 L 340 460 L 720 460 L 720 245" fill="none" stroke={COLORS.textMuted} strokeWidth={1} strokeDasharray="4,4" opacity={0.4} />
                <text x={530} y={475} fill={COLORS.textMuted} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">residual connection</text>

                {/* Legend */}
                <g transform="translate(20, 460)">
                  <text fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'" y={0}>Click components to explore →</text>
                </g>
              </g>
            )}

            {activeView === "cms" && (
              <g>
                <text x={450} y={30} fill={COLORS.text} fontSize={16} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">
                  Continuum Memory System (CMS)
                </text>
                <text x={450} y={50} fill={COLORS.textMuted} fontSize={11} textAnchor="middle" fontFamily="'JetBrains Mono'">
                  Multi-frequency MLP layers — the key to avoiding catastrophic forgetting
                </text>

                {/* Traditional vs CMS comparison */}
                {/* Traditional */}
                <rect x={30} y={75} width={250} height={200} rx={10} fill={COLORS.dangerGlow} stroke={COLORS.danger} strokeWidth={1} strokeDasharray="6,3" />
                <text x={155} y={100} fill={COLORS.danger} fontSize={13} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">❌ Traditional Transformer</text>
                <Box x={55} y={115} w={200} h={40} label="Attention" sublabel="Short-term memory" color={COLORS.textMuted} glowColor={COLORS.surfaceLight} />
                <Arrow x1={155} y1={155} x2={155} y2={175} color={COLORS.textMuted} />
                <Box x={55} y={175} w={200} h={40} label="Single FFN" sublabel="Long-term (frozen after training)" color={COLORS.danger} glowColor={COLORS.dangerGlow} active />
                <text x={155} y={240} fill={COLORS.textMuted} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">Only 2 memory levels</text>
                <text x={155} y={255} fill={COLORS.danger} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">→ Learns new = forgets old</text>

                {/* HOPE CMS */}
                <rect x={320} y={75} width={560} height={430} rx={10} fill={COLORS.accentGlow} stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={600} y={100} fill={COLORS.accent} fontSize={13} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">✅ HOPE Continuum Memory System</text>

                {/* Input */}
                <Box x={345} y={120} w={120} h={36} label="Input x" color={COLORS.text} glowColor={COLORS.surfaceLight} />
                <Arrow x1={465} y1={138} x2={510} y2={138} color={COLORS.textMuted} animate />

                {/* Fast */}
                <rect x={510} y={115} width={350} height={70} rx={8} fill={COLORS.fastGlow} stroke={COLORS.fast} strokeWidth={1.5} />
                <text x={530} y={136} fill={COLORS.fast} fontSize={12} fontWeight="700" fontFamily="'Space Grotesk'">⚡ Level 0 — Fast Memory</text>
                <text x={530} y={153} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">Update freq: every step | MLP with residual</text>
                <text x={530} y={168} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">Stores: immediate context, current sentence</text>
                <FreqBar x={750} y={133} w={90} freq={1.0} color={COLORS.fast} label="" />

                <Arrow x1={685} y1={185} x2={685} y2={205} color={COLORS.fast} animate label="output + residual" />

                {/* Medium */}
                <rect x={510} y={205} width={350} height={70} rx={8} fill={COLORS.mediumGlow} stroke={COLORS.medium} strokeWidth={1.5} />
                <text x={530} y={226} fill={COLORS.medium} fontSize={12} fontWeight="700" fontFamily="'Space Grotesk'">◆ Level 1 — Medium Memory</text>
                <text x={530} y={243} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">Update freq: every ~64 steps | Slower MLP</text>
                <text x={530} y={258} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">Stores: paragraph context, topic continuity</text>
                <FreqBar x={750} y={223} w={90} freq={0.35} color={COLORS.medium} label="" />

                <Arrow x1={685} y1={275} x2={685} y2={295} color={COLORS.medium} animate label="output + residual" />

                {/* Slow */}
                <rect x={510} y={295} width={350} height={70} rx={8} fill={COLORS.slowGlow} stroke={COLORS.slow} strokeWidth={1.5} />
                <text x={530} y={316} fill={COLORS.slow} fontSize={12} fontWeight="700" fontFamily="'Space Grotesk'">🔮 Level 2 — Slow Memory</text>
                <text x={530} y={333} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">Update freq: every ~256 steps | Deep MLP</text>
                <text x={530} y={348} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">Stores: grammar, facts, world knowledge</text>
                <FreqBar x={750} y={313} w={90} freq={0.08} color={COLORS.slow} label="" />

                {/* Brain comparison */}
                <rect x={345} y={300} width={140} height={120} rx={8} fill={COLORS.surfaceLight} stroke={COLORS.border} />
                <text x={415} y={320} fill={COLORS.text} fontSize={10} fontWeight="600" textAnchor="middle" fontFamily="'Space Grotesk'">🧠 Brain Analogy</text>
                <text x={415} y={340} fill={COLORS.fast} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">Fast → Working memory</text>
                <text x={415} y={358} fill={COLORS.medium} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">Med → Short-term mem</text>
                <text x={415} y={376} fill={COLORS.slow} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">Slow → Long-term mem</text>
                <text x={415} y={406} fill={COLORS.accent} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">= Neuroplasticity</text>

                {/* Output */}
                <Arrow x1={685} y1={365} x2={685} y2={395} color={COLORS.slow} animate />
                <Box x={610} y={395} w={150} h={36} label="Combined Output" color={COLORS.accent} glowColor={COLORS.accentGlow} active />

                {/* Key insight */}
                <rect x={345} y={440} width={515} height={50} rx={8} fill={COLORS.surface} stroke={COLORS.accent} strokeWidth={1} strokeDasharray="4,3" />
                <text x={600} y={462} fill={COLORS.accent} fontSize={10} fontWeight="600" textAnchor="middle" fontFamily="'Space Grotesk'">
                  KEY: New data updates fast layers → slow layers stay stable → no forgetting!
                </text>
                <text x={600} y={478} fill={COLORS.textMuted} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">
                  Each level is a nested optimization problem with its own context flow and update rate
                </text>
              </g>
            )}

            {activeView === "selfmod" && (
              <g>
                <text x={450} y={30} fill={COLORS.text} fontSize={16} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">
                  Self-Modifying Titans
                </text>
                <text x={450} y={50} fill={COLORS.textMuted} fontSize={11} textAnchor="middle" fontFamily="'JetBrains Mono'">
                  A model that rewrites its own weights during inference (Paper Eqs. 83-93)
                </text>

                {/* Token stream */}
                {["The", "cat", "sat", "on", "the", "quantum", "computer"].map((tok, i) => (
                  <g key={i}>
                    <rect x={60 + i * 110} y={80} width={90} height={32} rx={6}
                      fill={i === 5 ? COLORS.fastGlow : COLORS.surfaceLight}
                      stroke={i === 5 ? COLORS.fast : COLORS.border} strokeWidth={i === 5 ? 2 : 1} />
                    <text x={105 + i * 110} y={100} fill={i === 5 ? COLORS.fast : COLORS.text}
                      fontSize={11} fontWeight={i === 5 ? "700" : "400"} textAnchor="middle" fontFamily="'JetBrains Mono'">
                      {tok}
                    </text>
                    {i === 5 && <text x={105 + i * 110} y={78} fill={COLORS.fast} fontSize={8} textAnchor="middle" fontFamily="'JetBrains Mono'">⚠ SURPRISING!</text>}
                  </g>
                ))}

                {/* Process flow */}
                <Arrow x1={450} y1={112} x2={450} y2={145} color={COLORS.fast} animate />

                {/* Step 1: Compute surprise */}
                <rect x={100} y={145} width={700} height={70} rx={10} fill={COLORS.surfaceLight} stroke={COLORS.fast} strokeWidth={1} />
                <text x={140} y={168} fill={COLORS.fast} fontSize={12} fontWeight="700" fontFamily="'Space Grotesk'">Step 1: Compute Teach Signal (Surprise)</text>
                <text x={140} y={186} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  δℓ = prediction_error(token) — How "unexpected" was this token?
                </text>
                <text x={140} y={200} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  "quantum" after "sat on the" → HIGH surprise | "mat" → LOW surprise
                </text>

                <Arrow x1={450} y1={215} x2={450} y2={240} color={COLORS.fast} animate />

                {/* Step 2: Gate */}
                <rect x={200} y={240} width={500} height={55} rx={10} fill={COLORS.surfaceLight} stroke={COLORS.medium} strokeWidth={1} />
                <text x={240} y={263} fill={COLORS.medium} fontSize={12} fontWeight="700" fontFamily="'Space Grotesk'">Step 2: Surprise Gate</text>
                <text x={240} y={281} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  if ‖δℓ‖ {">"} threshold → UPDATE weights | else → SKIP (save compute)
                </text>

                {/* Branch */}
                <Arrow x1={350} y1={295} x2={250} y2={330} color={COLORS.accent} animate />
                <Arrow x1={550} y1={295} x2={650} y2={330} color={COLORS.danger} />

                {/* Update path */}
                <rect x={100} y={330} width={300} height={120} rx={10} fill={COLORS.accentGlow} stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={250} y={353} fill={COLORS.accent} fontSize={12} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">✅ HIGH Surprise → Update</text>
                <text x={130} y={375} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">W_fast += η · δℓ · x^T</text>
                <text x={130} y={395} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">• Fast weights learn new pattern</text>
                <text x={130} y={412} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">• α decay prevents overflow</text>
                <text x={130} y={429} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">• Momentum smooths updates</text>

                {/* Skip path */}
                <rect x={500} y={330} width={300} height={120} rx={10} fill={COLORS.dangerGlow} stroke={COLORS.danger} strokeWidth={1} strokeDasharray="6,3" />
                <text x={650} y={353} fill={COLORS.danger} fontSize={12} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">⏭ LOW Surprise → Skip</text>
                <text x={530} y={375} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">No weight update</text>
                <text x={530} y={395} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">• Already knew this pattern</text>
                <text x={530} y={412} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">• Saves computation</text>
                <text x={530} y={429} fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono'">• Preserves existing knowledge</text>

                {/* Key insight */}
                <rect x={100} y={470} width={700} height={40} rx={8} fill={COLORS.surface} stroke={COLORS.accent} strokeWidth={1} strokeDasharray="4,3" />
                <text x={450} y={494} fill={COLORS.accent} fontSize={10} fontWeight="600" textAnchor="middle" fontFamily="'Space Grotesk'">
                  KEY: The model literally rewrites its own weights as it reads — like a brain forming new memories in real-time
                </text>
              </g>
            )}

            {activeView === "optimizer" && (
              <g>
                <text x={450} y={30} fill={COLORS.text} fontSize={16} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">
                  Deep Momentum Gradient Descent (DMGD)
                </text>
                <text x={450} y={50} fill={COLORS.textMuted} fontSize={11} textAnchor="middle" fontFamily="'JetBrains Mono'">
                  Replacing hand-crafted optimizer rules with learned neural networks (Paper Eqs. 21-23)
                </text>

                {/* Standard optimizer */}
                <rect x={30} y={80} width={380} height={220} rx={10} fill={COLORS.dangerGlow} stroke={COLORS.danger} strokeWidth={1} strokeDasharray="6,3" />
                <text x={220} y={105} fill={COLORS.danger} fontSize={13} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">❌ Standard Adam/SGD</text>

                <Box x={60} y={120} w={140} h={36} label="Gradient g_t" color={COLORS.textMuted} glowColor={COLORS.surfaceLight} />
                <Arrow x1={200} y1={138} x2={230} y2={138} color={COLORS.textMuted} />
                <Box x={230} y={120} w={150} h={36} label="m = β·m + g" sublabel="Simple average" color={COLORS.danger} glowColor={COLORS.dangerGlow} active />
                <Arrow x1={305} y1={156} x2={305} y2={176} color={COLORS.textMuted} />
                <Box x={230} y={176} w={150} h={36} label="W -= lr · m" sublabel="Update weights" color={COLORS.textMuted} glowColor={COLORS.surfaceLight} />

                <text x={220} y={240} fill={COLORS.textMuted} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">• Dot-product similarity only</text>
                <text x={220} y={255} fill={COLORS.textMuted} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">• Can't relate different samples</text>
                <text x={220} y={270} fill={COLORS.danger} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">• Prone to forgetting</text>

                {/* DMGD */}
                <rect x={450} y={80} width={430} height={220} rx={10} fill={COLORS.accentGlow} stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={665} y={105} fill={COLORS.accent} fontSize={13} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">✅ DMGD (Nested Learning)</text>

                <Box x={480} y={120} w={120} h={36} label="Gradient g_t" color={COLORS.textMuted} glowColor={COLORS.surfaceLight} />
                <Arrow x1={600} y1={138} x2={630} y2={138} color={COLORS.accent} animate />

                <rect x={630} y={115} width={220} height={50} rx={8} fill={COLORS.fastGlow} stroke={COLORS.fast} strokeWidth={1.5} />
                <text x={740} y={137} fill={COLORS.fast} fontSize={11} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">Neural Memory Module</text>
                <text x={740} y={153} fill={COLORS.textMuted} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">MLP that LEARNS momentum</text>

                <Arrow x1={740} y1={165} x2={740} y2={185} color={COLORS.accent} animate />
                <Box x={630} y={185} w={220} h={36} label="m = Memory(g_t)" sublabel="L2 regression loss" color={COLORS.accent} glowColor={COLORS.accentGlow} active />
                <Arrow x1={740} y1={221} x2={740} y2={241} color={COLORS.accent} />
                <Box x={630} y={241} w={220} h={36} label="W -= lr · m" sublabel="Expressive update" color={COLORS.textMuted} glowColor={COLORS.surfaceLight} />

                {/* Comparison arrow */}
                <text x={450} y={340} fill={COLORS.textMuted} fontSize={10} fontWeight="600" textAnchor="middle" fontFamily="'Space Grotesk'" transform="rotate(-90, 430, 200)">vs</text>

                {/* The insight */}
                <rect x={30} y={330} width={850} height={100} rx={10} fill={COLORS.surfaceLight} stroke={COLORS.border} />
                <text x={450} y={355} fill={COLORS.text} fontSize={13} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">
                  🔑 The Key Insight
                </text>
                <text x={450} y={378} fill={COLORS.textMuted} fontSize={10} textAnchor="middle" fontFamily="'JetBrains Mono'">
                  Adam/SGD are actually associative memory modules — they just use a very simple (dot product) memory.
                </text>
                <text x={450} y={396} fill={COLORS.textMuted} fontSize={10} textAnchor="middle" fontFamily="'JetBrains Mono'">
                  DMGD replaces this with a neural network that maps: data → error (how surprising it was).
                </text>
                <text x={450} y={414} fill={COLORS.accent} fontSize={10} fontWeight="600" textAnchor="middle" fontFamily="'JetBrains Mono'">
                  Result: More resilient to imperfect/noisy data, better gradient compression, less forgetting.
                </text>

                {/* Nested levels */}
                <rect x={30} y={450} width={850} height={55} rx={8} fill={COLORS.surface} stroke={COLORS.accent} strokeWidth={1} strokeDasharray="4,3" />
                <text x={450} y={472} fill={COLORS.accent} fontSize={10} fontWeight="600" textAnchor="middle" fontFamily="'Space Grotesk'">
                  This is WHY it's called "Nested" Learning:
                </text>
                <text x={450} y={490} fill={COLORS.textMuted} fontSize={9} textAnchor="middle" fontFamily="'JetBrains Mono'">
                  Level 0: Attention (per token) → Level 1: Weights (per batch) → Level 2: Momentum/Memory (across batches) — each is its own optimization problem
                </text>
              </g>
            )}

            {activeView === "training" && (
              <g>
                <text x={450} y={30} fill={COLORS.text} fontSize={16} fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk'">
                  Training Pipeline — Step by Step
                </text>

                {/* Phase 1 */}
                <rect x={30} y={60} width={840} height={100} rx={10} fill={COLORS.surfaceLight} stroke={COLORS.medium} strokeWidth={1.5} />
                <rect x={30} y={60} width={6} height={100} rx={3} fill={COLORS.medium} />
                <text x={60} y={85} fill={COLORS.medium} fontSize={14} fontWeight="700" fontFamily="'Space Grotesk'">Phase 1: Pre-Training</text>
                <text x={60} y={105} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  Standard language modeling on large corpus (WikiText, RefinedWeb)
                </text>
                <text x={60} y={120} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  Config: pilot_smoke → pilot → mid → target (scale up gradually)
                </text>
                <text x={60} y={140} fill={COLORS.medium} fontSize={9} fontFamily="'JetBrains Mono'">
                  $ uv run python train.py --config-name pilot train.device=cuda:0
                </text>

                <Arrow x1={450} y1={160} x2={450} y2={185} color={COLORS.textMuted} />

                {/* Phase 2 */}
                <rect x={30} y={185} width={840} height={115} rx={10} fill={COLORS.surfaceLight} stroke={COLORS.fast} strokeWidth={1.5} />
                <rect x={30} y={185} width={6} height={115} rx={3} fill={COLORS.fast} />
                <text x={60} y={210} fill={COLORS.fast} fontSize={14} fontWeight="700" fontFamily="'Space Grotesk'">Phase 2: Paper-Faithful Training (Self-Modification)</text>
                <text x={60} y={230} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  Enable self-modifying Titans + CMS multi-frequency updates
                </text>
                <text x={60} y={248} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  batch_size=1 (strict per-context semantics — no cross-sample memory sharing)
                </text>
                <text x={60} y={266} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  Self-mod: l2 objective, retention gate (α), surprise-threshold gating
                </text>
                <text x={60} y={284} fill={COLORS.fast} fontSize={9} fontFamily="'JetBrains Mono'">
                  $ uv run python train.py --config-name pilot_selfmod_paper_faithful
                </text>

                <Arrow x1={450} y1={300} x2={450} y2={325} color={COLORS.textMuted} />

                {/* Phase 3 */}
                <rect x={30} y={325} width={840} height={100} rx={10} fill={COLORS.surfaceLight} stroke={COLORS.accent} strokeWidth={1.5} />
                <rect x={30} y={325} width={6} height={100} rx={3} fill={COLORS.accent} />
                <text x={60} y={350} fill={COLORS.accent} fontSize={14} fontWeight="700" fontFamily="'Space Grotesk'">Phase 3: Evaluate Continual Learning</text>
                <text x={60} y={370} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  Zero-shot benchmarks (PIQA, HellaSwag, ARC, BoolQ, WinoGrande)
                </text>
                <text x={60} y={388} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  Test-time memorization: --memorize --memorize-steps 2 --memorize-surprise-threshold 0.01
                </text>
                <text x={60} y={406} fill={COLORS.accent} fontSize={9} fontFamily="'JetBrains Mono'">
                  $ uv run python scripts/eval/continual.py --memorize --memorize-steps 2
                </text>

                <Arrow x1={450} y1={425} x2={450} y2={448} color={COLORS.textMuted} />

                {/* Phase 4 */}
                <rect x={30} y={448} width={840} height={60} rx={10} fill={COLORS.surfaceLight} stroke={COLORS.slow} strokeWidth={1.5} />
                <rect x={30} y={448} width={6} height={60} rx={3} fill={COLORS.slow} />
                <text x={60} y={473} fill={COLORS.slow} fontSize={14} fontWeight="700" fontFamily="'Space Grotesk'">Phase 4: Your Domain / Scale Up</text>
                <text x={60} y={493} fill={COLORS.textMuted} fontSize={10} fontFamily="'JetBrains Mono'">
                  Fine-tune on your data → FSDP multi-GPU → 1.3B target model → deploy
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
