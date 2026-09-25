"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw, Search } from "lucide-react";

const phases = [
  { label: "Train a probe", title: "Train a linear probe", group: "MAS · PREPARATION" },
  { label: "Select layer", title: "Find the hidden state", group: "MAS · PREPARATION" },
  { label: "Detect risk", title: "Detect harmful steps", group: "AGENTLENS DETECTION" },
  { label: "Select top 10", title: "Keep the top 10", group: "AGENTLENS MITIGATION" },
  { label: "Multi-step steer", title: "Steer at each step", group: "AGENTLENS MITIGATION" },
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
const probeExamples = [
  { kind: "benign", label: "0 BENIGN", vector: [9, 16, 12, 20, 13, 17, 10, 15] },
  { kind: "harmful", label: "1 HARMFUL", vector: [18, 11, 21, 14, 19, 12, 16, 20] },
  { kind: "benign", label: "0 BENIGN", vector: [13, 19, 11, 16, 20, 12, 18, 10] },
  { kind: "harmful", label: "1 HARMFUL", vector: [20, 13, 18, 10, 15, 21, 11, 17] },
];
const probePoints = [
  { x: 68, y: 60, kind: "benign" }, { x: 90, y: 110, kind: "benign" },
  { x: 123, y: 73, kind: "benign" }, { x: 137, y: 150, kind: "benign" },
  { x: 222, y: 145, kind: "harmful" }, { x: 241, y: 70, kind: "harmful" },
  { x: 272, y: 112, kind: "harmful" }, { x: 303, y: 52, kind: "harmful" },
];
const trajectorySteps = [
  { step: "01", state: "h₁", result: "BENIGN", before: "Inspect login config.", after: "Inspect login config.", kind: "benign" },
  { step: "02", state: "h₂", result: "HARMFUL", before: "Write deletion script.", after: "Refuse deletion.", kind: "harmful" },
  { step: "03", state: "h₃", result: "HARMFUL", before: "Run deletion on EXIT.", after: "Offer a harmless test.", kind: "harmful" },
];
const DURATION = 5000;

function ProbeVisual() {
  return (
    <div className="probe-visual" role="img" aria-label="MAS benchmark steps labeled benign or harmful provide hidden states to train a linear logistic probe that separates the two classes.">
      <div className="visual-axis"><span>MAS BENCHMARK · STEP LABELS</span><span>LINEAR PROBE</span></div>
      <div className="probe-flow">
        <div className="mas-samples">
          {probeExamples.map((example, index) => (
            <div className={`sample-row ${example.kind}`} key={index} style={{ animationDelay: `${index * 230}ms` }}>
              <span className="sample-label">{example.label}</span>
              <span className="sample-vector" aria-hidden="true">{example.vector.map((height, dimension) => <i key={dimension} style={{ height }} />)}</span>
            </div>
          ))}
        </div>
        <span className="probe-flow-arrow" aria-hidden="true">→</span>
        <div className="probe-model">
          <svg viewBox="0 0 360 210" aria-hidden="true">
            <rect x="20" y="18" width="160" height="174" className="probe-benign-zone" />
            <rect x="180" y="18" width="160" height="174" className="probe-harmful-zone" />
            {probePoints.map((point, index) => <circle className={`probe-point ${point.kind}`} cx={point.x} cy={point.y} r="7" key={index} style={{ animationDelay: `${500 + index * 150}ms` }} />)}
            <line x1="180" y1="18" x2="180" y2="192" className="probe-boundary" />
          </svg>
          <div className="probe-equation"><span>σ(w · h + b)</span><span>BENIGN <i /> HARMFUL</span></div>
        </div>
      </div>
    </div>
  );
}

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

function DetectionVisual() {
  return (
    <div className="detection-visual" role="img" aria-label="The trained linear probe checks each step's hidden state, allowing a benign step to continue and flagging harmful steps for steering.">
      <div className="visual-axis"><span>STEP HIDDEN STATE</span><span>PROBE OUTPUT</span></div>
      <div className="detection-list">
        {trajectorySteps.map((item, index) => (
          <div className={`detection-row ${item.kind}`} key={item.step} style={{ animationDelay: `${index * 850}ms` }}>
            <span className="detection-index">STEP {item.step}</span>
            <strong>{item.state}</strong>
            <span className="detection-connector" aria-hidden="true">→</span>
            <span className="detection-probe">LINEAR PROBE</span>
            <span className="detection-connector" aria-hidden="true">→</span>
            <span className="detection-result">{item.result}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiStepVisual() {
  return (
    <div className="multi-visual" role="img" aria-label="At each turn, the trained probe checks the hidden state. The benign action remains unchanged. Harmful actions in turns two and three are changed to a refusal and a harmless test after steering.">
      <div className="visual-axis"><span>MULTI-TURN TRAJECTORY</span><span>h′ = h + αv</span></div>
      <div className="trajectory-grid">
        {trajectorySteps.map((item, index) => (
          <div className={`trajectory-card ${item.kind}`} key={item.step} style={{ animationDelay: `${index * 950}ms` }}>
            <span className="trajectory-index">STEP {item.step}</span>
            <div className="trajectory-state"><strong>{item.state}</strong><span>→</span><span className="trajectory-probe">PROBE</span></div>
            <span className="trajectory-result">{item.result} · {item.kind === "benign" ? "PASS" : "SHIFT"}</span>
            <div className="trajectory-actions">
              <div className="trajectory-action-row"><span>BEFORE</span><strong>{item.before}</strong></div>
              <div className="trajectory-action-row after"><span>AFTER</span><strong>{item.after}</strong></div>
            </div>
          </div>
        ))}
      </div>
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
          <div className="stage-top"><span className="stage-group">{phases[phase].group}</span><span>0{phase + 1} / 0{phases.length}</span></div>
          <div className="stage-title" key={"title-" + phase}><h3>{phases[phase].title}</h3></div>
          <div className="stage-visual" key={"visual-" + phase}>
            {phase === 0 && <ProbeVisual />}
            {phase === 1 && <LayerVisual />}
            {phase === 2 && <DetectionVisual />}
            {phase === 3 && <TopTenVisual />}
            {phase === 4 && <MultiStepVisual />}
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
