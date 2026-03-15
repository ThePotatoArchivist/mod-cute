<script lang="ts">
    import type { TagTypes } from './modrinth';
    import { facet, type Facets } from './lib/modrinth/facets';
    import type { Category, GameVersion, Loader } from '@xmcl/modrinth';
    import FilterButtonGroup from './lib/component/FilterButtonGroup.svelte';
    import type { State } from './lib/component/FilterButton.svelte';
    import { associate, groupby } from './lib/util/misc';
    import CheckButtonGroup from './lib/component/CheckButtonGroup.svelte';
    import { SvelteMap } from 'svelte/reactivity';
    
    const MAIN_MOD_LOADERS = [ 'fabric', 'forge', 'neoforge' ]
    
    const SIDED_PROJECT_TYPES = [ 'mod', 'modpack' ]

    export let facets: Facets = []
    export let tags: TagTypes
    const { categories, loaders, versions } = tags
    export let projectType: string
    
    let categoryFilters: SvelteMap<Category, State>
    let selectedLoaders: Loader[] = []
    let serverSide: boolean = false
    let clientSide: boolean = false
    let selectedVersions: GameVersion[] = []

    let allLoaders = false
    let allVersions = false
    
    $: relevantCategories = categories.filter(e => e.project_type === projectType || e.project_type === 'mod' && (projectType === 'plugin' || projectType === 'datapack'))
    $: relevantLoaders = loaders.filter(e => e.supported_project_types.includes(projectType) 
        && (allLoaders || projectType !== 'mod' || MAIN_MOD_LOADERS.includes(e.name))
        && (!e.supported_project_types.includes('plugin') && !e.supported_project_types.includes('datapack') || projectType !== 'mod')
    )
    $: relevantVersions = allVersions ? versions : versions.filter(e => e.version_type === 'release')
    
    $: categoryFilters = new SvelteMap(associate(relevantCategories, () => undefined))
    $: categoryHeaders = groupby(relevantCategories, category => category.header)
    
    $: facets = [
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
</script>

<div>
    {#each categoryHeaders.keys() as header (header)}
        {@const categories = categoryHeaders.get(header)!}
        <h3>{header}</h3>
        <FilterButtonGroup bind:states={categoryFilters} options={categories} let:option>
            {@const tOption = option as Category}
            {#if tOption.icon}
                <div class="fit-icon">
                    {@html tOption.icon}
                </div>
            {/if}
            {tOption.name}
        </FilterButtonGroup>
    {/each}
</div>

{#if relevantLoaders.length > 1}
    <div>
        <label>
            <input type="checkbox" bind:checked={allLoaders} />
            Show all loaders
        </label>
        
        <CheckButtonGroup options={relevantLoaders} bind:value={selectedLoaders} let:option>
            <div class="fit-icon">
                {@html option.icon}
            </div>
            {option.name}
        </CheckButtonGroup>
    </div>
{/if}

{#if SIDED_PROJECT_TYPES.includes(projectType)}
    <div>
        <label>
            <input type="checkbox" bind:checked={clientSide} />
            Client
        </label>
        <label>
            <input type="checkbox" bind:checked={serverSide} />
            Server
        </label>
    </div>
{/if}

<div>
    <label>
        <input type="checkbox" bind:checked={allVersions} />
        Show all versions
    </label>
    
    <select multiple bind:value={selectedVersions}>
        {#each relevantVersions as version (version)}
            <option value={version}>{version.version}</option>
        {/each}
    </select>
</div>

<style>
    .fit-icon {
        display: inline-block;
        width: 1em;
        height: 1em;
    }
</style>