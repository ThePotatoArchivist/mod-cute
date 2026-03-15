<script lang="ts">
    import type { SearchResultHit } from "@xmcl/modrinth";
    import { toColor } from "./lib/util/misc";
    import { getProjectUrl } from "./modrinth";
    import type { EventHandler } from "svelte/elements";
    
    const MAX_PIXELATED_IMAGE_WIDTH = 64

    export let project: SearchResultHit
    
    let image: HTMLImageElement | undefined
    let pixelated = false
    
    const onImageLoad: EventHandler = event => {
        pixelated = image !== undefined && image.naturalHeight <= MAX_PIXELATED_IMAGE_WIDTH && image.naturalHeight <= MAX_PIXELATED_IMAGE_WIDTH
    }
    
    $: color = toColor(project.color)
</script>

<div class="card">
    {#if project.featured_gallery === null}
        <div class="banner" style:background-color={color}></div>
    {:else}
        <img class="banner" src={project.featured_gallery} alt="{project.title} featured gallery" />
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
            {#each project.display_categories as category (category)}
                <div class="category">{category}</div>
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
    
    .category {
        display: inline-block;
        padding: 0.1em 0.5em;
        border-radius: 999px;
        border: 1px solid gray;
        margin: 0 0.25em;
    }
</style>