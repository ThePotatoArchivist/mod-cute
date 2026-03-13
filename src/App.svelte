<script lang="ts">
    import type { SearchResultHit } from '@xmcl/modrinth';
    import FilterControls from './FilterControls.svelte';
    import { compileFacets, type Facets } from './lib/modrinth/facets';
    import { getProjects, TAGS } from './modrinth';
    
    let facets: Facets = []
    
    let projects: SearchResultHit[] = []
    
    $: {
        getProjects(facets, 10).then(result => projects = result.hits)
    }
</script>

<main>
    {#await TAGS}
        Loading...
    {:then tags} 
        <FilterControls {tags} bind:facets />
    {/await}
    
    {compileFacets(facets)}
    
    {#each projects as project}
        <div>{project.title}</div>
    {/each}
</main>

<style>
</style>
