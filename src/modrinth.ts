import { ModrinthV2Client, type SearchResult } from '@xmcl/modrinth'
import { getProjectTypeTags, getSideTypeTags } from './lib/modrinth/tags'
import { type Facets, compileFacets } from './lib/modrinth/facets'

export const modrinth = new ModrinthV2Client({
    headers: {
        'User-Agent': `ThePotatoArchivist/tinderinth`,
    }
})

export const TAGS = (async () => {
    const [categories, versions, loaders, projectTypes] = await Promise.all([
        modrinth.getCategoryTags(), 
        modrinth.getGameVersionTags(), 
        modrinth.getLoaderTags(),
        getProjectTypeTags(modrinth),
        // getSideTypeTags(modrinth),
    ])
    return { categories, versions, loaders, projectTypes }
})()

export type TagTypes = Awaited<typeof TAGS>

export async function getProjectCount(facets: Facets): Promise<number> {
    return (await modrinth.searchProjects({
        facets: compileFacets(facets),
        limit: 0,
    })).total_hits
}

export function getProjects(facets: Facets, limit: number | undefined = undefined, offset: number | undefined = undefined): Promise<SearchResult> {
    return modrinth.searchProjects({
        limit,
        offset,
        facets: compileFacets(facets),
    })
}

export async function getRandomProject(facets: Facets, count: number) {
    return (await getProjects(facets, 1, Math.floor(Math.random() * count))).hits[0]
}