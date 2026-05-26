
import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, LineChart, Line, Legend
} from "recharts";

const PARTNERS = ["Infosys Foundation", "Tata Trusts", "Wipro Cares", "HDFC Bank CSR"];
const SITES = {
  "Infosys Foundation": ["Nagpur Forest Belt", "Pune Riverbank", "Mysuru Dryland"],
  "Tata Trusts": ["Jharkhand Hills", "Odisha Coastal"],
  "Wipro Cares": ["Karnataka Plateau", "Andhra Drylands"],
  "HDFC Bank CSR": ["Rajasthan Semi-arid", "MP Central Forest"],
};
const MODULES = [
  { id: "e1", label: "E1 Carbon", group: "env" },
  { id: "e2", label: "E2 Biodiversity", group: "env" },
  { id: "e3", label: "E3 Water", group: "env" },
  { id: "e4", label: "E4 Solar", group: "env" },
  { id: "e5", label: "E5 GHG / CCTS", group: "env" },
  { id: "s1", label: "S1 Employment", group: "soc" },
  { id: "s2", label: "S2 Farmers", group: "soc" },
  { id: "s3", label: "S3 Education", group: "soc" },
  { id: "s4", label: "S4 Athletes", group: "soc" },
];

const carbonData = [
  { yr: "2020", annual: 12, cumulative: 12 },
  { yr: "2021", annual: 28, cumulative: 40 },
  { yr: "2022", annual: 45, cumulative: 85 },
  { yr: "2023", annual: 67, cumulative: 152 },
  { yr: "2024", annual: 89, cumulative: 241 },
  { yr: "2025", annual: 112, cumulative: 353 },
];
const speciesData = [
  { name: "Teak", value: 3200, color: "#1D9E75" },
  { name: "Neem", value: 2800, color: "#639922" },
  { name: "Peepal", value: 1900, color: "#0F6E56" },
  { name: "Bamboo", value: 2400, color: "#3B6D11" },
  { name: "Mahua", value: 1100, color: "#9FE1CB" },
  { name: "Others", value: 2600, color: "#B4B2A9" },
];
const iucnData = [
  { status: "CR", flora: 4, fauna: 2 },
  { status: "EN", flora: 9, fauna: 6 },
  { status: "VU", flora: 18, fauna: 11 },
  { status: "NT", flora: 26, fauna: 19 },
  { status: "LC", flora: 89, fauna: 67 },
];
const waterData = [
  { month: "Jan", saved: 18, recharge: 4 },
  { month: "Mar", saved: 32, recharge: 7 },
  { month: "May", saved: 45, recharge: 12 },
  { month: "Jul", saved: 58, recharge: 18 },
  { month: "Sep", saved: 41, recharge: 14 },
  { month: "Nov", saved: 29, recharge: 9 },
];
const aqiData = [
  { label: "Before", aqi: 148 },
  { label: "After", aqi: 87 },
];
const ghgData = [
  { scope: "Scope 1\nRemovals", value: 353 },
  { scope: "Scope 2\nSolar", value: 28 },
  { scope: "Scope 3\nCat 15", value: 241 },
];
const employData = [
  { role: "Planting crew", male: 124, female: 89 },
  { role: "Nursery", male: 34, female: 67 },
  { role: "Drip maint.", male: 45, female: 12 },
  { role: "GramYumm", male: 28, female: 94 },
];
const educData = [
  { yr: "2021", students: 48, dropout: 12, baseline: 28 },
  { yr: "2022", students: 74, dropout: 9, baseline: 28 },
  { yr: "2023", students: 103, dropout: 6, baseline: 28 },
  { yr: "2024", students: 138, dropout: 4, baseline: 28 },
  { yr: "2025", students: 167, dropout: 3, baseline: 28 },
];
const radarData = [
  { metric: "Carbon", value: 82 },
  { metric: "Biodiversity", value: 71 },
  { metric: "Water", value: 65 },
  { metric: "Solar", value: 58 },
  { metric: "Employment", value: 79 },
  { metric: "Education", value: 88 },
];
const athleteData = [
  { name: "Kavita Murmu", sport: "Athletics", level: "National", amount: 24000 },
  { name: "Raju Oraon", sport: "Archery", level: "State", amount: 18000 },
  { name: "Sunita Bhil", sport: "Wrestling", level: "National", amount: 24000 },
  { name: "Arjun Gond", sport: "Football", level: "District", amount: 12000 },
  { name: "Meera Santal", sport: "Kabaddi", level: "State", amount: 18000 },
];
const levelColor = { National: "#1D9E75", State: "#378ADD", District: "#BA7517" };
const IUCN_COLOR = { CR: "#E24B4A", EN: "#EF9F27", VU: "#378ADD", NT: "#888780", LC: "#1D9E75" };

const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;
const fmtBig = (n) => n.toLocaleString();

const KPICard = ({ icon, value, label, sub, color }) => (
  <div style={{
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: "var(--border-radius-lg)",
    padding: "14px 16px",
    display: "flex", flexDirection: "column", gap: 2,
    flex: 1, minWidth: 0,
  }}>
    <div style={{ fontSize: 22, color, lineHeight: 1 }}><i className={`ti ${icon}`} aria-hidden /></div>
    <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.2, marginTop: 4 }}>{value}</div>
    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{sub}</div>}
  </div>
);

const SectionHead = ({ letter, color, title, badge }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
    <div style={{
      width: 28, height: 28, borderRadius: 6, background: color + "22",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 500, color
    }}>{letter}</div>
    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{title}</span>
    {badge && <span style={{ fontSize: 11, padding: "2px 8px", background: "var(--color-background-secondary)", borderRadius: 4, color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>{badge}</span>}
  </div>
);

const Card = ({ children, style }) => (
  <div style={{
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: "var(--border-radius-lg)",
    padding: "16px",
    ...style
  }}>{children}</div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ fontWeight: 500, marginBottom: 4, color: "var(--color-text-primary)" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--color-text-secondary)" }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function ESGDashboard() {
  const [partner, setPartner] = useState("Infosys Foundation");
  const [site, setSite] = useState("All Sites");
  const [dateFrom, setDateFrom] = useState("2020-01");
  const [dateTo, setDateTo] = useState("2025-12");
  const [viewMode, setViewMode] = useState("cumulative");
  const [activeModules, setActiveModules] = useState(new Set(MODULES.map(m => m.id)));
  const [activeTab, setActiveTab] = useState("overview");

  const sites = ["All Sites", ...SITES[partner]];
  const toggleModule = (id) => {
    const s = new Set(activeModules);
    s.has(id) ? s.delete(id) : s.add(id);
    setActiveModules(s);
  };

  const envGreen = "#1D9E75";
  const socBlue = "#378ADD";
  const amber = "#BA7517";
  const red = "#E24B4A";

  return (
    <div style={{ display: "flex", height: "100vh", minHeight: 680, fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)", overflow: "hidden" }}>

      {/* LEFT SIDEBAR */}
      <div style={{
        width: 220, flexShrink: 0,
        background: "var(--color-background-primary)",
        borderRight: "0.5px solid var(--color-border-tertiary)",
        display: "flex", flexDirection: "column",
        overflowY: "auto", padding: "16px 12px",
        gap: 0
      }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingBottom: 14, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: envGreen + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-tree" style={{ fontSize: 18, color: envGreen }} aria-hidden />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1 }}>Sankalptaru</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>ESG Impact Dashboard</div>
          </div>
        </div>

        {/* Corporate partner */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6, fontWeight: 500 }}>Corporate partner</div>
          <select value={partner} onChange={e => { setPartner(e.target.value); setSite("All Sites"); }} style={{ width: "100%", fontSize: 12 }}>
            {PARTNERS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* Project site */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6, fontWeight: 500 }}>Project site</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sites.map(s => (
              <button key={s} onClick={() => setSite(s)} style={{
                textAlign: "left", fontSize: 12, padding: "6px 10px",
                border: "0.5px solid " + (site === s ? envGreen : "var(--color-border-tertiary)"),
                borderRadius: 6, background: site === s ? envGreen + "15" : "transparent",
                color: site === s ? envGreen : "var(--color-text-secondary)",
                cursor: "pointer", fontWeight: site === s ? 500 : 400,
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div style={{ marginBottom: 14, paddingTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6, fontWeight: 500 }}>Date range</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "var(--color-text-secondary)", minWidth: 28 }}>From</span>
              <input type="month" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ flex: 1, fontSize: 11 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "var(--color-text-secondary)", minWidth: 28 }}>To</span>
              <input type="month" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ flex: 1, fontSize: 11 }} />
            </div>
          </div>
        </div>

        {/* View mode */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6, fontWeight: 500 }}>View mode</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["cumulative", "annual", "per-site"].map(v => (
              <button key={v} onClick={() => setViewMode(v)} style={{
                fontSize: 11, padding: "4px 8px", borderRadius: 4,
                border: "0.5px solid " + (viewMode === v ? envGreen : "var(--color-border-tertiary)"),
                background: viewMode === v ? envGreen + "15" : "transparent",
                color: viewMode === v ? envGreen : "var(--color-text-secondary)",
                cursor: "pointer", fontWeight: viewMode === v ? 500 : 400,
                textTransform: "capitalize",
              }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Module toggles */}
        <div style={{ paddingTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8, fontWeight: 500 }}>Modules</div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4, letterSpacing: ".04em" }}>Environmental</div>
          {MODULES.filter(m => m.group === "env").map(m => (
            <div key={m.id} onClick={() => toggleModule(m.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "4px 2px",
              cursor: "pointer", opacity: activeModules.has(m.id) ? 1 : 0.4
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                background: activeModules.has(m.id) ? envGreen : "transparent",
                border: "0.5px solid " + (activeModules.has(m.id) ? envGreen : "var(--color-border-secondary)"),
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {activeModules.has(m.id) && <i className="ti ti-check" style={{ fontSize: 10, color: "#fff" }} aria-hidden />}
              </div>
              <span style={{ fontSize: 12, color: "var(--color-text-primary)" }}>{m.label}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 8, marginBottom: 4, letterSpacing: ".04em" }}>Social</div>
          {MODULES.filter(m => m.group === "soc").map(m => (
            <div key={m.id} onClick={() => toggleModule(m.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "4px 2px",
              cursor: "pointer", opacity: activeModules.has(m.id) ? 1 : 0.4
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                background: activeModules.has(m.id) ? socBlue : "transparent",
                border: "0.5px solid " + (activeModules.has(m.id) ? socBlue : "var(--color-border-secondary)"),
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {activeModules.has(m.id) && <i className="ti ti-check" style={{ fontSize: 10, color: "#fff" }} aria-hidden />}
              </div>
              <span style={{ fontSize: 12, color: "var(--color-text-primary)" }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Export */}
        <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", fontSize: 12, cursor: "pointer", borderRadius: 6, background: envGreen, border: "none", color: "#fff", fontWeight: 500 }}>
            <i className="ti ti-download" aria-hidden /> Export PDF report
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>

        {/* Top bar */}
        <div style={{
          background: "var(--color-background-primary)",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 12, flexShrink: 0
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" }}>{partner}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
              {site} · {dateFrom} → {dateTo} · {viewMode}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["SEBI BRSR", "GRI", "TCFD", "GHG Protocol"].map(b => (
              <span key={b} style={{ fontSize: 11, padding: "3px 8px", border: "0.5px solid " + envGreen, borderRadius: 4, color: envGreen, background: envGreen + "10" }}>{b}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["overview", "environment", "social", "deep dive"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                border: "0.5px solid " + (activeTab === t ? envGreen : "var(--color-border-tertiary)"),
                background: activeTab === t ? envGreen + "15" : "transparent",
                color: activeTab === t ? envGreen : "var(--color-text-secondary)",
                fontWeight: activeTab === t ? 500 : 400, textTransform: "capitalize",
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* KPI row */}
          <div style={{ display: "flex", gap: 10 }}>
            <KPICard icon="ti-leaf" value="353 tCO₂e" label="Carbon removed" sub="Cumulative · E1" color={envGreen} />
            <KPICard icon="ti-tree" value="14,000" label="Trees alive" sub="Survival-adjusted" color={envGreen} />
            <KPICard icon="ti-droplet" value="2.4 ML" label="Water saved" sub="vs conventional" color={socBlue} />
            <KPICard icon="ti-users" value="493" label="Jobs created" sub="Person-days" color={socBlue} />
            <KPICard icon="ti-home" value="284" label="Farmers benefited" sub="S2 · livelihood" color={amber} />
            <KPICard icon="ti-school" value="167" label="Students sponsored" sub="S3 · tribal education" color={amber} />
          </div>

          {/* Environmental section */}
          {(activeTab === "overview" || activeTab === "environment") && (
            <div>
              <div style={{ fontSize: 12, color: envGreen, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ti ti-leaf" aria-hidden /> Environmental modules
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>

                {/* E1 carbon area chart */}
                {activeModules.has("e1") && (
                  <Card style={{ gridColumn: "span 2" }}>
                    <SectionHead letter="E1" color={envGreen} title="Carbon sequestration over time" badge="tCO₂e · GHG Protocol LSR" />
                    <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Cumulative removed</div>
                        <div style={{ fontSize: 20, fontWeight: 500, color: envGreen }}>353 tCO₂e</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>2025 annual</div>
                        <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)" }}>112 tCO₂e</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Survival rate</div>
                        <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)" }}>78%</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={carbonData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={envGreen} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={envGreen} stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="annGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9FE1CB" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#9FE1CB" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                        <XAxis dataKey="yr" tick={{ fontSize: 11, fill: "#888" }} />
                        <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="cumulative" stroke={envGreen} fill="url(#cumGrad)" strokeWidth={2} name="Cumulative" />
                        <Area type="monotone" dataKey="annual" stroke="#9FE1CB" fill="url(#annGrad)" strokeWidth={1.5} strokeDasharray="4 2" name="Annual" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: "var(--color-text-secondary)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 3, background: envGreen, borderRadius: 2, display: "inline-block" }}></span>Cumulative tCO₂e</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 3, background: "#9FE1CB", borderRadius: 2, display: "inline-block" }}></span>Annual tCO₂e</span>
                      <span style={{ marginLeft: "auto" }}>Source: ICFRE · IPCC · GHG Protocol LSR Jan 2026</span>
                    </div>
                  </Card>
                )}

                {/* Species donut */}
                {activeModules.has("e1") && (
                  <Card>
                    <SectionHead letter="E1" color={envGreen} title="Carbon by species" />
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={speciesData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" nameKey="name" paddingAngle={2}>
                          {speciesData.map((s, i) => <Cell key={i} fill={s.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => [fmtBig(v) + " trees"]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {speciesData.map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }}></div>
                          <span style={{ flex: 1, color: "var(--color-text-secondary)" }}>{s.name}</span>
                          <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{fmtBig(s.value)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* E2 biodiversity */}
                {activeModules.has("e2") && (
                  <Card>
                    <SectionHead letter="E2" color="#378ADD" title="Biodiversity index" badge="IUCN Red List v2024-2" />
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      {["CR", "EN", "VU"].map(s => (
                        <div key={s} style={{ flex: 1, textAlign: "center", padding: "6px 4px", borderRadius: 6, background: IUCN_COLOR[s] + "18", border: "0.5px solid " + IUCN_COLOR[s] + "44" }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: IUCN_COLOR[s] }}>{s}</div>
                          <div style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" }}>{s === "CR" ? 6 : s === "EN" ? 15 : 29}</div>
                          <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>species</div>
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={130}>
                      <BarChart data={iucnData} layout="vertical" margin={{ left: 8, right: 8, top: 0, bottom: 0 }}>
                        <XAxis type="number" tick={{ fontSize: 10, fill: "#888" }} />
                        <YAxis dataKey="status" type="category" tick={{ fontSize: 11, fill: "#888" }} width={28} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="flora" stackId="a" fill="#1D9E75" name="Flora" />
                        <Bar dataKey="fauna" stackId="a" fill="#378ADD" name="Fauna" radius={[0, 3, 3, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: "var(--color-text-secondary)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#1D9E75", display: "inline-block" }}></span>Flora</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#378ADD", display: "inline-block" }}></span>Fauna</span>
                    </div>
                  </Card>
                )}

                {/* E3 water */}
                {activeModules.has("e3") && (
                  <Card>
                    <SectionHead letter="E3" color={socBlue} title="Water conservation" badge="CGWB · CPCB" />
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1, padding: "8px 10px", borderRadius: 6, background: socBlue + "12", border: "0.5px solid " + socBlue + "33" }}>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>AQI before</div>
                        <div style={{ fontSize: 20, fontWeight: 500, color: red }}>148</div>
                        <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Moderate</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", fontSize: 16, color: envGreen }}>→</div>
                      <div style={{ flex: 1, padding: "8px 10px", borderRadius: 6, background: envGreen + "12", border: "0.5px solid " + envGreen + "33" }}>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>AQI after</div>
                        <div style={{ fontSize: 20, fontWeight: 500, color: envGreen }}>87</div>
                        <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Satisfactory</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={130}>
                      <BarChart data={waterData} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#888" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#888" }} unit="kL" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="saved" fill={socBlue} name="Water saved (kL)" radius={[3,3,0,0]} />
                        <Bar dataKey="recharge" fill="#9FE1CB" name="Recharge (kL)" radius={[3,3,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                {/* E4 Solar + E5 GHG */}
                {(activeModules.has("e4") || activeModules.has("e5")) && (
                  <Card>
                    {activeModules.has("e4") && (
                      <>
                        <SectionHead letter="E4" color={amber} title="Solar carbon avoidance" badge="CEA v21.0 · 0.710 tCO₂/MWh" />
                        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                          {[["3,840 kWh", "Energy generated", amber], ["2.7 tCO₂e", "Avoided (E4)", amber], ["0.710", "CEA factor v21", "#888"]].map(([v, l, c]) => (
                            <div key={l} style={{ flex: 1, textAlign: "center" }}>
                              <div style={{ fontSize: 16, fontWeight: 500, color: c }}>{v}</div>
                              <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{l}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {activeModules.has("e5") && (
                      <>
                        <SectionHead letter="E5" color="#533AB7" title="GHG scope summary + CCTS" />
                        <ResponsiveContainer width="100%" height={110}>
                          <BarChart data={ghgData} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
                            <XAxis type="number" tick={{ fontSize: 10, fill: "#888" }} unit=" t" />
                            <YAxis dataKey="scope" type="category" tick={{ fontSize: 10, fill: "#888" }} width={65} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" name="tCO₂e" radius={[0, 4, 4, 0]}>
                              {ghgData.map((_, i) => <Cell key={i} fill={[envGreen, amber, "#7F77DD"][i]} />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        <div style={{ marginTop: 8, padding: "6px 10px", background: amber + "18", borderRadius: 6, border: "0.5px solid " + amber + "44", fontSize: 11, color: amber }}>
                          <i className="ti ti-alert-triangle" style={{ marginRight: 4 }} aria-hidden />
                          Projected ~353 CCC units under CCTS Offset V1 (BEE, Mar 2025). ICM platform not live — expected mid–late 2026. Not tradeable today.
                        </div>
                      </>
                    )}
                  </Card>
                )}

              </div>
            </div>
          )}

          {/* Social section */}
          {(activeTab === "overview" || activeTab === "social") && (
            <div>
              <div style={{ fontSize: 12, color: socBlue, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ti ti-users" aria-hidden /> Social modules
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>

                {/* S1 Employment */}
                {activeModules.has("s1") && (
                  <Card>
                    <SectionHead letter="S1" color={socBlue} title="Employment generation" badge="BRSR Core KPIs" />
                    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      {[["493", "Total person-days", socBlue], ["61%", "Women workforce", "#D4537E"], ["₹342", "Avg daily wage", envGreen]].map(([v, l, c]) => (
                        <div key={l} style={{ flex: 1, padding: "8px", borderRadius: 6, background: c + "12", border: "0.5px solid " + c + "33", textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: 500, color: c }}>{v}</div>
                          <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={130}>
                      <BarChart data={employData} margin={{ top: 0, right: 8, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                        <XAxis dataKey="role" tick={{ fontSize: 10, fill: "#888" }} angle={-15} textAnchor="end" />
                        <YAxis tick={{ fontSize: 10, fill: "#888" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="male" stackId="a" fill={socBlue} name="Male" />
                        <Bar dataKey="female" stackId="a" fill="#D4537E" name="Female" radius={[3,3,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                {/* S2 Farmers */}
                {activeModules.has("s2") && (
                  <Card>
                    <SectionHead letter="S2" color={amber} title="Farmer livelihood & fodder" badge="APMC · ICFRE" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[
                        { species: "Sesbania", households: 84, fodder: "12 kg/tree/yr", income: "₹4,200" },
                        { species: "Subabul", households: 72, fodder: "8 kg/tree/yr", income: "₹3,100" },
                        { species: "Gliricidia", households: 61, fodder: "10 kg/tree/yr", income: "₹3,800" },
                        { species: "Bamboo", households: 67, fodder: "—", income: "₹6,400" },
                      ].map((r, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "var(--color-background-secondary)", borderRadius: 6, fontSize: 12 }}>
                          <div style={{ flex: 2, fontWeight: 500, color: "var(--color-text-primary)" }}>{r.species}</div>
                          <div style={{ flex: 1, color: "var(--color-text-secondary)", fontSize: 11 }}>{r.households} HH</div>
                          <div style={{ flex: 2, color: "var(--color-text-secondary)", fontSize: 11 }}>{r.fodder}</div>
                          <div style={{ flex: 1, color: envGreen, fontWeight: 500 }}>{r.income}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                      {[["284", "Households", amber], ["38.2 t", "Fodder/yr", envGreen], ["₹4,200", "Avg income added", envGreen]].map(([v, l, c]) => (
                        <div key={l} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: 16, fontWeight: 500, color: c }}>{v}</div>
                          <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* S3 Education */}
                {activeModules.has("s3") && (
                  <Card>
                    <SectionHead letter="S3" color="#639922" title="Tribal education program" badge="UDISE+ benchmark" />
                    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: "#639922" + "15", border: "0.5px solid " + "#639922" + "33", textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 500, color: "#3B6D11" }}>167</div>
                        <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Students sponsored</div>
                      </div>
                      <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: envGreen + "12", border: "0.5px solid " + envGreen + "33", textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 500, color: envGreen }}>72%</div>
                        <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>First-gen learners</div>
                      </div>
                      <div style={{ flex: 1, padding: "8px", borderRadius: 6, background: red + "12", border: "0.5px solid " + red + "33", textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 500, color: red }}>3% dropout</div>
                        <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>vs 28% UDISE+ baseline</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={130}>
                      <LineChart data={educData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                        <XAxis dataKey="yr" tick={{ fontSize: 10, fill: "#888" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#888" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="students" stroke="#3B6D11" strokeWidth={2} dot={{ r: 3 }} name="Students" />
                        <Line type="monotone" dataKey="dropout" stroke={red} strokeWidth={1.5} strokeDasharray="4 2" dot={{ r: 2 }} name="Dropout %" />
                        <Line type="monotone" dataKey="baseline" stroke="#B4B2A9" strokeWidth={1} strokeDasharray="6 3" dot={false} name="UDISE+ baseline" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                {/* S4 Athletes */}
                {activeModules.has("s4") && (
                  <Card>
                    <SectionHead letter="S4" color={socBlue} title="Tribal athlete scholarships" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {athleteData.map((a, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--color-background-secondary)", borderRadius: 8, fontSize: 12 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: (levelColor[a.level] || "#888") + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: levelColor[a.level] || "#888", flexShrink: 0 }}>
                            <i className="ti ti-award" aria-hidden />
                          </div>
                          <div style={{ flex: 2 }}>
                            <div style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{a.name}</div>
                            <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{a.sport}</div>
                          </div>
                          <div style={{ flex: 1, textAlign: "center" }}>
                            <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: (levelColor[a.level] || "#888") + "20", color: levelColor[a.level] || "#888", border: "0.5px solid " + (levelColor[a.level] || "#888") + "44", fontWeight: 500 }}>{a.level}</span>
                          </div>
                          <div style={{ flex: 1, textAlign: "right", fontWeight: 500, color: "var(--color-text-primary)", fontSize: 12 }}>₹{fmtBig(a.amount)}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                      {[["5", "Athletes", socBlue], ["2 national", "Competitions", envGreen], ["₹96k", "Total disbursed", amber]].map(([v, l, c]) => (
                        <div key={l} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: 15, fontWeight: 500, color: c }}>{v}</div>
                          <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Deep dive: radar */}
          {activeTab === "deep dive" && (
            <Card>
              <SectionHead letter="∑" color="#7F77DD" title="Overall ESG performance radar" badge="Normalised 0–100" />
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <ResponsiveContainer width={300} height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-border-tertiary)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#888" }} />
                    <Radar name="Score" dataKey="value" stroke={envGreen} fill={envGreen} fillOpacity={0.2} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {radarData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ fontSize: 12, flex: 1, color: "var(--color-text-secondary)" }}>{d.metric}</div>
                      <div style={{ flex: 3, height: 6, background: "var(--color-background-tertiary)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: d.value + "%", height: "100%", background: envGreen, borderRadius: 3 }}></div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", minWidth: 28, textAlign: "right" }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Footer disclaimer */}
          <div style={{ padding: "10px 14px", background: amber + "12", border: "0.5px solid " + amber + "33", borderRadius: 8, fontSize: 11, color: amber, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <i className="ti ti-shield-check" style={{ marginTop: 1, flexShrink: 0 }} aria-hidden />
            <span>
              All metrics are source-linked and timestamped. CCC projections under CCTS Offset Mechanism V1 (BEE, Mar 2025) are estimated only — ICM trading platform expected mid–late 2026, not tradeable today. CEA emission factor: v21.0 (Nov 2025) = 0.710 tCO₂/MWh. IUCN Red List v2024-2. GHG Protocol LSR Standard (Jan 30 2026). Forest carbon methodology: 2022 Pilot Draft pending official Q2 2026 guidance.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
