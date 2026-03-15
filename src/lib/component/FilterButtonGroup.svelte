<script lang="ts" generics="T">
    import type { SvelteMap } from 'svelte/reactivity';
    import FilterButton, { type State } from './FilterButton.svelte';

    export let states: SvelteMap<T, State>
    export let options: T[] = states.keys().toArray()
</script>

{#each options as option (option)}
    <FilterButton bind:state={
        () => states.get(option),
        value => states = states.set(option, value)
    }>
        <slot {option}>
            {option}
        </slot>
    </FilterButton>
{/each}
