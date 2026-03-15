<script lang="ts">
    import type { GameVersion, SearchResultHit } from "@xmcl/modrinth";
    import { toColor } from "./lib/util/misc";
    import { getProjectUrl, ICON_CACHE } from "./modrinth";
    import type { EventHandler } from "svelte/elements";
    import { areConsecutivePatches } from "./lib/semver";
    
    const MAX_PIXELATED_IMAGE_WIDTH = 64

    export let project: SearchResultHit
    export let gameVersions: GameVersion[]
    
    $: imageUrl = getBannerImageUrl(project)
    
    let image: HTMLImageElement | undefined
    let pixelated = false
    
    const onImageLoad: EventHandler = event => {
        pixelated = image !== undefined && image.naturalHeight <= MAX_PIXELATED_IMAGE_WIDTH && image.naturalHeight <= MAX_PIXELATED_IMAGE_WIDTH
    }
    
    $: color = toColor(project.color)
    $: displayVersions = project.versions
        .map(v => gameVersions.find(gv => gv.version === v)!)
        .filter((v, i, a) => v.version_type === 'release' || i + 1 === a.length)
        .reduce<[first: GameVersion, last: GameVersion][]>((prev, current) => {
            const last = prev.at(-1)
            if (last !== undefined && areConsecutivePatches(last[1].version, current.version))
                last[1] = current
            else
                prev.push([current, current])
            return prev
        }, [])
        .map(([start, end]) => start === end ? start.version : `${start.version}-${end.version}`)
        .reverse()
</script>

<script lang="ts" context="module">

    function getBannerImageUrl(project: SearchResultHit): string | undefined {
        return project.featured_gallery ?? project.gallery[0]        
    }

    export function preload(project: SearchResultHit) {
        const img1 = new Image()
        img1.src = project.icon_url
        
        const banner = getBannerImageUrl(project)
        if (banner !== undefined) {
            const img2 = new Image()
            img2.src = banner
        }

        return project
    }
    
</script>

<div class="card">
    {#if imageUrl === undefined}
        <div class="banner" style:background-color={color}></div>
    {:else}
        <img class="banner" src={imageUrl} alt="{project.title} featured gallery" />
    {/if}
    <div class="icon-container">
        <img class="icon" class:pixelated src={project.icon_url} alt="{project.title} icon" bind:this={image} on:load={onImageLoad} />
    </div>
    <h2><a href={getProjectUrl(project.project_id)} target="_blank" on:mousedown|stopPropagation on:touchstart|stopPropagation /*prevent swiping*/>{project.title}</a></h2>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="description">
        <p>
            {project.description}
        </p>
        <div>
            {#each project.display_categories as category}
                {@const icon = ICON_CACHE.get(category)}
                <div class="badge">
                    {#if icon}
                        <div class="fit-icon">
                            {@html icon}
                        </div>
                    {/if}
                    {category}
                </div>
            {/each}
            {#each displayVersions as version}
                <div class="badge">{version}</div>
            {/each}
        </div>
    </div>
</div>

<style>
    .card {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: 3fr auto 2fr;
        grid-template-areas: 
            'banner banner'
            'icon name'
            'description description';
        border-radius: 2rem;
        overflow: hidden;
        background-color: #111;
    }
    
    .banner {
        grid-area: banner;
    }
    
    h2 {
        grid-area: name;
        align-self: center;
        margin: 1rem;
    }
    
    .description {
        grid-area: description;
        padding: 1rem;
        padding-top: 0;
        overflow-y: hidden;
    }
    
    p {
        margin: 0;
    }
    
    .icon-container {
        grid-area: icon;
        width: 100%;
        aspect-ratio: 1;
        padding: 1rem;
        box-sizing: border-box;
    }
    
    img.icon {
        border-radius: 1em;
        width: 100%;
        display: block;
        aspect-ratio: 1;
        object-fit: contain;
    }
    
    .pixelated {
        image-rendering: pixelated;
    }
    
    img.banner {
        object-fit: cover;
        height: 100%;
        width: 100%;
        min-width: 100%;
        min-height: 100%;
    }
    
    .badge {
        display: inline-block;
        padding: 0.1em 0.5em;
        border-radius: 999px;
        border: 1px solid gray;
        margin: 0 0.25em;
    }

    .fit-icon {
        display: inline-block;
        width: 1em;
        height: 1em;
    }
</style>