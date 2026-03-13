import { ModrinthV2Client } from '@xmcl/modrinth'
import { getProjectTypeTags, getSideTypeTags } from './lib/modrinth/tags'
import { type Facets, compileFacets } from './lib/modrinth/facets'

export const modrinth = new ModrinthV2Client({
    headers: {
        'User-Agent': `ThePotatoArchivist/tinderinth`,
    }
})

export const TAGS = (async () => {
    const [categories, versions, loaders, projectTypes, sideTypes] = await Promise.all([
        modrinth.getCategoryTags(), 
        modrinth.getGameVersionTags(), 
        modrinth.getLoaderTags(),
        getProjectTypeTags(modrinth),
        getSideTypeTags(modrinth),
    ])
    return { categories, versions, loaders, projectTypes, sideTypes }
})()

export async function getProjectCount(facets: Facets): Promise<number> {
    return (await modrinth.searchProjects({
        facets: compileFacets(facets),
        limit: 0,
    })).total_hits
}