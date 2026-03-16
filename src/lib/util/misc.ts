
export function associate<K, V>(keys: Iterable<K>, transform: (key: K) => V): Map<K, V> {
    const map = new Map<K, V>()
    for (const key of keys)
        map.set(key, transform(key))
    return map
}

export function toColor(num: number) {
    num >>>= 0
    const b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16
    return `rgb(${r},${g},${b})`
}

export function groupby<T, G>(values: Iterable<T>, getGroup: (value: T) => G): Map<G, T[]> {
    const groups = new Map<G, T[]>()
    for (const value of values) {
        const group = getGroup(value)
        groups.get(group)?.push(value) ?? groups.set(group, [value])
    }
    return groups
}

export function associateBy<K, V>(values: Iterable<V>, getKey: (value: V) => K): Map<K, V> {
    const map = new Map<K, V>()
    for (const value of values)
        map.set(getKey(value), value)
    return map
}

export function transformValue<K, V, U>(transform: (value: V) => U): (entry: [K, V]) => [K, U] {
    return ([key, value]) => [key, transform(value)]
}

export function transformKey<K, L, V>(transform: (key: K) => L): (entry: [K, V]) => [L, V] {
    return ([key, value]) => [transform(key), value]
}

export function keyIs<K, L extends K, V>(predicate: (key: K) => key is L) {
    return (entry: [K, V]): entry is [L, V] => predicate(entry[0])
}