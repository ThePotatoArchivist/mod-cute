<script lang="ts">
    import type { TagTypes } from './modrinth';
    import type { Facets } from './lib/modrinth/facets';
    import type { Category, GameVersion, Loader } from '@xmcl/modrinth';
    import ButtonGroup from './lib/component/ButtonGroup.svelte';

    export let facets: Facets = []
    export let tags: TagTypes
    const { categories, loaders, projectTypes, sideTypes, versions } = tags
    
    let selectedProjectType: string | undefined
    let selectedCategory: Category
    let selectedLoader: Loader
    let serverSide: string
    let clientSide: string
    let selectedVersion: GameVersion
    
    $: relevantCategories = selectedProjectType === undefined ? [] : categories.filter(e => e.project_type === selectedProjectType)
    $: relevantLoaders = selectedProjectType === undefined ? [] : loaders.filter(e => e.supported_project_types.includes(selectedProjectType!))
    let allVersions = false
    $: relevantVersions = allVersions ? versions : versions.filter(e => e.version_type === 'release')
</script>

<div>
    <ButtonGroup options={projectTypes} bind:value={selectedProjectType} />
</div>

{#if selectedProjectType !== undefined}
    <div>
        <ButtonGroup options={relevantCategories} bind:value={selectedCategory} let:option>
            {option.name}
        </ButtonGroup>
    </div>
    
    {#if relevantLoaders.length > 1}
        <div>
            <ButtonGroup options={relevantLoaders} bind:value={selectedLoader} let:option>
                {option.name}
            </ButtonGroup>
        </div>
    {/if}
    
    <div>
        <ButtonGroup options={sideTypes} bind:value={serverSide} />
    </div>

    <div>
        <ButtonGroup options={sideTypes} bind:value={clientSide} />
    </div>
    
    <div>
        <label>
            <input type="checkbox" bind:checked={allVersions} />
            Show all versions
        </label>

        <ButtonGroup options={relevantVersions} bind:value={selectedVersion} let:option>
            {option.version}
        </ButtonGroup>
    </div>
{/if}