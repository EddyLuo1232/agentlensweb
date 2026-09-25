"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw, Search } from "lucide-react";

const phases = [
  { label: "Select layer", title: "Find the hidden state" },
  { label: "Select top 10", title: "Keep the top 10" },
  { label: "Shift state", title: "Shift the state" },
];

const authors = [
  { name: "Weidi Luo", affiliation: 1 },
  { name: "Qiming Zhang", affiliation: 2 },
  { name: "Yihao Quan", affiliation: 3 },
  { name: "Mingyu Jin", affiliation: 3 },
  { name: "Jie Cai", affiliation: 4 },
  { name: "Chaowei Xiao", affiliation: 5 },
  { name: "Jingcheng Niu", affiliation: 6 },
  { name: "Zhen Xiang", affiliation: 1 },
];

const affiliations = [
  "University of Georgia",
  "University of South Florida",
  "Rutgers University",
  "University of Southern California",
  "Johns Hopkins University",
  "Independent",
];

const weights = [95, 88, 84, 77, 73, 69, 64, 60, 55, 51, 45, 41, 37, 34, 31, 28, 25, 22, 20, 18, 16, 14, 12, 10];
const visibleLayers = [15, 14, 13, 12, 11, 10];
const hiddenVector = [0.9, 0.4, 0.7, 0.3, 0.8, 0.5, 1, 0.35, 0.6, 0.75, 0.45, 0.85, 0.3, 0.65, 0.95, 0.5, 0.7, 0.4, 0.8, 0.55];
const DURATION = 5000;

function LayerVisual() {
  return (
    <div className="transformer-visual" role="img" aria-label="Token hidden states flow upward through transformer blocks. The probe selects the hidden state at layer 12.">
      <div className="transformer-stack">
        <div className="stack-caption">TRANSFORMER</div>
        <div className="stack-blocks">
          <span className="stack-rail" aria-hidden="true" />
          {visibleLayers.map((layer) => (
            <div className={"stack-row " + (layer === 12 ? "chosen" : "")} key={layer}>
              <span className="stack-index">L{layer}</span>
              <span className="transformer-block"><span>ATTN</span><span>MLP</span></span>
              <span className="stack-node" />
            </div>
          ))}
          <span className="stack-signal" aria-hidden="true" />
        </div>
        <div className="stack-input">↑ <span>TOKENS</span></div>
      </div>
      <div className="hidden-output">
        <span className="output-connector" aria-hidden="true" />
        <span className="output-label">HIDDEN STATE</span>
        <strong>h₁₂</strong>
        <div className="hidden-vector" aria-hidden="true">{hiddenVector.map((opacity, index) => <i key={index} style={{ opacity }} />)}</div>
      </div>
    </div>
  );
}

function TopTenVisual() {
  return (
    <div className="weight-visual" aria-label="Probe dimensions ranked by absolute class weight difference; the top ten are selected">
      <div className="visual-axis"><span>|W₁ − W₀|</span><span>DIMENSIONS</span></div>
      <div className="weight-chart">
        {weights.map((height, index) => (
          <span className={"weight-bar " + (index < 10 ? "chosen" : "")} key={index} style={{ height: height + "%", animationDelay: index * 38 + "ms" }}><i /></span>
        ))}
      </div>
      <div className="weight-bracket"><span>TOP 10 DIMENSIONS</span><span>OTHER DIMENSIONS</span></div>
    </div>
  );
}

function ShiftVisual() {
  return (
    <div className="shift-visual" aria-label="A schematic hidden-state point moves along a sparse steering vector from a risky region toward a safer region">
      <div className="visual-axis"><span>HIDDEN STATE</span><span>h′ = h + αv</span></div>
      <svg className="state-plane" viewBox="0 0 640 272" role="img" aria-label="The hidden state shifts from the risky side toward the safe side">
        <defs>
          <marker id="shift-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#39815a" strokeWidth="1.5" /></marker>
        </defs>
        <line x1="55" y1="214" x2="591" y2="214" className="plane-axis" />
        <line x1="55" y1="214" x2="55" y2="25" className="plane-axis" />
        <rect x="365" y="33" width="207" height="163" rx="82" className="safe-region" />
        <text x="103" y="52" className="plane-label risky-label">RISKY</text>
        <text x="424" y="52" className="plane-label safe-label">SAFER</text>
        <path d="M170 143 C240 143 335 121 452 115" className="shift-path" markerEnd="url(#shift-arrow)" />
        <circle cx="170" cy="143" r="13" className="origin-ring" />
        <circle cx="170" cy="143" r="7" className="origin-dot" />
        <circle cx="170" cy="143" r="12" className="moving-dot" />
        <text x="148" y="185" className="point-label">h</text>
        <text x="447" y="91" className="point-label">h′</text>
      </svg>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setPhase((current) => (current + 1) % phases.length);
      setCycle((current) => current + 1);
    }, DURATION);
    return () => window.clearTimeout(timer);
  }, [phase, playing, cycle]);

  const selectPhase = (index: number) => {
    setPhase(index);
    setCycle((current) => current + 1);
    setPlaying(false);
  };

  const replay = () => {
    setPhase(0);
    setCycle((current) => current + 1);
    setPlaying(true);
  };

  return (
    <main id="top">
      <section className="hero wrap" aria-labelledby="hero-title">
        <p className="hero-venue">NeurIPS 2026</p>
        <h1 id="hero-title"><span className="hero-name"><Search className="hero-icon" aria-hidden="true" strokeWidth={1.8} /><span>AgentLens:</span></span>{" "}<span className="hero-paper-title">Interpretable Safety Steering via Mechanistic Subspaces for Multi-Turn Coding Agent</span></h1>
        <ul className="hero-authors" aria-label="Authors">
          {authors.map((author) => <li key={author.name}>{author.name}<sup>{author.affiliation}</sup></li>)}
        </ul>
        <ol className="hero-affiliations" aria-label="Affiliations">
          {affiliations.map((affiliation, index) => <li key={affiliation}><sup>{index + 1}</sup>{affiliation}</li>)}
        </ol>
        <div className="hero-links">
          <a href="https://github.com/EddyLuo1232/AgentLens" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16} /></a>
          <a href="https://arxiv.org/pdf/2606.22673" target="_blank" rel="noreferrer">arXiv <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <section className="mechanism-section wrap" id="mechanism" aria-label="Mechanism">
        <div className="case-strip"><span>TASK</span><strong>Login initialization: EXIT hook deletes /home.</strong></div>

        <div className="motion-stage" data-phase={phase}>
          <div className="stage-top"><span>0{phase + 1} / 03</span></div>
          <div className="stage-title" key={"title-" + phase}><h3>{phases[phase].title}</h3></div>
          <div className="stage-visual" key={"visual-" + phase}>
            {phase === 0 && <LayerVisual />}
            {phase === 1 && <TopTenVisual />}
            {phase === 2 && <ShiftVisual />}
          </div>
          <div className="stage-outcome" aria-label="Actions before and after steering">
            <div className="action-card action-before"><span>BEFORE · ACTION</span><strong>Write script; run deletion on EXIT.</strong></div>
            <span className="outcome-arrow" aria-hidden="true">→</span>
            <div className="action-card action-after"><span>AFTER · ACTION</span><strong>Refuse deletion; offer a harmless test.</strong></div>
          </div>
        </div>

        <div className="player">
          <div className="player-steps" role="group" aria-label="Mechanism animation phases">
            {phases.map((item, index) => (
              <button className={"step " + (phase === index ? "active" : "")} key={item.label} type="button" onClick={() => selectPhase(index)} aria-current={phase === index ? "step" : undefined}>
                <span className="step-track"><span key={phase === index ? "progress-" + cycle : "idle-" + index} className={"step-progress " + (phase === index && playing ? "playing" : "")} /></span>
                <span className="step-text"><b>0{index + 1}</b>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="player-actions">
            <button type="button" className="player-button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause sequence" : "Play sequence"}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button>
            <button type="button" className="player-button" onClick={replay} aria-label="Replay animation"><RotateCcw size={17} /></button>
          </div>
        </div>
      </section>

      <footer className="footer wrap"><span>© 2026 AgentLens</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
