import { useEffect, useState } from "react";
import { createSkill, getSkills } from "./api/skills";
import type { Skill } from "./api/skills";
import {
  createActivityLog,
  getActivityLogs,
} from "./api/activitylogs";
import type { ActivityLog } from "./api/activitylogs";
import "./App.css";

export default function App() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [error, setError] = useState("");

  // Skill form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Log form
  const [logSkillId, setLogSkillId] = useState<number | "">("");
  const [logDate, setLogDate] = useState("");
  const [logMinutes, setLogMinutes] = useState(30);
  const [logNotes, setLogNotes] = useState("");

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch((e) => setError(e.message));

    getActivityLogs()
      .then(setLogs)
      .catch((e) => setError(e.message));
  }, []);

  async function onCreateSkill(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const newSkill = await createSkill({
        name,
        description: description || undefined,
      });
      setSkills((prev) => [newSkill, ...prev]);
      setName("");
      setDescription("");
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onCreateLog(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (logSkillId === "") {
      setError("Pick a skill for the log.");
      return;
    }

    try {
      const newLog = await createActivityLog({
        skillId: logSkillId,
        date: logDate,
        minutes: logMinutes,
        notes: logNotes || undefined,
      });
      setLogs((prev) => [newLog, ...prev]);
      setLogSkillId("");
      setLogDate("");
      setLogMinutes(30);
      setLogNotes("");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>SkillForge</h1>

      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>
      )}

      <section style={{ marginBottom: 32 }}>
        <h2>Skills</h2>
        <form onSubmit={onCreateSkill} style={{ marginBottom: 16 }}>
          <div>
            <label>
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                style={{ display: "block", width: "100%", marginTop: 6 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>
              Description
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ display: "block", width: "100%", marginTop: 6 }}
              />
            </label>
          </div>

          <button style={{ marginTop: 12 }}>Add Skill</button>
        </form>

        <ul>
          {skills.map((s) => (
            <li key={s.id}>
              <strong>{s.name}</strong>
              {s.description ? ` — ${s.description}` : ""}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Activity Logs</h2>
        <form onSubmit={onCreateLog} style={{ marginBottom: 16 }}>
          <div>
            <label>
              Skill
              <select
                value={logSkillId}
                onChange={(e) =>
                  setLogSkillId(e.target.value ? Number(e.target.value) : "")
                }
                required
                style={{ display: "block", width: "100%", marginTop: 6 }}
              >
                <option value="">Choose a skill...</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>
              Date
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                required
                style={{ display: "block", width: "100%", marginTop: 6 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>
              Minutes
              <input
                type="number"
                min={1}
                max={600}
                value={logMinutes}
                onChange={(e) => setLogMinutes(Number(e.target.value))}
                required
                style={{ display: "block", width: "100%", marginTop: 6 }}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>
              Notes
              <input
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                style={{ display: "block", width: "100%", marginTop: 6 }}
              />
            </label>
          </div>

          <button style={{ marginTop: 12 }}>Add Log</button>
        </form>

        <ul>
          {logs.map((l) => (
            <li key={l.id}>
              <strong>{l.skillName}</strong> — {l.date} — {l.minutes} min
              {l.notes ? ` — ${l.notes}` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
