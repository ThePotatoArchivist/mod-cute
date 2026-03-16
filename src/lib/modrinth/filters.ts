import type { Category, GameVersion, Loader } from "@xmcl/modrinth"
import { SvelteMap } from "svelte/reactivity"
import type { State } from "../component/FilterButton.svelte"
import { facet, type Facets } from "./facets"
import type { TagTypes } from "../../modrinth"
import { keyIs, transformKey, transformValue } from "../util/misc"

export const MAIN_MOD_LOADERS = [ 'fabric', 'forge', 'neoforge' ]

export const SIDED_PROJECT_TYPES = [ 'mod', 'modpack' ]

export interface Filters {
    categoryFilters: SvelteMap<Category, State>
    selectedLoaders: Loader[]
    serverSide: boolean
    clientSide: boolean
    selectedVersions: GameVersion[]
}

export function emptyFilters(): Filters {
    return {
        categoryFilters: new SvelteMap(),
        selectedLoaders: [],
        serverSide: false,
        clientSide: false,
        selectedVersions: []
    }
}

export function isRelevantCategory(projectType: string) {
    return (category: Category) => category.project_type === projectType || category.project_type === 'mod' && (projectType === 'plugin' || projectType === 'datapack')
}

export function isRelevantLoader(projectType: string, allLoaders: boolean) {
    return (e: Loader) => e.supported_project_types.includes(projectType) 
        && (allLoaders || projectType !== 'mod' || MAIN_MOD_LOADERS.includes(e.name))
        && (!e.supported_project_types.includes('plugin') && !e.supported_project_types.includes('datapack') || projectType !== 'mod')

}

export function compileFilters(projectType: string, {categoryFilters, selectedLoaders, serverSide, clientSide, selectedVersions}: Filters): Facets {
    return [
        [facet('project_type', projectType)],
        ...categoryFilters.entries().filter(([_, state]) => state).map(([category]) => [facet('categories', category)]),
        ...categoryFilters.entries().filter(([_, state]) => state === false).map(([category]) => [facet('categories', category, '!=')]),
        selectedLoaders.map(loader => facet('categories', loader)),
        selectedVersions.map(version => facet('versions', version)),
        clientSide 
            ? serverSide
                ? [facet('client_side', 'required')] 
                : [facet('client_side', 'unsupported', '!=')] 
            : serverSide 
                ? [facet('client_side', 'required', '!=')] 
                : [],
        serverSide 
            ? clientSide
                ? [facet('server_side', 'required')] 
                : [facet('server_side', 'unsupported', '!=')] 
            : clientSide 
                ? [facet('server_side', 'required', '!=')] 
                : [],
    ].filter(e => e.length > 0)
}

export interface SerializedFilters {
    categoryFilters: Record<string, boolean>
    selectedLoaders: string[]
    serverSide: boolean
    clientSide: boolean
    selectedVersions: string[]
}

export function serializeFilters({categoryFilters, selectedLoaders, clientSide, serverSide, selectedVersions}: Filters): SerializedFilters {
    return {
        categoryFilters: categoryFilters.entries().reduce((prev, [key, value]) => {
            if (value !== undefined)
                prev[key.name] = value
            return prev
        }, {} as Record<string, boolean>),
        selectedLoaders: selectedLoaders.map(e => e.name),
        serverSide,
        clientSide,
        selectedVersions: selectedVersions.map(e => e.version)
    }
}

export function deserializeFilters(projectType: string, tags: TagTypes, {categoryFilters, selectedLoaders, clientSide, serverSide, selectedVersions}: SerializedFilters): Filters {
    const categories = tags.categoriesByNameByType.get(projectType) ?? new Map<string, Category>()
    
    return {
        categoryFilters: new SvelteMap(Object.entries(categoryFilters)
            .map(transformKey(category => categories.get(category)))
            .filter(keyIs(k => k !== undefined))
        ),
        selectedLoaders: selectedLoaders
            .map(loader => tags.loadersByName.get(loader))
            .filter(e => e !== undefined),
        serverSide,
        clientSide,
        selectedVersions: selectedVersions
            .map(version => tags.versionsByName.get(version))
            .filter(e => e !== undefined)
    }
}

export function serializeFilterSet(filterSet: Record<string, Filters>): Record<string, SerializedFilters> {
    return Object.fromEntries(Object.entries(filterSet)
        .map(transformValue(serializeFilters))
    )
}

export function deserializeFilterSet(tags: TagTypes) {
    return (filterSet: Record<string, SerializedFilters>): Record<string, Filters> =>
        Object.fromEntries(Object.entries(filterSet)
            .map(([projectType, filters]) => [projectType, deserializeFilters(projectType, tags, filters)])
        )
}