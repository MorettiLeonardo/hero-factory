export function truncateText(text: string, maxLength: number = 20): string {
    if (text.length <= maxLength) {
        return text;
    }

    return text.slice(0, maxLength) + "...";
}

export function dateToInput(d: string) {
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

export function formatDisplayDate(s: string) {
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return s;
    return `${m[3]}/${m[2]}/${m[1]}`;
}