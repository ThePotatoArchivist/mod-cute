<script lang="ts">
    import type { SearchResultHit } from '@xmcl/modrinth';
    import FilterControls from './FilterControls.svelte';
    import { type Facets } from './lib/modrinth/facets';
    import { getProjectCount, getProjectUrl, getRandomProject, TAGS } from './modrinth';
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
            <button on:click={() => {
                projectType = undefined
                project = undefined
            }}>All Project Types</button>
            <details>
                <summary>Filters</summary>
                <FilterControls {tags} bind:facets {projectType} />
            </details>

            {#if project === undefined}
                <button on:click={() => count.then(roll)}>Go</button>
            {:else}
                <div class="card-container">
                    {#key project}
                        <Swipable
                            onSwipeLeft={() => count.then(roll)}
                            onSwipeRight={() => {
                                savedProjects = [...savedProjects, project!]
                                count.then(roll)
                            }}
                        >
                            <ProjectCard {project} />
                        </Swipable>
                    {/key}
                </div>
            {/if}
            <details>
                <summary>Saved Projects</summary>                    
                <ul>
                    {#each savedProjects as savedProject}
                        <li><a href={getProjectUrl(savedProject.project_id)}>{savedProject.title}</a></li>
                    {/each}
                </ul>
            </details>
        {/if}
    {/await}
    <p class="disclaimer">Accesses content from <a href="https://modrinth.com">modrinth.com</a>. NOT APPROVED BY OR ASSOCIATED WITH MODRINTH, RINTH INC., MINECRAFT, OR MOJANG</p>
</main>

<style>
    .disclaimer {
        opacity: 50%;
        margin: 0;
    }
    
    .card-container {
        width: 100%;
        max-width: 40rem;
        align-self: center;
        position: relative;
        flex-grow: 1;
    }
    
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        align-items: stretch;
        padding: 1rem;
        box-sizing: border-box;
        overflow: hidden;
    }
</style>
