export type Skill = {
    id: number;
    name: string;
    description: string | null;
};

export async function getSkills(): Promise<Skill[]> {
    const res = await fetch("/api/Skills");
    if (!res.ok) throw new Error("Failed to load skills");
    return res.json();
}

export async function createSkill(input: {
    name: string;
    description?: string;
}): Promise<Skill> {

    const res = await fetch("/api/Skills", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(input),
    });

    if(!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create skill");
    }

    return res.json();
}