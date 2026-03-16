const REGEX = /^(\d+).(\d+)(?:.(\d+))?$/

export function parseSemver(text: string): [major: number, minor: number, patch: number] | undefined {
    const match = text.match(REGEX)
    if (match === null) return undefined

    const [_,  sMajor, sMinor, sPatch] = match
    const major = parseInt(sMajor)
    const minor = parseInt(sMinor)
    const patch = parseInt(sPatch)

    if (isNaN(major) || isNaN(minor)) return undefined
        
    return [major, minor, isNaN(patch) ? 0 : patch]
}

export function areConsecutivePatches(v1: string, v2: string): boolean {
    const s1 = parseSemver(v1)
    if (s1 === undefined) return false
    const [major1, minor1, patch1] = s1

    const s2 = parseSemver(v2)
    if (s2 === undefined) return false
    const [major2, minor2, patch2] = s2
    
    if (major1 !== major2 || minor1 !== minor2) return false
    
    return patch1 + 1 === patch2
}