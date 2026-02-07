export type ActivityLog = {
    id: number;
    skillId: number;
    skillName: string;
    date: string; // ISO date string
    minutes: number;
    notes: string | null;
};

export async function getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch("/api/ActivityLogs");
    if (!res.ok) throw new Error("Failed to load activity logs");
    return res.json();
}

export async function createActivityLog(input: {
    skillId: number;
    date: string;
    minutes: number;
    notes?: string;
}): Promise<ActivityLog> {

    const res = await fetch("/api/ActivityLogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create activity log");
    }

    return res.json();
}