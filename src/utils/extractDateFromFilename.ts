export function extractDateFromFilename(name: string): Date | null {
    if (!name) return null;
    const patterns = [
        /(\d{4})[-_ ]?(\d{2})[-_ ]?(\d{2})/,
        /(\d{2})[.\/-](\d{2})[.\/-](\d{4})/,
        /(\d{4})[_]?(\d{2})[_]?(\d{2})/,
        /(\d{2})[_]?(\d{2})[_]?(\d{4})/,
    ];

    for (const p of patterns) {
        const m = name.match(p);
        if (!m) continue;
        if (m.length === 4 && m[1].length === 4) {
            const d = new Date(`${m[1]}-${m[2]}-${m[3]}`);
            if (!isNaN(d.getTime())) return d;
        }
        if (m.length === 4 && m[3].length === 4) {
            const d = new Date(`${m[3]}-${m[2]}-${m[1]}`);
            if (!isNaN(d.getTime())) return d;
        }
    }
    return null;
}
