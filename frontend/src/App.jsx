import { useState } from "react"
import axios from "axios"
import ResultPanel from "./components/ResultPanel"
import "./App.css"

const API = "http://127.0.0.1:8000/api"
const STEPS = [
  { label: "Parsing match report", icon: "ti-file-text" },
  { label: "Running AI analysis", icon: "ti-cpu" },
  { label: "Structuring output", icon: "ti-layout-grid" },
]

function App() {
  const [text, setText] = useState("")
  const [mode, setMode] = useState("text")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState(null)
  const [activeNav, setActiveNav] = useState("analyze")

  async function handleAnalyze() {
    if (!text.trim()) { setError("Paste a match report to analyze."); return }
    setError(null); setResult(null); setLoading(true); setStep(0)
    const t1 = setTimeout(() => setStep(1), 900)
    const t2 = setTimeout(() => setStep(2), 2200)
    try {
      const res = await axios.post(`${API}/analyze`, { match_report: text })
      clearTimeout(t1); clearTimeout(t2)
      if (res.data.success) setResult(res.data.data)
      else setError(res.data.error)
    } catch { setError("Cannot reach backend. Make sure the server is running.") }
    setLoading(false)
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setError(null); setLoading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await axios.post(`${API}/upload`, form)
      if (res.data.success) { setText(res.data.extracted_text); setMode("text") }
      else setError(res.data.error)
    } catch { setError("Upload failed. Try again.") }
    setLoading(false)
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><i className="ti ti-chart-dots" aria-hidden="true"></i></div>
          <div>
            <div className="logo-text">TacticLens</div>
            <div className="logo-sub">AI Match Analysis</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">Analysis</div>
          {[
            { id: "analyze", icon: "ti-zoom-scan", label: "Analyze Match" },
            { id: "history", icon: "ti-history", label: "History" },
            { id: "compare", icon: "ti-arrows-diff", label: "Compare Teams" },
          ].map(n => (
            <div key={n.id} className={`nav-item ${activeNav === n.id ? "active" : ""}`} onClick={() => setActiveNav(n.id)}>
              <i className={`ti ${n.icon}`} aria-hidden="true"></i>
              {n.label}
            </div>
          ))}
          <div className="nav-label">Tools</div>
          {[
            { id: "upload", icon: "ti-file-upload", label: "PDF Upload" },
            { id: "formations", icon: "ti-topology-star", label: "Formations" },
          ].map(n => (
            <div key={n.id} className={`nav-item ${activeNav === n.id ? "active" : ""}`} onClick={() => setActiveNav(n.id)}>
              <i className={`ti ${n.icon}`} aria-hidden="true"></i>
              {n.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="ibm-badge">
            <i className="ti ti-brand-ibm" aria-hidden="true"></i>
            <div className="ibm-badge-text">Powered by Docling<br/>IBM Challenge 2026</div>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title">Match Analyzer</div>
            <div className="topbar-sub">Paste a report — get full tactical breakdown</div>
          </div>
          <div className="topbar-right">
            <div className="status-dot"></div>
            <span className="status-text">AI Ready</span>
          </div>
        </div>

        <div className="content">
          <div className="stat-row">
            <div className="stat-card green">
              <div className="stat-label">Engine</div>
              <div className="stat-value">AI</div>
              <div className="stat-sub">Groq LLaMA 3</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-label">Parser</div>
              <div className="stat-value">PDF</div>
              <div className="stat-sub">IBM Docling</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-label">Avg. time</div>
              <div className="stat-value">~5s</div>
              <div className="stat-sub">Per analysis</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Outputs</div>
              <div className="stat-value">6</div>
              <div className="stat-sub">Insight sections</div>
            </div>
          </div>

          <div className="two-panel">
            <div>
              <div className="input-card">
                <div className="input-card-header">
                  <div className="input-card-title">
                    <i className="ti ti-pencil" aria-hidden="true"></i>
                    Match Report
                  </div>
                  <div className="mode-pills">
                    <button className={`mode-pill ${mode === "text" ? "active" : ""}`} onClick={() => setMode("text")}>Text</button>
                    <button className={`mode-pill ${mode === "pdf" ? "active" : ""}`} onClick={() => setMode("pdf")}>PDF</button>
                  </div>
                </div>
                <div className="input-card-body">
                  {mode === "pdf" && (
                    <label className="upload-zone">
                      <input type="file" accept=".pdf" onChange={handleUpload} style={{display:"none"}} />
                      <div className="upload-icon-wrap"><i className="ti ti-upload" aria-hidden="true"></i></div>
                      <div className="upload-title">Upload PDF match report</div>
                      <div className="upload-sub">Docling extracts text automatically</div>
                    </label>
                  )}
                  <div className="field-label">Report Content</div>
                  <textarea
                    className="match-ta"
                    rows={8}
                    placeholder="e.g. Manchester City vs Real Madrid, UCL Semi-Final. City lined up in a 4-3-3..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                </div>
                <div className="input-card-footer">
                  <span className="char-pill"><i className="ti ti-text-size" style={{fontSize:11,marginRight:4}} aria-hidden="true"></i>{text.length} chars</span>
                  <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
                    <i className="ti ti-cpu" aria-hidden="true"></i>
                    Analyze Tactics
                  </button>
                </div>
              </div>
            </div>

            <div>
              {error && (
                <div className="error-card">
                  <i className="ti ti-alert-circle" style={{fontSize:16,flexShrink:0}} aria-hidden="true"></i>
                  {error}
                </div>
              )}
              {loading && (
                <div className="loading-card">
                  <div className="spin-ring"></div>
                  <div className="loading-title">Analyzing match tactics...</div>
                  <div className="loading-sub">AI is processing your report</div>
                  <div className="step-list">
                    {STEPS.map((s, i) => (
                      <div key={i} className={`step-row ${i < step ? "done" : i === step ? "active" : ""}`}>
                        <i className={`ti ${i < step ? "ti-check" : s.icon}`} aria-hidden="true"></i>
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!loading && !result && !error && (
                <div className="empty-state">
                  <div className="empty-pitch">
                    <div className="pitch-line"></div>
                    <div className="pitch-circle"></div>
                  </div>
                  <div className="empty-title">No analysis yet</div>
                  <div className="empty-sub">Paste a match report on the left and click Analyze Tactics to get started.</div>
                </div>
              )}
              {result && !loading && <ResultPanel data={result} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App