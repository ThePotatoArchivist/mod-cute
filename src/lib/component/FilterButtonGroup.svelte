<script lang="ts" generics="T">
    import { type State } from './FilterButton.svelte';
    import GroupFilterButtonWrapper from './GroupFilterButtonWrapper.svelte';

    export let values: Map<T, State>
    export let include: (value: T) => boolean = () => true
</script>

{#each values.keys() as option (option)}
    {#if include(option)}
        <GroupFilterButtonWrapper bind:map={values} key={option}>
            <slot {option}>
                {option}
            </slot>
        </GroupFilterButtonWrapper>
    {/if}
{/each}
