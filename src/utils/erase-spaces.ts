export function eraseSpaces (text: string): string  {
    return text.replace(/\s\s+/g, " ").trim()
}
