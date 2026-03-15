<script lang="ts">
    import type { SearchResultHit } from '@xmcl/modrinth';
    import { getProjectUrl, TAGS } from './modrinth';
    import ProjectBrowser from './ProjectBrowser.svelte';
        
    let projectType: string | undefined
    let savedProjects: SearchResultHit[] = []
    
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
            <ProjectBrowser 
                {projectType} 
                {tags} 
                on:exit={() => projectType = undefined} 
                on:save={({detail: project}) => savedProjects = [...savedProjects, project]}
            />
        {/if}

        <details>
            <summary>Saved Projects</summary>                    
            <ul>
                {#each savedProjects as savedProject}
                    <li><a href={getProjectUrl(savedProject.project_id)}>{savedProject.title}</a></li>
                {/each}
            </ul>
        </details>
    {/await}
    <p class="disclaimer">Accesses content from <a href="https://modrinth.com">modrinth.com</a>. NOT APPROVED BY OR ASSOCIATED WITH MODRINTH, RINTH INC., MINECRAFT, OR MOJANG</p>
</main>

<style>
    .disclaimer {
        opacity: 50%;
        margin: 0;
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
