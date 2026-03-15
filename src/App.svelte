<script lang="ts">
    import type { SearchResultHit } from '@xmcl/modrinth';
    import FilterControls from './FilterControls.svelte';
    import { type Facets } from './lib/modrinth/facets';
    import { getProjectCount, getProjectUrl, getRandomProject, TAGS } from './modrinth';
    import ProjectCard from './ProjectCard.svelte';
    import Swipable from './lib/component/Swipable.svelte';
    import { ArrowBackIcon, CloseIcon, FavoriteIcon, FilterIcon } from './icons';
    
    let facets: Facets | undefined
    let projectType: string | undefined
    
    let rolling = false
    let projectP: Promise<SearchResultHit> | undefined
    let savedProjects: SearchResultHit[] = []
    
    let swipable: Swipable | undefined
    
    $: count = facets === undefined ? Promise.resolve(0) : getProjectCount(facets)
    
    async function roll(count: number) {
        if (facets === undefined || rolling) return
        rolling = true
        projectP = getRandomProject(facets, count)
        await projectP
        rolling = false
    }

</script>

<svelte:window on:keydown={event => {
    if (swipable === undefined) return
    switch (event.key) {
        case 'ArrowLeft':
            swipable.swipeLeft()
            break
        case 'ArrowRight':
            swipable.swipeRight()
            break
        default:
            return
    }
    event.preventDefault()
}} />

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
                projectP = undefined
            }} aria-label="Back to project types">
                <ArrowBackIcon />
            </button>
            <details open>
                <summary>
                    <FilterIcon />
                    Filters
                </summary>
                <FilterControls {tags} bind:facets {projectType} />
            </details>

            {#if projectP === undefined}
                <button on:click={() => count.then(roll)}>Go</button>
            {:else}
                <div class="card-container">
                    {#key projectP}
                        {#await projectP}
                            Loading...
                        {:then project} 
                                <Swipable
                                    bind:this={swipable}
                                    onSwipeLeft={() => {
                                        count.then(roll)
                                    }}
                                    onSwipeRight={() => {
                                        savedProjects = [...savedProjects, project]
                                        count.then(roll)
                                    }}
                                >
                                    <ProjectCard {project} gameVersions={tags.versions} />
                                </Swipable>
                        {/await}
                    {/key}
                </div>
                <div class="buttons">
                    <button on:click={() => swipable?.swipeLeft()} aria-label="dismiss">
                        <CloseIcon />
                    </button>
                    <button on:click={() => swipable?.swipeRight()} aria-label="save">
                        <FavoriteIcon />
                    </button>
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
    
    .buttons {
        display: flex;
        gap: 1rem;
    }
    
    .buttons button {
        flex-grow: 1;
    }
</style>
