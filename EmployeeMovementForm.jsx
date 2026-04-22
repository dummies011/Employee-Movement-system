import { useState, useMemo, useRef, useEffect } from "react";

// ── Sample data mirroring your Excel sheets ──────────────────
const EMPLOYEES = [
  { id: "EMP-0001", lastName: "Dela Cruz", firstName: "Juan", middleName: "Reyes",
    gender: "Male", dob: "1990-05-15", dateHired: "2022-03-01", status: "Probationary",
    company: "ABC Corporation", group: "Operations Group", department: "Operations",
    branch: "Head Office", position: "Operations Analyst", grade: "Grade 5",
    supervisor: "Maria Santos", probEndDate: "2022-09-01", regStatus: "Pending",
    email: "juan.dc@abc.com", contact: "09171234567" },
  { id: "EMP-0002", lastName: "Reyes", firstName: "Maria", middleName: "Lopez",
    gender: "Female", dob: "1988-11-20", dateHired: "2020-06-15", status: "Regular",
    company: "ABC Corporation", group: "Finance Group", department: "Finance & Accounting",
    branch: "Head Office", position: "Senior Accountant", grade: "Grade 7",
    supervisor: "Jose Garcia", probEndDate: "", regStatus: "Regular",
    email: "maria.r@abc.com", contact: "09181234567" },
  { id: "EMP-0003", lastName: "Santos", firstName: "Pedro", middleName: "Cruz",
    gender: "Male", dob: "1995-03-10", dateHired: "2023-10-01", status: "Probationary",
    company: "ABC Corporation", group: "HR Group", department: "Human Resources",
    branch: "Luzon", position: "HR Associate", grade: "Grade 4",
    supervisor: "Ana Reyes", probEndDate: "2024-04-01", regStatus: "Pending",
    email: "pedro.s@abc.com", contact: "09191234567" },
  { id: "EMP-0004", lastName: "Garcia", firstName: "Jose", middleName: "Manuel",
    gender: "Male", dob: "1985-07-22", dateHired: "2018-01-10", status: "Regular",
    company: "ABC Corporation", group: "Finance Group", department: "Finance & Accounting",
    branch: "Head Office", position: "Finance Manager", grade: "Grade 9",
    supervisor: "CEO", probEndDate: "", regStatus: "Regular",
    email: "jose.g@abc.com", contact: "09201234567" },
  { id: "EMP-0005", lastName: "Lim", firstName: "Ana", middleName: "Cruz",
    gender: "Female", dob: "1992-03-15", dateHired: "2019-05-20", status: "Regular",
    company: "ABC Corporation", group: "HR Group", department: "Human Resources",
    branch: "Head Office", position: "HR Manager", grade: "Grade 8",
    supervisor: "CHRO", probEndDate: "", regStatus: "Regular",
    email: "ana.l@abc.com", contact: "09211234567" },
];

const MOVEMENTS = [
  { id: "MOV-2024-001", employeeId: "EMP-0002", date: "2024-01-15", type: "Promotion",
    status: "Approved", prevPosition: "Junior Accountant", prevGrade: "Grade 5",
    prevDept: "Finance & Accounting", prevBranch: "Head Office",
    newPosition: "Senior Accountant", newGrade: "Grade 7",
    newDept: "Finance & Accounting", newBranch: "Head Office",
    prevSalary: 35000, newSalary: 45000,
    proposedDate: "2024-01-20", actualDate: "2024-01-20", csuiteDate: "2024-01-19",
    justification: "Outstanding performance Q3 — exceeded all KPIs by 35%.",
    preparedBy: "HR Officer", paf: "PAF-2024-001", goalSetting: "GS-2024-005",
    orgChart: "OC-2024-003", mrf: "MRF-2024-007", appraisal: "APR-2024-012",
    lor: "LOR-2024-001",
    deptHeadName: "Jose Garcia", deptHeadDate: "2024-01-16", deptHeadStatus: "Approved",
    cbName: "Ana Lim", cbDate: "2024-01-17", cbStatus: "Approved",
    csuiteName: "CEO Office", csuiteApprDate: "2024-01-19", csuiteStatus: "Approved" },
  { id: "MOV-2024-002", employeeId: "EMP-0001", date: "2024-02-01", type: "Transfer",
    status: "Approved", prevPosition: "Operations Analyst", prevGrade: "Grade 5",
    prevDept: "Operations", prevBranch: "Head Office",
    newPosition: "Operations Analyst", newGrade: "Grade 5",
    newDept: "Operations", newBranch: "Luzon",
    prevSalary: 28000, newSalary: 28000,
    proposedDate: "2024-02-15", actualDate: "2024-02-15", csuiteDate: "2024-02-10",
    justification: "Branch expansion requirement — Luzon operations scaling up.",
    preparedBy: "HR Officer", paf: "PAF-2024-002", goalSetting: "",
    orgChart: "OC-2024-004", mrf: "MRF-2024-008", appraisal: "",
    lor: "MEMO-2024-003",
    deptHeadName: "Jose Garcia", deptHeadDate: "2024-02-03", deptHeadStatus: "Approved",
    cbName: "Ana Lim", cbDate: "2024-02-07", cbStatus: "Approved",
    csuiteName: "CEO Office", csuiteApprDate: "2024-02-10", csuiteStatus: "Approved" },
  { id: "MOV-2024-003", employeeId: "EMP-0003", date: "2024-03-10", type: "Regularization",
    status: "Pending", prevPosition: "HR Associate", prevGrade: "Grade 4",
    prevDept: "Human Resources", prevBranch: "Luzon",
    newPosition: "HR Associate", newGrade: "Grade 4",
    newDept: "Human Resources", newBranch: "Luzon",
    prevSalary: 22000, newSalary: 24000,
    proposedDate: "2024-04-01", actualDate: "", csuiteDate: "",
    justification: "Completion of 6-month probationary period. Satisfactory performance.",
    preparedBy: "HR Officer", paf: "PAF-2024-003", goalSetting: "GS-2024-009",
    orgChart: "", mrf: "", appraisal: "APR-2024-015",
    lor: "",
    deptHeadName: "Ana Reyes", deptHeadDate: "", deptHeadStatus: "Pending",
    cbName: "", cbDate: "", cbStatus: "Pending",
    csuiteName: "", csuiteApprDate: "", csuiteStatus: "Pending" },
];

const STATUS_COLORS = {
  Approved:    { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  Pending:     { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  Cancelled:   { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  "On Hold":   { bg: "#e0e7ff", text: "#3730a3", dot: "#6366f1" },
  "For Approval": { bg: "#dbeafe", text: "#1e3a8a", dot: "#3b82f6" },
  Rejected:    { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};

const TYPE_ICONS = {
  Promotion: "↑",
  Transfer: "⇄",
  "Role/Position Change": "◈",
  Regularization: "✓",
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: s.bg, color: s.text,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function Field({ label, value, highlight, mono, wide, half }) {
  return (
    <div style={{
      gridColumn: wide ? "1 / -1" : half ? "span 1" : "span 1",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{
        padding: "9px 13px",
        background: highlight ? "#fffbeb" : "#f8fafc",
        border: `1.5px solid ${highlight ? "#fbbf24" : "#e2e8f0"}`,
        borderRadius: 8,
        fontSize: 13,
        fontWeight: highlight ? 700 : 500,
        color: value ? "#0f172a" : "#cbd5e1",
        fontFamily: mono ? "'Courier New', monospace" : "inherit",
        minHeight: 38,
        display: "flex", alignItems: "center",
      }}>
        {value || "—"}
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, color = "#1B3A6B" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      borderBottom: `2px solid ${color}`,
      paddingBottom: 8, marginBottom: 16, marginTop: 8,
    }}>
      <span style={{
        background: color, color: "#fff",
        width: 28, height: 28, borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14,
      }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 800, color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {title}
      </span>
    </div>
  );
}

function ApprovalBlock({ label, name, date, status, color }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS["Pending"];
  return (
    <div style={{
      flex: 1, border: `2px solid ${s.dot}`,
      borderRadius: 10, padding: "14px 16px",
      background: s.bg, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 4, background: s.dot,
      }} />
      <div style={{ fontSize: 10, fontWeight: 800, color: s.dot, letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
        {name || "—"}
      </div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
        {date || "No date yet"}
      </div>
      <StatusBadge status={status || "Pending"} />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("movement");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef();
  const dropdownRef = useRef();

  // Build unified search index
  const searchIndex = useMemo(() => {
    const entries = [];
    MOVEMENTS.forEach(m => {
      const emp = EMPLOYEES.find(e => e.id === m.employeeId);
      if (emp) {
        entries.push({
          movementId: m.id,
          employeeId: emp.id,
          fullName: `${emp.lastName}, ${emp.firstName} ${emp.middleName}`,
          displayName: `${emp.firstName} ${emp.lastName}`,
          movement: m,
          employee: emp,
          type: m.type,
          status: m.status,
          date: m.date,
        });
      }
    });
    return entries;
  }, []);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); setShowDropdown(false); return; }
    const q = query.toLowerCase();
    const matches = searchIndex.filter(e =>
      e.movementId.toLowerCase().includes(q) ||
      e.employeeId.toLowerCase().includes(q) ||
      e.fullName.toLowerCase().includes(q) ||
      e.displayName.toLowerCase().includes(q)
    );
    setSuggestions(matches);
    setShowDropdown(matches.length > 0);
  }, [query, searchIndex]);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectRecord(entry) {
    setSelected(entry);
    setQuery(`${entry.movementId} — ${entry.displayName}`);
    setShowDropdown(false);
  }

  function clearForm() {
    setSelected(null);
    setQuery("");
    setSuggestions([]);
  }

  const emp = selected?.employee;
  const mov = selected?.movement;
  const salaryDiff  = mov ? mov.newSalary - mov.prevSalary : 0;
  const salaryPct   = mov && mov.prevSalary ? ((salaryDiff / mov.prevSalary) * 100).toFixed(2) : 0;
  const dateGap     = mov && mov.actualDate && mov.csuiteDate
    ? Math.round((new Date(mov.actualDate) - new Date(mov.csuiteDate)) / 86400000)
    : null;

  const tabs = [
    { key: "movement", label: "Movement Details", icon: "⇄" },
    { key: "employee", label: "Employee Profile", icon: "👤" },
    { key: "approvals", label: "Approvals", icon: "✅" },
    { key: "documents", label: "Documents", icon: "📎" },
  ];

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2552 100%)",
      padding: "28px 20px",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 28,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: "linear-gradient(135deg, #C9A84C, #f0c96e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, flexShrink: 0,
            boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
          }}>⚡</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Employee Movement Form
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", letterSpacing: "0.06em", marginTop: 2 }}>
              ENTERPRISE HR MANAGEMENT SYSTEM
            </div>
          </div>
          {selected && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                padding: "6px 14px", borderRadius: 20,
                background: "rgba(201,168,76,0.15)", border: "1px solid #C9A84C",
                color: "#C9A84C", fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 16 }}>{TYPE_ICONS[mov?.type] || "◆"}</span>
                {mov?.type}
              </div>
              <StatusBadge status={mov?.status} />
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div ref={dropdownRef} style={{ position: "relative", marginBottom: 24 }}>
          <div style={{
            display: "flex", alignItems: "center",
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
            overflow: "visible",
            border: "2px solid transparent",
            transition: "border-color 0.2s",
          }}>
            <div style={{
              padding: "0 18px",
              color: "#94a3b8", fontSize: 20,
              display: "flex", alignItems: "center",
            }}>🔍</div>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => suggestions.length && setShowDropdown(true)}
              placeholder="Search by Employee Name, Employee ID, or Movement ID…"
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: 15, fontFamily: "'Georgia', serif",
                padding: "16px 0", color: "#0f172a",
                background: "transparent",
              }}
            />
            {query && (
              <button onClick={clearForm} style={{
                padding: "0 18px", border: "none", background: "none",
                cursor: "pointer", color: "#94a3b8", fontSize: 20,
                display: "flex", alignItems: "center",
              }}>×</button>
            )}
            {!selected && (
              <div style={{
                padding: "10px 18px", borderLeft: "1px solid #e2e8f0",
                color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap",
              }}>
                {searchIndex.length} records
              </div>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "#fff", borderRadius: 12,
              boxShadow: "0 16px 50px rgba(0,0,0,0.25)",
              zIndex: 100, overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}>
              {suggestions.map((entry, i) => (
                <div
                  key={entry.movementId}
                  onClick={() => selectRecord(entry)}
                  style={{
                    padding: "13px 20px",
                    cursor: "pointer",
                    borderBottom: i < suggestions.length - 1 ? "1px solid #f1f5f9" : "none",
                    display: "flex", alignItems: "center", gap: 14,
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                    background: "linear-gradient(135deg, #1B3A6B, #2E5FA3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 16, fontWeight: 700,
                  }}>
                    {entry.displayName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>
                      {entry.displayName}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 10, marginTop: 2 }}>
                      <span style={{ fontFamily: "monospace" }}>{entry.employeeId}</span>
                      <span>·</span>
                      <span style={{ fontFamily: "monospace" }}>{entry.movementId}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: "#1B3A6B", background: "#dbeafe",
                      padding: "2px 8px", borderRadius: 10,
                    }}>{entry.type}</span>
                    <StatusBadge status={entry.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {!selected && (
          <div style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.15)",
            padding: "60px 20px", textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <div style={{ color: "#94a3b8", fontSize: 15, marginBottom: 8 }}>
              Search for an employee or movement record to load the formal form
            </div>
            <div style={{ color: "#475569", fontSize: 13 }}>
              Try: <span style={{ fontFamily: "monospace", color: "#C9A84C" }}>EMP-0002</span> · <span style={{ fontFamily: "monospace", color: "#C9A84C" }}>MOV-2024-001</span> · <span style={{ fontFamily: "monospace", color: "#C9A84C" }}>Maria</span>
            </div>
            <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              {searchIndex.map(e => (
                <div
                  key={e.movementId}
                  onClick={() => selectRecord(e)}
                  style={{
                    padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "#94a3b8", fontSize: 12,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e2 => { e2.currentTarget.style.background = "rgba(201,168,76,0.15)"; e2.currentTarget.style.color = "#C9A84C"; e2.currentTarget.style.borderColor = "#C9A84C"; }}
                  onMouseLeave={e2 => { e2.currentTarget.style.background = "rgba(255,255,255,0.07)"; e2.currentTarget.style.color = "#94a3b8"; e2.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                >
                  {e.displayName} · {e.movementId}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Card */}
        {selected && (
          <div style={{
            background: "#fff", borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}>
            {/* Form Header Banner */}
            <div style={{
              background: "linear-gradient(135deg, #1B3A6B 0%, #2E5FA3 100%)",
              padding: "24px 32px",
              display: "flex", alignItems: "center", gap: 20,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: "linear-gradient(135deg, #C9A84C, #f0c96e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, fontWeight: 900, color: "#1B3A6B", flexShrink: 0,
              }}>
                {emp?.firstName?.charAt(0)}{emp?.lastName?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.01em" }}>
                  {emp?.firstName} {emp?.middleName ? emp.middleName.charAt(0) + ". " : ""}{emp?.lastName}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                  <span style={{ color: "#93c5fd", fontSize: 12, fontFamily: "monospace" }}>{emp?.id}</span>
                  <span style={{ color: "#93c5fd", fontSize: 12 }}>·</span>
                  <span style={{ color: "#93c5fd", fontSize: 12 }}>{emp?.position}</span>
                  <span style={{ color: "#93c5fd", fontSize: 12 }}>·</span>
                  <span style={{ color: "#93c5fd", fontSize: 12 }}>{emp?.department}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <div style={{
                  background: "rgba(201,168,76,0.2)", border: "1px solid #C9A84C",
                  padding: "4px 14px", borderRadius: 20, color: "#C9A84C",
                  fontSize: 12, fontFamily: "monospace", fontWeight: 700,
                }}>{mov?.id}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Transaction: {mov?.date}</div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: "flex", borderBottom: "2px solid #f1f5f9",
              padding: "0 32px", background: "#fafafa",
            }}>
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    padding: "14px 20px", border: "none", background: "none",
                    cursor: "pointer", fontSize: 13, fontWeight: 700,
                    color: activeTab === t.key ? "#1B3A6B" : "#94a3b8",
                    borderBottom: `3px solid ${activeTab === t.key ? "#1B3A6B" : "transparent"}`,
                    marginBottom: -2, transition: "all 0.15s",
                    fontFamily: "'Georgia', serif",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: "28px 32px" }}>

              {/* ── TAB: MOVEMENT DETAILS ── */}
              {activeTab === "movement" && (
                <div>
                  <SectionTitle icon="⇄" title="Movement Information" color="#1B3A6B" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                    <Field label="Movement ID" value={mov?.id} mono highlight />
                    <Field label="Movement Type" value={mov?.type} highlight />
                    <Field label="Status" value={mov?.status} />
                    <Field label="Transaction Date" value={mov?.date} />
                    <Field label="Proposed Effectivity Date" value={mov?.proposedDate} />
                    <Field label="Actual Effectivity Date" value={mov?.actualDate} />
                    <Field label="C-Suite Approval Date" value={mov?.csuiteDate} />
                    <Field label="Date Gap (Days)" value={dateGap !== null ? `${dateGap} day${dateGap !== 1 ? "s" : ""}` : "—"} highlight={dateGap !== null && dateGap < 0} />
                    <Field label="Prepared By" value={mov?.preparedBy} />
                  </div>

                  <SectionTitle icon="↔" title="Before → After Comparison" color="#7D3C98" />
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24,
                  }}>
                    {/* Before */}
                    <div style={{
                      border: "2px solid #e2e8f0", borderRadius: 12,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        background: "#f1f5f9", padding: "10px 16px",
                        fontSize: 11, fontWeight: 800, color: "#64748b",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        borderBottom: "1px solid #e2e8f0",
                      }}>📌 Previous (Before)</div>
                      <div style={{ padding: 16, display: "grid", gap: 12 }}>
                        <Field label="Position / Title" value={mov?.prevPosition} />
                        <Field label="Job Grade" value={mov?.prevGrade} />
                        <Field label="Department" value={mov?.prevDept} />
                        <Field label="Branch" value={mov?.prevBranch} />
                      </div>
                    </div>
                    {/* After */}
                    <div style={{
                      border: "2px solid #1B3A6B", borderRadius: 12,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        background: "#1B3A6B", padding: "10px 16px",
                        fontSize: 11, fontWeight: 800, color: "#fff",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        borderBottom: "1px solid #2E5FA3",
                      }}>🆕 New (After)</div>
                      <div style={{ padding: 16, display: "grid", gap: 12 }}>
                        <Field label="Position / Title" value={mov?.newPosition} highlight />
                        <Field label="Job Grade" value={mov?.newGrade} highlight />
                        <Field label="Department" value={mov?.newDept} highlight />
                        <Field label="Branch" value={mov?.newBranch} highlight />
                      </div>
                    </div>
                  </div>

                  <SectionTitle icon="💰" title="Compensation Change" color="#B7770D" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                    <Field label="Previous Basic Salary" value={mov?.prevSalary ? `₱ ${mov.prevSalary.toLocaleString()}` : "—"} />
                    <Field label="New Basic Salary" value={mov?.newSalary ? `₱ ${mov.newSalary.toLocaleString()}` : "—"} highlight />
                    <Field label="Salary Difference"
                      value={salaryDiff ? `${salaryDiff > 0 ? "+" : ""}₱ ${salaryDiff.toLocaleString()}` : "—"}
                      highlight={salaryDiff > 0} />
                    <Field label="% Increase" value={salaryDiff ? `${salaryPct}%` : "—"} highlight={salaryDiff > 0} />
                  </div>

                  <SectionTitle icon="📝" title="Justification & Remarks" color="#475569" />
                  <div style={{
                    background: "#f8fafc", border: "1.5px solid #e2e8f0",
                    borderRadius: 10, padding: "14px 16px",
                    fontSize: 14, color: "#334155", lineHeight: 1.7,
                    fontStyle: "italic",
                  }}>
                    "{mov?.justification || "No justification recorded."}"
                  </div>
                </div>
              )}

              {/* ── TAB: EMPLOYEE PROFILE ── */}
              {activeTab === "employee" && (
                <div>
                  <SectionTitle icon="👤" title="Personal Information" color="#1B3A6B" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                    <Field label="Employee ID" value={emp?.id} mono highlight />
                    <Field label="Last Name" value={emp?.lastName} />
                    <Field label="First Name" value={emp?.firstName} />
                    <Field label="Middle Name" value={emp?.middleName} />
                    <Field label="Gender" value={emp?.gender} />
                    <Field label="Date of Birth" value={emp?.dob} />
                  </div>

                  <SectionTitle icon="🏢" title="Employment & Organization" color="#2E5FA3" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                    <Field label="Date Hired" value={emp?.dateHired} />
                    <Field label="Employment Status" value={emp?.status} highlight />
                    <Field label="Current Position" value={emp?.position} />
                    <Field label="Job Grade" value={emp?.grade} />
                    <Field label="Direct Supervisor" value={emp?.supervisor} />
                    <Field label="Company" value={emp?.company} />
                    <Field label="Group" value={emp?.group} />
                    <Field label="Department" value={emp?.department} />
                    <Field label="Branch" value={emp?.branch} />
                  </div>

                  <SectionTitle icon="⏰" title="Regularization Status" color="#7D3C98" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                    <Field label="Probationary End Date" value={emp?.probEndDate || "N/A"} highlight={!!emp?.probEndDate} />
                    <Field label="Regularization Status" value={emp?.regStatus} highlight={emp?.regStatus === "Pending"} />
                  </div>

                  <SectionTitle icon="📬" title="Contact Information" color="#475569" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                    <Field label="Email Address" value={emp?.email} mono />
                    <Field label="Contact Number" value={emp?.contact} mono />
                  </div>
                </div>
              )}

              {/* ── TAB: APPROVALS ── */}
              {activeTab === "approvals" && (
                <div>
                  <SectionTitle icon="✅" title="Three-Level Approval Chain" color="#1B3A6B" />
                  <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                    <ApprovalBlock
                      label="Level 1 — Department Head"
                      name={mov?.deptHeadName} date={mov?.deptHeadDate}
                      status={mov?.deptHeadStatus} color="#2E5FA3"
                    />
                    <div style={{ display: "flex", alignItems: "center", color: "#cbd5e1", fontSize: 20 }}>→</div>
                    <ApprovalBlock
                      label="Level 2 — Compensation & Benefits"
                      name={mov?.cbName} date={mov?.cbDate}
                      status={mov?.cbStatus} color="#B7770D"
                    />
                    <div style={{ display: "flex", alignItems: "center", color: "#cbd5e1", fontSize: 20 }}>→</div>
                    <ApprovalBlock
                      label="Level 3 — C-Suite / Executive"
                      name={mov?.csuiteName} date={mov?.csuiteApprDate}
                      status={mov?.csuiteStatus} color="#C0392B"
                    />
                  </div>

                  {/* Overall Status Banner */}
                  <div style={{
                    padding: "18px 24px", borderRadius: 12,
                    background: mov?.status === "Approved" ? "#d1fae5" : "#fef3c7",
                    border: `2px solid ${mov?.status === "Approved" ? "#10b981" : "#f59e0b"}`,
                    display: "flex", alignItems: "center", gap: 16,
                  }}>
                    <div style={{ fontSize: 28 }}>{mov?.status === "Approved" ? "✅" : "⏳"}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>
                        Overall Movement Status: <StatusBadge status={mov?.status} />
                      </div>
                      {mov?.status === "Approved" && (
                        <div style={{ fontSize: 13, color: "#065f46", marginTop: 4 }}>
                          All three approval levels have been obtained. Movement is official.
                        </div>
                      )}
                      {mov?.status === "Pending" && (
                        <div style={{ fontSize: 13, color: "#92400e", marginTop: 4 }}>
                          Awaiting completion of all three approval levels before movement becomes official.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: DOCUMENTS ── */}
              {activeTab === "documents" && (
                <div>
                  <SectionTitle icon="📎" title="Supporting Document References" color="#1B3A6B" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                    {[
                      { label: "Personnel Action Form (PAF)", key: "paf", required: true },
                      { label: "Goal Setting Form", key: "goalSetting" },
                      { label: "Organizational Chart", key: "orgChart" },
                      { label: "Manpower Requisition Form (MRF)", key: "mrf" },
                      { label: "Performance Appraisal", key: "appraisal" },
                      { label: "LOR / Letter of Intent / Memorandum", key: "lor" },
                    ].map(doc => {
                      const val = mov?.[doc.key];
                      const present = !!val;
                      return (
                        <div key={doc.key} style={{
                          border: `2px solid ${present ? "#10b981" : doc.required ? "#ef4444" : "#e2e8f0"}`,
                          borderRadius: 10, padding: "14px 18px",
                          background: present ? "#f0fdf4" : doc.required ? "#fff5f5" : "#f8fafc",
                          display: "flex", alignItems: "center", gap: 14,
                        }}>
                          <div style={{ fontSize: 22 }}>{present ? "✅" : doc.required ? "🔴" : "○"}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              color: present ? "#065f46" : doc.required ? "#991b1b" : "#94a3b8",
                              marginBottom: 4,
                            }}>
                              {doc.label} {doc.required && <span style={{ color: "#ef4444" }}>*</span>}
                            </div>
                            <div style={{
                              fontFamily: "monospace", fontSize: 13, fontWeight: 700,
                              color: present ? "#0f172a" : "#94a3b8",
                            }}>
                              {val || (doc.required ? "MISSING — Required for compliance" : "Not applicable / not yet filed")}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{
                    marginTop: 24, padding: "14px 18px", borderRadius: 10,
                    background: "#f0f9ff", border: "1px solid #bae6fd",
                    fontSize: 13, color: "#0369a1",
                    display: "flex", gap: 10, alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: 16 }}>ℹ️</span>
                    <span>PAF reference number is mandatory for all approved movements. Missing documents are flagged in red. Update reference numbers in the Dim_Documents sheet of your Excel workbook and refresh.</span>
                  </div>
                </div>
              )}

            </div>

            {/* Form Footer */}
            <div style={{
              background: "#f8fafc", borderTop: "1px solid #e2e8f0",
              padding: "16px 32px",
              display: "flex", alignItems: "center", gap: 16,
              flexWrap: "wrap",
            }}>
              <div style={{ fontSize: 11, color: "#94a3b8", flex: 1 }}>
                <span style={{ fontWeight: 700, color: "#64748b" }}>ABC Corporation</span> · HR Management System · Movement Record {mov?.id} · Confidential
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: "8px 18px", borderRadius: 8,
                    border: "1.5px solid #1B3A6B", background: "none",
                    color: "#1B3A6B", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Georgia', serif",
                  }}>
                  🖨 Print Form
                </button>
                <button
                  onClick={clearForm}
                  style={{
                    padding: "8px 18px", borderRadius: 8,
                    background: "#1B3A6B", border: "none",
                    color: "#fff", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Georgia', serif",
                  }}>
                  🔍 New Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
