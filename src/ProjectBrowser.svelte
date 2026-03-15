<script lang="ts">
    import type { SearchResultHit } from '@xmcl/modrinth';
    import FilterControls from './FilterControls.svelte';
    import { type Facets } from './lib/modrinth/facets';
    import { getProjectCount, getRandomProject, type TagTypes } from './modrinth';
    import ProjectCard, { preload } from './ProjectCard.svelte';
    import Swipable from './lib/component/Swipable.svelte';
    import { ArrowBackIcon, CloseIcon, FavoriteIcon, FilterIcon } from './icons';
    import { prequeue } from './lib/util/prequeue';
    import { createEventDispatcher } from 'svelte';

    export let projectType: string
    export let tags: TagTypes
    
    let facets: Facets
    
    let queueStale = true
    let projectQueue: AsyncIterator<SearchResultHit> | undefined
    let projectP: Promise<SearchResultHit> | undefined

    let swipable: Swipable | undefined
    
    const dispatch = createEventDispatcher<{
        exit: undefined
        save: SearchResultHit
    }>()
    
    $: if (facets) queueStale = true
            
    function showNext() {
        if (facets === undefined) return

        if (queueStale) {
            projectP = new Promise(() => {})
            getProjectCount(facets)
                .then(count => {
                    setupQueue(facets!, count)
                    shiftQueue()
                })
            queueStale = false
        } else
            shiftQueue()
    }
    
    function shiftQueue() {
        projectP = projectQueue?.next().then(({value}) => value)
    }
    
    function setupQueue(facets: Facets, count: number) {
        if (facets === undefined) {
            projectQueue = undefined
            projectP = undefined
        } else {
            projectQueue = prequeue(3, () => getRandomProject(facets, count).then(preload))
        }
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

<button on:click={() => {
    dispatch('exit')
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
    <button on:click={showNext}>Go</button>
{:else}
    <div class="card-container">
        {#key projectP}
            {#await projectP}
                Loading...
            {:then project} 
                    <Swipable
                        bind:this={swipable}
                        onSwipeLeft={() => {
                            showNext()
                        }}
                        onSwipeRight={() => {
                            dispatch('save', project)
                            showNext()
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

<style>
    .card-container {
        width: 100%;
        max-width: 40rem;
        align-self: center;
        position: relative;
        flex-grow: 1;
    }
    
    .buttons {
        display: flex;
        gap: 1rem;
    }
    
    .buttons button {
        flex-grow: 1;
    }
</style>
