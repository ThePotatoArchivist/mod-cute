<script lang="ts">
    import type { SearchResultHit } from '@xmcl/modrinth';
    import FilterControls from './FilterControls.svelte';
    import { type Facets } from './lib/modrinth/facets';
    import { getProjectCount, getRandomProject, TAGS } from './modrinth';
    import ProjectCard from './ProjectCard.svelte';
    import Swipable from './lib/component/Swipable.svelte';
    
    let facets: Facets | undefined
    let projectType: string | undefined
    
    let rolling = false
    let project: SearchResultHit | undefined
    let savedProjects: SearchResultHit[] = []
    
    $: count = facets === undefined ? Promise.resolve(0) : getProjectCount(facets)
    
    async function roll(count: number) {
        if (facets === undefined || rolling) return
        rolling = true
        project = await getRandomProject(facets, count)
        rolling = false
    }

</script>

<main>
    {#await TAGS}
        Loading...
    {:then tags} 
        {#if projectType === undefined}
            {#each tags.projectTypes as type (type)}
                <button on:click={() => projectType = type}>{type}</button>
            {/each}
        {:else}
            <button on:click={() => projectType = undefined}>All Project Types</button>
            <details>
                <summary>Filters</summary>
                <FilterControls {tags} bind:facets {projectType} />
            </details>

            <div>
                {#if project === undefined}
                    <button on:click={() => count.then(roll)}>Go</button>
                {:else}{#key project}
                    <Swipable
                        onSwipeLeft={() => count.then(roll)}
                        onSwipeRight={() => {
                            savedProjects = [...savedProjects, project!]
                            count.then(roll)
                        }}
                    >
                        <ProjectCard {project} />
                    </Swipable>
                {/key}{/if}
                <details>
                    <summary>Saved Projects</summary>
                    <ul>
                        {#each savedProjects as savedProject}
                            <li>{savedProject.title}</li>
                        {/each}
                    </ul>
                </details>
            </div>
        {/if}
    {/await}
</main>

<style>
</style>
