<script lang="ts">
    import type { Project, SearchResultHit } from '@xmcl/modrinth';
    import { getProjectUrl, modrinth, TAGS } from './modrinth';
    import ProjectBrowser from './ProjectBrowser.svelte';
    import { localStore } from './lib/util/localStore';
    import { text } from './text';
    import PopupButton from './lib/component/PopupButton.svelte';
    import SavedFilters from './SavedFilters.svelte';
    import { ArrowBackIcon } from './icons';
        
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
        <div class="center">
            Loading...
        </div>
    {:then tags} 
        {#if projectType === undefined}
            <div class="center menu">
                {#each tags.projectTypes as type (type)}
                    <button on:click={() => projectType = type}>{text(type)}</button>
                {/each}
            </div>

            <p class="disclaimer">Accesses content from <a href="https://modrinth.com">modrinth.com</a>. NOT APPROVED BY OR ASSOCIATED WITH MODRINTH, RINTH INC., MINECRAFT, OR MOJANG</p>
        {:else}
            <SavedFilters {tags} {projectType} let:getFilters let:setFilters>
                <ProjectBrowser 
                    {projectType} 
                    {tags} 
                    bind:filters={getFilters, setFilters}
                    on:save={({detail: project}) => {
                        savedProjects = [...savedProjects, {...project, id: project.project_id}]
                        $savedProjectIds = [...$savedProjectIds, project.project_id]
                    }}
                >
                    <button slot="buttons-left" on:click={() => projectType = undefined } aria-label="Back to project types">
                        <ArrowBackIcon />
                    </button>

                    <PopupButton slot="buttons-right">
                        <svelte:fragment slot="button">Saved Projects</svelte:fragment>

                        <ul>
                            {#each savedProjects as savedProject}
                                <li><a href={getProjectUrl(savedProject.id)}>{savedProject.title}</a></li>
                            {/each}
                        </ul>
                    </PopupButton>
                </ProjectBrowser>
            </SavedFilters>
        {/if}

    {/await}
</main>

<style>
    .disclaimer {
        opacity: 50%;
        position: fixed;
        left: 0;
        bottom: 0;
        margin: 1rem;
    }
    
    main {
        height: 100%;
        overflow: hidden;
    }
    
    .center {
        display: grid;
        justify-items: stretch;
        justify-content: center;
        align-content: center;
        height: 100%;
        gap: 1rem;
    }
    
    .menu {
        font-size: 1.5rem;
    }
</style>
