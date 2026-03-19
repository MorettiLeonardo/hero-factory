export function truncateText(text: string, maxLength: number = 20): string {
    if (text.length <= maxLength) {
        return text;
    }

    return text.slice(0, maxLength) + "...";
}