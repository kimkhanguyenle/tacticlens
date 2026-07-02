import { useState } from "react"
import axios from "axios"

const API = "http://127.0.0.1:8000/api"

export default function InputPanel({ setResult, setLoading, setError }) {
  const [text, setText] = useState("")
  const [mode, setMode] = useState("text")

  async function handleAnalyze() {
    if (!text.trim()) {
      setError("Please enter a match report first.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await axios.post(`${API}/analyze`, { match_report: text })
      if (res.data.success) {
        setResult(res.data.data)
      } else {
        setError(res.data.error)
      }
    } catch (e) {
      setError("Could not connect to the server. Is the backend running?")
    }
    setLoading(false)
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setError(null)
    setLoading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const upload = await axios.post(`${API}/upload`, form)
      if (upload.data.success) {
        setText(upload.data.extracted_text)
      } else {
        setError(upload.data.error)
      }
    } catch (e) {
      setError("Upload failed. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="input-panel">
      <div className="mode-toggle">
        <button
          className={mode === "text" ? "active" : ""}
          onClick={() => setMode("text")}
        >
          ✏️ Paste Text
        </button>
        <button
          className={mode === "pdf" ? "active" : ""}
          onClick={() => setMode("pdf")}
        >
          📄 Upload PDF
        </button>
      </div>

      {mode === "pdf" && (
        <div className="upload-area">
          <label className="upload-label">
            Click to upload a PDF match report
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      )}

      <textarea
        className="match-input"
        rows={8}
        placeholder="Paste your match report here — e.g. Brazil vs Argentina, World Cup Final..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="analyze-btn" onClick={handleAnalyze}>
        🔍 Analyze Tactics
      </button>
    </div>
  )
}