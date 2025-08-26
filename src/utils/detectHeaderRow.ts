export function detectHeaderRow(rows: any[][], knownColumns: string[]) {
    const normalizedKnownColumns = knownColumns.map((c: string) =>
        c?.toString().trim().toLowerCase()
    );

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i].map((c: string) =>
            c?.toString().trim().toLowerCase()
        );

        const matches = row.filter((c) =>
            normalizedKnownColumns.includes(c)
        ).length;

        if (matches >= 2) {
            return i + 1;
        }
    }
    return 0;
}
