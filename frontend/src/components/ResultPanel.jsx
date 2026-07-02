import { useState, useEffect } from "react"

async function fetchTeamLogo(teamName) {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
    )
    const data = await res.json()
    if (data.teams && data.teams[0]?.strBadge) {
      return data.teams[0].strBadge + "/preview"
    }
  } catch {}
  return null
}

function TeamLogo({ name, size = 56 }) {
  const [logo, setLogo] = useState(null)
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!name) return
    fetchTeamLogo(name).then(url => { if (url) setLogo(url) })
  }, [name])

  return (
    <div style={{
      width: size, height: size, borderRadius: 10,
      background: logo ? "transparent" : "var(--s4)",
      border: "1px solid var(--br2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", flexShrink: 0,
    }}>
      {logo
        ? <img src={logo} alt={name} style={{width: size - 10, height: size - 10, objectFit: "contain"}} />
        : <span style={{fontSize: 13, fontWeight: 800, color: "var(--t2)"}}>{initials}</span>
      }
    </div>
  )
}

export default function ResultPanel({ data }) {
  return (
    <div className="result-scroll">

      {/* ── MATCH HEADER ── */}
      <div className="match-header-card">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 1fr",
          alignItems: "center",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--br)",
          gap: "0.5rem",
        }}>

          {/* Team A — left aligned */}
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
            <TeamLogo name={data.team_a?.name} size={52} />
            <div style={{fontSize:"1rem", fontWeight:800, color:"var(--t1)", letterSpacing:"-0.02em", lineHeight:1.2}}>
              {data.team_a?.name}
            </div>
            <div style={{
              display:"inline-flex", alignItems:"center",
              background:"var(--g-dim)", border:"1px solid var(--g-border)",
              color:"var(--g)", fontSize:11, fontWeight:700,
              padding:"2px 10px", borderRadius:99, letterSpacing:"0.06em",
              width:"fit-content"
            }}>
              {data.team_a?.formation}
            </div>
            <div style={{fontSize:11, color:"var(--t3)", lineHeight:1.4}}>
              {data.team_a?.style}
            </div>
          </div>

          {/* VS center */}
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"1.4rem", fontWeight:900, color:"var(--t3)", letterSpacing:"-0.04em", lineHeight:1}}>VS</div>
            <div style={{fontSize:9, color:"var(--t3)", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:3}}>Analysis</div>
          </div>

          {/* Team B — right aligned */}
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
            <TeamLogo name={data.team_b?.name} size={52} />
            <div style={{fontSize:"1rem", fontWeight:800, color:"var(--t1)", letterSpacing:"-0.02em", lineHeight:1.2, textAlign:"center"}}>
                {data.team_b?.name}
            </div>
            <div style={{
              display:"inline-flex", alignItems:"center",
              background:"var(--g-dim)", border:"1px solid var(--g-border)",
              color:"var(--g)", fontSize:11, fontWeight:700,
              padding:"2px 10px", borderRadius:99, letterSpacing:"0.06em",
              width:"fit-content"
            }}>
              {data.team_b?.formation}
            </div>
            <div style={{fontSize:11, color:"var(--t3)", lineHeight:1.4}}>
              {data.team_b?.style}
            </div>
          </div>

        </div>
        <div style={{padding:"0.875rem 1.5rem", fontSize:13, color:"var(--t2)", lineHeight:1.7}}>
          {data.match_summary}
        </div>
      </div>

      {/* ── KEY MOMENTS ── */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem"}}>
        <MomentsCard team={data.team_a} />
        <MomentsCard team={data.team_b} />
      </div>

      {/* ── TACTICAL SHIFTS ── */}
      <div className="section-card">
        <div className="sc-header">
          <div className="sc-icon g"><i className="ti ti-arrows-exchange" aria-hidden="true"></i></div>
          <span className="sc-title">Tactical Shifts</span>
        </div>
        <div className="sc-body">
          <div className="shift-tl">
            {data.tactical_shifts?.map((s, i) => (
              <div key={i} className="shift-tl-row">
                <div className="stl-min"><span className="stl-min-badge">{s.minute}</span></div>
                <div className="stl-dot-col"><div className="stl-dot"></div></div>
                <div className="stl-body">
                  <div className="stl-team">{s.team}</div>
                  <div className="stl-change">{s.change}</div>
                  <div className="stl-impact">
                    <span className="stl-impact-tag">Impact</span>
                    {s.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOMENTUM ── */}
      <div className="section-card">
        <div className="sc-header">
          <div className="sc-icon b"><i className="ti ti-chart-line" aria-hidden="true"></i></div>
          <span className="sc-title">Match Momentum</span>
        </div>
        <div className="sc-body">
          <div className="mom-list">
            {data.momentum_periods?.map((m, i) => (
              <div key={i} className="mom-row">
                <div className="mom-top">
                  <span className="mom-period">{m.period}</span>
                  <span className="mom-team">{m.dominant_team}</span>
                </div>
                <div className="mom-track">
                  <div className="mom-fill" style={{width:`${50+(i%2===0?30:15)}%`}}></div>
                </div>
                <div className="mom-reason">{m.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAN EXPLAINER ── */}
      <div className="fan-card">
        <div className="fan-card-top">
          <div className="fan-icon"><i className="ti ti-users" aria-hidden="true"></i></div>
          <div>
            <div className="fan-label">Casual Fan Explainer</div>
            <div className="fan-label-sub">No football knowledge needed</div>
          </div>
        </div>
        <div className="fan-body">{data.fan_explainer}</div>
      </div>

    </div>
  )
}

function MomentsCard({ team }) {
  return (
    <div className="section-card">
      <div className="sc-header" style={{gap:10}}>
        <TeamLogo name={team?.name} size={26} />
        <span className="sc-title">{team?.name}</span>
      </div>
      <div className="sc-body">
        <div className="moments-grid">
          {team?.key_moments?.map((m, i) => (
            <div key={i} className="moment-pill">
              <div className="moment-num">{i+1}</div>
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}