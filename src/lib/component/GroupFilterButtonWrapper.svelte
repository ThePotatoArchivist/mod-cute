<script lang="ts" generics="T">
    import { writable, type Writable } from 'svelte/store';
    import type { State } from './FilterButton.svelte';
    import { mapWith } from '../util/misc';
    import FilterButton from './FilterButton.svelte';

    export let map: Map<T, State>
    export let key: T
    
    const store = writable<State>(map.get(key))
    
    $: store.set(map.get(key))
    
    const delegateStore: Writable<State> = {
        ...store, 
        set(value) {
            map = mapWith(map, key, value)
            store.set(value)
        },
    }
</script>

<FilterButton bind:state={$delegateStore}>
    <slot />
</FilterButton>
