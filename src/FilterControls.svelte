<script lang="ts">
    import type { TagTypes } from './modrinth';
    import { facet, type Facets } from './lib/modrinth/facets';
    import type { Category, GameVersion, Loader } from '@xmcl/modrinth';
    import ButtonGroup from './lib/component/ButtonGroup.svelte';
    import FilterButtonGroup from './lib/component/FilterButtonGroup.svelte';
    import type { State } from './lib/component/FilterButton.svelte';
    import { associate } from './lib/util/misc';
    import CheckButtonGroup from './lib/component/CheckButtonGroup.svelte';
    
    const MAIN_MOD_LOADERS = [
        'fabric', 'forge', 'neoforge'
    ]

    export let facets: Facets = []
    export let tags: TagTypes
    const { categories, loaders, projectTypes, sideTypes, versions } = tags
    
    let selectedProjectType: string | undefined
    let categoryFilters: Map<Category, State>
    let selectedLoaders: Loader[] = []
    let serverSide: string
    let clientSide: string
    let selectedVersions: GameVersion[] = []

    let allLoaders = false
    let allVersions = false
    
    $: relevantCategories = selectedProjectType === undefined ? [] : categories.filter(e => e.project_type === selectedProjectType)
    $: relevantLoaders = selectedProjectType === undefined ? [] : loaders.filter(e => e.supported_project_types.includes(selectedProjectType!) && (allLoaders || selectedProjectType !== 'mod' || MAIN_MOD_LOADERS.includes(e.name)))
    $: relevantVersions = allVersions ? versions : versions.filter(e => e.version_type === 'release')
    
    $: categoryFilters = associate(relevantCategories, () => undefined)
    
    $: facets = selectedProjectType === undefined ? [] : [
        [facet('project_type', selectedProjectType)],
        ...categoryFilters.entries().filter(([_, state]) => state).map(([category]) => [facet('categories', category)]),
        ...categoryFilters.entries().filter(([_, state]) => state === false).map(([category]) => [facet('categories', category, '!=')]),
        selectedLoaders.map(loader => facet('categories', loader)),
        selectedVersions.map(version => facet('versions', version)),
    ].filter(e => e.length > 0)
</script>

<div>
    <ButtonGroup options={projectTypes} bind:value={selectedProjectType} />
</div>

{#if selectedProjectType !== undefined}
    <div>
        <FilterButtonGroup bind:values={categoryFilters} let:option>
            {(option as Category).name}
        </FilterButtonGroup>
    </div>
    
    {#if relevantLoaders.length > 1}
        <div>
                <label>
                    <input type="checkbox" bind:checked={allLoaders} />
                    Show all loaders
                </label>
            
            <CheckButtonGroup options={relevantLoaders} bind:value={selectedLoaders} let:option>
                {option.name}
            </CheckButtonGroup>
        </div>
    {/if}
    
    <div>
        Server:
        <ButtonGroup options={sideTypes} bind:value={serverSide} />
    </div>

    <div>
        Client:
        <ButtonGroup options={sideTypes} bind:value={clientSide} />
    </div>
    
    <div>
        <label>
            <input type="checkbox" bind:checked={allVersions} />
            Show all versions
        </label>
        
        <select multiple bind:value={selectedVersions}>
            {#each relevantVersions as version}
                <option value={version}>{version.version}</option>
            {/each}
        </select>
    </div>
{/if}