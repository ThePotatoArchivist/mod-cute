import { ModrinthV2Client, type Category, type GameVersion, type Loader, type SearchProjectOptions } from '@xmcl/modrinth'

export const modrinth = new ModrinthV2Client({
    headers: {
        'User-Agent': `ThePotatoArchivist/tinderinth`,
    }
})

export type SideType = 'required' | 'optional' | 'unsupported' | 'unknown'

export interface FacetTypes {
    project_type: 'mod' | 'modpack',
    categories: Category | Loader,
    versions: GameVersion,
    client_side: SideType,
    server_side: SideType,
}

export interface Facet<T extends keyof FacetTypes> {
    type: T,
    value: FacetTypes[T],
    operation: ':' | '=' | '!=' | '>=' | '>' | '<=' | '<'
}

export function facet<T extends keyof FacetTypes>(type: T, value: FacetTypes[T], operation: Facet<T>['operation'] = ':'): Facet<T> {
    return {type, value, operation}
}

export type Facets = Facet<keyof FacetTypes>[][]

function getFacetValue(value: FacetTypes[keyof FacetTypes]): string {
    if (typeof value !== 'object') return value.toString()
    if ('name' in value) return value.name
    if ('version' in value) return value.version
    return value
}

export function compileFacets(facets: Facets): string {
    return `[${facets.map(a => 
        `[${a.map(({type, value, operation = ':'}) => 
            `"${type}${operation}${getFacetValue(value)}"`
        ).join(',')}]`
    ).join(',')}]`
}

export const TAGS = (async () => {
    const [categories, versions, loaders] = await Promise.all([
        modrinth.getCategoryTags(), 
        modrinth.getGameVersionTags(), 
        modrinth.getLoaderTags(),
    ])
    return { categories, versions, loaders }
})()

export async function getProjectCount(facets: Facets): Promise<number> {
    return (await modrinth.searchProjects({
        facets: compileFacets(facets),
        limit: 0,
    })).total_hits
}