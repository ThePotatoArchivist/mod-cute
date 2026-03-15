import textFile from './assets/text.json'

const CACHE: Record<string, string> = {...textFile}

export function snakeToTitle(text: string) {
    console.log(text)
    return text
        .split(/[_-](?=.)/)
        .map(word => word[0].toUpperCase() + word.substring(1))
        .join(' ')
}

export function text(id: string): string {
    if (id === "") return ""
    const existing = CACHE[id]
    if (existing !== undefined) return existing
    const generated = snakeToTitle(id)
    CACHE[id] = generated
    return generated
}