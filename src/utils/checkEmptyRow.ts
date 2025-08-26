export function checkEmptyRow(entity: any, threshold: number = 0.5): boolean {
    if (
        typeof entity === "object" &&
        entity !== null &&
        !Array.isArray(entity) &&
        Object.values(entity).every(
            (val) => typeof val === "string" || val === null
        )
    ) {
        const values = Object.values(entity);
        const nullCount = values.filter((val) => val === null).length;
        return values.length > 0 && nullCount / values.length >= threshold;
    }
    return false;
}
