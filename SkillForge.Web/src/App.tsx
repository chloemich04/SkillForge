import { useEffect, useState } from "react";
import { 
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "./api/skills";
import type { Skill } from "./api/skills";
import {
  createActivityLog,
  getActivityLogs,
  updateActivityLog,
  deleteActivityLog,
} from "./api/activitylogs";
import type { ActivityLog } from "./api/activitylogs";
import "./App.css";

export default function App() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [error, setError] = useState("");

  // Skill create form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Skill edit form
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [editSkillName, setEditSkillName] = useState("");
  const [editSkillDescription, setEditSkillDescription] = useState("");

  // Log create form
  const [logSkillId, setLogSkillId] = useState<number | "">("");
  const [logDate, setLogDate] = useState("");
  const [logMinutes, setLogMinutes] = useState(30);
  const [logNotes, setLogNotes] = useState("");

  // Log edit form
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [editLogDate, setEditLogDate] = useState("");
  const [editLogMinutes, setEditLogMinutes] = useState(30);
  const [editLogNotes, setEditLogNotes] = useState("");

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

  function startEditSkill(skill: Skill) {
    setEditingSkillId(skill.id);
    setEditSkillName(skill.name);
    setEditSkillDescription(skill.description ?? "");
  }

  async function saveSkill(id: number) {
    setError("");
    try {
      await updateSkill(id, {
        name: editSkillName,
        description: editSkillDescription || undefined,
      });
      setSkills((prev) => 
        prev.map((s) =>
          s.id === id
            ? { ...s, name: editSkillName, description: editSkillDescription || null}
            : s
          )
        );
        setEditingSkillId(null);
      } catch (e:any) {
        setError(e.message);
    }
  }

  async function removeSkill(id: number) {
    setError("");
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (e:any) {
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

  function startEditLog(log: ActivityLog) {
    setEditingLogId(log.id);
    setEditLogDate(log.date);
    setEditLogMinutes(log.minutes);
    setEditLogNotes(log.notes ?? "");
  }

  async function saveLog(id: number) {
    setError("");
    try {
      await updateActivityLog(id, {
        date: editLogDate,
        minutes: editLogMinutes,
        notes: editLogNotes || undefined,
      });
      setLogs((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, date: editLogDate, minutes: editLogMinutes, notes: editLogNotes || null }
            : l
          )
        );
        setEditingLogId(null);
    } catch (e:any) {
      setError(e.message);
    }
  }

  async function removeLog(id: number) {
    setError("");
    try {
      await deleteActivityLog(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
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
            <li key={s.id} style={{ marginBottom: 8 }}>
              {editingSkillId === s.id ? (
                <>
                <input
                  value={editSkillName}
                  onChange={(e) => setEditSkillName(e.target.value)}
                  style={{ marginRight: 8 }} 
                />
                <input
                  value={editSkillDescription}
                  onChange={(e) => setEditSkillDescription(e.target.value)}
                  style={{ marginRight: 8 }} 
                />
                <button onClick={() => saveSkill(s.id)}>Save</button>
                <button onClick={() => setEditingSkillId(null)} style={{ marginLeft: 6 }}>
                  Cancel
                </button>
              </>
              ) : (
                <>
                <strong>{s.name}</strong>
                {s.description ? ` — ${s.description}` : ""}
                <button onClick={() => startEditSkill(s)} style={{ marginLeft: 8 }}>
                  Edit
                </button>
                <button onClick={() => removeSkill(s.id)} style={{ marginLeft: 6}}>
                  Delete
                </button>
                </>
              )}
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
