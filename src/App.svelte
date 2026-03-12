<script lang="ts">
    import FilterControls from './lib/FilterControls.svelte';
    import { compileFacets, facet, modrinth, TAGS } from './lib/modrinth';
    
</script>

<main>
    {#await TAGS}
        Loading...
    {:then tags} 
        <FilterControls {tags} />
    {/await}
    
</main>

<style>
</style>
