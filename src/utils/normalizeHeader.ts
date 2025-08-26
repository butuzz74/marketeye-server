export function normalizeHeader(header: string): string {
    return header
        .replace(/-\s*[\r\n]+/g, "")
        .replace(/[\r\n]+/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}
