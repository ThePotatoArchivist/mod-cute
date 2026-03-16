import { ModrinthV2Client, type SearchResult } from '@xmcl/modrinth'
import { getProjectTypeTags } from './lib/modrinth/tags'
import { type Facets, compileFacets } from './lib/modrinth/facets'
import { associateBy, groupby, transformValue } from './lib/util/misc'

export const modrinth = new ModrinthV2Client({
    headers: {
        'User-Agent': `ThePotatoArchivist/mod-cute`,
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
    return { categories, versions, loaders, projectTypes,
        categoriesByNameByType: new Map(groupby(categories, category => category.project_type)
            .entries()
            .map(transformValue(categories => associateBy(categories, category => category.name)))),
        loadersByName: associateBy(loaders, loader => loader.name),
        versionsByName: associateBy(versions, version => version.version)
    }
})()

export type TagTypes = Awaited<typeof TAGS>

export const ICON_CACHE = new Map<string, string>()

TAGS.then(({categories, loaders}) => {
    for (const category of categories)
        if (category.project_type !== 'server')
            ICON_CACHE.set(category.name, category.icon)
    for (const loader of loaders)
        ICON_CACHE.set(loader.name, loader.icon)
})

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

export function getProjectUrl(id: string) {
    return `https://modrinth.com/project/${id}`
}