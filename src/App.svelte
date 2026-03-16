<script lang="ts">
    import type { Project, SearchResultHit } from '@xmcl/modrinth';
    import { getProjectUrl, modrinth, TAGS } from './modrinth';
    import ProjectBrowser from './ProjectBrowser.svelte';
    import { localStore } from './lib/util/localStore';
    import { text } from './text';
    import PopupButton from './lib/component/PopupButton.svelte';
    import SavedFilters from './SavedFilters.svelte';
        
    let projectType: string | undefined
    let savedProjects: (SearchResultHit & {id: string} | Project)[] = []
    let savedProjectIds = localStore<string[]>("saved_projects", [])
    
    if ($savedProjectIds.length > 0)
        modrinth.getProjects($savedProjectIds).then(projects =>
            savedProjects = [...projects, ...savedProjects]
        )
</script>

<main>
    {#await TAGS}
        Loading...
    {:then tags} 
        {#if projectType === undefined}
            {#each tags.projectTypes as type (type)}
                <button on:click={() => projectType = type}>{text(type)}</button>
            {/each}
        {:else}
            <SavedFilters {tags} {projectType} let:filters>
                <ProjectBrowser 
                    {projectType} 
                    {tags} 
                    {filters}
                    on:exit={() => projectType = undefined} 
                    on:save={({detail: project}) => {
                        savedProjects = [...savedProjects, {...project, id: project.project_id}]
                        $savedProjectIds = [...$savedProjectIds, project.project_id]
                    }}
                />
            </SavedFilters>
        {/if}

        <PopupButton>
            <svelte:fragment slot="button">Saved Projects</svelte:fragment>

            <ul>
                {#each savedProjects as savedProject}
                    <li><a href={getProjectUrl(savedProject.id)}>{savedProject.title}</a></li>
                {/each}
            </ul>
        </PopupButton>
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
