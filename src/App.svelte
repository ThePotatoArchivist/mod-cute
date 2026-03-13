<script lang="ts">
    import type { SearchResultHit } from '@xmcl/modrinth';
    import FilterControls from './FilterControls.svelte';
    import { compileFacets, type Facets } from './lib/modrinth/facets';
    import { getProjectCount, getRandomProject, TAGS } from './modrinth';
    
    let facets: Facets = []
    
    let rolling = false
    let project: SearchResultHit | undefined
    
    $: count = getProjectCount(facets)
    
    async function roll(count: number) {
        if (rolling) return
        rolling = true
        project = await getRandomProject(facets, count)
        rolling = false
    }
    
    $: count.then(roll)
    
</script>

<main>
    {#await TAGS}
        Loading...
    {:then tags} 
        <FilterControls {tags} bind:facets />
    {/await}
    
    {compileFacets(facets)}

    <div>
        <button on:click={() => count.then(roll)}>Next</button>
        {#if project !== undefined}
            <a href="https://modrinth.com/project/{project.project_id}">{project.title}</a>
        {/if}
    </div>
</main>

<style>
</style>
