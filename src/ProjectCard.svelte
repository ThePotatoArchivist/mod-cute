<script lang="ts">
    import type { SearchResultHit } from "@xmcl/modrinth";
    import { propertyCast, toColor } from "./lib/util/misc";

    export let project: SearchResultHit
    
    $: color = toColor(propertyCast<number>(project, 'color'))
</script>

<div class="card">
    {#if project.featured_gallery === null}
        <div class="banner" style:background-color={color}></div>
    {:else}
        <img class="banner" src={project.featured_gallery} alt="{project.title} featured gallery" />
    {/if}
    <div class="icon-container">
        <img class="icon" src={project.icon_url} alt="{project.title} icon" />
    </div>
    <h2><a href="https://modrinth.com/project/{project.project_id}" target="_blank" on:touchstart|stopPropagation /*prevent swiping*/>{project.title}</a></h2>
    <div class="description">
        <p>
            {project.description}
        </p>
        <ul>
            {#each propertyCast<string[]>(project, 'display_categories') as category (category)}
                <li>{category}</li>
            {/each}
        </ul>
    </div>
</div>

<style>
    .card {
        height: 30rem;
        width: 20rem;
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: 2fr auto 3fr;
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
    }
    
    img.banner {
        object-fit: cover;
        height: 100%;
        width: 100%;
        min-width: 100%;
        min-height: 100%;
    }
</style>